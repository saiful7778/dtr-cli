import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileRead, fileWrite } from "./fileSystem";

export default async function createDirContents(
  templatePath: string,
  newProjectPath: string
) {
  const filesAndFolders = await readdir(templatePath);

  for (const fileAndFolder of filesAndFolders) {
    const originalPath = path.join(templatePath, fileAndFolder);

    const stats = await stat(originalPath);

    if (stats.isFile()) {
      const contents = await fileRead(originalPath);

      const writeFilePath = path.join(newProjectPath, fileAndFolder);

      await fileWrite(writeFilePath, contents);
    } else if (stats.isDirectory()) {
      const templateFolderPath = path.join(templatePath, fileAndFolder);

      const newFolderPath = path.join(newProjectPath, fileAndFolder);

      await mkdir(newFolderPath);

      await createDirContents(templateFolderPath, newFolderPath);
    }
  }
}
