import { join } from "path";
import { describe, it, expect } from "vitest";
import { directoryScan } from "../server/assets";

describe("assets", () => {
  const dir = "testDir";
  const path1 = "testDir/file1";
  const path2 = "testDir/files/file2";

  const _join = (name: string) => join(__dirname, name);

  it.todo("file routing", () => {});

  it("directoryScan", () => {
    const paths = directoryScan(__dirname, dir);

    expect(paths).toEqual([_join(path1), _join(path2)]);
  });
});
