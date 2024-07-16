import { QuestionArray } from "inquirer/dist/cjs/types/types";
import updateGlobalConfigData, {
  getGlobalConfigData,
} from "../utils/globalConfig";
import inquirer from "inquirer";
import { unlink } from "node:fs/promises";
import { createSpinner } from "nanospinner";

export default class DeleteCode {
  private async getFileName(
    allFiles: { name: string; value: string }[]
  ): Promise<{ fileName: string[]; delConfirm: boolean }> {
    const fileNameQuestion: QuestionArray<{
      fileName: string[];
      delConfirm: boolean;
    }> = [
      {
        type: "checkbox",
        name: "fileName",
        message: "Select any code file",
        choices: allFiles as any,
      },
      {
        type: "confirm",
        name: "delConfirm",
        message: "Make sure you want to delete?",
        default: false,
      },
    ];

    return inquirer.prompt(fileNameQuestion);
  }

  public async deleteCodeCommand() {
    const spinner = createSpinner();
    try {
      const globalConfig = await getGlobalConfigData();

      if (globalConfig.allFiles.length === 0) {
        console.error(
          "You haven't created any code file. First create code file by 'create' command"
        );
        process.exit(1);
      }

      const allFilesName = globalConfig.allFiles.map((file) => ({
        name: file.fileName,
        value: file.path,
      }));

      const fileName = await this.getFileName(allFilesName);
      spinner.start({ text: "Start processing...." });

      if (!fileName.delConfirm) {
        process.exit(0);
      }

      await Promise.all(
        fileName.fileName.map((file) => {
          return unlink(file);
        })
      );

      const remainCodeFile = globalConfig.allFiles.filter((file) =>
        fileName.fileName.find((delFile) => delFile === file.path)
          ? false
          : true
      );

      await updateGlobalConfigData({
        ...globalConfig,
        allFiles: remainCodeFile,
      });

      spinner.success({ text: "Processing successful." });
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
