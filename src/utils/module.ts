import { createRequire } from 'module'

const cr = createRequire(__dirname)

export function _require(path: string) {
  return cr(path)
}
