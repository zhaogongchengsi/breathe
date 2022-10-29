import { readFile } from "fs/promises";


export async function readCodeFile(path: string) :Promise<string> {
  let file;
  try {
    file = await readFile(path);
  } catch (err) {
    throw new Error(`File read failed -->${path}`);
  }

  return file.toString();
}
