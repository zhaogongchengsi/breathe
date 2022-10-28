import { join } from "path";
import { describe, expect, it } from "vitest";
import { requestType } from "..";
import { fileExist } from "../fs";
import { _require } from "../module";

describe("fs", () => {
  it("fileExist", () => {
    const is1 = fileExist(join(__dirname, "test.json"));
    const is2 = fileExist(join(__dirname, "test1"));

    expect(is1).toBe(true);
    expect(is2).toBe(false);
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
