import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";
import { BreatheConfig } from "../../config";
// @ts-ignore
import polkaParse from "@polka/url";

export function urlParseMiddleware(root: string, config: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    const info = polkaParse(req);
    res._url = info.pathname;
    res.parse = info;
    next();
  };
}
