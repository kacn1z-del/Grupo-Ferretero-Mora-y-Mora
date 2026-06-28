/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  User, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Percent, 
  FileText, 
  Briefcase, 
  Building, 
  FolderHeart, 
  Layers,
  GraduationCap,
  CalendarDays,
  ShoppingBag,
  Clock,
  Phone,
  Settings
} from "lucide-react";
import { QuotationRequest } from "../types";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  onSelectCategory: (catId: string) => void;
  onNavigateToCatalog: () => void;
  onNavigateToCalculators: () => void;
  quoteHistory: QuotationRequest[];
  onViewHistoryQuote: (quote: QuotationRequest) => void;
  userEmail?: string;
  onOpenAdminPortal: () => void;
}

export default function MenuDrawer({
  isOpen,
  onClose,
  categories,
  onSelectCategory,
  onNavigateToCatalog,
  onNavigateToCalculators,
  quoteHistory,
  onViewHistoryQuote,
  userEmail = "kchinchilla.pos@gmail.com",
  onOpenAdminPortal
}: MenuDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"menu" | "cuenta">("menu");
  
  // Track open states for expandable categories
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    productos: false,
    tiendas: false,
    ideas: false,
    promociones: false,
    accionSocial: false,
    unete: false,
  });

  // Nesting sub-sections like "Consejos"
  const [expandedSubSections, setExpandedSubSections] = React.useState<Record<string, boolean>>({
    consejos: false,
  });

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSubSection = (subSection: string) => {
    setExpandedSubSections(prev => ({
      ...prev,
      [subSection]: !prev[subSection]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" id="menu-drawer-portal">
      {/* Backdrop backdrop-blur-xs */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        id="menu-drawer-backdrop"
      />

      {/* Drawer Panel */}
      <div 
        className="relative flex-1 flex flex-col max-w-sm w-full bg-white h-full shadow-2xl transition-transform duration-300 ease-out z-50"
        id="menu-drawer-panel"
      >
        {/* Top Header Row with Close Button */}
        <div className="flex justify-between items-center px-4 py-3 bg-brand-blue-950 text-white border-b border-brand-blue-900">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-orange-500 uppercase">
              Mora y Mora Costa Rica
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-stone-300 hover:text-white hover:bg-brand-blue-900/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher - Exactly 50% / 50% width based on EPA mockup */}
        <div className="flex border-b border-stone-200 text-sm font-semibold select-none">
          <button
            onClick={() => setActiveTab("menu")}
            className={`w-1/2 py-3.5 text-center transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "menu"
                ? "text-sky-600 border-sky-600 font-bold bg-sky-50/20"
                : "text-stone-500 border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Menú</span>
          </button>
          <button
            onClick={() => setActiveTab("cuenta")}
            className={`w-1/2 py-3.5 text-center transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "cuenta"
                ? "text-sky-600 border-sky-600 font-bold bg-sky-50/20"
                : "text-stone-500 border-transparent hover:text-stone-800 hover:bg-stone-50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Cuenta</span>
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {activeTab === "menu" ? (
            /* ================= MENU TAB ================= */
            <div className="flex flex-col">
              
              {/* 1. Productos (Expandable) */}
              <div>
                <button
                  onClick={() => toggleSection("productos")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                    <strong>☰ Productos</strong>
                  </span>
                  {expandedSections.productos ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.productos && (
                  <div className="bg-stone-50/60 pl-6 pr-4 py-1 divide-y divide-stone-100/60 animate-fade-in text-[13px]">
                    <button
                      onClick={() => {
                        onSelectCategory("all");
                        onClose();
                      }}
                      className="w-full text-left py-2.5 text-stone-600 hover:text-sky-600 hover:pl-1 transition-all flex items-center gap-2"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      <span>Todos los Productos</span>
                    </button>
                    {categories.filter(c => c.id !== "all").map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onClose();
                        }}
                        className="w-full text-left py-2.5 text-stone-600 hover:text-sky-600 hover:pl-1 transition-all flex items-center gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Novedad */}
              <button
                onClick={() => {
                  onSelectCategory("all");
                  onNavigateToCatalog();
                  onClose();
                }}
                className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Novedad</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Nuevo
                </span>
              </button>

              {/* 3. Tiendas (Expandable) */}
              <div>
                <button
                  onClick={() => toggleSection("tiendas")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span>Tiendas</span>
                  </span>
                  {expandedSections.tiendas ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.tiendas && (
                  <div className="bg-stone-50/60 pl-6 pr-4 py-2.5 space-y-3.5 text-[12px] text-stone-600 leading-relaxed animate-fade-in border-b border-stone-100">
                    <div className="space-y-1">
                      <h5 className="font-bold text-brand-blue-950 text-xs">📍 Acosta Norte (Sucursal Principal)</h5>
                      <p className="text-stone-500">100m norte de la Clínica de la CCSS, San Ignacio.</p>
                      <div className="font-mono text-[11px] text-stone-700 space-y-0.5">
                        <p>📞 Teléfono: <a href="tel:24101515" className="font-semibold text-sky-600 hover:underline">2410-1515</a></p>
                        <p>💬 WhatsApp: <a href="https://wa.me/50660686454?text=Hola%20Mora%20y%20Mora%20Acosta%20Norte,%20solicito%20atención%20al%20cliente." target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:underline">+506 6068-6454</a></p>
                      </div>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-3 h-3" /> Lun-Sáb: 7:00am - 6:00pm
                      </span>
                    </div>
                    <div className="border-t border-stone-200/50 pt-2.5 space-y-1">
                      <h5 className="font-bold text-brand-blue-950 text-xs">📍 Sucursal Acosta Centro</h5>
                      <p className="text-stone-500">Frente al Parque Central de Acosta.</p>
                      <p className="text-[10px] text-stone-500 italic font-medium">(Consultas canalizadas por Acosta Norte)</p>
                    </div>
                    <div className="border-t border-stone-200/50 pt-2.5 space-y-1">
                      <h5 className="font-bold text-brand-blue-950 text-xs">📍 Sucursal Vuelta de Jorco</h5>
                      <p className="text-stone-500">Vuelta de Jorco, contiguo al supermercado Palí.</p>
                      <div className="font-mono text-[11px] text-stone-700 space-y-0.5">
                        <p>📞 Teléfonos: <a href="tel:24104848" className="font-semibold text-sky-600 hover:underline">2410-4848</a> / <a href="tel:24104747" className="font-semibold text-sky-600 hover:underline">2410-4747</a></p>
                        <p>💬 WhatsApp: <a href="https://wa.me/50687113034?text=Hola%20Mora%20y%20Mora%20Vuelta%20de%20Jorco,%20solicito%20atención%20al%20cliente." target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:underline">+506 8711-3034</a></p>
                      </div>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-3 h-3" /> Lun-Sáb: 7:00am - 6:00pm
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Ideas (Expandable - Nesting Consejos exactly like screenshot) */}
              <div>
                <button
                  onClick={() => toggleSection("ideas")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Ideas</span>
                  </span>
                  {expandedSections.ideas ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.ideas && (
                  <div className="bg-stone-50/80 pl-8 pr-4 py-1 divide-y divide-stone-200/40 text-[13px] text-stone-600 animate-fade-in border-b border-stone-100">
                    <div className="py-2.5 hover:text-sky-600 transition-colors cursor-pointer">
                      Novedades de Diseño
                    </div>
                    
                    {/* Nested Consejos */}
                    <div>
                      <button
                        onClick={() => toggleSubSection("consejos")}
                        className="w-full text-left py-2.5 flex items-center justify-between hover:text-sky-600 transition-colors"
                      >
                        <span>Consejos</span>
                        {expandedSubSections.consejos ? (
                          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                        )}
                      </button>
                      {expandedSubSections.consejos && (
                        <div className="pl-4 pb-2 space-y-2 text-[12px] text-stone-500 animate-fade-in">
                          <p className="hover:text-sky-600 cursor-pointer">• Guías de Cimentación Antisísmica</p>
                          <p className="hover:text-sky-600 cursor-pointer">• Preparación de Concreto f&apos;c 210</p>
                          <p className="hover:text-sky-600 cursor-pointer">• Aplicación y Dilución de Lanco Maxima</p>
                        </div>
                      )}
                    </div>

                    <div className="py-2.5 hover:text-sky-600 transition-colors cursor-pointer">
                      Hágalo usted mismo
                    </div>
                    <div className="py-2.5 hover:text-sky-600 transition-colors cursor-pointer">
                      Talleres de Bricolaje
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Promociones (Expandable) */}
              <div>
                <button
                  onClick={() => toggleSection("promociones")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <Percent className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>Promociones</span>
                  </span>
                  {expandedSections.promociones ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.promociones && (
                  <div className="bg-stone-50/80 pl-8 pr-4 py-1 divide-y divide-stone-200/40 text-[13px] text-stone-600 animate-fade-in border-b border-stone-100">
                    <div className="py-2.5 hover:text-emerald-600 font-semibold flex items-center justify-between cursor-pointer">
                      <span>Oportunidades de Obra</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full">-10%</span>
                    </div>
                    <div className="py-2.5 hover:text-red-600 font-bold flex items-center justify-between cursor-pointer">
                      <span>Liquidación</span>
                      <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-full">OUTLET</span>
                    </div>
                    <div className="py-2.5 hover:text-sky-600 cursor-pointer">Los más buscados</div>
                    <div className="py-2.5 hover:text-sky-600 cursor-pointer">Dinámicas del Mes</div>
                  </div>
                )}
              </div>

              {/* 6. Catálogo */}
              <button
                onClick={() => {
                  onSelectCategory("all");
                  onNavigateToCatalog();
                  onClose();
                }}
                className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Catálogo</span>
                </span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>

              {/* 7. Acción Social (Expandable) */}
              <div>
                <button
                  onClick={() => toggleSection("accionSocial")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <FolderHeart className="w-4 h-4 text-rose-500" />
                    <span>Acción Social</span>
                  </span>
                  {expandedSections.accionSocial ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.accionSocial && (
                  <div className="bg-stone-50/80 pl-8 pr-4 py-2 space-y-2 text-[12px] text-stone-600 animate-fade-in border-b border-stone-100">
                    <p>💚 <strong>Reforestación en Acosta:</strong> Campaña anual para sembrar árboles autóctonos en la cuenca de Acosta.</p>
                    <p>🤝 <strong>Apoyo Comunitario:</strong> Donaciones de cemento y materiales para reparación de escuelas locales.</p>
                  </div>
                )}
              </div>

              {/* 8. Preferidos */}
              <button
                onClick={() => {
                  onSelectCategory("all");
                  onNavigateToCatalog();
                  onClose();
                }}
                className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                  <span>Preferidos</span>
                </span>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </button>

              {/* 9. Únete al equipo (Expandable) */}
              <div>
                <button
                  onClick={() => toggleSection("unete")}
                  className="w-full text-left text-sky-600 font-medium py-3.5 px-5 text-[14px] flex items-center justify-between hover:bg-sky-50/40 transition-colors border-b border-stone-100"
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>Únete al equipo</span>
                  </span>
                  {expandedSections.unete ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  )}
                </button>
                {expandedSections.unete && (
                  <div className="bg-stone-50/80 pl-8 pr-4 py-2.5 space-y-2 text-[12px] text-stone-600 animate-fade-in border-b border-stone-100">
                    <p>💼 <strong>Bolsa de Empleo Acosta:</strong> Vacantes para asesores técnicos en tiendas y chóferes de reparto.</p>
                    <p>🎓 <strong>Pasantías Mora y Mora:</strong> Dirigido a estudiantes de administración y logística.</p>
                  </div>
                )}
              </div>

              {/* 10. Venta Empresas */}
              <div className="p-5 bg-brand-orange-50/30 border-t border-brand-orange-100/50">
                <div className="flex items-center gap-2 text-[14px] font-bold text-brand-orange-700">
                  <Building className="w-4.5 h-4.5" />
                  <span>Venta Empresas & Mayoreo</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Surtido completo, crédito comercial corporativo y entregas masivas en todo Acosta y San José.
                </p>
                <a 
                  href="https://wa.me/50660686454?text=Hola%20Mora%20y%20Mora%20Acosta,%20deseo%20información%20sobre%20ventas%20corporativas%20y%20mayoreo."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 px-3 py-1 bg-brand-orange-600 hover:bg-brand-orange-700 text-white rounded text-[11px] font-bold transition-colors"
                >
                  Contactar Asesor B2B
                </a>
              </div>

            </div>
          ) : (
            /* ================= CUENTA TAB ================= */
            <div className="p-5 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue-900 text-white flex items-center justify-center font-display font-black text-sm">
                  KC
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">{userEmail}</h4>
                  <p className="text-[10px] text-stone-500">Cliente de Acosta • Perfil Particular</p>
                </div>
              </div>

              {/* Admin Portal Fast Trigger */}
              <div className="bg-brand-orange-500/15 border border-brand-orange-500/35 rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-brand-orange-600 rounded-lg text-white">
                    <Settings className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="text-[11px] font-black text-brand-blue-950 uppercase tracking-tight">Portal de Colaboradores</h5>
                    <p className="text-[9px] text-stone-500 leading-normal">Acceso administrativo para Jorco, Acosta Centro y Acosta Norte.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenAdminPortal();
                    onClose();
                  }}
                  className="w-full text-center bg-brand-blue-950 hover:bg-brand-blue-900 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Abrir Panel de Control
                </button>
              </div>

              {/* Real persistent Quote History! */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Mis Cotizaciones Guardadas
                  </h4>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {quoteHistory.length}
                  </span>
                </div>

                {quoteHistory.length === 0 ? (
                  <div className="border border-dashed border-stone-300 rounded-lg p-5 text-center text-xs text-stone-400">
                    Aún no ha generado cotizaciones oficiales. Agregue artículos y complete el formulario en el carrito.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {quoteHistory.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          onViewHistoryQuote(q);
                          onClose();
                        }}
                        className="w-full text-left border border-stone-200/80 bg-white hover:bg-stone-50 rounded-lg p-2.5 transition-all flex justify-between items-center group cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-mono font-bold text-brand-blue-950 block">
                            {q.id}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            {q.createdAt} • {q.items.reduce((sum, i) => sum + i.quantity, 0)} arts.
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-extrabold text-stone-900 block">
                            ₡{q.total.toLocaleString("es-CR", { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[9px] text-brand-orange-500 group-hover:underline block font-semibold">
                            Ver PDF →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CR Configuration Context details */}
              <div className="space-y-3 border-t border-stone-200/80 pt-5">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configuración Regional</span>
                </h4>
                <div className="space-y-2 text-[11px] text-stone-600 leading-normal">
                  <p className="flex justify-between border-b border-stone-100 pb-1">
                    <span>Moneda de Cotización:</span>
                    <strong>Colón Costarricense (₡ CRC)</strong>
                  </p>
                  <p className="flex justify-between border-b border-stone-100 pb-1">
                    <span>Impuesto de Ley:</span>
                    <strong>13.00% I.V.A. (Hacienda CR)</strong>
                  </p>
                  <p className="flex justify-between border-b border-stone-100 pb-1">
                    <span>Área de Envío Autorizada:</span>
                    <strong>Acosta, Vuelta de Jorco y cercanías</strong>
                  </p>
                </div>
              </div>

              {/* Direct Fast Support */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3.5">
                <h5 className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-orange-600" />
                  <span>Central de Asistencia y Pedidos</span>
                </h5>
                
                {/* Acosta Support Sub-block */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-brand-orange-700 uppercase tracking-wider">📞 Acosta Norte (Oficina Principal)</p>
                  <div className="flex gap-1.5">
                    <a 
                      href="tel:24101515"
                      className="flex-1 text-center py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-[10px] font-semibold transition-colors font-mono"
                    >
                      Llamar 2410-1515
                    </a>
                    <a 
                      href="https://wa.me/50660686454?text=Hola%20Mora%20y%20Mora%20Acosta%20Norte,%20solicito%20atención%20para%20un%20pedido."
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold transition-colors font-mono"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Jorco Support Sub-block */}
                <div className="space-y-1.5 border-t border-stone-250/65 pt-3">
                  <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">📞 Sucursal Vuelta de Jorco</p>
                  <div className="flex gap-1.5">
                    <a 
                      href="tel:24104848"
                      className="flex-1 text-center py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-[10px] font-semibold transition-colors font-mono"
                    >
                      Llamar 2410-4848
                    </a>
                    <a 
                      href="https://wa.me/50687113034?text=Hola%20Mora%20y%20Mora%20Vuelta%20de%20Jorco,%20solicito%20atención%20para%20un%20pedido."
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold transition-colors font-mono"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Bottom Small info bar inside Drawer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 text-center text-[10px] text-stone-400">
          <p className="font-semibold text-stone-500">Grupo Ferretero Mora y Mora S.A.</p>
          <p className="mt-0.5">San Ignacio de Acosta, Costa Rica</p>
        </div>

      </div>
    </div>
  );
}
