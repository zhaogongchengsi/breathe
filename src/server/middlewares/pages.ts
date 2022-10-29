import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { requestType } from "../../utils";

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
    }

    res.end(htmlStr);
  };
}
