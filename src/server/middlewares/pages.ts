import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";

export function pagesServeMiddleware(root: string, config: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    // res.setHeader("Accept", "text/html");
    res.html = "<h1> hello world </h1>";
    next();
  };
}
