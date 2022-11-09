import { statSync } from "fs";
import { readdir, readFile } from "fs/promises";
import { join, parse, resolve, sep } from "path";

/**
 *
 * @param path 文件路径
 * @description 文件路径存在并且不是文件夹
 */
export function fileExist(path: string): boolean {
  try {
    const state = statSync(path);
    if (!state.isDirectory()) return true;
    return false;
  } catch {
    return false;
  }
}

export type DirChtch = Map<string, string>;
export async function catalogScan(
  root: string,
  path: string,
  cb?: (path: string, value: string) => void | Promise<void>,
  splitSep: string = "/"
): Promise<DirChtch> {
  const catchFile: DirChtch = new Map<string, string>();
  const targetDir = resolve(root, path);

  const files = await readdir(targetDir);

  for await (const file of files) {
    const target = join(path, file);
    const base = resolve(root, target);
    const chiFile = statSync(base);

    if (chiFile.isFile()) {
      const fileBuff = await readFile(base);
      const { dir, name } = parse(target);
      const key = [...dir.split(sep), name].join(splitSep);
      const fileStr = fileBuff.toString();
      cb && (await cb(base, fileStr), fileStr);
      catchFile.set(key, fileStr);
    }

    if (chiFile.isDirectory()) {
      const fileCache = await catalogScan(root, target, cb, splitSep);
      fileCache.forEach((value, key) => catchFile.set(key, value));
    }
  }

  return catchFile;
}

export type CreateFileChtch = {
  find(path: string): string | undefined;
  update(pathkey: string, value?: string | undefined): Promise<void>;
  deleteChtch(pathkey: string): void;
  clearChtch(): void;
  forEach(
    cb: (
      key: string,
      value: string,
      opt: {
        root: string;
        path: string;
        sep: string;
      }
    ) => void
  ): void;
};

export async function createFileChtch(
  root: string,
  path: string,
  splitSep: string = "/"
) {
  const chtch = await catalogScan(root, path, undefined, splitSep);

  const key = (pathkey: string): string => {
    const target = join(path, pathkey);
    const { dir, name } = parse(target);
    return [...dir.split(sep), name].join(splitSep);
  };

  return {
    find(path: string) {
      return chtch.get(key(path));
    },
    async update(pathkey: string, value?: string) {
      if (value) {
        chtch.set(key(pathkey), value || "");
        return;
      } else {
        const filePath = resolve(root, join(path, pathkey));
        const fileBuff = await readFile(filePath);
        chtch.set(key(pathkey), fileBuff.toString());
      }
    },
    deleteChtch(pathkey: string) {
      chtch.delete(key(pathkey));
    },
    clearChtch() {
      chtch.clear();
    },

    async forEach(
      cb: (
        key: string,
        value: string,
        opt: { root: string; path: string; sep: string }
      ) => void | Promise<void>
    ) {
      for await (const [key, value] of chtch) {
        cb &&
          (await cb(key, value, {
            root,
            path,
            sep,
          }));
      }
    },
  };
}

export async function dirRrase(
  path: string,
  cb: (path: string, base: string) => void | Promise<void>,
  s: string = "/"
) {
  const pubPath = path;

  async function rease(
    p: string,
    cb: (path: string, base: string) => void | Promise<void>
  ) {
    const files = await readdir(p);

    for await (const file of files) {
      const base = resolve(p, file);
      const chiFile = statSync(base);

      if (chiFile.isFile()) {
        const _p = base.replace(pubPath, "");
        const _p2 = _p.split(sep).filter(Boolean).join(s);
        cb && (await cb(_p2, base));
      }

      if (chiFile.isDirectory()) {
        await rease(base, cb);
      }
    }
  }

  return await rease(path, cb);
}
