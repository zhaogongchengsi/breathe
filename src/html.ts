import { readFile } from "fs/promises";
import posthtml from "posthtml";
// @ts-ignore
import posthtmlModule from "posthtml-modules";
// @ts-ignore
import posthtmlInclude from "posthtml-include";
import { join, parse, resolve } from "path";

export interface HtmlOptions {
  layouts: string;
  components: string;
  pages: string;
  root: string;
}

export class Html {
  config: HtmlOptions;

  head: string[];

  body: string;

  file: string | undefined;

  constructor(config: HtmlOptions) {
    this.config = config;
    this.head = [];
    this.body = "";
  }

  public parsePath(
    pathname: string,
    basepath?: string,
    filext: string = ".html"
  ) {
    const { config } = this;
    let { dir, name, ext } = parse(pathname);
    const _ext = ext === filext ? filext : filext;
    const _name = ["", "''", "/"].includes(name) ? "index" : name;
    const _dir = ["/"].includes(dir) ? "" : dir;
    return resolve(basepath ?? config.root, join(_dir, _name + _ext));
  }

  public async readPagesFile(name: string): Promise<string | undefined> {
    const { root, pages } = this.config;
    const path = this.parsePath(name, join(root, pages));

    let file;
    try {
      file = await readFile(path);
    } catch (err) {
      throw err;
    }

    return file.toString();
  }

  async render(name: string) {
    const file = await this.readPagesFile(name);

    if (!file) return;
    return await this.compiler(file);
  }

  public compiler(html: string) {
    const { config } = this;

    const includePlugin = posthtmlInclude({
      encoding: "utf8",
      root: config.root,
    });

    const htmlModulesMidd = posthtmlModule({
      root: config.root,
      from: resolve(config.root, config.layouts),
    });

    return new Promise((res, rej) => {
      posthtml([includePlugin])
        .use(htmlModulesMidd)
        .process(html)
        .then((result) => {
          res(result.html);
        })
        .catch((err) => {
          rej(new Error(`The module does not exist, the path is: ${err.path}`));
        });
    });
  }
}
