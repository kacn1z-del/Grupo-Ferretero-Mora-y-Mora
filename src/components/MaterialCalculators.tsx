/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calculator, BrickWall, Paintbrush, ArrowRight, ShoppingCart, Info, CheckCircle2 } from "lucide-react";
import { calcularConcreto, calcularPintura } from "../data";
import { Product } from "../types";

interface MaterialCalculatorsProps {
  onAddBulkToCart: (items: Array<{ product: Product; quantity: number }>) => void;
}

export default function MaterialCalculators({ onAddBulkToCart }: MaterialCalculatorsProps) {
  const [activeTab, setActiveTab] = React.useState<"concreto" | "pintura">("concreto");
  
  // --- STATE FOR CONCRETE CALCULATOR ---
  const [largoLosa, setLargoLosa] = React.useState<number>(6);
  const [anchoLosa, setAnchoLosa] = React.useState<number>(5);
  const [espesorLosa, setEspesorLosa] = React.useState<number>(10); // 10 cm por defecto
  const [concreteSuccess, setConcreteSuccess] = React.useState(false);

  // --- STATE FOR PAINT CALCULATOR ---
  const [anchoPared, setAnchoPared] = React.useState<number>(4);
  const [altoPared, setAltoPared] = React.useState<number>(2.7);
  const [murosCount, setMurosCount] = React.useState<number>(4);
  const [capasPintura, setCapasPintura] = React.useState<number>(2);
  const [paintSuccess, setPaintSuccess] = React.useState(false);

  // Run Concrete Calculations
  const espesorEnMetros = espesorLosa / 100;
  const concreteResult = calcularConcreto(largoLosa, anchoLosa, espesorEnMetros);

  // Run Paint Calculations
  const areaTotalParedes = anchoPared * altoPared * murosCount;
  const paintResult = calcularPintura(areaTotalParedes, capasPintura);

  const handleAddConcreteToCart = () => {
    const itemsToAdd = [
      { product: concreteResult.cementoSugerido, quantity: concreteResult.bultosCemento },
      { product: concreteResult.varillaSugerida, quantity: concreteResult.varillasEstimadas }
    ];
    onAddBulkToCart(itemsToAdd);
    setConcreteSuccess(true);
    setTimeout(() => setConcreteSuccess(false), 2000);
  };

  const handleAddPaintToCart = () => {
    // Sugerimos agregar la cubeta de 19L y un galón de sellador 5x1 para preparar muros
    // Buscamos el sellador acrílico en el catálogo
    const selladorProduct = concreteResult.cementoSugerido; // default fallback if not found
    // Encontramos el sellador real en el catálogo
    const actualPaint = paintResult.pinturaSugerida;
    
    // Suponemos que 1 cubeta de pintura rinde bastante, agregamos las cubetas calculadas
    const itemsToAdd = [
      { product: actualPaint, quantity: paintResult.cubetas19l }
    ];
    onAddBulkToCart(itemsToAdd);
    setPaintSuccess(true);
    setTimeout(() => setPaintSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden" id="calculators-container">
      {/* Header bar */}
      <div className="bg-brand-blue-900 text-white p-5 flex items-center space-x-3">
        <Calculator className="w-6 h-6 text-brand-orange-500" />
        <div>
          <h2 className="font-display font-extrabold text-lg leading-tight">
            Calculadora Profesional de Materiales de Obra
          </h2>
          <p className="text-stone-300 text-xs">
            Evita desperdicios. Estima las cantidades exactas y agrégalas a tu cotización oficial.
          </p>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="flex border-b border-stone-200 bg-stone-50">
        <button
          onClick={() => setActiveTab("concreto")}
          className={`flex-1 py-3 px-4 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "concreto"
              ? "border-brand-orange-600 text-brand-blue-950 bg-white"
              : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100"
          }`}
        >
          <BrickWall className="w-4 h-4 text-brand-orange-500" />
          <span>Firme y Losa (Cemento y Acero)</span>
        </button>
        <button
          onClick={() => setActiveTab("pintura")}
          className={`flex-1 py-3 px-4 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === "pintura"
              ? "border-brand-orange-600 text-brand-blue-950 bg-white"
              : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100"
          }`}
        >
          <Paintbrush className="w-4 h-4 text-brand-orange-500" />
          <span>Muros y Fachadas (Pintura Vinílica)</span>
        </button>
      </div>

      {/* Calculator Body */}
      <div className="p-6">
        
        {/* --- CONCRETE TAB --- */}
        {activeTab === "concreto" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Inputs Column */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="font-display font-bold text-stone-800 text-sm md:text-base border-b pb-2">
                Dimensiones de tu Firme o Losa
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Largo de la losa (metros)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={largoLosa}
                    onChange={(e) => setLargoLosa(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Ancho de la losa (metros)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={anchoLosa}
                    onChange={(e) => setAnchoLosa(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Espesor o grosor (centímetros)
                  </label>
                  <select
                    value={espesorLosa}
                    onChange={(e) => setEspesorLosa(parseInt(e.target.value))}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50"
                  >
                    <option value={8}>8 cm (Patios peatonales / banquetas)</option>
                    <option value={10}>10 cm (Firme residencial estándar)</option>
                    <option value={12}>12 cm (Losa de entrepiso estándar)</option>
                    <option value={15}>15 cm (Cocheras o tránsito ligero)</option>
                    <option value={20}>20 cm (Tránsito pesado / bodegas)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-normal">
                  Este cálculo emplea una proporción estándar de resistencia de concreto estructural de obra <strong>f&apos;c = 210 kg/cm²</strong> (apropiada para losas estructurales y firmes de carga en Costa Rica). Las varillas se estiman con un armado de cuadrícula a cada 20cm con traslapes y amarres (+15% de merma de seguridad).
                </p>
              </div>
            </div>

            {/* Outputs Column */}
            <div className="md:col-span-7 bg-stone-50/70 border border-stone-200/80 rounded-xl p-5 md:p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                  Resultados Estimados de Materiales
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Volumen Total</span>
                    <span className="text-xl font-mono font-extrabold text-stone-900">
                      {concreteResult.volumenM3} m³
                    </span>
                    <span className="text-[9px] text-stone-500 block">de concreto requerido</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Cemento Gris</span>
                    <span className="text-xl font-mono font-extrabold text-brand-orange-600">
                      {concreteResult.bultosCemento} Bultos
                    </span>
                    <span className="text-[9px] text-stone-500 block">de cemento de 50kg</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Varilla 3/8&quot;</span>
                    <span className="text-xl font-mono font-extrabold text-brand-blue-900">
                      {concreteResult.varillasEstimadas} Varillas
                    </span>
                    <span className="text-[9px] text-stone-500 block">tramos de 12 metros</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Agregados Pétreos</span>
                    <span className="text-sm font-mono font-bold text-stone-800 block mt-1">
                      Arena: {concreteResult.toneladasArena} Ton.
                    </span>
                    <span className="text-sm font-mono font-bold text-stone-800 block">
                      Grava: {concreteResult.toneladasGrava} Ton.
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-200 pt-4">
                  <p className="text-xs text-stone-600 font-semibold mb-2">
                    Productos recomendados listos para surtir:
                  </p>
                  <div className="flex items-center justify-between text-xs bg-white border border-stone-200/60 rounded-lg p-2.5">
                    <span className="font-semibold text-stone-800">{concreteResult.cementoSugerido.name}</span>
                    <span className="font-mono font-bold text-stone-900">₡{concreteResult.cementoSugerido.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })} c/u</span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white border border-stone-200/60 rounded-lg p-2.5">
                    <span className="font-semibold text-stone-800">{concreteResult.varillaSugerida.name}</span>
                    <span className="font-mono font-bold text-stone-900">₡{concreteResult.varillaSugerida.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })} c/u</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAddConcreteToCart}
                  disabled={concreteSuccess}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    concreteSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-orange-600 hover:bg-brand-orange-700 text-white hover:scale-101"
                  }`}
                >
                  {concreteSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Materiales recomendados añadidos al carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Añadir {concreteResult.bultosCemento} Cemento y {concreteResult.varillasEstimadas} Varillas al Carrito</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* --- PAINT TAB --- */}
        {activeTab === "pintura" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Inputs Column */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="font-display font-bold text-stone-800 text-sm md:text-base border-b pb-2">
                Área de Muros a Pintar
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Largo de muro (m)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      value={anchoPared}
                      onChange={(e) => setAnchoPared(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Alto de muro (m)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      step="0.1"
                      value={altoPared}
                      onChange={(e) => setAltoPared(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Número de muros
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={murosCount}
                      onChange={(e) => setMurosCount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Capas / Manos
                    </label>
                    <select
                      value={capasPintura}
                      onChange={(e) => setCapasPintura(parseInt(e.target.value))}
                      className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:border-brand-orange-500 bg-stone-50"
                    >
                      <option value={1}>1 capa (Mantenimiento leve)</option>
                      <option value={2}>2 capas (Estándar recomendado)</option>
                      <option value={3}>3 capas (Cambio drástico de color)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-normal">
                  Cálculo basado en pintura de excelente calidad Lanco Maxima que rinde aproximadamente <strong>9 m² por litro</strong> a una sola mano sobre superficies con porosidad regular (repello liso o yeso).
                </p>
              </div>
            </div>

            {/* Outputs Column */}
            <div className="md:col-span-7 bg-stone-50/70 border border-stone-200/80 rounded-xl p-5 md:p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                  Materiales Estimados de Pintura
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Área de Superficie</span>
                    <span className="text-xl font-mono font-extrabold text-stone-900">
                      {areaTotalParedes.toFixed(2)} m²
                    </span>
                    <span className="text-[9px] text-stone-500 block">muros totales calculados</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Litros Totales</span>
                    <span className="text-xl font-mono font-extrabold text-stone-900">
                      {paintResult.litrosTotales} L
                    </span>
                    <span className="text-[9px] text-stone-500 block">de pintura necesarios</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs col-span-2">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase">Presentación Recomendada</span>
                    <span className="text-lg font-display font-extrabold text-brand-orange-600 block mt-1">
                      {paintResult.cubetas19l} Cubeta(s) de 19 Litros
                    </span>
                    <span className="text-[9px] text-stone-500">
                      O equivalente a {paintResult.galones4l} Galón(es) de 4 Litros
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-200 pt-4">
                  <p className="text-xs text-stone-600 font-semibold mb-2">
                    Pintura premium oficial en Mora y Mora:
                  </p>
                  <div className="flex items-center justify-between text-xs bg-white border border-stone-200/60 rounded-lg p-2.5">
                    <span className="font-semibold text-stone-800">{paintResult.pinturaSugerida.name}</span>
                    <span className="font-mono font-bold text-stone-900">₡{paintResult.pinturaSugerida.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })} c/u</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAddPaintToCart}
                  disabled={paintSuccess}
                  className={`w-full py-3 px-4 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    paintSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-orange-600 hover:bg-brand-orange-700 text-white hover:scale-101"
                  }`}
                >
                  {paintSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Pintura recomendada añadida al carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Añadir {paintResult.cubetas19l} Cubeta(s) de Pintura al Carrito</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
