import { IncomingMessage, ServerResponse } from "http";
import sirv, { NextHandler } from "sirv";

export function staicServeMiddleware(dir: string) {
  const serve = sirv(dir, {
    maxAge: 31536000, // 1Y
    immutable: true,
    dev: true,
  });

  return function staicServeMiddlewareFunc(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    next: NextHandler | undefined
  ) {
    serve(req, res, next);
  };
}
