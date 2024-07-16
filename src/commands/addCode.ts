import { createSpinner } from "nanospinner";
import { getGlobalConfigData } from "../utils/globalConfig";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import inquirer from "inquirer";
import { copyFile } from "node:fs/promises";
import process from "node:process";
import path from "node:path";
import { getDtrConfigData, updateDtrConfigData } from "../utils/dtrConfig";
import type { GlobalConfigFile } from "../types";

export default class AddCode {
  private readonly currentPath = process.cwd();
  private readonly dtrConfigFilePath = path.join(
    this.currentPath,
    "dtr-config.json"
  );

  private async getFileNames(
    allFiles: { name: string; value: string }[]
  ): Promise<{ filePaths: string[] }> {
    const fileNameQuestion: QuestionArray<{ filePaths: string[] }> = [
      {
        type: "checkbox",
        name: "filePaths",
        message: "Select any code file",
        choices: allFiles as any,
      },
    ];
    const prompt = inquirer.createPromptModule();

    return prompt(fileNameQuestion);
  }

  public async addCodeCommand(_codeName?: string) {
    const spinner = createSpinner();

    try {
      const globalConfig = await getGlobalConfigData();

      if (globalConfig.allFiles.length === 0) {
        console.error(
          "You do not have any code file. Create new code file by `create` command"
        );
        process.exit(1);
      }

      const allFilesNameAndValue = globalConfig.allFiles.map((file) => ({
        name: file.fileName,
        value: file.path,
      }));

      const allFilePaths = await this.getFileNames(allFilesNameAndValue);

      const dtrConfigData = await getDtrConfigData(this.dtrConfigFilePath);

      spinner.start({ text: "Start processing...." });

      const codeFolderPath = path.join(
        this.currentPath,
        dtrConfigData.codeFolder
      );

      const dtrAddedCode: GlobalConfigFile[] = [];

      await Promise.all(
        allFilePaths.filePaths.map((filePath) => {
          const fileName = filePath.match(/[^\/]+$/gi)![0];

          const codeFilePath = path.join(codeFolderPath, fileName);

          dtrAddedCode.push({ fileName, path: codeFilePath });

          return copyFile(filePath, codeFilePath);
        })
      );

      await updateDtrConfigData(this.dtrConfigFilePath, {
        ...dtrConfigData,
        addedCode: [...dtrConfigData.addedCode!, ...dtrAddedCode],
      });

      spinner.success({ text: "Processing successful." });
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
