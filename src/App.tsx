/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Boxes, 
  Search, 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  FileCheck, 
  HelpCircle, 
  PhoneCall, 
  ArrowUp,
  MapPin,
  Clock,
  Briefcase
} from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import MaterialCalculators from "./components/MaterialCalculators";
import CartSection from "./components/CartSection";
import QuoteModal from "./components/QuoteModal";
import { PRODUCTS, PRODUCT_CATEGORIES } from "./data";
import { CartItem, Product, QuotationRequest } from "./types";

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = React.useState<"catalog" | "calculators" | "cart">("catalog");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Shopping Cart state with LocalStorage persistence
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("moraymora_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Generated Quote popup state
  const [generatedQuote, setGeneratedQuote] = React.useState<QuotationRequest | null>(null);

  // Quotation History State
  const [quoteHistory, setQuoteHistory] = React.useState<QuotationRequest[]>(() => {
    try {
      const saved = localStorage.getItem("moraymora_quotes_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto scroll to top on section transitions
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  // Sync cart state with LocalStorage
  React.useEffect(() => {
    localStorage.setItem("moraymora_cart", JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        // Update quantity
        const newCart = [...prevCart];
        const newQty = Math.min(product.stock, newCart[existingIndex].quantity + quantity);
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newQty,
        };
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.max(1, Math.min(item.product.stock, quantity));
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Add multiple calculator outputs directly to cart
  const handleAddBulkToCart = (items: Array<{ product: Product; quantity: number }>) => {
    setCart((prevCart) => {
      let updatedCart = [...prevCart];
      items.forEach(({ product, quantity }) => {
        const idx = updatedCart.findIndex((item) => item.product.id === product.id);
        if (idx > -1) {
          const newQty = Math.min(product.stock, updatedCart[idx].quantity + quantity);
          updatedCart[idx] = { ...updatedCart[idx], quantity: newQty };
        } else {
          updatedCart.push({ product, quantity: Math.min(product.stock, quantity) });
        }
      });
      return updatedCart;
    });
  };

  // Trigger Quote creation
  const handleGenerateQuote = (quote: QuotationRequest) => {
    setGeneratedQuote(quote);
    setQuoteHistory((prev) => {
      const updated = [quote, ...prev];
      localStorage.setItem("moraymora_quotes_history", JSON.stringify(updated));
      return updated;
    });
    handleClearCart(); // Reset the cart after generating an official quote sheet
  };

  // Catalog filtering
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans" id="app-wrapper">
      
      {/* Header bar component */}
      <Header
        cart={cart}
        onOpenCart={() => setActiveSection("cart")}
        onNavigateToCalculators={() => setActiveSection("calculators")}
        onNavigateToCatalog={() => {
          setActiveSection("catalog");
          setSelectedCategory("all");
          setSearchTerm("");
        }}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          if (activeSection !== "catalog") {
            setActiveSection("catalog");
          }
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          if (activeSection !== "catalog") {
            setActiveSection("catalog");
          }
        }}
        categories={PRODUCT_CATEGORIES}
        quoteHistory={quoteHistory}
        onViewHistoryQuote={(quote) => setGeneratedQuote(quote)}
      />

      {/* Main Body Layout */}
      <main className="flex-1 w-full">
        
        {/* CATALOG VIEW */}
        {activeSection === "catalog" && (
          <div className="animate-fade-in space-y-8 pb-16">
            {/* Show Hero Banner only on search/filter reset */}
            {selectedCategory === "all" && searchTerm === "" && (
              <Hero
                onGoToCatalog={() => {
                  setSelectedCategory("all");
                  const catTitle = document.getElementById("catalog-title");
                  if (catTitle) catTitle.scrollIntoView({ behavior: "smooth" });
                }}
                onGoToCalculators={() => setActiveSection("calculators")}
              />
            )}

            {/* Catalog Grid Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 pt-4" id="catalog-section">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4" id="catalog-title">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-black tracking-tight text-brand-blue-950 uppercase">
                    {selectedCategory === "all" ? "Catálogo General de Productos" : PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Mostrando {filteredProducts.length} materiales y herramientas profesionales
                  </p>
                </div>

                {/* Badges / Filters status */}
                {searchTerm && (
                  <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 px-3 py-1 rounded-lg text-xs">
                    <span className="text-stone-500">Búsqueda:</span>
                    <strong className="text-stone-800 font-bold">&ldquo;{searchTerm}&rdquo;</strong>
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="text-stone-400 hover:text-stone-700 font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* No results placeholder */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-xl p-10 text-center space-y-3 max-w-md mx-auto my-12 shadow-xs">
                  <Boxes className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-stone-800 text-sm md:text-base">No encontramos resultados</h4>
                  <p className="text-xs text-stone-500">
                    No hay productos que coincidan con &ldquo;{searchTerm}&rdquo;. Pruebe con palabras genéricas como cemento, varilla, o DeWalt.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold py-1.5 px-4 rounded-md transition-colors"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              ) : (
                /* Products Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find(it => it.product.id === product.id);
                    const qtyInCart = cartItem ? cartItem.quantity : 0;
                    
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        currentCartQuantity={qtyInCart}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALCULATORS VIEW */}
        {activeSection === "calculators" && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 animate-fade-in pb-16">
            <button
              onClick={() => setActiveSection("catalog")}
              className="text-xs font-bold text-stone-500 hover:text-brand-blue-950 flex items-center gap-1 mb-4 cursor-pointer"
            >
              ← Volver al Catálogo
            </button>
            <MaterialCalculators onAddBulkToCart={handleAddBulkToCart} />
          </div>
        )}

        {/* CART & FORM VIEW */}
        {activeSection === "cart" && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in pb-16">
            <CartSection
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onGenerateQuote={handleGenerateQuote}
              onBackToCatalog={() => setActiveSection("catalog")}
            />
          </div>
        )}

      </main>

      {/* Floating Cart Button (Visible on Catalog when items exist) */}
      {cartTotalCount > 0 && activeSection === "catalog" && (
        <div className="fixed bottom-6 right-6 z-40 animate-bounce print:hidden">
          <button
            onClick={() => setActiveSection("cart")}
            className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative">
              <Boxes className="w-6 h-6" />
              <span className="absolute -top-3 -right-3 bg-brand-blue-950 text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-orange-600">
                {cartTotalCount}
              </span>
            </div>
            <span className="text-xs font-bold px-1.5 hidden sm:inline">Generar Cotización en Línea</span>
          </button>
        </div>
      )}

      {/* Corporate Professional Footer */}
      <footer className="bg-brand-zinc-950 text-stone-400 pt-16 pb-12 px-4 md:px-8 border-t border-stone-800 print:hidden" id="mora-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-brand-orange-600 p-2 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-display font-black text-white leading-none">MORA Y MORA</h4>
                <span className="text-[10px] text-brand-orange-500 font-bold tracking-wider">GRUPO FERRETERO</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Distribuidora autorizada de cementos, varillas, acero corrugado, herramientas profesionales y acabados finos para la construcción en Acosta, Vuelta de Jorco y cercanías, San José, Costa Rica.
            </p>
            <p className="text-[10px] text-stone-600">
              © 2026 Grupo Ferretero Mora y Mora S.A. Todos los derechos reservados.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Nuestra Empresa</h5>
            <ul className="text-xs space-y-2">
              <li>
                <button 
                  onClick={() => setActiveSection("catalog")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Catálogo de Productos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection("calculators")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Calculadora de Materiales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection("cart")}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mi Carrito / Cotizaciones
                </button>
              </li>
              <li className="text-stone-500 cursor-not-allowed">Precios de Mayoreo</li>
            </ul>
          </div>

          {/* Contact matrix */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Servicio & Soporte</h5>
            <div className="text-xs space-y-2.5 leading-relaxed">
              <p className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-brand-orange-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Atención Telefónica:</strong><br />
                  2410-5890 (Costa Rica)<br />
                  Lunes a Sábado: 7:00 AM - 6:00 PM
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-orange-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Locales Costa Rica:</strong><br />
                  Acosta (Parque y Clínica CCSS) y Vuelta de Jorco
                </span>
              </p>
            </div>
          </div>

          {/* Security & Badges */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Seguridad y Garantía</h5>
            <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-850 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                <ShieldCheck className="w-4.5 h-4.5 text-brand-orange-500" />
                <span>Garantía Mora y Mora</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-normal">
                Todas las compras en sucursal o cotizaciones formalizadas cuentan con garantías oficiales directo del fabricante. Emitimos facturas electrónicas oficiales autorizadas por el Ministerio de Hacienda en Costa Rica para todas sus compras.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Quote Document Overlay Modal */}
      <QuoteModal
        quote={generatedQuote}
        onClose={() => setGeneratedQuote(null)}
      />

    </div>
  );
}
