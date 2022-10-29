import { transform, TransformOptions, Plugin } from "esbuild";
import { readFile } from "fs/promises";

type Mode = "development" | "production";
export interface ScriptOptions {
  root: string;
  mode: Mode;
  plugins?: Plugin[];
}

export class Script {
  root: string;
  mode: Mode;
  plugins: Plugin[];
  constructor(options: ScriptOptions) {
    this.root = options.root;
    this.mode = options.mode;
    this.plugins = options.plugins ?? [];
  }

  use(...plugins: Plugin[]) {
    this.plugins.concat(plugins);
    return this;
  }

  async readScriptFile(path: string) {
    let file;
    try {
      file = await readFile(path);
    } catch (err) {
      throw new Error(`File read failed -->${path}`);
    }

    return file.toString();
  }

  async compiler(code: string, optiosn?: TransformOptions) {
    const isDev = this.mode === "production";
    const opt = optiosn ?? {};
    return transform(code, {
      format: "iife",
      minify: isDev,
      target: ["ie9"],
      loader: "ts",
      platform: "browser",
      sourcemap: "inline",
      ...opt,
    });
  }
}
