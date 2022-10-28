import { describe, it, expect } from "vitest";
import { posthtmlStylePlugin } from "..";
import posthtml from "posthtml";

describe("style loder", () => {
  it("style", async () => {
    const html = `<head>
            <link rel="stylesheet" href="index.scss">
    </head>`;
    const res = await posthtml([posthtmlStylePlugin({})]).process(html);
    expect(res.html).toContain("type=scss");
  });
});
