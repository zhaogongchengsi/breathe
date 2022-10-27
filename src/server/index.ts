import type { ServerOption } from "../index";

import {
  CONFIG_NAME,
  DEFAULT_PORT,
  DEFAULT_HOST,
  resolveConfig,
} from "../config";

import connect from "connect";
import polka from "polka";
import colors from "picocolors";
import { staicServeMiddleware } from "./middlewares";
import { parse, resolve } from "path";
import compression from "compression";

import http from "node:http";

export interface Optopns extends ServerOption {
  configPath: string;
}

export async function createDevServer(root: string, option: Optopns) {
  const conf = await resolveConfig(root, option.configPath ?? CONFIG_NAME);

  const { server, staticDir } = conf;

  const { port, host } = {
    host: option.host ?? server.host ?? DEFAULT_HOST,
    port: option.port ?? server.port ?? DEFAULT_PORT,
  };

  const staticPath = resolve(root, staticDir);

  polka()
    .use(compression(), staicServeMiddleware(staticPath))

    .listen(port, host, (err: any) => {
      if (err) throw err;
      console.log(colors.green(`http://${host}:${port}`));
    });

  //   http.createServer(app).listen(port, host, () => {
  //
  //   });
}
