import { readdir } from "node:fs/promises";
import { lstatSync } from "node:fs";

export async function getAllFileName(filePath?: string): Promise<string[]> {
  const currentUrl = process.cwd();

  const allFiles = await readdir(filePath ?? currentUrl);

  return allFiles.filter((file) => lstatSync(file).isFile());
}
