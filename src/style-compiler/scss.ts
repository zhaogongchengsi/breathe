import sass from "node-sass";

export function compilerSass(code: string) {
  return new Promise((res, rej) => {
    sass.render({ data: code }, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });
}
