import { extname } from "path";

export type RequestType = "html" | "style" | "resources";

export function requestType(path: string): RequestType | undefined {
  const exname = extname(path);

  if (["", ".html"].includes(exname)) {
    return "html";
  }

  if ([".png", ".svg", ".jpg"].includes(exname)) {
    return "resources";
  }

  if ([".scss", "sass", ".less"].includes(exname)) {
    return "style";
  }
  
  return;
}
