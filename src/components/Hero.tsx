/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Truck, ShieldCheck, Percent, FileText, ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onGoToCatalog: () => void;
  onGoToCalculators: () => void;
}

export default function Hero({ onGoToCatalog, onGoToCalculators }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-brand-blue-950 via-brand-blue-900 to-brand-zinc-950 text-white relative overflow-hidden" id="hero-section">
      {/* Decorative architectural grid lines overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Warm background gradient glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-orange-500/10 border border-brand-orange-500/20 px-3 py-1 rounded-full text-brand-orange-500 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Distribuidor Autorizado Holcim, Lanco, Truper y DeWalt</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight leading-tight">
              Sólido como tus cimientos, <br className="hidden sm:inline" />
              <span className="text-brand-orange-500">preciso como tus herramientas.</span>
            </h1>
            
            <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-xl">
              En <strong className="text-white font-semibold">Grupo Ferretero Mora y Mora</strong> proveemos herramientas profesionales, material de construcción, plomería y electricidad para obras residenciales, comerciales e industriales.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                onClick={onGoToCatalog}
                className="bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all hover:scale-102 cursor-pointer shadow-lg shadow-brand-orange-600/20 flex items-center gap-2"
              >
                <span>Ver Catálogo Interactivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onGoToCalculators}
                className="bg-brand-blue-900/50 hover:bg-brand-blue-900 text-stone-100 hover:text-white border border-brand-blue-800 font-semibold px-6 py-3 rounded-lg text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Calculadora de Materiales</span>
              </button>
            </div>
          </div>

          {/* Value cards Grid column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-5 hover:border-brand-orange-500/30 transition-all group">
              <div className="bg-brand-orange-600/10 text-brand-orange-500 p-2.5 rounded-lg w-fit group-hover:bg-brand-orange-600/20 transition-all">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mt-4 mb-1.5 font-display text-white">Surtido Directo a Obra</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Flotilla propia para entregas rápidas y seguras en tu domicilio o zona de construcción.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-5 hover:border-brand-orange-500/30 transition-all group">
              <div className="bg-brand-orange-600/10 text-brand-orange-500 p-2.5 rounded-lg w-fit group-hover:bg-brand-orange-600/20 transition-all">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mt-4 mb-1.5 font-display text-white">Precios Especiales</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Descuentos por volumen y precios de mayoreo para contratistas, albañiles e ingenieros.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-5 hover:border-brand-orange-500/30 transition-all group">
              <div className="bg-brand-orange-600/10 text-brand-orange-500 p-2.5 rounded-lg w-fit group-hover:bg-brand-orange-600/20 transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mt-4 mb-1.5 font-display text-white">Cotizador Formal</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Genera cotizaciones oficiales con desglose de IVA y validez legal en menos de un minuto.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-5 hover:border-brand-orange-500/30 transition-all group">
              <div className="bg-brand-orange-600/10 text-brand-orange-500 p-2.5 rounded-lg w-fit group-hover:bg-brand-orange-600/20 transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mt-4 mb-1.5 font-display text-white">Calidad Garantizada</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Solo distribuimos marcas líderes con amplias garantías directo de fábrica.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
