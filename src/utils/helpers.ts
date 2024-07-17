import path from "node:path";
import { fileURLToPath } from "node:url";

export const rootUrl = path.dirname(fileURLToPath(import.meta.url));

export const globalConfigPath = path.join(rootUrl, "../configData.json");

export const templatesPath = path.join(rootUrl, "allTemplates");
