#!/usr/bin/env node

import { Command } from "commander";
import process from "node:process";
import InitDTRConfig from "./commands/InitDTRConfig";
import CreateCode from "./commands/createCode";
import ReadCode from "./commands/readCode";
import AddCode from "./commands/addCode";

class MainProgram {
  private name = "dtr";
  private description =
    "DTR is an open source developer helping CLI tool build on typescript";
  private version = "0.0.1";
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
      .description("Add code file into your directory")
      .action(async () => {
        addCodeFile.addCodeCommand.bind(addCodeFile)();
      });
  }

  private createNewCodeFile() {
    const newCode = new CreateCode();
    this.program
      .command("create")
      .description("Create new code file")
      .option("-n, --name <codeName>", "Name of the code file")
      .option(
        "-f, --from <codeFrom>",
        "Source of the code file. accept 'local' | 'internet'",
        "local"
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
        async (flags: {
          name?: string;
          from?: "local" | "internet";
          url?: string;
          path?: string;
        }) => {
          newCode.createCodeCommand.bind(newCode)(
            flags?.name,
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
      .option("-n, --name <codeName>", "Name of the code file")
      .action(async (flags: { name?: string }) => {
        readCodeData.readCodeCommand.bind(readCodeData)(flags.name);
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
