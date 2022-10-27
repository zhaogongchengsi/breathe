import { resolve } from "path";
import sirv from "sirv";
import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";

export function staicServeMiddleware(
  root: string,
  { staticDir }: BreatheConfig
) {
  const staticPath = resolve(root, staticDir);

  const serve = sirv(staticPath, {
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
