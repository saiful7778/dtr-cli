export interface GlobalConfigFile {
  fileName: string;
  path: string;
}

export interface Template {
  templateName: string;
  templateFolder: string;
}

export interface GlobalConfig {
  allFiles: GlobalConfigFile[];
  allTemplates: Template[];
}

export interface DtrConfig {
  codeFolder: string;
  addedCode?: GlobalConfigFile[];
}
