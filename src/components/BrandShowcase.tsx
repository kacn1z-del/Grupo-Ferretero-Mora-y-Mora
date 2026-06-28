import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

interface BrandShowcaseProps {
  onSelectBrand: (brandName: string) => void;
  selectedBrand: string;
}

export default function BrandShowcase({ onSelectBrand, selectedBrand }: BrandShowcaseProps) {
  const premiumBrands = [
    { name: "Holcim", desc: "Cementos y mezclas premium", accent: "from-amber-500 to-orange-600" },
    { name: "DeWalt", desc: "Herramientas de nivel industrial", accent: "from-yellow-400 to-amber-500" },
    { name: "Lanco", desc: "Pinturas, selladores y siliconas", accent: "from-sky-500 to-blue-600" },
    { name: "Truper", desc: "Herramientas manuales líderes", accent: "from-orange-500 to-red-600" },
    { name: "Makita", desc: "Fuerza y durabilidad profesional", accent: "from-teal-500 to-emerald-600" },
    { name: "ArcelorMittal", desc: "Acero corrugado y perfiles estructurales", accent: "from-blue-700 to-indigo-800" },
    { name: "Stanley", desc: "Cintas métricas y herramientas manuales", accent: "from-zinc-700 to-zinc-950" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 md:p-8 shadow-xs" id="brand-showcase-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-5 mb-6">
        <div>
          <span className="text-[10px] bg-brand-orange-500/10 border border-brand-orange-500/20 text-brand-orange-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-spin" />
            Aliados Estratégicos
          </span>
          <h3 className="font-display font-black text-brand-blue-950 text-base md:text-lg uppercase mt-2 tracking-tight">
            Marcas Profesionales Autorizadas
          </h3>
          <p className="text-stone-500 text-xs mt-1">
            Solo distribuimos marcas líderes de clase mundial con garantía oficial directa. Haga clic para filtrar.
          </p>
        </div>
        
        {selectedBrand && (
          <button
            onClick={() => onSelectBrand("")}
            className="text-xs font-bold text-brand-orange-600 hover:text-brand-orange-700 flex items-center gap-1 transition-colors bg-brand-orange-50 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            Ver todos los productos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {premiumBrands.map((brand, idx) => {
          const isSelected = selectedBrand.toLowerCase() === brand.name.toLowerCase();
          
          return (
            <motion.button
              key={idx}
              onClick={() => onSelectBrand(brand.name)}
              className={`p-4 rounded-xl border flex flex-col justify-between items-center text-center group cursor-pointer transition-all ${
                isSelected
                  ? "bg-brand-blue-950 border-brand-blue-950 text-white shadow-md ring-2 ring-brand-orange-500"
                  : "bg-stone-50/50 hover:bg-white border-stone-200 hover:border-brand-orange-500/40 hover:shadow-xs"
              }`}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Fake stylized Logo/Icon badge */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-black tracking-tighter text-sm mb-3 shadow-inner ${
                isSelected 
                  ? "bg-brand-orange-500 text-white" 
                  : `bg-linear-to-br ${brand.accent} text-white opacity-90 group-hover:opacity-100 transition-opacity`
              }`}>
                {brand.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <span className={`text-xs font-black tracking-tight block ${isSelected ? "text-white" : "text-stone-800"}`}>
                  {brand.name}
                </span>
                <span className={`text-[9px] mt-1 leading-normal block ${isSelected ? "text-stone-300" : "text-stone-400 group-hover:text-stone-500"}`}>
                  {brand.desc}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
