import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { join, parse } from "path";

export function filesRouterMiddleware(root: string, { pages }: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    if (!res.parse?.pathname) {
      next();
      return;
    }

    let url = parse(res.parse!.pathname);
    const page = join(root, pages, url.dir, url.name || "index");

    next();
  };
}
