import { join, resolve } from "path";
import { describe, it, expect } from "vitest";
import autoprefixer from "autoprefixer";
import nested from "postcss-nested";

import {
  readCodeFile,
  findFile,
  compilerScript,
  compilerStyle,
  compilerSassStyle,
  compilerSassFile,
  compilerHtml,
  posthtmlStylePlugin,
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
  it("compiler", async () => {
    const file = await readCodeFile(
      join(__dirname, "htmltest/pages/index.html")
    );
    const str = await compilerHtml(file!, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "development",
    });
    expect(str).not.toBe("");
  });
});

describe("find file", () => {
  const targetFile = resolve(__dirname, "htmltest/pages", "index.html");

  it("defaule index file", () => {
    const filepath = findFile(__dirname, "htmltest/pages", {
      defaultFile: "index",
      ext: ".html",
    });

    expect(filepath).toBe(targetFile);
  });

  it("url", () => {
    const filepath = findFile(__dirname, "/htmltest/pages", {
      defaultFile: "index",
      ext: ".html",
    });

    expect(filepath).toBe(targetFile);
  });

  it("file suffix", () => {
    const filepath = findFile(__dirname, "htmltest/pages/index.html");
    expect(filepath).toBe(targetFile);
  });

  it.todo("file no suffix", () => {
    const filepath = findFile(__dirname, "htmltest/pages/index", {
      ext: ".html",
    });
    expect(filepath).toBe(targetFile);
  });
});

describe.todo("Integration default index.html", () => {
  it(" read default index.html", async () => {
    const filepath = findFile(__dirname, "htmltest/pages", {
      defaultFile: "index",
      ext: ".html",
    });
    expect(filepath).not.toBe("");
    const file = await readCodeFile(filepath!);
    expect(file).not.toBe("");
  });

  it(" read default index.html", async () => {
    const filepath = findFile(__dirname, "htmltest/pages", {
      defaultFile: "index",
      ext: ".html",
    });

    expect(filepath).not.toBe("");

    const file = await readCodeFile(filepath!);

    expect(file).not.toBe("");

    const str = await compilerHtml(file!, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "development",
    });

    expect(str).not.toBe("");
  });
});

describe("style loder", () => {
  it("style dev", async () => {
    const html = `<head>
            <link rel="stylesheet" href="index.scss">
    </head>`;

    const str = await compilerHtml(html!, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "development",
      plugins: [posthtmlStylePlugin({ mode: "development" })],
    });

    expect(str).toContain("type=scss");
  });

  it("style pro", async () => {
    const html = `<head>
            <link rel="stylesheet" href="index.scss">
    </head>`;

    const str = await compilerHtml(html!, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "production",
      plugins: [posthtmlStylePlugin({ mode: "production" })],
    });

    expect(str).toContain("index.css");
  });
});
