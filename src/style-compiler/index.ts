import postcss, { AcceptedPlugin } from "postcss";
import autoprefixer from "autoprefixer";

export function compilerCss(css: string, plugins: AcceptedPlugin[]) {
  return new Promise((res, rej) => {
    postcss([autoprefixer, ...plugins])
      .process(css)
      .then((result) => {
        res({
          code: result.css,
          map: result.map.toString(),
        });
      })
      .catch(rej);
  });
}
