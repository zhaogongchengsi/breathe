import { cac } from "cac";

import { createDevServer } from "./index";

const cli = cac("breathe");

export interface ServerOption {
  host: string;
  port: number;
}

export function createCli() {
  const root = process.cwd();

  console.log("cwd", root);

  // npm run bs dev
  cli
    .command("[root]", "start dev server") // default command
    .alias("serve") // the command is called 'serve' in Vite's API
    .alias("dev") // alias to align with the script name
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .action((root: string, options: ServerOption) => {
      console.log("actions", root, options);
      createDevServer();
    });

  return cli;
}
