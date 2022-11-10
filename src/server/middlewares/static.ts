import { resolve } from 'path'
import sirv from 'sirv'
import type {
  BreatheServerRequest,
  BreatheServerResponse,
  NextHandler,
} from '..'
import type { BreatheConfig } from '../../config'

const STATICRESOURCERTPE = ['.png', '.jpeg', '.jpg', '.svg']

export function staicServeMiddleware(
  root: string,
  { staticDir }: BreatheConfig,
) {
  const staticPath = resolve(root, staticDir)

  const serve = sirv(staticPath, {
    maxAge: 31536000, // 1Y
    immutable: true,
    etag: true,
    dev: true,
  })

  return function (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler,
  ) {
    const stactReg = new RegExp(`(\\.?\\/?${staticDir}\\/)(.*)(${STATICRESOURCERTPE.join('|')})`)
    req.url = req.url?.replace(stactReg, (match, p1, p2, p3) => {
      return `/${p2}${p3}`
    })

    serve(req, res, next)
  }
}
