import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../constants';

// Restoring the default API Key.
// This allows the app to attempt to connect without user configuration.
// If this key hits rate limits, the app will handle the 429 error and prompt the user.
const DEFAULT_API_KEY = "AIzaSyAl2v_WEWEcOjWjhTRaQLEqXCwh8jshYtg";

// Helper to initialize the client only when needed
const getClient = () => {
  // 1. Check LocalStorage first (User preference/override)
  let apiKey = localStorage.getItem('gemini_api_key');

  // 2. Check Vite Env Var (Specific to Vite setups)
  if (!apiKey || apiKey === 'undefined') {
    apiKey = (import.meta as any).env?.VITE_API_KEY;
  }

  // 3. Check process.env (Fallback)
  if (!apiKey) {
    // Safety check for process.env access in browser
    try {
      apiKey = process.env.API_KEY;
    } catch (e) {
      // Ignore process is not defined
    }
  }

  // 4. Use Default (Hardcoded fallback)
  if (!apiKey) {
    apiKey = DEFAULT_API_KEY;
  }
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const saveApiKey = (key: string) => {
  localStorage.setItem('gemini_api_key', key);
};

export const hasApiKey = () => {
   // Check all sources including the hardcoded default
   const key = localStorage.getItem('gemini_api_key') || 
               (import.meta as any).env?.VITE_API_KEY || 
               DEFAULT_API_KEY;
   return !!key;
};

// Retry helper for 429 errors
const retryOp = async <T>(operation: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error.message?.includes('429') || 
                        error.message?.includes('quota') || 
                        error.message?.includes('RESOURCE_EXHAUSTED');
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOp(operation, retries - 1, delay * 2);
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
        const ai = getClient();
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
        const ai = getClient();
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
        const ai = getClient();
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