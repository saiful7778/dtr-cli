import type { GlobalConfig } from "../types";
import { jsonFileRead, jsonFileWrite } from "./fileSystem";
import { globalConfigPath } from "./helpers";
import { existsSync } from "node:fs";
import { globalConfigStaterData } from "./staterCode";

export async function getGlobalConfigData(): Promise<GlobalConfig> {
  const isExist = existsSync(globalConfigPath);
  if (isExist) {
    const configData = await jsonFileRead(globalConfigPath);

    return configData;
  } else {
    await jsonFileWrite(globalConfigPath, globalConfigStaterData);

    return globalConfigStaterData;
  }
}

export default async function updateGlobalConfigData(
  configData: GlobalConfig
): Promise<void> {
  return jsonFileWrite(globalConfigPath, configData);
}
