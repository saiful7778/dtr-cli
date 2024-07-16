#!/usr/bin/env node

import { Command } from "commander";
import process from "node:process";

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

    this.createNewCodeFile();
  }

  private createNewCodeFile() {
    this.program
      .command("create")
      .description("Create new code file")
      .option("-n, --name <codeName>", "Name of the code file")
      .option(
        "-f, --from <codeFrom>",
        "Source of the code file. accept 'local' | 'internet'",
        "local"
      )
      .action(async (flags) => {
        console.log(flags);
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
