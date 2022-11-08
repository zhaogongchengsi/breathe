import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType, formatErr, CreateFileChtch } from "../../utils";
import {
  compilerHtml,
  posthtmlInjection,
  posthtmlStylePlugin,
} from "../../compilers";
import { injectClientCode } from "../ws";

export function pagesServeMiddleware(
  root: string,
  { pages, layouts }: BreatheConfig,
  dirChtch: CreateFileChtch,
  { port }: { port: number }
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
        plugins: [
          posthtmlStylePlugin({ mode: "development" }),
          posthtmlInjection("development", {
            mode: "development",
            code: injectClientCode({ port: port }),
            Location: "footer",
          }),
        ],
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
