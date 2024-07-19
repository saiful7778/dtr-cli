#!/usr/bin/env node

import { Command } from "commander";
import process from "node:process";
import InitDTRConfig from "./commands/InitDTRConfig";
import CreateCode from "./commands/createCode";
import ReadCode from "./commands/readCode";
import AddCode from "./commands/addCode";
import DeleteCode from "./commands/deleteCode";
import CreateTemplate from "./commands/createTemplate";
import AddTemplate from "./commands/addTemplate";

class MainProgram {
  private name = "dtr";
  private description =
    "DTR is an open source developer helping CLI tool build on typescript";
  private version = "0.2.5";
  private program: Command;

  constructor() {
    this.program = new Command();

    this.program
      .name(this.name)
      .description(this.description)
      .version(this.version);

    this.initDtrConfigFile();
    this.addCodeFile();
    this.createNewCodeFile();
    this.readCodeFile();
    this.deleteCodeFile();
    this.creatTemplate();
    this.addTemplate();
  }

  private initDtrConfigFile() {
    const initCommand = new InitDTRConfig();
    this.program
      .command("init")
      .description("Initialize the dtr-config.json configuration file")
      .option("-c, --code <codeFolder>", "Path for code file directory")
      .action((flags: { code?: string }) => {
        initCommand.initCommand.bind(initCommand)(flags?.code);
      });
  }

  private addCodeFile() {
    const addCodeFile = new AddCode();
    this.program
      .command("add")
      .argument("[codeName]", "Name of the code file you want to add")
      .description("Add code file into your directory")
      .action(async (codeName?: string) => {
        addCodeFile.addCodeCommand.bind(addCodeFile)(codeName);
      });
  }

  private createNewCodeFile() {
    const newCode = new CreateCode();
    this.program
      .command("create")
      .description("Create new code file")
      .argument("[codeName]", "Name of the code file")
      .option(
        "-f, --from <codeFrom>",
        "Source of the code file. accept 'local' | 'internet'"
      )
      .option(
        "-u, --url <internetURL>",
        "Github code URL if you select 'codeFrom' as 'internet'"
      )
      .option(
        "-p, --path <localPath>",
        "Current dir file path if you select 'codeFrom' as 'local'"
      )
      .action(
        async (
          codeName?: string,
          flags?: {
            from?: "local" | "internet";
            url?: string;
            path?: string;
          }
        ) => {
          newCode.createCodeCommand.bind(newCode)(
            codeName,
            flags?.from,
            flags?.url,
            flags?.path
          );
        }
      );
  }

  private readCodeFile() {
    const readCodeData = new ReadCode();
    this.program
      .command("read")
      .description("Read all code file")
      .argument("[codeName]", "Name of the code file")
      .action(async (codeName?: string) => {
        readCodeData.readCodeCommand.bind(readCodeData)(codeName);
      });
  }

  private deleteCodeFile() {
    const deleteCodeFile = new DeleteCode();
    this.program
      .command("delete")
      .description("Delete global code file")
      .action(async () => {
        deleteCodeFile.deleteCodeCommand.bind(deleteCodeFile)();
      });
  }

  private creatTemplate() {
    const createTemplate = new CreateTemplate();
    this.program
      .command("create-template")
      .description("Create new boilerplate template")
      .argument("[templateName]", "Name of the template")
      .option("-s, --source", "Source folder of the template")
      .action(async (templateName?: string, flags?: { source?: string }) => {
        createTemplate.createTemplateCode.bind(createTemplate)(
          templateName,
          flags?.source
        );
      });
  }

  private addTemplate() {
    const addTemplate = new AddTemplate();
    this.program
      .command("template")
      .description("Add boilerplate template in current directory")
      .argument("[templateName]", "Name of the template")
      .action(async (templateName?: string) => {
        addTemplate.addTemplateCommand.bind(addTemplate)(templateName);
      });
  }

  public getProgram() {
    return this.program;
  }
}

const mainProgram = new MainProgram();

mainProgram.getProgram.bind(mainProgram)().parse(process.argv);

/**
 * Exit code
 */
process.on("exit", () => {
  console.log("\nProcess is stoped");
  process.exit(0);
});
