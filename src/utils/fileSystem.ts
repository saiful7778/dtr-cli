import { writeFile, readFile } from "node:fs/promises";
import internal from "node:stream";

export async function fileWrite(
  filePath: string,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | internal.Stream
): Promise<void> {
  return writeFile(filePath, data, { encoding: "utf-8", flag: "w" });
}

export async function fileRead(filePath: string): Promise<string> {
  return readFile(filePath, { encoding: "utf-8", flag: "r" });
}

export async function jsonFileRead(filePath: string): Promise<any> {
  const stringData = await readFile(filePath, { encoding: "utf-8", flag: "r" });
  const jsonData = JSON.parse(stringData);
  return jsonData;
}

export async function jsonFileWrite(
  filePath: string,
  data: any
): Promise<void> {
  return writeFile(filePath, JSON.stringify(data), {
    encoding: "utf-8",
    flag: "w",
  });
}
