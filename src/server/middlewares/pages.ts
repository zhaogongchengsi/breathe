import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType, formatErr, DirChtch } from "../../utils";
import {
  readCodeFile,
  findFile,
  compilerHtml,
  posthtmlStylePlugin,
} from "../../compilers";

export function pagesServeMiddleware(
  root: string,
  { pages }: BreatheConfig,
  dirChtch: DirChtch
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

    console.log(url);

    try {
      const code = dirChtch.get(url);

      if (code) {
        next();
        return;
      }

      // html = await compilerHtml(code!, {
      //   root,
      //   modules: config.layouts,
      //   mode: "development",
      //   plugins: [posthtmlStylePlugin({ mode: "development" })],
      // });

      res.end(`<h1>${url}<h1>`);
    } catch (err: any) {
      res.err = {
        code: 500,
        massage: formatErr(err),
      };
      next();
    }
  };
}
