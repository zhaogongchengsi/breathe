import { join } from "path";
import { describe, it, expect } from "vitest";
import { Html, HtmlOptions } from "../html";

describe("html", () => {
  const root = join(__dirname, "htmltest");
  const config: HtmlOptions = {
    pages: "pages",
    layouts: "layout",
    components: "components",
    root,
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
