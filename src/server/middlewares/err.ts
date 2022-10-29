import { BreatheConfig } from "../../config";
import type {
  BreatheServerResponse,
  BreatheServerRequest,
  NextHandler,
} from "..";

export function serverErrotMiddleware(root: string, config: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler
  ) => {
    if (!res.err) {
      next();
      return;
    }

    res.end(
      "<h1 style='color: red;'> Error 500 <br> <p>" +
        res.err.massage +
        " </p>  </h1>"
    );
  };
}
