import { dirname, format, parse, relative, resolve, sep } from 'path'
import { readFileSync } from 'fs'
import type { Plugin } from 'posthtml'
import posthtml from 'posthtml'
// @ts-expect-error
import posthtmlModule from 'posthtml-modules'
// @ts-expect-error
import posthtmlInclude from 'posthtml-include'
import type PostHTML from 'posthtml'
import { compileString } from 'sass'
import { outputFile } from 'fs-extra'
import type { Mode } from './index'
import {
  buildScriptSync,
  compilerSassFileSync,
  compilerScriptSync,
} from './index'

export interface PostHtmlStylePluginOptons {
  mode: Mode
  cwd?: string
  outdir?: string
  currentPath?: string
}

export interface CompilerHtmlOptions {
  root?: string
  modules?: string
  mode?: Mode
  plugins?: Plugin<any>[]
}

export function compilerHtml(
  html: string,
  options?: CompilerHtmlOptions,
): Promise<string> {
  const { root, modules, plugins } = Object.assign(
    {
      root: process.cwd(),
      modules: 'modules',
      mode: 'production',
      plugins: [],
    },
    options,
  )

  const includePlugin = posthtmlInclude({
    encoding: 'utf8',
    root,
  })

  const htmlModulesMidd = posthtmlModule({
    root,
    from: resolve(root, modules),
    plugins: () => plugins,
  })

  return new Promise((res, rej) => {
    posthtml([includePlugin, ...plugins])
      .use(htmlModulesMidd)
      .process(html)
      .then((result) => {
        res(result.html)
      })
      .catch((err) => {
        rej(err)
      })
  })
}

const cacth = new Map<string, string>()

export function posthtmlStylePlugin({
  mode,
  cwd,
  outdir,
  currentPath,
}: PostHtmlStylePluginOptons) {
  const isDev = mode === 'development'
  const isPro = mode === 'production'

  const convertUrl = (attrurl: string, origin: string) => {
    // @ts-expect-error
    const { ext, name, dir, root } = parse(attrurl)
    const type = ext.slice(1)

    if (isPro && cwd && outdir && currentPath) {
      const outfile = resolve(
        cwd,
        outdir,
        format({
          root,
          dir,
          name: `${name}-${String(Math.floor(Math.random() * 100))}`,
          ext: `.${origin}`,
        }),
      )

      const filepath = resolve(cwd, attrurl)

      const key = filepath

      // 打包完成一个静态文件后 将输出文件的路径缓存起来
      const cacthFile = cacth.get(key)

      const getRelative = (_path: string) => {
        const relPath = relative(currentPath, _path)
          .split(sep)
          .join('/')
          .slice(3)
        const { name: n, dir: d, root: r } = parse(relPath)
        return [r, d, `${n}.${origin}`].filter(Boolean).join('/')
      }

      if (cacthFile) {
        // 当引用的文件已存在时 重新计算相对路径
        return getRelative(cacthFile)
      }

      // 处理文件
      if (origin === 'js') {
        buildScriptSync(filepath, outfile)
      }
      else if (origin === 'css') {
        if (type === 'scss')
          compilerSassFileSync(filepath, outfile)
        else
          outputFile(outfile, readFileSync(filepath).toString())
      }

      cacth.set(key, outfile)

      // 第一次计算相对路径
      return getRelative(outfile)
    }

    return [root, dir, `${name}.${origin}${isDev ? `?type=${type}` : ''}`]
      .filter(Boolean)
      .join('/')
  }

  return (tree: PostHTML.Node) => {
    // @ts-expect-error
    tree.match({ tag: 'link', attrs: { rel: 'stylesheet' } }, (node) => {
      const { attrs } = node
      // @ts-expect-error
      if (!attrs.href)
        return node

      return Object.assign(node, {
        attrs: {
          ...attrs,
          href: convertUrl(attrs.href, 'css'),
        },
      })
    })

    tree.match({ tag: 'script' }, (node) => {
      const { attrs } = node

      // @ts-expect-error
      if (!attrs.src)
        return node

      // @ts-expect-error
      if (attrs.type && attrs.type === 'module')
        return node

      return Object.assign(node, {
        attrs: {
          ...attrs,
          // @ts-expect-error
          src: convertUrl(attrs.src, 'js'),
        },
      })
    })

    // 内联代码编译
    tree.match({ tag: 'style', attrs: { lang: 'scss' } }, (node) => {
      const { content, attrs } = node

      // @ts-expect-error
      delete attrs.lang
      // @ts-expect-error
      const scsscode: string = content[0] ?? ''

      return Object.assign(node, {
        content: [compileString(scsscode).css],
        attrs,
      })
    })

    tree.match(
      { tag: 'script', attrs: { type: 'text/typescript' } },
      (node) => {
        const { content, attrs } = node
        // @ts-expect-error
        delete attrs.lang
        // @ts-expect-error
        const tscode: string = content[0] ?? ''

        return Object.assign(node, {
          content: [
            compilerScriptSync(tscode, mode, {
              sourcemap: undefined,
            }).code,
          ],
          attrs: {
            ...attrs,
            type: 'text/javascript',
          },
        })
      },
    )
  }
}

export interface posthtmlInjectionOptions {
  mode: Mode
  code?: string
  Location: 'header' | 'footer'
}

export function posthtmlInjection(
  mode: Mode,
  ...options: posthtmlInjectionOptions[]
) {
  return (tree: PostHTML.Node) => {
    options.forEach((option) => {
      if (mode === option.mode) {
        if (option.Location === 'footer') {
          tree.match({ tag: 'body' }, (node) => {
            return {
              ...node,
              content: node.content?.concat([option.code ?? '']),
            }
          })
        }
        if (option.Location === 'header') {
          tree.match({ tag: 'head' }, (node) => {
            return {
              ...node,
              content: node.content?.concat([option.code ?? '']),
            }
          })
        }
      }
    })
  }
}
