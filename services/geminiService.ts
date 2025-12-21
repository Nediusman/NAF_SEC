import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../constants';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageStream = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and precision
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message });

    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Error in sendMessageStream:", error);
    throw error;
  }
};

export const analyzeLog = async (logContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for analytical precision
      },
      contents: `Analyze the following log excerpt for anomalies, potential threats (based on MITRE ATT&CK), and suggest mitigation steps. Format the output with clear headers and a severity rating.\n\nLOG DATA:\n\`\`\`\n${logContent}\n\`\`\``,
    });
    return response.text;
  } catch (error) {
    console.error("Error in analyzeLog:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string) => {
  try {
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
  } catch (error) {
    console.error("Error in generateQuiz:", error);
    throw error;
  }
};
