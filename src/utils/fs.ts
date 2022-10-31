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
      const file = await readFile(base);
      const { dir, name } = parse(target);
      const key = [...dir.split(sep), name].join(splitSep);
      catchFile.set(key, file.toString());
    }

    if (chiFile.isDirectory()) {
      const fileCache = await catalogScan(root, target, splitSep);
      fileCache.forEach((value, key) => catchFile.set(key, value));
    }
  }

  return catchFile;
}

export async function createFileChtch(
  root: string,
  path: string,
  splitSep: string = "/"
) {
  const chtch = await catalogScan(root, path, splitSep);

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

    forEach(
      cb: (
        key: string,
        value: string,
        opt: { root: string; path: string; sep: string }
      ) => void
    ) {
      chtch.forEach((key, value) => {
        cb &&
          cb(key, value, {
            root,
            path,
            sep,
          });
      });
    },
  };
}
