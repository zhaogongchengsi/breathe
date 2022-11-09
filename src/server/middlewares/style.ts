import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { compilerSassFile, compilerStyle } from "../../compilers";
import { join, parse, resolve } from "path";
import { readFile } from "fs/promises";
import { formatErr } from "../../utils";

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
    const { dir, name } = parse(url);
    let csscode: string = "";
    const filepath = resolve(root, join(dir.slice(1), name + "." + type));

    try {
      const file = await readFile(filepath);

      if (type === "scss") {
        csscode = await compilerSassFile(filepath);
      } else if (type === "css") {
        csscode = file.toString();
      }

      csscode = (await compilerStyle(csscode)).code;
    } catch (err) {
      res.err = {
        code: 500,
        massage: formatErr(err),
      };
      next();
    }

    res.end(csscode);
  };
}
