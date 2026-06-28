import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo no permitido." });
  }

  const { targetLang, texts } = req.body;

  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: "Textos requeridos." });
  }

  if (!targetLang) {
    return res.status(400).json({ error: "Idioma destino requerido." });
  }

  if (targetLang.toLowerCase() === "es") {
    return res.status(200).json({ translatedTexts: texts });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ translatedTexts: texts });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Translate from Spanish to ${targetLang}. Return ONLY a JSON array of strings, same order and length.\n\n${JSON.stringify(texts)}`,
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
    return res.status(200).json({ translatedTexts: texts });
  }
}
