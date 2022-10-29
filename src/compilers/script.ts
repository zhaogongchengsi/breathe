import { TransformOptions, transform } from "esbuild";
import type { Mode } from ".";

export async function compilerScript(
  code: string,
  mode: Mode = "development",
  optiosn?: TransformOptions
): Promise<string> {
  const isDev = mode === "production";
  const opt = optiosn ?? {};

  const res = await transform(code, {
    format: "iife",
    minify: isDev,
    target: ["es2016"],
    loader: "ts",
    platform: "browser",
    sourcemap: "inline",
    ...opt,
  });

  return res.code;
}
