export interface UpdtaeInfo {
  type: UpdateType;
  quantity?: number;
}

export type UpdateType = "add" | "delete" | "update";

export default class RecordInfo {
  private infos = new Map<string, UpdtaeInfo>();
  constructor() {}

  toString() {
    const { infos } = this;
    const strs: string[] = [];
    infos.forEach((value, key) => {
      switch (value.type) {
        case "add": {
          strs.push(`Newly added file -> ${key}`);
          break;
        }
        case "delete": {
          strs.push(`Delete ${key} file`);
          break;
        }
        case "update": {
          strs.push(`${key} file change x${value.quantity}`);
        }
      }
    });

    return strs.join("\n");
  }

  clear() {
    this.infos.clear();
  }

  change(path: string, type: UpdateType) {
    const { infos } = this;
    const info = infos.get(path);

    if (info) {
      infos.set(path, {
        ...info,
        quantity: info.quantity! + 1,
        type,
      });
      return;
    }

    infos.set(path, {
      quantity: 1,
      type,
    });
  }

  values() {
    const { infos } = this;
    const obj: Record<string, UpdtaeInfo> = {};

    infos.forEach((value, key) => {
      obj[key] = value;
    });

    return obj;
  }

  get isChange() {
    if (this.infos.size > 0) {
      return true;
    } else {
      return false;
    }
  }

  set inChange(_: any) {
    throw new Error(`isChange is a read-only property`);
  }
}
