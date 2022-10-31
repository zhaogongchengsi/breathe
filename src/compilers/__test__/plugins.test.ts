import { join } from "path";
import { describe, it, expect } from "vitest";
import { compilerHtml, posthtmlStylePlugin } from "../";

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
