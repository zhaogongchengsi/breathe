import postcss, { AcceptedPlugin } from "postcss";
import sass, { compileAsync } from "sass";

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

export function compilerSassStyle(code: string) {
  return new Promise((res, rej) => {
    try {
      let cssString = sass.compileString(code);
      res(cssString.css);
    } catch (err) {
      rej(err);
    }
  });
}

export async function compilerSassFile(form: string, to?: string) {
  const res = await compileAsync(form);
  if (to) {
    console.log("写入css")
  }
  return res.css;
}
