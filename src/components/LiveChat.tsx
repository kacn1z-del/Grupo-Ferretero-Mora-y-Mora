import React from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  ChevronDown, 
  Sparkles, 
  Wrench, 
  Phone, 
  FileText, 
  RefreshCw,
  ShoppingBag,
  HelpCircle,
  Clock,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface LiveChatProps {
  cart: CartItem[];
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export default function LiveChat({ cart }: LiveChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [errorState, setErrorState] = React.useState<string | null>(null);

  // Initialize messages from sessionStorage to persist across clicks/pages
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem("moraymora_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
    
    // Default welcome message
    return [
      {
        id: "welcome-1",
        role: "model",
        text: `¡Hola! Le damos la más cordial bienvenida a **Grupo Ferretero Mora y Mora**. Soy **Martina**, su asesora virtual experta. 🛠️🇨🇷\n\n¿En qué le puedo asistir el día de hoy? Con muchísimo gusto le ayudo con:\n\n* 📦 **Productos y Precios:** Consultas de precios del catálogo oficial.\n* 🏠 **Calculadora Inteligente:** Estimaciones de sacos de cemento, varillas, arena y piedra cuarta, o cubetas de pintura para sus proyectos.\n* 🛒 **Ayuda con su Carrito:** Información sobre los productos que tiene seleccionados y cómo generar su cotización.\n* 📍 **Sucursales y Contacto:** Direcciones, teléfonos y WhatsApp directos de Acosta y Vuelta de Jorco.`,
        timestamp: new Date()
      }
    ];
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatInputRef = React.useRef<HTMLInputElement>(null);

  // Sync messages to sessionStorage
  React.useEffect(() => {
    try {
      sessionStorage.setItem("moraymora_chat_history", JSON.stringify(messages));
    } catch (e) {
      console.error("Error saving chat history:", e);
    }
  }, [messages]);

  // Handle unread counts
  React.useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Trigger focus on input when chat opens
  React.useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Simulated typing helper
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    setErrorState(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Format history for the backend endpoint according to types
    const historyPayload = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: historyPayload,
          cart: cart
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar con el asistente de Martina.");
      }

      const data = await response.json();
      
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, modelMessage]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorState(err.message || "Error al conectar.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Quick action prompt selections
  const quickActions = [
    { label: "📍 Dirección y Teléfonos", text: "¿Cuáles sucursales tienen, dónde quedan y cuáles son sus teléfonos y WhatsApp?" },
    { label: "🧱 Calcular Concreto", text: "Necesito que me ayudes a calcular bultos de cemento y varillas para una losa. ¿Cómo hago?" },
    { label: "🎨 Calcular Pintura", text: "Quiero pintar una pared de mi casa, ¿cuánto rinde una cubeta o un galón de pintura Lanco?" },
    { label: "🛒 Consultar mi Carrito", text: "¿Qué productos tengo en mi carrito de compras actual y cómo los cotizo?" },
    { label: "⚡ Proceso de Cotización", text: "¿Cómo genero la cotización oficial en PDF y cómo se la envío a los agentes por WhatsApp?" }
  ];

  // Micro Markdown text parser inside chat
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let cleanLine = line;
      
      // Check for bullet list
      if (cleanLine.trim().startsWith("* ") || cleanLine.trim().startsWith("- ")) {
        const content = cleanLine.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-stone-700 text-xs my-1 leading-relaxed">
            {parseInlineMarkdown(content)}
          </li>
        );
      }
      
      // Check for subheadings
      if (cleanLine.trim().startsWith("### ")) {
        const content = cleanLine.trim().substring(4);
        return (
          <h4 key={idx} className="text-xs font-bold text-brand-blue-950 uppercase mt-3 mb-1 tracking-tight flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-orange-500 inline" />
            {parseInlineMarkdown(content)}
          </h4>
        );
      }
      if (cleanLine.trim().startsWith("## ") || cleanLine.trim().startsWith("# ")) {
        const content = cleanLine.trim().replace(/^#+\s+/, "");
        return (
          <h3 key={idx} className="text-xs font-black text-brand-orange-600 uppercase mt-3 mb-1 tracking-tight">
            {parseInlineMarkdown(content)}
          </h3>
        );
      }

      // Check for basic table lines
      if (cleanLine.trim().startsWith("|") && cleanLine.trim().endsWith("|")) {
        if (cleanLine.includes("---")) return null;
        const cells = cleanLine.split("|").map(c => c.trim()).filter((c, i) => i > 0 && i < cleanLine.split("|").length - 1);
        return (
          <div key={idx} className="grid grid-cols-2 gap-2 border-b border-stone-100 py-1 text-[11px] font-mono bg-stone-50 px-2 rounded mt-1">
            {cells.map((cell, cIdx) => (
              <span key={cIdx} className={cIdx === 0 ? "font-bold text-stone-700" : "text-stone-600 text-right"}>
                {parseInlineMarkdown(cell)}
              </span>
            ))}
          </div>
        );
      }

      // Paragraph
      if (cleanLine.trim() === "") return <div key={idx} className="h-2" />;
      
      return (
        <p key={idx} className="text-xs text-stone-700 leading-relaxed my-1">
          {parseInlineMarkdown(cleanLine)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    let currentText = text;
    const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
    const splitParts = currentText.split(regex);

    return splitParts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-brand-blue-950">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="italic text-stone-800">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("[") && part.includes("](")) {
        const label = part.substring(1, part.indexOf("]"));
        const url = part.substring(part.indexOf("](") + 2, part.length - 1);
        return (
          <a 
            key={i} 
            href={url} 
            target="_blank" 
            rel="noreferrer" 
            className="text-brand-orange-600 hover:underline font-bold inline-flex items-center gap-0.5"
          >
            {label}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 left-6 sm:bottom-6 sm:right-6 sm:left-auto z-50 print:hidden" id="live-chat-widget">
      {/* Floating Launcher Button */}
      <motion.button
        id="chat-launcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-blue-950 hover:bg-brand-blue-900 text-white rounded-full p-4 shadow-2xl flex items-center justify-center cursor-pointer relative group transition-transform duration-300 hover:scale-105"
        layoutId="chat-window-container"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-brand-orange-500 text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue-950 animate-pulse font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        
        {/* Nice subtle hover text */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold font-display uppercase tracking-wider whitespace-nowrap pl-0 group-hover:pl-2">
          ¿Dudas? Chat en Vivo
        </span>
      </motion.button>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-0 right-0 left-0 top-0 sm:bottom-24 sm:right-6 sm:left-auto sm:top-auto w-full sm:w-[380px] h-full sm:h-[550px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200/80"
          >
            {/* Header section */}
            <div className="bg-brand-blue-950 text-white p-4 flex justify-between items-center border-b border-brand-blue-900">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-brand-orange-500 w-10 h-10 rounded-full flex items-center justify-center shadow-inner border border-brand-orange-600">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {/* Active Green Dot indicator */}
                  <span className="absolute bottom-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-brand-blue-950 shadow-xs" title="En línea" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-black text-xs md:text-sm tracking-wide uppercase leading-none">Martina</h3>
                    <span className="bg-brand-orange-600 text-[9px] font-bold uppercase tracking-widest px-1 rounded text-white py-0.5">Asistente AI</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-brand-orange-500" />
                    Soporte Técnico en Vivo • 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-brand-blue-900 p-1.5 rounded-lg text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Minimizar"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Shopping Cart Mini status banner (context alert) */}
            {cart.length > 0 && (
              <div className="bg-brand-orange-50 border-b border-brand-orange-100 px-3 py-1.5 flex items-center justify-between text-[11px] text-brand-orange-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Lleva <strong>{cart.reduce((a, b) => a + b.quantity, 0)} artículos</strong> en su cotización actual</span>
                </div>
                <span className="font-mono font-bold">
                  ₡{cart.reduce((s, i) => s + (i.product.price * i.quantity), 0).toLocaleString("es-CR")}
                </span>
              </div>
            )}

            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-orange-600 text-white rounded-br-none"
                      : "bg-white text-stone-800 border border-stone-200/60 rounded-bl-none"
                  }`}>
                    {/* Message content */}
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderMarkdown(msg.text)}
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className={`text-[9px] mt-1.5 font-medium ${
                      msg.role === "user" ? "text-brand-orange-100 text-right" : "text-stone-400 text-left"
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200/60 rounded-2xl rounded-bl-none p-3.5 shadow-xs max-w-[85%]">
                    <div className="flex items-center gap-1 py-1 px-1.5">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error state with retry option */}
              {errorState && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700 space-y-2">
                  <p className="font-semibold flex items-center gap-1">
                    <HelpCircle className="w-4 h-4 text-red-500" />
                    No se pudo procesar la consulta
                  </p>
                  <p className="text-[11px] text-red-600 leading-normal">
                    {errorState.includes("asistente") 
                      ? "Hubo un error de conexión con el servidor. Por favor, asegúrese de que el servidor de desarrollo esté iniciado." 
                      : errorState}
                  </p>
                  <button
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                      if (lastUserMsg) {
                        handleSendMessage(lastUserMsg.text);
                      } else {
                        setErrorState(null);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reintentar Consulta
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick action suggest chips */}
            {messages.length < 5 && !isTyping && (
              <div className="px-3 py-2 bg-stone-100 border-t border-b border-stone-200 overflow-x-auto flex gap-1.5 scrollbar-thin">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action.text)}
                    className="bg-white hover:bg-brand-orange-50 border border-stone-200 hover:border-brand-orange-200 text-[10px] font-bold text-stone-600 hover:text-brand-orange-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer shadow-2xs"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom input area */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
            >
              <input
                ref={chatInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escriba su mensaje aquí..."
                disabled={isTyping}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-brand-orange-500 focus:bg-white disabled:opacity-60 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white p-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
