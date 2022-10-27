import type { NextHandler } from "sirv";
import type { BreatheServerResponse, BreatheServerRequest } from "..";

export function pagesServeMiddleware() {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    res.html = "<h1> hello world </h1>";
    next();
  };
}
