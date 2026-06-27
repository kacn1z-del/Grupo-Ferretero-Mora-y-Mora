/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Hammer, BrickWall, Zap, Droplet, Lightbulb, Paintbrush, Boxes, Plus, Minus, Check, ChevronDown, ChevronUp, ShieldAlert, BadgeCheck } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: any;
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  currentCartQuantity: number;
}

export default function ProductCard({ product, onAddToCart, currentCartQuantity }: ProductCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const [showSpecs, setShowSpecs] = React.useState(false);
  const [addedAnimation, setAddedAnimation] = React.useState(false);

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
            Stock Disponible
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Bajo Stock ({product.stock})
          </span>
        )}

        {/* Product Unit Indicator */}
        <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
          Unidad: {product.unit}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange-600 block">
            {product.category.replace("-", " ")}
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
                Antes de IVA
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-stone-500 block">
                {formattedIvaPrice}
              </span>
              <span className="text-[9px] text-stone-400 font-medium block">
                con IVA incl.
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
                  <span>¡Añadido!</span>
                </>
              ) : (
                <>
                  <span>Agregar</span>
                  {currentCartQuantity > 0 && (
                    <span className="bg-brand-orange-500/30 text-brand-orange-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                      en cart: {currentCartQuantity}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Expand Specifications Link */}
          <div>
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex items-center justify-between text-stone-500 hover:text-stone-800 text-[11px] font-semibold py-1 border-t border-dashed border-stone-100 transition-colors cursor-pointer"
            >
              <span>Ver ficha técnica</span>
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
