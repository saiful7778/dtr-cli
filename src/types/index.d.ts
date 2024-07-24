export interface GlobalConfigCodeFile {
  fileName: string;
  path: string;
}

export interface Template {
  templateName: string;
  templateFolder: string;
}

export interface GlobalConfig {
  allFiles: GlobalConfigCodeFile[];
  allTemplates: Template[];
}

export interface DtrConfig {
  codeFolder: string;
  addedCode?: GlobalConfigCodeFile[];
}
