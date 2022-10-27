import { join } from "path";
import { describe, expect, it } from "vitest";
import { fileExist } from "../fs";
import { _require } from "../module";

describe("fs", () => {
  it("fileExist", async () => {
    const is1 = await fileExist(join(__dirname, "test.json"));
    const is2 = await fileExist(join(__dirname, "test1"));

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
