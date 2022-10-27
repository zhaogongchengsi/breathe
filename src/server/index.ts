import type { ServerOption } from "../index";

import {
  CONFIG_NAME,
  DEFAULT_PORT,
  DEFAULT_HOST,
  resolveConfig,
} from "../config";

import polka from "polka";
import colors from "picocolors";
import { staicServeMiddleware, pagesServeMiddleware } from "./middlewares";
import { parse, resolve } from "path";
import compression from "compression";
import { IncomingMessage, ServerResponse } from "http";

export interface Optopns extends ServerOption {
  configPath: string;
}

export interface BreatheServerResponse extends ServerResponse<IncomingMessage> {
  html?: string;
}

export interface BreatheServerRequest extends IncomingMessage {}

export async function createDevServer(root: string, option: Optopns) {
  const conf = await resolveConfig(root, option.configPath ?? CONFIG_NAME);

  const { server, staticDir } = conf;

  const { port, host } = {
    host: option.host ?? server.host ?? DEFAULT_HOST,
    port: option.port ?? server.port ?? DEFAULT_PORT,
  };

  const staticPath = resolve(root, staticDir);

  const app = polka();

  app
    .use(
      compression(),
      staicServeMiddleware(staticPath),
      pagesServeMiddleware()
    )

    .get("/", (req: BreatheServerRequest, res: BreatheServerResponse) => {
      res.end(res.html);
    })

    .listen(port, host, (err: any) => {
      if (err) throw err;
      console.log(colors.green(`http://${host}:${port}`));
    });
}
