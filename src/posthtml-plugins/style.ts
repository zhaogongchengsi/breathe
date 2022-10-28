import { join, parse } from "path";
import PostHTML from "posthtml";

export interface PostHtmlStylePluginOptons {
  mode: "development" | "production";
}

export function posthtmlStylePlugin(options: PostHtmlStylePluginOptons) {
  return (tree: PostHTML.Node) => {
    // @ts-ignore
    tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, (node) => {
      const { attrs } = node;
      // @ts-ignore
      if (!attrs.href) {
        return node;
      }
      const isDev = options.mode === "development";
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
  };
}
