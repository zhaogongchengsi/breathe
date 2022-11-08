import { BuildOption } from "./cli";
import { CONFIG_NAME, resolveConfig } from "./config";
import { createFileChtch } from "./utils";

export async function build(cwd: string, options: BuildOption) {
  const conf = await resolveConfig(cwd, options.configPath ?? CONFIG_NAME);
  const ch = await createFileChtch(cwd, conf.pages);

  ch.forEach(async (key, value) => {
    console.log(key);
  });
}
