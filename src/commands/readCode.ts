import { getGlobalConfigData } from "../utils/globalConfig";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import type { GlobalConfigFile } from "../types";
import inquirer from "inquirer";
import { fileRead } from "../utils/fileSystem";

export default class ReadCode {
  private async getFileName(allFiles: string[]): Promise<{ fileName: string }> {
    const fileNameQuestion: QuestionArray<GlobalConfigFile> = [
      {
        type: "list",
        name: "fileName",
        message: "Select any code file",
        choices: allFiles as any,
      },
    ];

    const prompt = inquirer.createPromptModule();

    return prompt(fileNameQuestion);
  }

  private async getFileData(
    fileName: string,
    allFilesName: GlobalConfigFile[]
  ): Promise<string> {
    const fileData = allFilesName.find((file) => file.fileName === fileName);

    if (!fileData) {
      console.error("Code file data not found");
      process.exit(1);
    }

    return fileRead(fileData.path);
  }

  public async readCodeCommand(codeName?: string) {
    try {
      const globalConfig = await getGlobalConfigData();

      if (globalConfig.allFiles.length === 0) {
        console.error(
          "You haven't created any code file. First create code file by 'create' command"
        );
        process.exit(1);
      }

      const allFilesName = globalConfig.allFiles.map(
        (file, idx) => `${idx + 1} ${file.fileName}`
      );

      if (!codeName) {
        const fileName = await this.getFileName(allFilesName);

        const fileData = await this.getFileData(
          fileName.fileName.split(" ")[1],
          globalConfig.allFiles
        );
        console.log(fileData);
      } else {
        const fileData = await this.getFileData(
          codeName,
          globalConfig.allFiles
        );
        console.log(fileData);
      }
    } catch (err) {
      console.error("\nError:", err);
      process.exit(1);
    }
  }
}
