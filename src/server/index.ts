import type { IncomingMessage, ServerResponse } from 'http'
import { join, sep } from 'path'
import { readFile } from 'fs/promises'
import polka from 'polka'
import colors from 'picocolors'
import compression from 'compression'
import type { ServerOption } from '../cli'

import {
  CONFIG_NAME,
  DEFAULT_HOST,
  DEFAULT_PORT,
  resolveConfig,
} from '../config'
import { RecordInfo, createFileChtch } from '../utils'
import { createWatcher } from '../watch'
import {
  pagesServeMiddleware,
  serverErrotMiddleware,
  staicServeMiddleware,
  styleServeMiddleware,
  urlParseMiddleware,
} from './middlewares'

import type { WsMessage } from './ws'
import { createWsServer } from './ws'

export interface Optopns extends ServerOption {
  configPath: string
}

export interface ParseUrlInfo {
  search: string | null | undefined
  query: string | null | undefined
  pathname: string
  path: string
  href: string
  _raw: string
}

export interface ErrorInfo {
  code: number
  massage: string
}

export interface BreatheServerResponse extends ServerResponse<IncomingMessage> {
  _url?: string
  html?: string
  err?: ErrorInfo
  parse?: ParseUrlInfo
}

export type NextHandler = () => void | Promise<void>

export interface BreatheServerRequest extends IncomingMessage {}

export async function createDevServer(root: string, option: Optopns) {
  const conf = await resolveConfig(root, option.configPath ?? CONFIG_NAME)

  const { server } = conf

  const { port, host } = {
    host: option.host ?? server.host ?? DEFAULT_HOST,
    port: option.port ?? server.port ?? DEFAULT_PORT,
  }

  const wsPort = port + 1

  const rec = new RecordInfo()

  const fileCatch = await createFileChtch(root, conf.pages, '/')

  const wss = createWsServer(wsPort, host)

  const broadcast = (message: WsMessage) => {
    wss.clients.forEach((ws) => {
      ws.send(JSON.stringify(message))
    })
  }

  const getKey = (path: string) => {
    return path.replace(new RegExp(`^${conf.pages}\\${sep}`), '')
  }

  const changeHandler = async (path: string) => {
    const filePath = join(root, path)
    const code = await readFile(filePath, { encoding: 'utf8' })
    await fileCatch.update(getKey(path), code)
    broadcast({ type: 'fileChange', message: getKey(path).replace(sep, '/') })
  }

  createWatcher(conf.pages, {
    cwd: root,
    sep: '/',
    async onChange(path) {
      await changeHandler(path)
      rec.change(getKey(path), 'update')
    },
    async onAdd(type, path) {
      if (type === 'dir')
        return
      await changeHandler(path)
    },
    async onDelete(type, path) {
      if (type === 'dir')
        return
      fileCatch.deleteChtch(getKey(path))
      rec.change(getKey(path), 'delete')
    },
  })

  const app = polka({
    onNoMatch: (req, res) => {
      res.end(`<h1> Not Found  ${req.url}  </h1>`)
    },
  })

  app
    .use(
      compression(),
      staicServeMiddleware(root, conf),
      urlParseMiddleware(root, conf),
      pagesServeMiddleware(root, conf, fileCatch, { port: wsPort }),
      styleServeMiddleware(root, conf),
      serverErrotMiddleware(root, conf),
    )

    .get('*', async (req: BreatheServerRequest, res: BreatheServerResponse) => {
      //   const html = await res.html?.render();
      res.end('<h1> defaule hello world </h1>')
    })

    .listen(port, (err: any) => {
      if (err)
        throw err
      // eslint-disable-next-line no-console
      console.log(colors.green(`http -> http://${host}:${port}`))
    })
}
