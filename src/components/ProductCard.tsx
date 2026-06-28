/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Hammer, BrickWall, Zap, Droplet, Lightbulb, Paintbrush, Boxes, Plus, Minus, Check, ChevronDown, ChevronUp, ShieldAlert, BadgeCheck } from "lucide-react";
import { Product } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface ProductCardProps {
  key?: any;
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  currentCartQuantity: number;
}

export default function ProductCard({ product, onAddToCart, currentCartQuantity }: ProductCardProps) {
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = React.useState(1);
  const [showSpecs, setShowSpecs] = React.useState(false);
  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const [zoomedPhoto, setZoomedPhoto] = React.useState<{ url: string; branch: string } | null>(null);

  // Check if this product has any branch-specific photos
  const hasBranchPhotos = Object.values(product.branchPhotos || {}).some(
    (photos) => photos && photos.length > 0
  );

  // Helper to match category to lucide icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "construccion":
        return <BrickWall className="w-8 h-8 text-orange-600" />;
      case "herramientas":
        return <Zap className="w-8 h-8 text-amber-500" />;
      case "ferreteria":
        return <Hammer className="w-8 h-8 text-blue-600" />;
      case "plomeria":
        return <Droplet className="w-8 h-8 text-sky-500" />;
      case "electricidad":
        return <Lightbulb className="w-8 h-8 text-yellow-500" />;
      case "pintura":
        return <Paintbrush className="w-8 h-8 text-emerald-500" />;
      default:
        return <Boxes className="w-8 h-8 text-stone-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "construccion":
        return "from-orange-50 to-orange-100/50 border-orange-200";
      case "herramientas":
        return "from-amber-50 to-amber-100/50 border-amber-200";
      case "ferreteria":
        return "from-blue-50 to-blue-100/50 border-blue-200";
      case "plomeria":
        return "from-sky-50 to-sky-100/50 border-sky-200";
      case "electricidad":
        return "from-yellow-50 to-yellow-100/50 border-yellow-200";
      case "pintura":
        return "from-emerald-50 to-emerald-100/50 border-emerald-200";
      default:
        return "from-stone-50 to-stone-100/50 border-stone-200";
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddClick = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1800);
  };

  const formattedPrice = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(product.price);

  const formattedIvaPrice = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(product.price * 1.13);

  const getCategoryLabel = (category: string) => {
    if (category === "construccion") return t("construccion", "Construcción");
    if (category === "herramientas") return t("herramientas", "Herramientas Eléctricas");
    if (category === "pintura") return t("pinturas", "Pinturas y Acabados");
    if (category === "electricidad") return t("electricidad", "Electricidad");
    if (category === "plomeria") return t("fontaneria", "Plomería y Grifería");
    return category;
  };

  return (
    <div 
      className="bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col h-full group overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Illustration Mockup */}
      <div className={`h-40 bg-gradient-to-br ${getCategoryColor(product.category)} border-b flex flex-col justify-center items-center relative p-4 select-none`}>
        {getCategoryIcon(product.category)}
        
        {/* Brand stamp overlay */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-black uppercase text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
          {product.brand}
        </span>

        {/* Stock Badge */}
        {product.stock > 10 ? (
          <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("stockAvailable", "Stock Disponible")}
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            {t("lowStock", "Bajo Stock")} ({product.stock})
          </span>
        )}

        {/* Product Unit Indicator */}
        <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
          {t("unit", "Unidad")}: {product.unit}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange-600 block">
            {getCategoryLabel(product.category)}
          </span>
          <h3 className="font-display font-bold text-stone-900 group-hover:text-brand-blue-900 transition-colors text-base line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Tag */}
        <div className="my-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-mono font-bold text-stone-900 tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-[10px] text-stone-400 font-bold ml-1 uppercase">
                {t("beforeIva", "Antes de IVA")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-stone-500 block">
                {formattedIvaPrice}
              </span>
              <span className="text-[9px] text-stone-400 font-medium block">
                {t("withIva", "con IVA incl.")}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Action Panel */}
        <div className="space-y-2.5">
          
          {/* Controls: Qty Selector and Add Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50/50">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-stone-800 select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddClick}
              disabled={product.stock === 0}
              className={`flex-1 font-semibold py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-blue-900 hover:bg-brand-blue-950 text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t("added", "¡Añadido!")}</span>
                </>
              ) : (
                <>
                  <span>{t("add", "Agregar")}</span>
                  {currentCartQuantity > 0 && (
                    <span className="bg-brand-orange-500/30 text-brand-orange-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                      {language === "en" ? "in cart" : language === "es" ? "en carro" : "carro"}: {currentCartQuantity}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Real-time Stock per Branch Grid */}
          <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {t("branchAvailability", "Disponibilidad por Sucursal")}:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-white border border-stone-150 p-1.5 rounded-lg text-center shadow-3xs">
                <span className="text-[9px] font-bold text-stone-500 block leading-tight">Acosta Centro</span>
                <strong className={`font-mono text-xs block mt-0.5 ${product.branchStock?.acosta_centro ? "text-emerald-600 font-extrabold" : "text-stone-400"}`}>
                  {product.branchStock?.acosta_centro ?? 0}
                </strong>
              </div>
              <div className="bg-white border border-stone-150 p-1.5 rounded-lg text-center shadow-3xs">
                <span className="text-[9px] font-bold text-stone-500 block leading-tight">Acosta Norte</span>
                <strong className={`font-mono text-xs block mt-0.5 ${product.branchStock?.acosta ? "text-emerald-600 font-extrabold" : "text-stone-400"}`}>
                  {product.branchStock?.acosta ?? 0}
                </strong>
              </div>
              <div className="bg-white border border-stone-150 p-1.5 rounded-lg text-center shadow-3xs">
                <span className="text-[9px] font-bold text-stone-500 block leading-tight">Vuelta Jorco</span>
                <strong className={`font-mono text-xs block mt-0.5 ${product.branchStock?.jorco ? "text-emerald-600 font-extrabold" : "text-stone-400"}`}>
                  {product.branchStock?.jorco ?? 0}
                </strong>
              </div>
            </div>
          </div>

          {/* Real Warehouse Stock Photos Section */}
          {hasBranchPhotos && (
            <div className="border-t border-dashed border-stone-200 pt-2 space-y-1.5">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 w-fit">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("realWarehousePhoto", "Foto Real Verificada en Bodega")}</span>
              </span>
              
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {Object.entries(product.branchPhotos || {}).map(([branchKey, photos]) => {
                  const branchLabel = branchKey === "acosta_centro" 
                    ? "Acosta Centro" 
                    : branchKey === "acosta" 
                    ? "Acosta Norte" 
                    : "Jorco";
                  
                  return (photos || []).map((photoUrl, photoIdx) => (
                    <button 
                      key={`${branchKey}-${photoIdx}`} 
                      onClick={() => setZoomedPhoto({ url: photoUrl, branch: branchLabel })}
                      className="relative rounded-lg overflow-hidden border border-stone-200 aspect-video w-20 shrink-0 bg-stone-100 cursor-zoom-in group/photo shadow-2xs hover:border-brand-orange-500/50 transition-colors"
                    >
                      <img 
                        src={photoUrl} 
                        alt={`Stock real ${branchLabel}`} 
                        className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[7px] text-white py-0.5 px-1 font-bold text-center uppercase truncate leading-none">
                        {branchLabel}
                      </span>
                    </button>
                  ));
                })}
              </div>
            </div>
          )}

          {/* Zoomed Lightbox Modal */}
          {zoomedPhoto && (
            <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setZoomedPhoto(null)}>
              <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl border border-stone-200 relative" onClick={e => e.stopPropagation()}>
                <div className="bg-brand-blue-950 text-white px-4 py-2.5 flex justify-between items-center text-xs font-bold border-b border-brand-blue-900">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <BadgeCheck className="w-4 h-4 text-brand-orange-500" />
                    {t("warehousePhoto", "Foto de Bodega")} ({zoomedPhoto.branch})
                  </span>
                  <button 
                    onClick={() => setZoomedPhoto(null)}
                    className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[10px] cursor-pointer"
                  >
                    {t("close", "Cerrar")}
                  </button>
                </div>
                <div className="aspect-square bg-stone-100">
                  <img 
                    src={zoomedPhoto.url} 
                    alt="Evidencia real de stock en bodega" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3.5 bg-stone-50 border-t border-stone-200 text-center">
                  <p className="text-[10px] text-stone-500 font-medium">
                    {t("photoDisclaimer", "Fotografía de stock capturada en tiempo real")} {zoomedPhoto.branch}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expand Specifications Link */}
          <div>
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex items-center justify-between text-stone-500 hover:text-stone-800 text-[11px] font-semibold py-1 border-t border-dashed border-stone-100 transition-colors cursor-pointer"
            >
              <span>{t("viewSpecs", "Ver ficha técnica")}</span>
              {showSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSpecs && (
              <div className="bg-stone-50 rounded-lg p-2.5 mt-1 border border-stone-150 animate-slide-down">
                <table className="w-full text-[10px]">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-stone-100 last:border-0 py-1">
                        <td className="font-semibold text-stone-500 pr-2 py-0.5 align-top w-2/5">
                          {key}
                        </td>
                        <td className="text-stone-700 py-0.5">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
