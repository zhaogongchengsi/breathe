import { join, parse, resolve } from 'path'
import { readFile } from 'fs/promises'
import type {
  BreatheServerRequest,
  BreatheServerResponse,
  NextHandler,
} from '..'
import type { BreatheConfig } from '../../config'
import { compilerSassFile, compilerStyle } from '../../compilers'
import { formatErr } from '../../utils'

export function styleServeMiddleware(root: string, config: BreatheConfig) {
  return async (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler,
  ) => {
    if (req.method !== 'GET') {
      next()
      return
    }

    const url = res.parse?.pathname

    if (!url) {
      next()
      return
    }

    if (!url.endsWith('.css')) {
      next()
      return
    }

    // todo: 将请求后的文件内容缓存起来 只有第一次需要读取
    // @ts-expect-error
    const { type } = req.query
    const { dir, name } = parse(url)
    let csscode = ''
    const filepath = resolve(root, join(dir.slice(1), `${name}.${type}`))
    try {
      const file = await readFile(filepath)
      if (type === 'scss')
        csscode = await compilerSassFile(filepath)
      else if (type === 'css')
        csscode = file.toString()

      csscode = (await compilerStyle(csscode)).code
    }
    catch (err) {
      res.err = {
        code: 500,
        massage: formatErr(err),
      }
      next()
    }
    res.end(csscode)
  }
}
