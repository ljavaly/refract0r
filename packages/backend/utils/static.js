import { readFile, readdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Async function to load file each time (prevents caching)
export const loadJsonFile = async (filePath) => {
  const fullPath = join(__dirname, "../", "static", filePath);
  const data = await readFile(fullPath, "utf-8");
  return JSON.parse(data);
};

export const readFiles = async (filePath) => {
  const fullPath = join(__dirname, "../", "static", filePath);
  const files = await readdir(fullPath);
  return files;
};
