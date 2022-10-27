import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { join } from "path";


export function filesRouterMiddleware(root: string, { pages }: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (req.method !== "GET") {
      next();
    }

    let url = res.parse?.pathname;

    if (!url || url === "/") {
      url = "index.html";
    }

    const page = join(root, pages, url);

    console.log(page);
    // console.log(req.url)
    // console.log("pages", config.pages);
    next();
  };
}
