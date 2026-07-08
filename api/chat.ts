import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./_shared/products.js";

// Initialize the Gemini client (usa la variable de entorno configurada en Vercel)
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

  try {
    const { message, history, cart } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    // Generate the dynamic products inventory text
    const productsListText = PRODUCTS.map((p) =>
      `- [${p.id}] ${p.name} marca ${p.brand} (${p.unit}): ₡${p.price.toLocaleString("es-CR")} (sin IVA). Categoría: ${p.category}. Desc: ${p.description}. Especificaciones: ${JSON.stringify(p.specifications)}`
    ).join("\n");

    // Set up the system instruction
    const systemInstruction = `
Eres Martina, la asesora de servicio virtual del Grupo Ferretero Mora y Mora en Costa Rica.
Tu misión es brindar atención al cliente en tiempo real, con una amabilidad, empatía y profesionalismo sobresalientes que califiquen con un 9.8+ de 10 (clase mundial). Tu tono debe ser corporativo, técnico cuando sea necesario, pero sumamente cálido y servicial. Puedes usar expresiones educadas costarricenses (como "Con muchísimo gusto", "Un placer servirle", "Claro que sí") de manera natural.

INFORMACIÓN DE CONTACTO Y SUCURSALES (Muy importante, dale estos datos exactos si preguntan por contacto, llamadas o dirección):
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
- Horario de Atención Unificado: Lunes a Sábado de 7:00 AM a 6:00 PM. Domingo cerrado.

PROCESO DE COTIZACIÓN EN LÍNEA:
- Explica al usuario que para cotizar de manera oficial, solo debe navegar en la página, agregar los productos que necesite al carrito (usando el ícono de carrito o el botón "Agregar al Carrito"), ingresar a la sección de Carrito (en el botón de la esquina superior derecha), completar su información de contacto, y presionar "Generar Cotización".
- Esto le generará una cotización en formato PDF con un número de Folio único y un botón directo para enviarlo por WhatsApp al asesor de la sucursal de su preferencia (Acosta o Jorco) para coordinar el pago, el flete y la entrega.

CÁLCULOS DE MATERIALES:
Si te piden cálculos de pintura o concreto para sus proyectos de remodelación o construcción, puedes realizar los cálculos directamente basándote en lo siguiente:
1. Pintura y Acabados:
   - Un galón de pintura rinde aprox. 35 m² por capa (se recomiendan 2 capas, es decir, rendimiento neto de 17.5 m² por galón). Una cubeta de 5 galones rinde aprox. 175 m² por capa (87.5 m² a doble capa).
   - El cliente puede escoger entre distintas marcas y colores de pintura disponibles en el catálogo (ver lista de productos abajo, categoría "pintura").
2. Concreto Estructural (Cimientos, losas, firmes):
   - Pide el largo, ancho y espesor en metros para calcular el volumen total en metros cúbicos (m³ = largo * ancho * espesor).
   - Por cada 1 m³ de concreto se necesitan:
     * 7 bultos de Cemento Gris Portland Holcim de 50kg (₡5,800 por bulto)
     * ~0.88 metros cúbicos (o toneladas) de Arena (arena de río para construcción)
     * ~1.34 metros cúbicos (o toneladas) de Piedra Cuarta (la grava o piedra triturada de 1/4" que se usa tradicionalmente en Costa Rica para concreto)
     * Para refuerzo, estima varillas corrugadas de 3/8" (tramo de 12m a ₡4,500 cada una) asumiendo cuadrícula de 20cm x 20cm con un 15% de desperdicio/amarres.
   - Realiza la multiplicación y diles los bultos de cemento sugeridos y varillas de forma desglosada y profesional.

CATÁLOGO REAL DE PRODUCTOS DISPONIBLES:
${productsListText}

REGLAS DE RESPUESTA:
1. Nunca ofrezcas productos que no estén en la lista anterior como disponibles en línea. Si el cliente busca algo diferente (como láminas de zinc, madera, tuberías especiales, clavos, etc.), dile amablemente que contamos con miles de productos adicionales en nuestras sucursales físicas y pídele que se comunique al WhatsApp o teléfono de la sucursal que prefiera para que un asesor busque el artículo exacto en bodega de inmediato.
2. Sé muy precisa con los cálculos matemáticos de precios e IVA. Recuerda que los precios mostrados están SIN el 13% de IVA. Si el cliente lo desea, puedes calcularle el precio final sumándole el 13% de IVA.
3. Responde siempre de manera concisa pero detallada, con un formato Markdown limpio, estructurado y muy legible (negritas, viñetas, tablas).
4. El cliente te enviará en cada mensaje su carrito de compras actual para que tengas contexto completo y puedas asistirle sobre lo que lleva seleccionado.
`;

    // Format current cart context to give to the model
    const cartContext = cart && cart.length > 0
      ? `El cliente tiene actualmente estos productos en su carrito de compras:\n` +
        cart.map((item: any) => `- ${item.product.name} (Cantidad: ${item.quantity}, Marca: ${item.product.brand}, Precio unitario sin IVA: ₡${item.product.price.toLocaleString("es-CR")}, Subtotal: ₡${(item.product.price * item.quantity).toLocaleString("es-CR")})`).join("\n") +
        `\nTotal del carrito actual sin IVA: ₡${cart.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0).toLocaleString("es-CR")}.`
      : `El carrito de compras del cliente está vacío actualmente. Sugiérele explorar las categorías para iniciar su cotización.`;

    // Format chat history for the API
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: Array.isArray(msg.parts)
        ? msg.parts.map((p: any) => ({ text: p.text || "" }))
        : [{ text: typeof msg.parts === "string" ? msg.parts : (msg.text || "") }],
    }));

    // Gemini requires chat history to start with a "user" turn. The frontend
    // always includes Martina's canned welcome message (role "model") first,
    // so strip any leading "model" turns before creating the chat session.
    while (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory.shift();
    }

    // Create a chat session with the model
    const chatSession = ai.chats.create({
      model: "gemini-3.5-flash",
      history: formattedHistory,
      config: {
        systemInstruction: systemInstruction + "\n\n" + cartContext,
        temperature: 0.7,
      },
    });

    // Send the user message
    const response = await chatSession.sendMessage({ message: message });
    const reply = response.text || "Lo lamento, no logré procesar tu respuesta en este momento. ¿Me lo podrías repetir?";

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Error en endpoint /api/chat:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar el chat con el asistente.",
      details: error.message || error,
    });
  }
}
