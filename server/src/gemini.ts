import {
  FunctionCallingConfigMode,
  FunctionDeclaration,
  FunctionCall,
  Content,
  GoogleGenAI,
} from "@google/genai";
import { listProjectFiles, } from "./projectFiles.js";
import { readProjectFiles, writeProjectFiles } from "./tools.js";
import { Message, ProjectSnapshot } from "./types.js";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
const previewUrl = process.env.PROJECT_PREVIEW_URL ?? "http://localhost:5174";
let runSummary = ""

console.log(apiKey);

const listProjectFilesDeclaration: FunctionDeclaration = {
  description: "Lists all files in the project directory.",
  name: "listProjectFiles",
};

const readProjectFilesDeclaration: FunctionDeclaration = {
  name: "readProjectFiles",
  description: "Read a file from the project directory.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
      },
    },
    required: ["path"],
  },
};

const writeProjectFilesDeclaration: FunctionDeclaration = {
  name: "writeProjectFiles",
  description: "Write a file to the project directory.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
      },
      content: {
        type: "string",
      },
    },
    required: ["path", "content"],
  },
};

export const updateProjectSummaryTool: FunctionDeclaration = {
  name: "updateProjectSummary",
  description: "You should call this tool at the end of your task when you need to update your progress and what you have done till now.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
      },
    },
    required: ["summary"],
  },
}

async function runToolCall(functionCall: FunctionCall) {
  const args = (functionCall.args ?? {}) as Record<string, unknown>;

  switch (functionCall.name) {
    case "listProjectFiles":
      return await listProjectFiles();

    case "readProjectFiles": {
      const path = args.path;
      return await readProjectFiles(path!.toString());
    }

    case "writeProjectFiles": {
      const path = args.path;
      const content = args.content;
      const writeResult = await writeProjectFiles(path!.toString(), content!.toString());
      return { writeResult };
    }

    case "updateProjectSummary": {
      const summary = args.summary;
      runSummary = summary!.toString();
      return "Project Summary updated as " + runSummary;
    }

    default:
      throw new Error(`Unknown function call: ${functionCall.name}`);
  }
}

export async function generateWithGemini(
  prompt: string,
  messageHistory: Message[] = [],
): Promise<ProjectSnapshot | void> {
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const contents: Content[] = [
    ...messageHistory.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  let counter = 0;
  const maxTurns = 100;

  try {
    if (!apiKey) {
      throw new Error("Mock mode: GEMINI_API_KEY is not configured, so no files were changed.");
    }

    while (counter < maxTurns) {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          tools: [
            {
              functionDeclarations: [
                listProjectFilesDeclaration,
                readProjectFilesDeclaration,
                writeProjectFilesDeclaration,
              ],
            },
          ],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
        },
      });

      const modelContent = response.candidates?.[0]?.content;
      if (!modelContent) {
        throw new Error("Gemini returned no content.");
      }

      contents.push(modelContent);

      const functionCalls = response.functionCalls ?? [];
      console.log(
        "The agent is calling functions...",
        JSON.stringify(functionCalls),
      );

      if (functionCalls.length === 0) {
        console.log(response.text);
        break;
      }

      contents.push({
        role: "user",
        parts: await Promise.all(
          functionCalls.map(async (functionCall) => ({
            functionResponse: {
              id: functionCall.id,
              name: functionCall.name,
              response: {
                result: await runToolCall(functionCall),
              },
            },
          })),
        ),
      });

      counter += 1;
    }

    contents.map(content => {
      const role = content.role;
      const partMessage = content.parts?.[0].text

      if (partMessage) {
        messageHistory.push({
          role: role === 'user' ? 'user' : 'assistant',
          content: partMessage!,
          createdAt: Date.now().toLocaleString()
        })
      }
    })
    return {
      summary: runSummary,
      messageHistory: messageHistory,
      files: await listProjectFiles(),
      updatedAt: Date.now().toString(),
      previewUrl,
    };
  } catch (e) {
    console.error(e);
    return {
      summary: (e as Error).message,
      messageHistory: messageHistory,
      files: await listProjectFiles(),
      updatedAt: Date.now().toString(),
      previewUrl,
    };
  }
}
