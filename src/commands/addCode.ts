import { createSpinner } from "nanospinner";
import { getGlobalConfigData } from "../utils/globalConfig";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import inquirer from "inquirer";
import { copyFile } from "node:fs/promises";
import process from "node:process";
import path from "node:path";
import { getDtrConfigData, updateDtrConfigData } from "../utils/dtrConfig";
import { DtrConfig, GlobalConfigFile } from "../types";

export default class AddCode {
  private readonly currentPath = process.cwd();
  private readonly dtrConfigFilePath = path.join(
    this.currentPath,
    "dtr-config.json"
  );

  public constructor() {
    this.addCodeCommand.bind(this);
  }

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

  private async dtrConfigUpdate(
    prevDtrConfigData: DtrConfig,
    addedCode: GlobalConfigFile[]
  ) {
    const allAddedCode = [...prevDtrConfigData.addedCode!, ...addedCode];

    const newAddedCode: GlobalConfigFile[] = [];

    allAddedCode.forEach((file) => {
      const isExist = newAddedCode.find(
        (codeFile) => codeFile.path === file.path
      )
        ? true
        : false;

      if (!isExist) {
        newAddedCode.push(file);
      }
    });

    await updateDtrConfigData(this.dtrConfigFilePath, {
      ...prevDtrConfigData,
      addedCode: newAddedCode,
    });
  }

  public async addCodeCommand(codeName?: string) {
    const spinner = createSpinner();

    try {
      const globalConfig = await getGlobalConfigData();

      if (globalConfig.allFiles.length === 0) {
        console.error(
          "You do not have any code file. Create new code file by `create` command"
        );
        process.exit(1);
      }

      const dtrConfigData = await getDtrConfigData(this.dtrConfigFilePath);

      const codeFolderPath = path.join(
        this.currentPath,
        dtrConfigData.codeFolder
      );

      // if code name provide
      if (codeName) {
        const codeFile = globalConfig.allFiles.find(
          (file) => file.fileName === codeName
        );
        if (!codeFile) {
          console.error(`Could not found '${codeName}' code file.`);
          process.exit(1);
        }
        spinner.start({ text: "Start processing...." });

        const codeFilePath = path.join(codeFolderPath, codeFile.fileName);

        await copyFile(codeFile.path, codeFilePath);

        await this.dtrConfigUpdate(dtrConfigData, [
          { fileName: codeFile.fileName, path: codeFilePath },
        ]);

        spinner.success({ text: "Processing successful." });

        process.exit(0);
      }

      const allFilesNameAndValue = globalConfig.allFiles.map((file) => ({
        name: file.fileName,
        value: `${file.fileName} ${file.path}`,
      }));

      const filePathsValue = await this.getFileNames(allFilesNameAndValue);

      spinner.start({ text: "Start processing...." });

      const newAddedCode: GlobalConfigFile[] = [];

      await Promise.all(
        filePathsValue.filePaths.map(async (filePath) => {
          const fileValue = filePath.split(" ");
          const fileName = fileValue[0];

          const codeFilePath = path.join(codeFolderPath, fileName);

          newAddedCode.push({
            fileName,
            path: codeFilePath,
          });

          return copyFile(fileValue[1], codeFilePath);
        })
      );

      await this.dtrConfigUpdate(dtrConfigData, newAddedCode);

      spinner.success({ text: "Processing successful." });
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
