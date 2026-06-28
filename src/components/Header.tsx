/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShoppingCart, Calculator, Search, Hammer, Phone, MapPin, Menu, X, Clock, Shield, Globe } from "lucide-react";
import { CartItem, QuotationRequest } from "../types";
import MenuDrawer from "./MenuDrawer";
import { useLanguage, LANGUAGES, LanguageCode } from "../contexts/LanguageContext";

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onNavigateToCalculators: () => void;
  onNavigateToCatalog: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  quoteHistory?: QuotationRequest[];
  onViewHistoryQuote?: (quote: QuotationRequest) => void;
  onOpenAdminPortal: () => void;
}

export default function Header({
  cart,
  onOpenCart,
  onNavigateToCalculators,
  onNavigateToCatalog,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  quoteHistory = [],
  onViewHistoryQuote = () => {},
  onOpenAdminPortal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { language, setLanguage, t } = useLanguage();

  const getCategoryTranslation = (id: string, defaultName: string) => {
    if (id === "all") return t("all", "Todos");
    if (id === "construccion") return t("construccion", "Construcción");
    if (id === "herramientas") return t("herramientas", "Herramientas Eléctricas");
    if (id === "pintura") return t("pinturas", "Pinturas y Acabados");
    if (id === "electricidad") return t("electricidad", "Electricidad");
    if (id === "plomeria") return t("fontaneria", "Plomería y Grifería");
    return defaultName;
  };

  return (
    <header className="sticky top-0 z-40 w-full" id="mora-header">
      {/* Top micro-bar: Info and Contact */}
      <div className="bg-brand-zinc-950 text-stone-300 text-xs py-2 px-4 md:px-8 border-b border-stone-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-orange-500" />
            <span className="font-medium text-stone-200">Acosta:</span> 
            <a href="tel:24101515" className="hover:text-brand-orange-400 font-mono">2410-1515</a>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-brand-orange-500" />
            <span className="font-medium text-stone-200">Jorco:</span> 
            <a href="tel:24104848" className="hover:text-brand-orange-400 font-mono">2410-4848</a>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-orange-500" />
            <span className="font-medium text-stone-200">{t("locales")}:</span> Acosta (Parque / Clínica) y Vuelta de Jorco, CR
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-orange-500" />
            <span className="font-medium text-stone-200">{t("schedule")}:</span> Lun-Sáb: 7:00 AM - 6:00 PM
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden xl:inline bg-brand-orange-600/20 text-brand-orange-100 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-brand-orange-600/30">
            Entrega a Obra Gratuita desde ₡150,000
          </span>
          
          {/* Elegant Language Selector */}
          <div className="flex items-center space-x-1.5 bg-stone-900 border border-stone-850 px-2 py-1 rounded-md text-stone-300">
            <Globe className="w-3.5 h-3.5 text-brand-orange-500 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-[11px] font-semibold text-stone-200 focus:outline-none cursor-pointer pr-1"
              title="Seleccionar idioma / Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-950 text-stone-200">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="bg-brand-blue-950 text-white py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Logo Brand with Desktop Menu Button */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer select-none group"
              onClick={onNavigateToCatalog}
            >
             <img src="https://i.ibb.co/Y4Qwsp5P/2-B6-D1-FB4-9-E37-4-FCB-80-A8-FC01-E91-BDA6-C.png" alt="Mora y Mora" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight leading-none">
                  MORA Y MORA
                </h1>
                <span className="text-[10px] md:text-xs text-brand-orange-500 font-bold tracking-[0.15em] uppercase block mt-0.5">
                  {t("title").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Desktop Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="hidden md:flex items-center gap-2 bg-brand-blue-900/40 hover:bg-brand-blue-900/80 border border-brand-blue-800 text-stone-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Explorar departamentos, ofertas y cuenta"
            >
              <Menu className="w-4 h-4 text-brand-orange-500" />
              <span>Menú</span>
            </button>
          </div>

          {/* Large Screen Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative mx-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-brand-blue-900/50 border border-brand-blue-900/80 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 placeholder-stone-400 transition-all shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-stone-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Actions Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Calculators trigger */}
            <button
              onClick={onNavigateToCalculators}
              className="flex items-center space-x-1.5 bg-brand-blue-900/40 hover:bg-brand-blue-900 text-stone-100 hover:text-white border border-brand-blue-900 px-3.5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-brand-orange-500" />
              <span className="hidden sm:inline font-medium">{t("calculatorsTab")}</span>
            </button>

            {/* Administrative Portal trigger */}
            <button
              onClick={onOpenAdminPortal}
              className="hidden lg:flex items-center space-x-1.5 bg-brand-blue-900/40 hover:bg-brand-blue-900 text-stone-100 hover:text-white border border-brand-blue-900/80 px-3.5 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer font-bold"
              title="Portal para administradores de Jorco, Acosta Centro y Acosta Norte"
            >
              <Shield className="w-4 h-4 text-brand-orange-500" />
              <span>{t("adminPortal")}</span>
            </button>

            {/* Shopping Cart trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 bg-brand-orange-600 hover:bg-brand-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-102 cursor-pointer shadow-lg shadow-brand-orange-600/10"
              id="cart-trigger-btn"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t("cartTab")}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-orange-700 font-mono text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-orange-600 animate-pulse shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              className="md:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile search & quick categories */}
      <div className="md:hidden bg-brand-blue-950 p-3 border-t border-brand-blue-900/60">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-stone-400" />
          </div>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-brand-blue-900/50 border border-brand-blue-900/80 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-orange-500"
          />
        </div>
      </div>

      {/* Quick Category Bar (Horizontal slider) */}
      <div className="bg-white border-b border-stone-200/80 py-2.5 px-4 md:px-8 overflow-x-auto scrollbar-none shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 min-w-max">
          <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider mr-3 hidden lg:inline">
            {t("all_categories", "Categorías")}:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-brand-orange-50 text-brand-orange-700 border-brand-orange-500/30 shadow-xs font-semibold"
                    : "text-stone-600 bg-stone-50 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {getCategoryTranslation(cat.id, cat.name)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Sliding Menu Drawer */}
      <MenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        onSelectCategory={onSelectCategory}
        onNavigateToCatalog={onNavigateToCatalog}
        onNavigateToCalculators={onNavigateToCalculators}
        quoteHistory={quoteHistory}
        onViewHistoryQuote={onViewHistoryQuote}
        onOpenAdminPortal={onOpenAdminPortal}
      />
    </header>
  );
}
