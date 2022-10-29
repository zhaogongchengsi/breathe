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
  urlParseMiddleware,
  styleServeMiddleware,
  serverErrotMiddleware,
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

export interface ErrorInfo {
  code: number;
  massage: string;
}

export interface BreatheServerResponse extends ServerResponse<IncomingMessage> {
  html?: string;
  err?: ErrorInfo;
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
    pagesServeMiddleware,
    styleServeMiddleware,
    serverErrotMiddleware,
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

    .get("*", async (req: BreatheServerRequest, res: BreatheServerResponse) => {
      //   const html = await res.html?.render();
      res.end("<h1> defaule hello world </h1>");
    })

    .listen(port, host, (err: any) => {
      if (err) throw err;
      console.log(colors.green(`http://${host}:${port}`));
    });
}
