import type { ServerOption } from "../index";

import {
  CONFIG_NAME,
  DEFAULT_PORT,
  DEFAULT_HOST,
  resolveConfig,
} from "../config";

import polka from "polka";
import colors from "picocolors";
import {
  staicServeMiddleware,
  pagesServeMiddleware,
  filesRouterMiddleware,
  urlParseMiddleware,
} from "./middlewares";
import compression from "compression";
import { IncomingMessage, ServerResponse } from "http";

export interface Optopns extends ServerOption {
  configPath: string;
}

export interface ParseUrlInfo {
  search: string | null | undefined;
  query: string | null | undefined;
  pathname: string;
  path: string;
  href: string;
  _raw: string;
}

export interface BreatheServerResponse extends ServerResponse<IncomingMessage> {
  html?: string;
  parse?: ParseUrlInfo;
}

export type NextHandler = () => void | Promise<void>;

export interface BreatheServerRequest extends IncomingMessage {}

export async function createDevServer(root: string, option: Optopns) {
  const conf = await resolveConfig(root, option.configPath ?? CONFIG_NAME);

  const { server } = conf;

  const { port, host } = {
    host: option.host ?? server.host ?? DEFAULT_HOST,
    port: option.port ?? server.port ?? DEFAULT_PORT,
  };

  const middlewares = [
    urlParseMiddleware,
    staicServeMiddleware,
    filesRouterMiddleware,
    pagesServeMiddleware,
  ];

  const app = polka({
    onNoMatch: (req, res) => {
      res.end(`<h1> Not Found  ${req.url}  </h1>`);
    },
  });

  const serverMidds = middlewares.map((middleware) => {
    return middleware(root, conf);
  });

  app
    .use(compression(), ...serverMidds)

    .get("*", (req: BreatheServerRequest, res: BreatheServerResponse) => {
      res.end(res.html);
    })

    .listen(port, host, (err: any) => {
      if (err) throw err;
      console.log(colors.green(`http://${host}:${port}`));
    });
}
