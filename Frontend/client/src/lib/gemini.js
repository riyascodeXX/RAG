import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

const geminiApiKey = import.meta.env.VITE_GEMINI_PUBLIC_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const generateResponse = async (prompt) => {
  if (!geminiApiKey) {
    throw new Error("Missing VITE_GEMINI_PUBLIC_KEY in frontend environment.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    safetySettings,
  });

  return response.text;
};

export default generateResponse;
