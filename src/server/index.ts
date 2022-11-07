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
import { catalogScan, createFileChtch } from "../utils";

import { createWsServer } from "./ws";
import { createWatcher } from "../watch";
import { join } from "path";
import { readFile } from "fs/promises";

export const WS_PATH = "ws";

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
  _url?: string;
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

  const wsPort = port + 1;

  const fileCatch = await createFileChtch(root, conf.pages, "/");

  const getKey = (path: string) => {
    return path.replace(conf.pages, "");
  };

  const changeHandler = async (path: string) => {
    const filePath = join(root, path);
    const code = await readFile(filePath, { encoding: "utf8" });
    fileCatch.update(getKey(path), code);
  };

  createWatcher(conf.pages, {
    cwd: root,
    sep: "/",
    async onChange(path) {
      changeHandler(path);
    },
    async onAdd(type, path) {
      if (type === "dir") {
        return;
      }
      changeHandler(path);
    },
    async onDelete(type, path) {
      if (type === "dir") {
        return;
      }
      fileCatch.deleteChtch(getKey(path));
    },
  });

  createWsServer(wsPort, host, {
    onHeartbeat(message) {
      console.log(message);
    },
  });

  const app = polka({
    onNoMatch: (req, res) => {
      res.end(`<h1> Not Found  ${req.url}  </h1>`);
    },
  });

  app
    .use(
      compression(),
      staicServeMiddleware(root, conf),
      urlParseMiddleware(root, conf),
      pagesServeMiddleware(root, conf, fileCatch),
      styleServeMiddleware(root, conf),
      serverErrotMiddleware(root, conf)
    )

    .get("*", async (req: BreatheServerRequest, res: BreatheServerResponse) => {
      //   const html = await res.html?.render();
      res.end("<h1> defaule hello world </h1>");
    })

    .listen(port, (err: any) => {
      if (err) throw err;
      console.log(colors.green(`http -> http://${host}:${port}`));
      console.log(colors.green(`ws -> ws://${host}:/${wsPort}`));
    });
}
