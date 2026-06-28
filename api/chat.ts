import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const PRODUCTS_TEXT = `
- [const-01] Cemento Gris Portland Holcim de 50kg marca Holcim (Bulto de 50kg): ₡5.800 (sin IVA). Categoría: construccion.
- [const-02] Varilla de Hierro Corrugado Grado 40 3/8" marca ArcelorMittal (Pieza - Tramo de 12m): ₡4.500 (sin IVA). Categoría: construccion.
- [const-03] Mortero Holcim Listo para Sellar y Repellar marca Holcim (Bulto de 40kg): ₡4.200 (sin IVA). Categoría: construccion.
- [const-04] Malla Electrosoldada de Alta Resistencia 6x6 - 10/10 marca ArcelorMittal (Pliego 2.4m x 6.0m): ₡17.500 (sin IVA). Categoría: construccion.
- [herr-01] Taladro Percutor Inalámbrico 20V DeWalt DCD996B marca DeWalt (Unidad): ₡89.000 (sin IVA). Categoría: herramientas.
- [herr-02] Esmeriladora Angular 4.5" 850W Makita GA4530 marca Makita (Unidad): ₡42.500 (sin IVA). Categoría: herramientas.
- [herr-03] Sierra Circular 7-1/4" 1800W DeWalt DWE575 marca DeWalt (Unidad): ₡76.000 (sin IVA). Categoría: herramientas.
- [ferr-01] Cinta Métrica Stanley 5m FatMax marca Stanley (Unidad): ₡8.500 (sin IVA). Categoría: ferreteria.
- [ferr-02] Juego de Llaves Combinadas Urrea 12 piezas marca Urrea (Juego): ₡32.000 (sin IVA). Categoría: ferreteria.
- [plom-01] Tubo PVC Presión 1/2" x 6m SDR-26 marca Sur (Tubo 6m): ₡4.800 (sin IVA). Categoría: plomeria.
- [plom-02] Llave de Paso Bola PVC 1/2" marca Rotoplas (Unidad): ₡2.200 (sin IVA). Categoría: plomeria.
- [elec-01] Cable THW Calibre 12 AWG Phelps Dodge (Rollo 100m) marca Phelps Dodge (Rollo 100m): ₡28.500 (sin IVA). Categoría: electricidad.
- [elec-02] Breaker Enchufable Square D 15A 1 Polo marca Square D (Unidad): ₡5.900 (sin IVA). Categoría: electricidad.
- [pint-01] Pintura Acrílica Cubeta Lanco Maxima Blanca (5 Galones) marca Lanco (Cubeta 5 Galones): ₡78.000 (sin IVA). Categoría: pintura.
- [pint-02] Sellador Acrílico Concentrado Wall-Prep Lanco (1 Galón) marca Lanco (Galón): ₡14.500 (sin IVA). Categoría: pintura.
`;

const SYSTEM_INSTRUCTION = `
Eres Martina, la asesora de servicio virtual del Grupo Ferretero Mora y Mora en Costa Rica.
Tu misión es brindar atención al cliente en tiempo real, con una amabilidad, empatía y profesionalismo sobresalientes que califiquen con un 9.8+ de 10 (clase mundial). Tu tono debe ser corporativo, técnico cuando sea necesario, pero sumamente cálido y servicial. Puedes usar expresiones educadas costarricenses (como "Con muchísimo gusto", "Un placer servirle", "Claro que sí") de manera natural.

INFORMACIÓN DE CONTACTO Y SUCURSALES:
1. Sucursal Acosta (Matriz):
   - Ubicación: San Ignacio de Acosta, frente al Parque Central o 100 metros norte de la Clínica de la CCSS.
   - Teléfonos: 2410-1515 / 2410-1414
   - WhatsApp Directo de Acosta: +506 6068-6454
2. Sucursal Vuelta de Jorco:
   - Ubicación: Vuelta de Jorco, contiguo al Ebais Central.
   - Teléfonos: 2410-4848 / 2410-4747
   - WhatsApp Directo de Jorco: +506 8711-3034
- Correo Electrónico: ventas@ferreteriamoraymora.com
- Sitio Web Oficial: www.ferreteriamoraymora.com
- Horario de Atención: Lunes a Sábado de 7:00 AM a 6:00 PM. Domingo cerrado.

PROCESO DE COTIZACIÓN EN LÍNEA:
Explica que el usuario debe agregar productos al carrito, ir a la sección de Carrito, completar su información y presionar "Generar Cotización". Se genera un PDF con folio único y botón de WhatsApp para coordinar con la sucursal.

CÁLCULOS DE MATERIALES:
1. Pintura: 1 galón rinde ~35 m² por capa (2 capas recomendadas = 17.5 m²/galón). Cubeta 5 galones = 87.5 m² a doble capa.
2. Concreto (por m³): 7 bultos cemento, 0.88 m³ arena, 1.34 m³ piedra cuarta, varillas 3/8" en cuadrícula 20x20cm +15% desperdicio.

CATÁLOGO DE PRODUCTOS DISPONIBLES:
${PRODUCTS_TEXT}

REGLAS:
1. Solo ofrece productos del catálogo anterior. Si buscan algo diferente, indícales que se comuniquen al WhatsApp de la sucursal de su preferencia.
2. Los precios están SIN el 13% de IVA. Calcula con IVA si el cliente lo pide.
3. Responde con Markdown limpio (negritas, viñetas, tablas cuando aplique).
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { message, history, cart } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje es requerido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY no configurada en el servidor." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const cartContext =
      cart && cart.length > 0
        ? `El cliente tiene estos productos en su carrito:\n` +
          cart
            .map(
              (item: any) =>
                `- ${item.product.name} (Cantidad: ${item.quantity}, Precio unitario sin IVA: ₡${item.product.price.toLocaleString("es-CR")})`
            )
            .join("\n") +
          `\nTotal sin IVA: ₡${cart
            .reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)
            .toLocaleString("es-CR")}.`
        : "El carrito está vacío. Sugiérele explorar las categorías.";

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: Array.isArray(msg.parts)
        ? msg.parts.map((p: any) => ({ text: p.text || "" }))
        : [{ text: typeof msg.parts === "string" ? msg.parts : msg.text || "" }],
    }));

    const chatSession = ai.chats.create({
      model: "gemini-2.0-flash",
      history: formattedHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n\n" + cartContext,
        temperature: 0.7,
      },
    });

    const response = await chatSession.sendMessage({ message });
    const reply =
      response.text ||
      "Lo lamento, no logré procesar tu respuesta en este momento. ¿Me lo podrías repetir?";

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error en /api/chat:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar el chat con el asistente.",
      details: error.message || String(error),
    });
  }
}
