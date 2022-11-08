export interface UpdtaeInfo {
  type: UpdateType;
  quantity?: number;
}

export type UpdateType = "add" | "delete" | "update";

export default class RecordInfo {
  private infos = new Map<string, UpdtaeInfo>();
  constructor() {}

  toString() {}

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
}
