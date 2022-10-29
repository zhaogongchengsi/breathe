import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { readCodeFile, findFile, compilerSassStyle } from "../../compilers";
import { parse, resolve } from "path";
import { fromJSON } from "postcss";

export function styleServeMiddleware(root: string, config: BreatheConfig) {
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

    if (!url.endsWith(".css")) {
      next();
      return;
    }

    // @ts-ignore
    const { type } = req.query;

    if (type === "scss") {
    }

    // if (res.parse?.query === "type=scss") {
    //   const cssPath = resolve(root, parse(url).name + "scss");
    // }

    res.end(` .main { color: red; } `);
  };
}
