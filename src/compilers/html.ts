import posthtml, { Plugin } from "posthtml";
import { parse, resolve } from "path";
// @ts-ignore
import posthtmlModule from "posthtml-modules";
// @ts-ignore
import posthtmlInclude from "posthtml-include";
import PostHTML from "posthtml";
import { Mode } from ".";
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
        rej(new Error(`The module does not exist, the path is: ${err.path}`));
      });
  });
}

export function posthtmlStylePlugin(options: PostHtmlStylePluginOptons) {
  const isDev = options.mode === "development";

  return (tree: PostHTML.Node) => {
    // @ts-ignore
    tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, (node) => {
      const { attrs } = node;
      // @ts-ignore
      if (!attrs.href) {
        return node;
      }

      // @ts-ignore
      const { ext, name, dir, root } = parse(attrs.href);
      const type = ext.replace(".", "");

      const url = [root, dir, `${name}.css`, isDev ? `?type=${type}` : ""]
        .filter(Boolean)
        .join("/");

      return Object.assign(node, {
        attrs: {
          ...attrs,
          href: url,
        },
      });
    });

    tree.match({ tag: "style", attrs: { lang: "scss" } }, (node) => {
      const { content, attrs } = node;

      // @ts-ignore
      delete attrs.lang;
      // @ts-ignore
      const scsscode: string = content[0] ?? "";

      return Object.assign(node, {
        content: compileString(scsscode).css,
        attrs,
      });
    });
  };
}