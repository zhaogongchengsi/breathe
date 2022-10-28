import { join, parse } from "path";
import PostHTML from "posthtml";

export interface PostHtmlStylePluginOptons {}

export function posthtmlStylePlugin(options?: PostHtmlStylePluginOptons) {
  return async (tree: PostHTML.Node) => {
    // @ts-ignore
    tree.match({ tag: "link" }, (node) => {
      const { attrs } = node;
      // @ts-ignore
      if (!attrs.href) {
        return node;
      }

      // @ts-ignore
      const { ext, name, dir, root } = parse(attrs.href);
      const type = ext.replace(".", "");

      const url = [root, dir, `${name}.css`, `?type=${type}`]
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
