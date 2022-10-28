import postcss, { AcceptedPlugin } from "postcss";

import autoprefixer from "autoprefixer";
import nested from "postcss-nested";
// @ts-ignore
import cssfmt from "stylefmt";
// @ts-ignore
import utils from "postcss-utilities";
// @ts-ignore
import postenv from "postcss-preset-env";


export function compilerCss(css: string, plugins: AcceptedPlugin[] = []) {
  return new Promise((res, rej) => {
    postcss([autoprefixer, utils, nested, postenv(), cssfmt, ...plugins])
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
