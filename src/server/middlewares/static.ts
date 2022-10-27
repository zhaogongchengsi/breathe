import sirv, { NextHandler } from "sirv";
import type { BreatheServerResponse, BreatheServerRequest } from "..";

export function staicServeMiddleware(dir: string) {
  const serve = sirv(dir, {
    maxAge: 31536000, // 1Y
    immutable: true,
    dev: true,
  });

  return function (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) {
    serve(req, res, next);
  };
}
