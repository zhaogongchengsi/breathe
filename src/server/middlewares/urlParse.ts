import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";

export function urlParseMiddleware(root: string, config: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    const isGet = req.method === "GET";
    const url = req.url;

    if (!isGet) {
      next();
    }

    


    next();
  };
}

