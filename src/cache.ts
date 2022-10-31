import chokidar from "chokidar";
import { Stats } from "fs";

export interface CacheOptions {
  root: string;
  cacheDir: string | string[];
  pages: string;
}

export type FileCache = Map<string, string>;

export class Cache {
  private _options: CacheOptions;
  private root: string;
  private cacheDir: string | string[];
  private fileCache: FileCache;
  private FsWatch: chokidar.FSWatcher | undefined;
  private pagse: string;

  constructor(options: CacheOptions) {
    this._options = options;
    this.root = options.root;
    this.cacheDir = options.cacheDir;
    this.pagse = options.pages;
    this.fileCache = new Map<string, string>();
  }

  private watch() {
    const dirs =
      typeof this.cacheDir === "string"
        ? [this.cacheDir, this.pagse]
        : this.cacheDir.concat([this.pagse]);
        
    this.FsWatch = chokidar.watch(dirs, {
      cwd: this.root,
    });
    return this;
  }

  private static catalogScan(path: string) {}

  bindEvent(func?: (path: string, stat: Stats) => void) {
    const watch = this.FsWatch;
    watch?.on("all", (path: string, stat: Stats) => {
      func && func(path, stat);
      console.log(path);
    });
  }
}
