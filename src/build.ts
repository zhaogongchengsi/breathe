import { resolve } from "path";
import { BuildOption } from "./cli";
import { CONFIG_NAME, resolveConfig } from "./config";
import { catalogScan, createFileChtch } from "./utils";
import { outputFile } from "fs-extra";
import { compilerHtml, posthtmlStylePlugin } from "./compilers";

export async function build(cwd: string, options: BuildOption) {
  const { layouts, pages, build } = await resolveConfig(
    cwd,
    options.configPath ?? CONFIG_NAME
  );
  const distPath = options.outdir || build.outdir || "dist";

  const ch = await createFileChtch(cwd, pages);

  await ch.forEach(async (path, value) => {
    const pathname = path.replace(pages + "/", "");
    const outdir = resolve(cwd, distPath, pathname);
    const html = await compilerHtml(value, {
      root: cwd,
      modules: layouts,
      mode: "production",
      plugins: [posthtmlStylePlugin({ mode: "production" })],
    });
    await outputFile(outdir + ".html", html);
  });

  console.log("构建结束");
}
