import { statSync } from "fs";

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
