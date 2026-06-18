import { FunctionDeclaration } from "@google/genai";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";



export const readProjectFiles = async (path: string): Promise<string> => {
  const contents = await readFile(path, "utf-8");
  return contents;
};




export const writeProjectFiles = async (filePath: string, content: string): Promise<string> => {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDirectory = path.dirname(currentFile);
  const projectRoot = path.resolve(currentDirectory, "../../project");
  // Project root is:  /Users/mohittiwari/Dev/Contests/loveable-assignment-s30/project
  console.log("Project root is: ", projectRoot)


  const fullPath = projectRoot + '/' + filePath
  console.log("Full path is: ", fullPath);

  await writeFile(fullPath, content);
  return `Write to the file ${path} successful`
}
