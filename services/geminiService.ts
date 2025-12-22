import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../constants';

// Retrieve the API key. 
// Vite's define plugin replaces process.env.API_KEY with the actual string value during build.
const apiKey = process.env.API_KEY || "AIzaSyAl2v_WEWEcOjWjhTRaQLEqXCwh8jshYtg";

// Initialize the client.
const ai = new GoogleGenAI({ apiKey: apiKey });

// Enhanced Retry helper for 429 errors to provide "unlimited" feel
// Uses exponential backoff with jitter
const retryOp = async <T>(operation: () => Promise<T>, retries = 5, initialDelay = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error.message?.includes('429') || 
                        error.message?.includes('quota') || 
                        error.message?.includes('RESOURCE_EXHAUSTED');
    
    if (retries > 0 && isRateLimit) {
      // Add jitter to prevent thundering herd
      const delay = initialDelay * Math.pow(2, 5 - retries) + (Math.random() * 500);
      console.warn(`Quota limit hit. Retrying in ${Math.round(delay)}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOp(operation, retries - 1, initialDelay);
    }
    throw error;
  }
};

export const sendMessageStream = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  try {
    await retryOp(async () => {
        const chat = ai.chats.create({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7, 
          },
          history: history,
        });

        const result = await chat.sendMessageStream({ message });

        for await (const chunk of result) {
          if (chunk.text) {
            onChunk(chunk.text);
          }
        }
    });
  } catch (error) {
    console.error("Error in sendMessageStream:", error);
    throw error;
  }
};

export const analyzeLog = async (logContent: string) => {
  try {
    return await retryOp(async () => {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, 
          },
          contents: `Analyze the following log excerpt for anomalies, potential threats (based on MITRE ATT&CK), and suggest mitigation steps. Format the output with clear headers and a severity rating.\n\nLOG DATA:\n\`\`\`\n${logContent}\n\`\`\``,
        });
        return response.text;
    });
  } catch (error) {
    console.error("Error in analyzeLog:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string) => {
  try {
    return await retryOp(async () => {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: "You are a quiz generator. Generate valid JSON only.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER, description: "Zero-based index of correct option" },
                      explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                  }
                }
              }
            }
          },
          contents: `Generate a difficult cybersecurity quiz with 5 questions about: ${topic}. Focus on technical accuracy.`,
        });
        
        return JSON.parse(response.text || "{}");
    });
  } catch (error) {
    console.error("Error in generateQuiz:", error);
    throw error;
  }
};