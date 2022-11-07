import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType, formatErr, DirChtch, CreateFileChtch } from "../../utils";
import {
  readCodeFile,
  findFile,
  compilerHtml,
  posthtmlStylePlugin,
} from "../../compilers";

export function pagesServeMiddleware(
  root: string,
  { pages, layouts }: BreatheConfig,
  dirChtch: CreateFileChtch
) {
  return async (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    let url = res._url;

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

    let html = "";

    try {
      const code = dirChtch.find(url);

      if (!code) {
        next();
        return;
      }

      html = await compilerHtml(code, {
        root,
        modules: layouts,
        mode: "development",
        plugins: [posthtmlStylePlugin({ mode: "development" })],
      });
    } catch (err: any) {
      res.err = {
        code: 500,
        massage: formatErr(err),
      };
      next();
    }

    res.end(html || `<h1>${url}<h1>`);
  };
}
