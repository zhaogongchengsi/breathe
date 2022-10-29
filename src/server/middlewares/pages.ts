import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType } from "../../utils";
import {
  readCodeFile,
  findFile,
  compilerHtml,
  posthtmlStylePlugin,
} from "../../compilers";
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

    let url = res.parse?.pathname;

    if (!url) {
      next();
      return;
    }

    if (requestType(url) != "html") {
      next();
      return;
    }

    if (url === "/") {
      url = "index.html";
    }

    let file: string | undefined = "";
    let code = "";
    let html = "";
    try {
      file = findFile(
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
      code = await readCodeFile(file);
      html = await compilerHtml(code, {
        root,
        modules: config.layouts,
        mode: "development",
        plugins: [posthtmlStylePlugin({ mode: "development" })],
      });
    } catch (err: any) {
      res.err = {
        code: 500,
        massage: err.toString(),
      };
      next();
    }

    res.end(html);
  };
}
