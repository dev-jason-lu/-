import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini API Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file/blob to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a recipe or cooking advice based on ingredients or a request.
 */
export const generateCookingAdvice = async (prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, romantic, and helpful professional chef assistant for a couple. Your tone is encouraging, fun, and clear. When providing recipes, include an ingredients list and step-by-step instructions. Keep formatting using Markdown.",
      }
    });
    return response.text || "Sorry, I couldn't think of a recipe right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the kitchen database (API Error).";
  }
};

/**
 * Analyzes a food image to identify it or provide a recipe.
 */
export const analyzeFoodImage = async (base64Image: string, promptText: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, but works for PNG too usually
              data: base64Image
            }
          },
          {
            text: promptText || "What is this dish and how can I make it?"
          }
        ]
      },
      config: {
        systemInstruction: "You are an expert food critic and chef. Identify the food in the image and provide a brief history or recipe suitable for a home date night.",
      }
    });
    return response.text || "I couldn't analyze that image.";
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return "I'm having trouble seeing that image right now.";
  }
};

/**
 * Chat stream for the AI Chef tutor.
 */
export const createChefChat = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are 'Chef Cupid', a cooking tutor for couples. You help them plan meals, solve cooking disasters, and make cooking romantic. Keep answers concise unless asked for a full recipe.",
    }
  });
};
