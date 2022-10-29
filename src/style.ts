import { readFile } from "fs/promises";
import postcss, { AcceptedPlugin } from "postcss";
import { BreatheConfig } from "./config";
import postScss from "postcss-scss";

// @ts-ignore
import postSyntax from "postcss-syntax";

export interface StyleOptions {
  plugins?: PostCssPlugin[];
  root: string;
  config?: BreatheConfig;
}

export type PostCssPlugin = AcceptedPlugin;

export class Style {
  root: string;

  plugins: PostCssPlugin[];

  config: BreatheConfig | undefined;

  constructor(options: StyleOptions) {
    this.root = options.root;
    this.plugins = options.plugins ?? [];
    this.config = options.config;
  }

  async readStyleFile(path: string) {
    let file;
    try {
      file = await readFile(path);
    } catch (err) {
      throw new Error(`File read failed -->${path}`);
    }

    return file.toString();
  }

  use(plugin: PostCssPlugin) {
    this.plugins.push(plugin);
    return this;
  }

  compilerCss(css: string): Promise<{ code: string; map: string }> {
    const syntax = postSyntax({
      sass: postScss,
    });

    return new Promise((res, rej) => {
      postcss(this.plugins)
        .process(css, { from: undefined, to: undefined, syntax: syntax })
        .then((result) => {
          res({
            code: result.css,
            map: result.map?.toString(),
          });
        })
        .catch(rej);
    });
  }
  
}
 
