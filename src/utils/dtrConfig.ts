import { existsSync } from "node:fs";
import { jsonFileRead, jsonFileWrite } from "./fileSystem";
import process from "node:process";
import type { DtrConfig } from "../types";

export async function getDtrConfigData(
  dtrConfigFilePath: string
): Promise<DtrConfig> {
  if (!existsSync(dtrConfigFilePath)) {
    console.error(
      "'dtr-config.json' file not found. First initialize 'dtr-config.json' by 'init' command"
    );
    process.exit(1);
  }
  return jsonFileRead(dtrConfigFilePath);
}

export async function updateDtrConfigData(
  dtrConfigFilePath: string,
  newConfigData: DtrConfig
): Promise<void> {
  if (!existsSync(dtrConfigFilePath)) {
    console.error(
      "'dtr-config.json' file not found. First initialize 'dtr-config.json' by 'init' command"
    );
    process.exit(1);
  }
  return jsonFileWrite(dtrConfigFilePath, newConfigData);
}
