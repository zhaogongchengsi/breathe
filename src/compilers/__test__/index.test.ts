import { join } from "path";
import { describe, it, expect } from "vitest";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";

import {
  compilerScript,
  readCodeFile,
  compilerStyle,
  compilerSassStyle,
  compilerSassFile,
  Html,
  HtmlOptions,
} from "../";

describe("script", () => {
  it("read code file", async () => {
    const code = await readCodeFile(join(__dirname, "scripttest/index.js"));
    expect(code).not.toBe("");
  });

  it("compiler", async () => {
    const code = await readCodeFile(join(__dirname, "scripttest/index.js"));
    const newcode = await compilerScript(code);
    expect(newcode).not.toBe("");
  });

  it("compiler (ts)", async () => {
    const code = await readCodeFile(join(__dirname, "scripttest/index.ts"));

    const newcode = await compilerScript(code, "development");
    expect(newcode).not.toBe("");
  });
});

describe("style", () => {
  it("use plugins Add prefix", async () => {
    const css = await readCodeFile(join(__dirname, "styletest/index.css"));
    const newcss = await compilerStyle(css, [autoprefixer]);
    expect(newcss.code).toMatch("-webkit");
  });

  it("css nested syntax", async () => {
    const css = await readCodeFile(join(__dirname, "styletest/nested.css"));
    const newcss = await compilerStyle(css, [nested]);
    expect(newcss.code).toMatch(".a .b");
  });

  it("scss", async () => {
    const css = await readCodeFile(join(__dirname, "styletest/index.scss"));
    const newcss = await compilerSassStyle(css);
    expect(newcss).toMatch(".a .b");
  });

  it("scss (import)", async () => {
    const newcss = await compilerSassFile(
      join(__dirname, "styletest/index2.scss")
    );
    expect(newcss).toMatch(".a1 .b2");
    expect(newcss).toMatch(".a .b");
  });
});

describe("html", () => {
  const root = join(__dirname, "htmltest");
  const config: HtmlOptions = {
    pages: "pages",
    layouts: "layout",
    components: "components",
    root,
    mode: "development",
  };

  const html = new Html(config);

  it("name -> path", () => {
    const path1 = html.parsePath("index");
    const path2 = html.parsePath("index.html");
    const path3 = html.parsePath("index/index.html");
    const path4 = html.parsePath("");
    const path5 = html.parsePath("index/''");
    const path6 = html.parsePath("/");

    expect(path1).toBe(join(root, "index.html"));
    expect(path2).toBe(join(root, "index.html"));
    expect(path3).toBe(join(root, "index/index.html"));
    expect(path4).toBe(join(root, "index.html"));
    expect(path5).toBe(join(root, "index/index.html"));
    expect(path6).toBe(join(root, "index.html"));
  });

  it("read pages file", async () => {
    const file = await html.readPagesFile("index.html");
    expect(file).not.toBe("");
  });

  it("compiler", async () => {
    const file = await html.readPagesFile("index.html");
    const str = await html.compiler(file!);
    expect(str).not.toBe("");
  });

  it.skip("Module does not exist", async () => {
    const cop = async () => {
      const file = await html.readPagesFile("abc.html");
      return await html.compiler(file!);
    };

    expect(cop).toThrowError(/^module does not exist$/);
  });
});
