import { join } from "path";
import { describe, expect, it } from "vitest";
import { requestType } from "..";
import { fileExist, catalogScan } from "../fs";
import { _require } from "../module";

describe("fs", () => {
  it("fileExist", () => {
    const is1 = fileExist(join(__dirname, "test.json"));
    const is2 = fileExist(join(__dirname, "test1"));

    expect(is1).toBe(true);
    expect(is2).toBe(false);
  });

  it("catalogScan", async () => {
    const cacth = await catalogScan(__dirname, "pages");
    const index = cacth.get("pages/index");
    const index2 = cacth.get("pages/about/index");
    const index3 = cacth.get("pages/about/desc/index");

    expect(index).toContain("<h1>pages</h1>");
    expect(index2).toContain("<h1>about page</h1>");
    expect(index3).toContain("<h1>about desc</h1>");
  });
});

describe("module", () => {
  it("_require", async () => {
    const json = await _require(join(__dirname, "test.json"));
    expect(json.name).toBe("zhaogongchengsi");
  });
});

describe("request", () => {
  it("requestType", () => {
    const type1 = requestType("/");
    const type2 = requestType("/index");
    const type3 = requestType("/index.scss");
    const type4 = requestType("/index.png");
    const type5 = requestType("/index.html");
    expect(type1).toBe("html");
    expect(type2).toBe("html");
    expect(type5).toBe("html");
    expect(type3).toBe("style");
    expect(type4).toBe("resources");
  });
});
