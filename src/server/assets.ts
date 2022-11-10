import { join, resolve } from 'path'
import { readdirSync, statSync } from 'fs'
import type { BreatheConfig } from '../config'

export interface AssetsInfo {}

export async function createAssetsInfo(
  root: string,
  config: BreatheConfig,
): Promise<AssetsInfo> {
  return {}
}

export function directoryScan(root: string, path: string) {
  let paths: string[] = []

  const base = resolve(root, path)

  const dirs = readdirSync(base)

  dirs.forEach((dir) => {
    const _p = resolve(base, dir)
    const start = statSync(_p)
    if (start.isDirectory())
      paths = paths.concat(directoryScan(base, dir))
    else
      paths.push(_p)
  })

  return paths
}

export function createRouterPath() {}
