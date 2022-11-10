import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { outputFile } from 'fs-extra'
import { format } from 'prettier'
import type { BuildOption } from './cli'
import { CONFIG_NAME, resolveConfig } from './config'
import { dirRrase } from './utils'
import { compilerHtml, posthtmlStylePlugin } from './compilers'

export async function build(cwd: string, options: BuildOption) {
  const { layouts, pages, build } = await resolveConfig(
    cwd,
    options.configPath ?? CONFIG_NAME,
  )

  const distPath = options.outdir || build.outdir || 'dist'

  await dirRrase(resolve(cwd, pages), async (pathname, file) => {
    const outdir = resolve(cwd, distPath, pathname)
    const value = await readFile(file)
    const html = await compilerHtml(value.toString(), {
      root: cwd,
      modules: layouts,
      mode: 'production',
      plugins: [
        posthtmlStylePlugin({
          mode: 'production',
          cwd,
          outdir: build.outdir,
          currentPath: outdir,
        }),
      ],
    })
    await outputFile(outdir, format(html, { semi: false, parser: 'html' }))
  })

  console.log('构建结束')
}
