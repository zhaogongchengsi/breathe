import { join } from "path";
import { describe, it, expect } from "vitest";
import { Style } from "../style";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";

// // @ts-ignore
// import cssfmt from "stylefmt";
// // @ts-ignore
// import utils from "postcss-utilities";
// // @ts-ignore
// import postenv from "postcss-preset-env";

describe("style", () => {
  const style = new Style({
    root: __dirname,
  });

  it("read css", async () => {
    const css = await style.readStyleFile(
      join(__dirname, "styletest/index.css")
    );
    expect(css).not.toBe("");
  });

  it("use plugins Add prefix", async () => {
    const css = await style.readStyleFile(
      join(__dirname, "styletest/index.css")
    );
    const newcss = await style.use(autoprefixer).compilerCss(css);
    expect(newcss.code).toMatch("-webkit");
  });

  it("use plugins Add prefix", async () => {
    const css = await style.readStyleFile(
      join(__dirname, "styletest/nested.css")
    );
    const newcss = await style.use(nested).compilerCss(css);
    expect(newcss.code).toMatch(".a .b");
  });

  it("scss", async () => {
    const css = await style.readStyleFile(
      join(__dirname, "styletest/index.scss")
    );
    const newcss = await style.compilerCss(css);
    expect(newcss.code).toMatch(".a .b");
  });
});
