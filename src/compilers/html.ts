import posthtml, { Plugin } from "posthtml";
import { parse, resolve } from "path";
// @ts-ignore
import posthtmlModule from "posthtml-modules";
// @ts-ignore
import posthtmlInclude from "posthtml-include";
import PostHTML from "posthtml";
import { compilerScriptSync, Mode } from "./index";
import { compileString } from "sass";
export interface PostHtmlStylePluginOptons {
  mode: Mode;
}

export interface CompilerHtmlOptions {
  root?: string;
  modules?: string;
  mode?: Mode;
  plugins?: Plugin<any>[];
}

export function compilerHtml(
  html: string,
  options?: CompilerHtmlOptions
): Promise<string> {
  const { root, modules, plugins } = Object.assign(
    {
      root: process.cwd(),
      modules: "modules",
      mode: "production",
      plugins: [],
    },
    options
  );

  const includePlugin = posthtmlInclude({
    encoding: "utf8",
    root: root,
  });

  const htmlModulesMidd = posthtmlModule({
    root: root,
    from: resolve(root, modules),
    plugins: () => plugins,
  });

  return new Promise((res, rej) => {
    posthtml([includePlugin, ...plugins])
      .use(htmlModulesMidd)
      .process(html)
      .then((result) => {
        res(result.html);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

export function posthtmlStylePlugin(options: PostHtmlStylePluginOptons) {
  const isDev = options.mode === "development";

  const convertUrl = (attrurl: string, origin: string) => {
    // @ts-ignore
    const { ext, name, dir, root } = parse(attrurl);
    const type = ext.replace(".", "");
    return [root, dir, `${name}.${origin}${isDev ? `?type=${type}` : ""}`]
      .filter(Boolean)
      .join("/");
  };

  return (tree: PostHTML.Node) => {
    // @ts-ignore
    tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, (node) => {
      const { attrs } = node;
      // @ts-ignore
      if (!attrs.href) {
        return node;
      }

      return Object.assign(node, {
        attrs: {
          ...attrs,
          href: convertUrl(attrs.href, "css"),
        },
      });
    });

    tree.match({ tag: "script" }, (node) => {
      const { attrs } = node;

      // @ts-ignore
      if (!attrs.src) {
        return node;
      }

      // @ts-ignore
      if (attrs.type && attrs.type === "module") {
        return node;
      }

      return Object.assign(node, {
        attrs: {
          ...attrs,
          // @ts-ignore
          src: convertUrl(attrs.src, "js"),
        },
      });
    });

    // 内联代码编译
    tree.match({ tag: "style", attrs: { lang: "scss" } }, (node) => {
      const { content, attrs } = node;

      // @ts-ignore
      delete attrs.lang;
      // @ts-ignore
      const scsscode: string = content[0] ?? "";

      return Object.assign(node, {
        content: [compileString(scsscode).css],
        attrs,
      });
    });

    tree.match(
      { tag: "script", attrs: { type: "text/typescript" } },
      (node) => {
        const { content, attrs } = node;
        // @ts-ignore
        delete attrs.lang;
        // @ts-ignore
        const tscode: string = content[0] ?? "";

        return Object.assign(node, {
          content: [
            compilerScriptSync(tscode, options.mode, {
              sourcemap: undefined,
            }).code,
          ],
          attrs,
        });
      }
    );
  };
}

export interface posthtmlInjectionOptions {
  mode: Mode;
  code?: string;
  Location: "header" | "footer";
}

export function posthtmlInjection(
  mode: Mode,
  ...options: posthtmlInjectionOptions[]
) {
  return (tree: PostHTML.Node) => {
    options.forEach((option) => {
      if (mode === option.mode) {
        if (option.Location === "footer") {
          tree.match({ tag: "body" }, (node) => {
            return {
              ...node,
              content: node.content?.concat([option.code ?? ""]),
            };
          });
        }
        if (option.Location === "header") {
          tree.match({ tag: "head" }, (node) => {
            return {
              ...node,
              content: node.content?.concat([option.code ?? ""]),
            };
          });
        }
      }
    });
  };
}
