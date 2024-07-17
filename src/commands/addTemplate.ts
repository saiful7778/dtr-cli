import { createSpinner } from "nanospinner";
import { getGlobalConfigData } from "../utils/globalConfig";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import inquirer from "inquirer";
import createDirContents from "../utils/createDirContents";
import process from "node:process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

export default class AddTemplate {
  private readonly currentUrl = process.cwd();
  private async questionAnswers(
    templates: string[]
  ): Promise<{ templateName: string; folderName: string }> {
    const questions: QuestionArray<{
      templateName: string;
      folderName: string;
    }> = [
      {
        type: "input",
        name: "folderName",
        message: "Template folder name:",
      },
      {
        type: "list",
        name: "templateName",
        message: "Select template:",
        choices: templates as any,
      },
    ];

    const prompt = inquirer.createPromptModule();

    return prompt(questions);
  }

  public async addTemplateCommand() {
    const spinner = createSpinner();
    try {
      const globalConfigData = await getGlobalConfigData();

      if (globalConfigData.allTemplates.length === 0) {
        console.error(
          "You do not have any code file. Create new code file by `create` command"
        );
        process.exit(1);
      }

      const allTemplates = globalConfigData.allTemplates.map(
        (template) => template.templateName
      );

      const templateName = await this.questionAnswers(allTemplates);

      const template = globalConfigData.allTemplates.find(
        (template) => template.templateName === templateName.templateName
      );

      if (!template) {
        console.error("template path not found");
        process.exit(1);
      }

      const templatePath = path.join(this.currentUrl, templateName.folderName);

      await mkdir(templatePath);

      createDirContents(template.templateFolder, templatePath);
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
