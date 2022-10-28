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


    next();
  };
}
