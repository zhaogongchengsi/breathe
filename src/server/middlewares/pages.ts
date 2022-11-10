import type {
  BreatheServerRequest,
  BreatheServerResponse,
  NextHandler,
} from '..'
import type { BreatheConfig } from '../../config'
import type { CreateFileChtch } from '../../utils'
import { formatErr, requestType } from '../../utils'
import {
  compilerHtml,
  posthtmlInjection,
  posthtmlStylePlugin,
} from '../../compilers'
import { injectClientCode } from '../ws'

export function pagesServeMiddleware(
  root: string,
  { pages, layouts }: BreatheConfig,
  dirChtch: CreateFileChtch,
  { port }: { port: number },
) {
  return async (
    req: BreatheServerRequest,
    res: BreatheServerResponse,
    next: NextHandler,
  ) => {
    if (req.method !== 'GET') {
      next()
      return
    }

    let url = res._url

    if (!url) {
      next()
      return
    }

    if (requestType(url) != 'html') {
      next()
      return
    }

    if (url === '/')
      url = 'index.html'

    let html = ''

    try {
      const code = dirChtch.find(url)

      if (!code) {
        next()
        return
      }

      html = await compilerHtml(code, {
        root,
        modules: layouts,
        mode: 'development',
        plugins: [
          posthtmlStylePlugin({ mode: 'development' }),
          posthtmlInjection('development', {
            mode: 'development',
            code: injectClientCode({ port }),
            Location: 'footer',
          }),
        ],
      })

      res.end(html)
    }
    catch (err: any) {
      res.err = {
        code: 500,
        massage: formatErr(err),
      }
      next()
    }
  }
}
