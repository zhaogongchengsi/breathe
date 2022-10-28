import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
import { Html } from "../../html";
import { requestType } from "../../utils";

export function pagesServeMiddleware(root: string, config: BreatheConfig) {
  const html = new Html({
    ...config,
    root: root,
    mode: "development",
  });

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

    const htmlStr = await html.render(url);
    
    res.end(htmlStr);
  };
}
