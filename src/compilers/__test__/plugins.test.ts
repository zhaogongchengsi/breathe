import { join } from "path";
import { describe, it, expect } from "vitest";
import { compilerHtml, posthtmlStylePlugin, posthtmlInjection } from "../";

describe("style loder", () => {
  it.skip("style dev", async () => {
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

  it.skip("style pro", async () => {
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

  it("Internal chain scss", async () => {
    const html = `<head>
            <style lang="scss" >  .a { .b { color: red; } }  </style>
            <style lang="scss" >  .a1 { .b2 { color: red; } }  </style>
    </head>`;

    const str = await compilerHtml(html!, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "development",
      plugins: [posthtmlStylePlugin({ mode: "development" })],
    });

    expect(str).toContain(".a .b");
  });
});

describe("html Code injection", () => {
  it("development Code injection", async () => {
    const html = `<html> <head><style  >  .b { color: red; }</style></head><body> <h1>hello world</h1> </body></html>`;

    const code = `<script> console.log(1) </script>`;
    const codeHead = `<script> console.log(3) </script>`;
    const codePro = `<script> console.log(2) </script>`;
    const str = await compilerHtml(html, {
      modules: "layout",
      root: join(__dirname, "htmltest"),
      mode: "development",
      plugins: [
        posthtmlInjection(
          "development",
          {
            mode: "development",
            code: code,
            Location: "footer",
          },
          {
            mode: "production",
            code: codePro,
            Location: "footer",
          },
          {
            mode: "development",
            code: codeHead,
            Location: "header",
          }
        ),
      ],
    });

    expect(str).toContain(code);
    expect(str).not.toContain(codePro);
    expect(str).toContain(codeHead);
  });
});
