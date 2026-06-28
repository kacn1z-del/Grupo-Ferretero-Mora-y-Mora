import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { targetLang, texts } = req.body;

  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: "La lista de textos es requerida." });
  }

  if (!targetLang) {
    return res.status(400).json({ error: "El idioma destino es requerido." });
  }

  if (targetLang.toLowerCase() === "es" || targetLang.toLowerCase() === "español") {
    return res.status(200).json({ translatedTexts: texts });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY no configurada." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Translate the following list from Spanish to ${targetLang}. Output strictly a JSON array of strings with the same length and order.\n\n${JSON.stringify(texts, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const rawText = response.text ? response.text.trim() : "[]";
    let translatedTexts: string[] = [];

    try {
      translatedTexts = JSON.parse(rawText);
    } catch (e) {
      translatedTexts = texts;
    }

    if (!Array.isArray(translatedTexts) || translatedTexts.length !== texts.length) {
      translatedTexts = texts;
    }

    return res.status(200).json({ translatedTexts });
  } catch (error: any) {
    return res.status(200).json({ translatedTexts: texts, error: error.message });
  }
}
