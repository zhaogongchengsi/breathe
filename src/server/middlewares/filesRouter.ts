import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { join, parse } from "path";
import { Html } from "../../html";

export function filesRouterMiddleware(root: string, config: BreatheConfig) {
  const html = new Html({
    root: root,
    ...config,
  });

  return async (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    if (!res.parse?.pathname) {
      next();
      return;
    }

    // let { dir, name, ext } = parse(res.parse!.pathname);
    // const _ext = ext === ".html" ? ext : ".html";
    // const page = join(root, config.pages, dir, (name || "index") + _ext);

    const htmlStr = await html.render(res.parse?.pathname);

    res.end(htmlStr || "<h1>hello world</h1>");
  };
}
