import { stat } from "fs/promises";

/**
 *
 * @param path 文件路径
 * @description 文件路径存在并且不是文件夹
 */
export async function fileExist(path: string): Promise<boolean> {
  try {
    const state = await stat(path);
    if (!state.isDirectory()) return true;
    return false;
  } catch {
    return false;
  }
}
