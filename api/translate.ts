import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { targetLang, texts } = req.body;

  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: "La lista de textos 'texts' es requerida y debe ser un arreglo." });
  }

  if (!targetLang) {
    return res.status(400).json({ error: "El idioma destino 'targetLang' es requerido." });
  }

  if (targetLang.toLowerCase() === "es" || targetLang.toLowerCase() === "español") {
    return res.status(200).json({ translatedTexts: texts });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY no configurada en el servidor." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Translate the following list of Costa Rican hardware store product names/descriptions or UI labels from Spanish to ${targetLang}.
Keep the exact order. Output the result strictly as a JSON array of translated strings with the same length.

Input texts to translate:
${JSON.stringify(texts, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
