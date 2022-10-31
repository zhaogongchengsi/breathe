import { stat, statSync } from "fs";
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

export async function catalogScan(
  root: string,
  path: string,
  splitSep: string = "/"
) {
  const catchFile = new Map<string, string>();
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
