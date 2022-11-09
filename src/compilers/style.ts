import postcss, { AcceptedPlugin } from "postcss";
import sass, { compileAsync, compileString } from "sass";

/**
 *
 * @param css css 代码
 * @param plugins postcss plugins
 * @param from The path of the CSS source file. You should always set from, because it is used in source map generation and syntax error messages.
 * @param to The path where you'll put the output CSS file. You should always set to to generate correct source maps.
 * @description 输出css代码以及对应的map代码 用以调试用 并且可通过postcss 插件来处理css
 */
export function compilerStyle(
  css: string,
  plugins: AcceptedPlugin[] = [],
  from?: string,
  to?: string
): Promise<{ code: string; map: string }> {
  return new Promise((res, rej) => {
    postcss(plugins)
      .process(css, { from, to })
      .then((result) => {
        res({
          code: result.css,
          map: result.map?.toString(),
        });
      })
      .catch(rej);
  });
}

/**
 *
 * @param code scss 代码
 * @description 不支持通过 `@import` 引入指定的scss文件 使用**异步**的方式编译小段scss代码
 */
export function compilerSassStyle(code: string): Promise<string> {
  return new Promise((res, rej) => {
    try {
      let cssString = sass.compileString(code);
      res(cssString.css);
    } catch (err) {
      rej(err);
    }
  });
}

/**
 *
 * @param code scss 代码
 * @description 不支持通过 `@import` 引入指定的scss文件 使用同步的方式编译小段scss代码
 */
export function compilerSassStyleSync(code: string) {
  return compileString(code).css;
}

/**
 *
 * @param form 编译scss 目标文件的路径
 * @param to 需要输出的文件路径
 * @description 若指定 输出目录 则直接输出 未指定输出目录 则直接输出编译后的css 支持通过 `@import` 引入指定的scss文件
 */
export async function compilerSassFile(form: string, to?: string) {
  const res = await compileAsync(form);
  if (to) {
    console.log("写入css");
  }
  return res.css;
}
