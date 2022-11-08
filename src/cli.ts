import { cac } from "cac";

import { createDevServer, build } from "./index";

const cli = cac("breathe");

export interface ServerOption {
  host?: string;
  port?: number;
}

export interface BuildOption {
  outdir?: string;
  configPath?: string;
}

export function createCli() {
  const cwdPath = process.cwd();

  // npm run bs dev
  cli
    .command("[root]", "start dev server") // default command
    .alias("serve") // the command is called 'serve' in Vite's API
    .alias("dev") // alias to align with the script name
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .action((root: string, options: ServerOption) => {
      createDevServer(cwdPath, {
        host: options.host,
        port: options.port,
        configPath: root,
      });
    });

  cli
    .command("build [root]", "build")
    .option("--outdir <dir>", `[string] output directory (default: dist)`)
    .action((root: string, option: BuildOption) => {
      build(cwdPath, {
        outdir: option.outdir,
        configPath: root,
      });
    });
  return cli;
}
