import { describe, it, expect } from "vitest";
import { posthtmlStylePlugin } from "..";
import posthtml from "posthtml";

describe("style loder", () => {
  it("style dev", async () => {
    const html = `<head>
            <link rel="stylesheet" href="index.scss">
    </head>`;
    const res = await posthtml([
      posthtmlStylePlugin({ mode: "development" }),
    ]).process(html);
    expect(res.html).toContain("type=scss");
  });

  it("style pro", async () => {
    const html = `<head>
            <link rel="stylesheet" href="index.scss">
    </head>`;
    const res = await posthtml([
      posthtmlStylePlugin({ mode: "production" }),
    ]).process(html);
    expect(res.html).toContain("index.css");
  });
});
