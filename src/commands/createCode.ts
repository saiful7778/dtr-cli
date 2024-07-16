import { createSpinner, type Spinner } from "nanospinner";
import updateGlobalConfigData, {
  getGlobalConfigData,
} from "../utils/globalConfig";
import type { QuestionArray } from "inquirer/dist/cjs/types/types";
import inquirer from "inquirer";
import { getAllFileName } from "../utils/allFiles";
import { getApiData } from "../utils/apiData";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "path";
import { fileRead, fileWrite } from "../utils/fileSystem";
import { rootUrl } from "../utils/helpers";
import type { GlobalConfig, GlobalConfigFile } from "../types";

type CreateOptions = {
  fileName: string;
  codeFrom: "local" | "internet";
  path?: string;
  url?: string;
};

export default class CreateCode {
  private readonly checkUrlRegex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|\d{1,3}(\.\d{1,3}){3}|\[?[a-f\d:]+\]?)?(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

  private readonly checkFileNameRegx = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/g;
  private readonly globalAllCodeFileFolderPath = path.join(
    rootUrl,
    "../allFiles"
  );

  private async questionsAnswers(
    codeName?: string,
    codeFrom?: "local" | "internet",
    codeUrl?: string,
    codePath?: string
  ): Promise<CreateOptions> {
    const allFileName = await getAllFileName();

    const createCodeQuestion: QuestionArray<CreateOptions> = [
      {
        type: "input",
        name: "fileName",
        message: "Code file name:",
        default: codeName,
        validate: (input) => {
          if (this.checkFileNameRegx.test(input) && input.trim() !== "") {
            return true;
          } else {
            return "Invalid file name.";
          }
        },
        when() {
          return !codeName;
        },
      },
      {
        type: "list",
        name: "codeFrom",
        message: "Where does the code come from?",
        choices: ["local", "internet"] as any,
        default: codeFrom,
        when() {
          return !codeFrom;
        },
      },
      {
        type: "input",
        name: "url",
        message: "Internet code url:",
        default: codeUrl,
        validate: (input) => {
          if (this.checkUrlRegex.test(input) && input.trim() !== "") {
            return true;
          } else {
            return "Invalid url";
          }
        },
        when(answer) {
          return (
            (answer.codeFrom === "internet" || codeFrom === "internet") &&
            !codeUrl
          );
        },
      },
      {
        type: "list",
        name: "path",
        message: "Select the file:",
        default: codePath,
        choices: allFileName as any,
        when(answer) {
          return (
            (answer.codeFrom === "local" || codeFrom === "local") && !codePath
          );
        },
      },
    ];

    const answers = await inquirer.prompt(createCodeQuestion);

    if (!answers.fileName && codeName) {
      answers.fileName = codeName;
    }

    if (!answers.codeFrom && codeFrom) {
      answers.codeFrom = codeFrom;
    }

    if (answers.codeFrom === "internet" && codeUrl) {
      answers.url = codeUrl;
    }

    if (answers.codeFrom === "local" && codePath) {
      answers.path = codePath;
    }

    return answers;
  }

  private async getLocalCodeData(
    pathName: string,
    spinner: Spinner
  ): Promise<string> {
    spinner.start({ text: "Start processing...." });

    const currentUrl = process.cwd();

    const codeFilePath = path.join(currentUrl, pathName);

    return fileRead(codeFilePath);
  }

  private async getCodeData(
    codeOptions: CreateOptions,
    spinner: Spinner
  ): Promise<string> {
    if (codeOptions.codeFrom === "internet") {
      spinner.start({ text: "Start processing...." });

      const codeData = await getApiData(codeOptions.url!);

      if (!codeData) {
        spinner.error({ text: "No data found from url" });
        throw new Error("No data found from url");
      }

      return codeData;
    } else if (codeOptions.codeFrom === "local") {
      const codeData = await this.getLocalCodeData(codeOptions.path!, spinner);

      if (!codeData) {
        spinner.error({ text: "No data found from this file" });
        throw new Error("No data found from this file");
      }

      return codeData;
    } else {
      throw "Select the correct option";
    }
  }

  private async getCodeFilePath(fileName: string) {
    if (existsSync(this.globalAllCodeFileFolderPath)) {
      return path.join(rootUrl, `../allFiles/${fileName}`);
    } else {
      await mkdir(this.globalAllCodeFileFolderPath);

      return path.join(this.globalAllCodeFileFolderPath, fileName);
    }
  }

  private async updateGlobalConfig(
    configData: GlobalConfig,
    fileName: string,
    path: string
  ): Promise<void> {
    const allFiles: GlobalConfigFile[] = [
      ...configData.allFiles,
      { fileName, path },
    ];

    await updateGlobalConfigData({ ...configData, allFiles });
  }

  public async createCodeCommand(
    codeName?: string,
    codeFrom?: "local" | "internet",
    codeUrl?: string,
    codePath?: string
  ) {
    const spinner = createSpinner();
    try {
      const globalConfigData = await getGlobalConfigData();

      if (codeFrom && codeFrom !== "local" && codeFrom !== "internet") {
        console.error(
          `-f, --from <codeFrom>, codeFrom must be 'local' or 'internet' but you pass ${codeFrom}`
        );
        process.exit(1);
      }

      const createAnswers = await this.questionsAnswers(
        codeName,
        codeFrom,
        codeUrl,
        codePath
      );

      const isFilenameExist = globalConfigData.allFiles.find(
        (globalFile) => globalFile.fileName === createAnswers.fileName
      );

      if (isFilenameExist) {
        console.log(
          `'${createAnswers.fileName}' is already exist. Try to update or delete`
        );
        process.exit(0);
      }

      const codeData = await this.getCodeData(createAnswers, spinner);

      const codeFilePath = await this.getCodeFilePath(createAnswers.fileName);

      await fileWrite(codeFilePath, codeData);

      await this.updateGlobalConfig(
        globalConfigData,
        createAnswers.fileName,
        codeFilePath
      );

      spinner.success({ text: `file is created on ${codeFilePath}` });
    } catch (err) {
      console.error("\nError:", err);
      spinner.error({ text: "Something went wrong" });
      process.exit(1);
    }
  }
}
