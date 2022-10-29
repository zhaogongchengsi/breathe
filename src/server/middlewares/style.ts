import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType } from "../../utils";

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

    if (requestType(url) != "style") {
      next();
      return
    }

    // compilerSass();

    res.end(` .main { color: red; } `);
  };
}
