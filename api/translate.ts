import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  let texts: string[] = [];
  try {
    const { targetLang } = req.body;
    texts = req.body.texts || [];

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: "La lista de textos 'texts' es requerida y debe ser un arreglo." });
    }

    if (!targetLang) {
      return res.status(400).json({ error: "El idioma destino 'targetLang' es requerido." });
    }

    // If Spanish, return immediately
    if (targetLang.toLowerCase() === "es" || targetLang.toLowerCase() === "español") {
      return res.status(200).json({ translatedTexts: texts });
    }

    // Perform translation using the language model
    const prompt = `Translate the following list of Costa Rican hardware store product names/descriptions or UI labels from Spanish to ${targetLang}. 
Keep the exact order. Output the result strictly as a JSON array of translated strings with the same length.

Input texts to translate:
${JSON.stringify(texts, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
        systemInstruction: `You are an expert translator specializing in Costa Rican languages (Spanish, English, Bribri, Cabécar, Ngäbere/Ngöbe, Maleku/Guatuso, Boruca/Brunca, and Telire). 
Your task is to translate UI strings and product details accurately. 
For Costa Rican indigenous languages (Bribri, Cabécar, Ngöbe, Maleku, Brunca, Telire), use high-quality authentic terminology, loan words for hardware concepts if necessary, or descriptive phrasing where exact hardware terms do not exist (e.g. translate 'cemento' or 'herramienta' appropriately or use recognized loanwords).
Output strictly a JSON array of strings matching the length and order of the input array.`
      }
    });

    const rawText = response.text ? response.text.trim() : "[]";
    let translatedTexts = [];
    try {
      translatedTexts = JSON.parse(rawText);
    } catch (e) {
      console.error("Error parsing Gemini translation JSON:", rawText, e);
      translatedTexts = texts; // Fallback to source
    }

    // Verify lengths match
    if (!Array.isArray(translatedTexts) || translatedTexts.length !== texts.length) {
      translatedTexts = texts;
    }

    return res.status(200).json({ translatedTexts });
  } catch (error: any) {
    console.error("Error en endpoint /api/translate:", error);
    return res.status(200).json({ translatedTexts: texts, error: error.message }); // Graceful fallback
  }
}
