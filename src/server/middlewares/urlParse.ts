import polkaParse from '@polka/url'
import type {
  BreatheServerRequest,
  BreatheServerResponse,
  NextHandler,
} from '..'
import type { BreatheConfig } from '../../config'
// @ts-expect-error

export function urlParseMiddleware(root: string, config: BreatheConfig) {
  return (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler,
  ) => {
    const info = polkaParse(req)
    res._url = info.pathname
    res.parse = info
    next()
  }
}
