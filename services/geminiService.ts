import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../constants';

// Helper to get the most current client instance
// This allows the app to switch keys without refreshing the page
const getGenAI = () => {
  const userKey = localStorage.getItem('naf_sec_api_key');
  // Prioritize User Key > Env Key > Fallback
  const keyToUse = userKey || process.env.API_KEY || "AIzaSyDAh_JZOPwNG8cQw4ATw2gh68z5OhNJIko";
  return new GoogleGenAI({ apiKey: keyToUse });
};

// Define Safety Settings to UNBLOCK all restricted content
// This effectively disables the AI's "Safety Filter" allowing it to discuss exploits/attacks
const UNRESTRICTED_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Enhanced Retry helper for 429 errors
const retryOp = async <T>(operation: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const isRateLimit = error.message?.includes('429') || 
                        error.message?.includes('quota') || 
                        error.message?.includes('RESOURCE_EXHAUSTED');
    
    if (retries > 0 && isRateLimit) {
      const delay = initialDelay * Math.pow(2, 3 - retries); // Exponential backoff
      console.warn(`Quota hit. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOp(operation, retries - 1, initialDelay * 1.5);
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
        const ai = getGenAI();
        const chat = ai.chats.create({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.9, // Increased creativity for unrestricted mode
            safetySettings: UNRESTRICTED_SAFETY_SETTINGS, // DISABLE FILTERS
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
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, 
            safetySettings: UNRESTRICTED_SAFETY_SETTINGS, // DISABLE FILTERS
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
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: "You are a quiz generator. Generate valid JSON only.",
            responseMimeType: "application/json",
            safetySettings: UNRESTRICTED_SAFETY_SETTINGS, // DISABLE FILTERS
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

export const scanVulnerabilities = async (target: string) => {
  try {
    return await retryOp(async () => {
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7, 
            safetySettings: UNRESTRICTED_SAFETY_SETTINGS,
          },
          contents: `Simulate a vulnerability scan report for the target: ${target}. 
          Provide a detailed technical report including:
          1. Open Ports & Services (simulated)
          2. Detected Vulnerabilities (with CVE IDs if applicable)
          3. Risk Severity (Critical/High/Medium/Low)
          4. Remediation Steps
          
          Use a professional, technical tone. Format with Markdown. Do not include any real personal data.`,
        });
        return response.text;
    });
  } catch (error) {
    console.error("Error in scanVulnerabilities:", error);
    throw error;
  }
};
