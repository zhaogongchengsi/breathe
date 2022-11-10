import { statSync } from 'fs'
import { readFile } from 'fs/promises'
import { join, parse, resolve, sep } from 'path'
import { e } from 'vitest/dist/index-6e18a03a'

export async function readCodeFile(path: string): Promise<string> {
  let file
  try {
    file = await readFile(path)
  }
  catch (err) {
    throw new Error(`File read failed -->${path}`)
  }

  return file.toString()
}

export interface FindFileoptions {
  ext?: '.js' | '.html' | '.css'
  defaultFile?: string
}

/**
 * @params basepath 寻找的目录
 * @params filepath 寻找的文件
 * @params options 寻找的文件的后缀
 * @type {FindFileoptions}
 * @description 在某目录下寻找文件 若是没有则寻找一个默认文件提供
 */
export function findFile(
  basepath: string,
  filepath: string,
  options?: FindFileoptions,
): string | undefined {
  const { ext, defaultFile } = Object.assign({}, options)

  if (filepath.startsWith('/'))
    filepath = filepath.substring(1)

  const { dir, name, ext: ex } = parse(filepath)

  const url = resolve(basepath, filepath)

  const stat = statSync(url)

  if (stat.isFile())
    return url

  const getExt = () => {
    return ext || ex || ''
  }

  if (defaultFile) {
    const fileUrl = [join(basepath, filepath), defaultFile + getExt()].join(
      sep,
    )
    try {
      const state = statSync(fileUrl)
      if (state.isFile())
        return fileUrl
    }
    catch {
      throw new Error(
        `The target is a folder, the provided default file does not exist :${fileUrl}`,
      )
    }
  }
  else {
    throw new Error('The target is a folder and no default file is provided')
  }
}
