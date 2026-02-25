import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️  GEMINI_API_KEY not set — AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export function getModel(
  modelName = "gemini-3-flash-preview",
): GenerativeModel {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Generate structured JSON from a prompt using Gemini.
 * The prompt should instruct the model to return valid JSON.
 */
export async function generateJSON<T>(
  prompt: string,
  modelName = "gemini-3-flash-preview",
): Promise<T> {
  const model = getModel(modelName);
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  return JSON.parse(text) as T;
}

/**
 * Start a multi-turn chat session for interviews.
 */
export function createChatSession(
  systemInstruction: string,
  modelName = "gemini-3-flash-preview",
) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction,
  });

  return model.startChat({
    history: [],
  });
}
