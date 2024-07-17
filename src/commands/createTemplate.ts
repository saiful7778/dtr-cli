import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import { getAllFolderName } from "../utils/allFiles";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import updateGlobalConfigData, {
  getGlobalConfigData,
} from "../utils/globalConfig";
import type { GlobalConfig, Template } from "../types";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { templatesPath } from "../utils/helpers";
import createDirContents from "../utils/createDirContents";
import path from "node:path";

export default class CreateTemplate {
  private async questionAnswers(
    templateName?: string,
    templateFolder?: string
  ) {
    const allFolder = await getAllFolderName();

    const questions: QuestionArray<Template> = [
      {
        type: "input",
        name: "templateName",
        message: "Template name:",
        validate: (input) => {
          // TODO: handle
          if (input.trim() !== "") {
            return true;
          } else {
            return "Invalid url";
          }
        },
        when() {
          return !templateName;
        },
      },
      {
        type: "list",
        name: "templateFolder",
        message: "Select the template root folder: ",
        choices: allFolder as any,
        when() {
          return !templateFolder;
        },
      },
    ];

    const prompt = inquirer.createPromptModule();

    const answers = await prompt(questions);

    if (!answers.templateName && templateName) {
      answers.templateName = templateName;
    }

    if (!answers.templateFolder && templateFolder) {
      answers.templateFolder = templateFolder;
    }

    return answers;
  }

  private async getAllTemplatesFolder(templateName: string): Promise<string> {
    if (!existsSync(templatesPath)) {
      await mkdir(templatesPath);
    }
    const newTemplatePath = path.join(templatesPath, templateName);
    await mkdir(newTemplatePath);

    return newTemplatePath;
  }

  private async updateGlobalConfig(
    prevConfigData: GlobalConfig,
    templateName: string,
    templateFolder: string
  ): Promise<void> {
    const allTemplates: Template[] = [
      ...prevConfigData.allTemplates,
      { templateName, templateFolder },
    ];

    await updateGlobalConfigData({ ...prevConfigData, allTemplates });
  }

  public async createTemplateCode(
    templateName?: string,
    templateFolder?: string
  ) {
    const spinner = createSpinner();
    try {
      const globalConfigData = await getGlobalConfigData();

      const answers = await this.questionAnswers(templateName, templateFolder);

      spinner.start({ text: "Start processing...." });

      const templatePath = await this.getAllTemplatesFolder(
        answers.templateName
      );

      await createDirContents(answers.templateFolder, templatePath);

      this.updateGlobalConfig(
        globalConfigData,
        answers.templateName,
        templatePath
      );

      spinner.success({ text: "Processing successful." });
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
