import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType } from "../../utils";
import { readCodeFile, findFile, compilerHtml } from "../../compilers";
import { join } from "path";

export function pagesServeMiddleware(root: string, config: BreatheConfig) {
  return async (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    const url = res.parse?.pathname;

    if (!url) {
      next();
      return;
    }

    if (requestType(url) != "html") {
      next();
      return;
    }

    const file = findFile(
      join(root, config.pages),
      url.endsWith(".html") ? url : url + ".html",
      {
        defaultFile: "index",
        ext: ".html",
      }
    );

    if (!file) {
      next();
      return;
    }

    try {
      const code = await readCodeFile(file);
      const html = await compilerHtml(code, {
        root,
        modules: config.layouts,
        mode: "development",
      });
      res.end(html);
    } catch (err) {
      console.log(err);
      next();
    }
  };
}
