export interface GlobalConfigFile {
  fileName: string;
  path: string;
}

export interface GlobalConfig {
  allFiles: GlobalConfigFile[];
}

export interface DtrConfig {
  codeFolder: string;
  addedCode?: GlobalConfigFile[];
}
