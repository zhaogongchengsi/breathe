import { resolve } from 'path'
import { _require } from './utils'
import { fileExist } from './utils/fs'
import type { BuildOption, ServerOption } from '.'

export const CONFIG_NAME = 'breathe.config.json'
export const DEFAULT_HOST = 'localhost'
export const DEFAULT_PORT = 3456

export interface BreatheConfig {
  lib: string
  layouts: string
  pages: string
  components: string
  staticDir: string
  server: ServerOption
  build: BuildOption
}

export async function resolveConfig(
  root: string,
  name: string = CONFIG_NAME,
): Promise<BreatheConfig> {
  const configPath = resolve(root, name)

  if (!fileExist(configPath)) {
    return {
      server: {
        port: DEFAULT_PORT,
        host: DEFAULT_HOST,
      },
      build: {
        outdir: 'dist',
      },
      lib: 'lib',
      pages: 'pages',
      layouts: 'layouts',
      staticDir: 'public',
      components: 'components',
    }
  }

  let config: BreatheConfig
  try {
    config = await _require(configPath)
    return config
  }
  catch (err) {
    throw new Error('Configuration file read failed')
  }
}
