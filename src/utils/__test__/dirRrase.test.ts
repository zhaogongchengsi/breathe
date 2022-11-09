import { join, resolve } from "path";
import { describe, it, expect } from "vitest";
import { dirRrase } from "..";

describe("Traverse the directory", () => {
  const targetDir = resolve(__dirname, "pages");

  it("dirRrase", async () => {
    const files: string[] = [];
    const bases: string[] = [];
    await dirRrase(targetDir, (path, base) => {
      files.push(path);
      bases.push(base);
    });

    expect(files).toEqual([
      "about/desc/index.html",
      "about/index.html",
      "index.html",
    ]);
  });
});
