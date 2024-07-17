import { readdir } from "node:fs/promises";
import { lstatSync } from "node:fs";

export async function getAllFileName(filePath?: string): Promise<string[]> {
  const currentUrl = process.cwd();

  const allFiles = await readdir(filePath ?? currentUrl);

  return allFiles.filter((file) => lstatSync(file).isFile());
}

export async function getAllFolderName(folderPath?: string): Promise<string[]> {
  const currentUrl = process.cwd();

  const allFiles = await readdir(folderPath ?? currentUrl);

  return allFiles.filter((file) => lstatSync(file).isDirectory());
}
