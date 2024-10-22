import inquirer from "inquirer";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import { createSpinner } from "nanospinner";
import path from "node:path";
import { jsonFileWrite } from "../utils/fileSystem";
import type { DtrConfig } from "../types";
import { dtrConfigStaterData } from "../utils/staterCode";

interface ModifyQuestion {
  modifyData: boolean;
}

export default class InitDTRConfig {
  private readonly currentPath = process.cwd();
  private readonly dtrConfigFilePath = path.join(
    this.currentPath,
    "dtr-config.json"
  );
  private configData: DtrConfig = dtrConfigStaterData;

  public constructor() {
    this.initCommand.bind(this);
  }

  private async getConfigData(): Promise<DtrConfig> {
    const configQuestion: QuestionArray<DtrConfig> = [
      {
        type: "input",
        name: "codeFolder",
        message: "Where do all your files go (code folder location)?",
        default: "code",
      },
    ];

    const prompt = inquirer.createPromptModule();

    return prompt(configQuestion);
  }

  private async updateDtrConfigAnswers() {
    const modifyQuestion: QuestionArray<ModifyQuestion> = [
      {
        type: "confirm",
        name: "modifyData",
        message: `Would you like to modify 'dtr-config.json'?`,
        default: false,
      },
    ];

    const prompt = inquirer.createPromptModule();

    const modifyAnswer = await prompt(modifyQuestion);

    return new Promise((resolve) => {
      if (!modifyAnswer.modifyData) {
        process.exit(0);
      } else {
        resolve(modifyAnswer.modifyData);
      }
    });
  }

  public async initCommand(codeFolder?: string) {
    // start spinner
    const spinner = createSpinner();
    this.configData.codeFolder = codeFolder!;

    try {
      if (existsSync(this.dtrConfigFilePath)) {
        await this.updateDtrConfigAnswers();
      }

      if (!this.configData.codeFolder) {
        const dtrConfigAnswers = await this.getConfigData();
        this.configData.codeFolder = dtrConfigAnswers.codeFolder;
      }

      await jsonFileWrite(this.dtrConfigFilePath, this.configData);

      spinner.success({
        text: `'dtr-config.json' file is created on ${this.dtrConfigFilePath}`,
      });

      const codeDirPath = path.join(
        this.currentPath,
        this.configData.codeFolder
      );
      await mkdir(codeDirPath);

      spinner.success({
        text: `'${this.configData.codeFolder}' folder is created on ${codeDirPath}`,
      });
    } catch (err) {
      spinner.error({ text: "Something went wrong" });
      console.error("\nError:", err);
      process.exit(1);
    }
  }
}
