/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShoppingCart, Trash2, Plus, Minus, FileText, ChevronLeft, User, Mail, Phone, MapPin, Building, ShieldCheck, Truck, ClipboardList } from "lucide-react";
import { CartItem, Product, QuotationRequest } from "../types";

interface CartSectionProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onGenerateQuote: (quote: QuotationRequest) => void;
  onBackToCatalog: () => void;
}

export default function CartSection({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onGenerateQuote,
  onBackToCatalog,
}: CartSectionProps) {
  // Form States
  const [customerName, setCustomerName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [cedula, setCedula] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [projectType, setProjectType] = React.useState("Residencial");
  const [notes, setNotes] = React.useState("");

  // Validation States
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStep, setSubmitStep] = React.useState("");

  // Subtotal calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const iva = subtotal * 0.13;
  const shippingThreshold = 150000; // Free shipping over ₡150,000
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 10000;
  const total = subtotal + iva + shippingCost;

  const handleValidate = () => {
    const tempErrors: Record<string, string> = {};
    if (!customerName.trim()) tempErrors.customerName = "El nombre del cliente es obligatorio.";
    if (!email.trim()) {
      tempErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Formato de correo inválido.";
    }
    if (!phone.trim()) {
      tempErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^\d{8}$/.test(phone.replace(/[\s-]+/g, ""))) {
      tempErrors.phone = "Deben ser 8 dígitos numéricos.";
    }
    if (!address.trim()) tempErrors.address = "La dirección de entrega es obligatoria.";
    
    if (cedula.trim() && !/^[0-9A-Z-]{9,15}$/i.test(cedula.trim())) {
      tempErrors.cedula = "Cédula física o jurídica con formato inválido (Ej. 1-1234-5678).";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) return;

    setIsSubmitting(true);
    setSubmitStep("Analizando stock de materiales...");

    setTimeout(() => {
      setSubmitStep("Desglosando I.V.A. e impuestos (13%)...");
      setTimeout(() => {
        setSubmitStep("Registrando folio oficial Mora y Mora...");
        setTimeout(() => {
          // Generate formal QuotationRequest
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          const currentYear = new Date().getFullYear();
          const quoteId = `COT-${currentYear}-${randomSuffix}`;
          
          const today = new Date();
          const expirationDate = new Date(today);
          expirationDate.setDate(today.getDate() + 15); // Valid for 15 days

          const formatDate = (date: Date) => {
            const d = date.getDate().toString().padStart(2, "0");
            const m = (date.getMonth() + 1).toString().padStart(2, "0");
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
          };

          const newQuote: QuotationRequest = {
            id: quoteId,
            customerName,
            companyName: companyName || undefined,
            cedula: cedula.toUpperCase() || undefined,
            email,
            phone,
            address,
            projectType,
            notes: notes || undefined,
            items: [...cart],
            subtotal,
            iva,
            shippingCost,
            total,
            createdAt: formatDate(today),
            validUntil: formatDate(expirationDate),
          };

          onGenerateQuote(newQuote);
          setIsSubmitting(false);
          setSubmitStep("");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6" id="empty-cart-view">
        <div className="bg-brand-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-brand-orange-100">
          <ShoppingCart className="w-8 h-8 text-brand-orange-600 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-stone-900 text-lg md:text-xl">
            Su cotizador de materiales está vacío
          </h3>
          <p className="text-stone-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Añada bultos de cemento, varillas de hierro, herramientas profesionales DeWalt o pinturas Lanco del catálogo para generar su cotización oficial con IVA desglosado.
          </p>
        </div>
        <div>
          <button
            onClick={onBackToCatalog}
            className="bg-brand-blue-900 hover:bg-brand-blue-950 text-white font-semibold py-2.5 px-6 rounded-lg text-xs md:text-sm transition-all shadow-md cursor-pointer"
          >
            Explorar Catálogo Interactivo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="cart-section-container">
      
      {/* LEFT: Items Table & Shipping Bar */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Back control */}
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center space-x-1.5 text-stone-500 hover:text-brand-blue-950 text-xs font-semibold cursor-pointer py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Continuar agregando productos</span>
        </button>

        <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-xs">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="font-display font-extrabold text-stone-950 text-base md:text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-orange-500" />
              <span>Lista de Materiales Seleccionados</span>
            </h2>
            <button
              onClick={onClearCart}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Lista</span>
            </button>
          </div>

          {/* Cart progress indicator */}
          <div className="mb-6 bg-stone-50 border border-stone-150 rounded-lg p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-stone-600 flex items-center gap-1">
                <Truck className="w-4 h-4 text-brand-orange-500" />
                Entrega gratis Acosta, Vuelta de Jorco y cercanías:
              </span>
              <span className="font-mono font-bold">
                {subtotal >= shippingThreshold ? "¡Alcanzada!" : `Faltan ₡${(shippingThreshold - subtotal).toLocaleString("es-CR", { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-orange-500 h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400">
              *En pedidos menores a ₡150,000.00 se cobrará un flete consolidado de ₡10,000.00.
            </p>
          </div>

          {/* Table list */}
          <div className="divide-y divide-stone-150">
            {cart.map((item) => {
              const rowTotal = item.product.price * item.quantity;
              return (
                <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Title & Brand */}
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase text-stone-400">
                      {item.product.brand} • {item.product.category}
                    </span>
                    <h4 className="text-sm font-semibold text-stone-900 leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Unidad: {item.product.unit} • ₡{item.product.price.toLocaleString("es-CR", { minimumFractionDigits: 2 })} c/u
                    </p>
                  </div>

                  {/* Quantity and Row total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 cursor-pointer"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Row price */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-sm font-mono font-bold text-stone-900 block">
                        ₡{rowTotal.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="text-[10px] text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* RIGHT: Totals Summary & Cotizar Form */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Price Calculations */}
        <div className="bg-brand-blue-950 text-white rounded-xl p-5 md:p-6 shadow-md border border-brand-blue-900">
          <h3 className="font-display font-bold text-sm md:text-base border-b border-brand-blue-900 pb-3 mb-4">
            Resumen de Presupuesto
          </h3>
          
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-stone-300">
              <span>Subtotal (Neto):</span>
              <span>
                ₡{subtotal.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CRC
              </span>
            </div>
            
            <div className="flex justify-between text-stone-300">
              <span>I.V.A. Trasladado (13%):</span>
              <span>
                ₡{iva.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CRC
              </span>
            </div>

            <div className="flex justify-between text-stone-300">
              <span>Flete / Envío a Obra:</span>
              <span>
                {shippingCost === 0 ? (
                  <strong className="text-emerald-400 font-bold font-sans uppercase">GRATIS</strong>
                ) : (
                  `₡${shippingCost.toLocaleString("es-CR", { minimumFractionDigits: 2 })} CRC`
                )}
              </span>
            </div>

            <div className="border-t border-brand-blue-900 pt-3 flex justify-between text-base font-extrabold text-white">
              <span className="font-sans">TOTAL ESTIMADO:</span>
              <span>
                ₡{total.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CRC
              </span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-xs">
          <h3 className="font-display font-extrabold text-stone-900 text-sm md:text-base border-b pb-3 mb-4 flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-brand-orange-500" />
            <span>Datos de Cotización</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer name */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Nombre de Contacto / Cliente *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ej. Ing. Carlos Mora"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full text-xs md:text-sm border rounded-lg pl-9 pr-3 py-2 focus:outline-none ${
                    errors.customerName ? "border-red-500 bg-red-50/10" : "border-stone-200 focus:border-brand-orange-500"
                  }`}
                />
              </div>
              {errors.customerName && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.customerName}</p>}
            </div>

            {/* Company & Cedula row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Empresa / Obra (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ej. Constructora Mora S.A."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-brand-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Cédula Física / Jurídica (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1-1234-5678"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  maxLength={15}
                  className={`w-full text-xs border rounded-lg px-3 py-2 focus:outline-none uppercase ${
                    errors.cedula ? "border-red-500 bg-red-50/10" : "border-stone-200 focus:border-brand-orange-500"
                  }`}
                />
                {errors.cedula && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.cedula}</p>}
              </div>
            </div>

            {/* Contact details row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="carlos@mora.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full text-xs border rounded-lg pl-9 pr-3 py-2 focus:outline-none ${
                      errors.email ? "border-red-500 bg-red-50/10" : "border-stone-200 focus:border-brand-orange-500"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Teléfono (8 dígitos) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="88885890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={12}
                    className={`w-full text-xs border rounded-lg pl-9 pr-3 py-2 focus:outline-none ${
                      errors.phone ? "border-red-500 bg-red-50/10" : "border-stone-200 focus:border-brand-orange-500"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.phone}</p>}
              </div>
            </div>

            {/* Surtido address */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Dirección Completa Surtido de Obra *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <input
                  type="text"
                  placeholder="Dirección, Barrio, Distrito, Acosta"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full text-xs md:text-sm border rounded-lg pl-9 pr-3 py-2 focus:outline-none ${
                    errors.address ? "border-red-500 bg-red-50/10" : "border-stone-200 focus:border-brand-orange-500"
                  }`}
                />
              </div>
              {errors.address && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.address}</p>}
            </div>

            {/* Project type */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Tipo de Obra / Proyecto
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full text-xs md:text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none bg-stone-50 font-medium"
              >
                <option value="Particular / Autoconstrucción">Particular / Autoconstrucción</option>
                <option value="Residencial Premium">Residencial Premium</option>
                <option value="Comercial / Oficinas">Comercial / Oficinas</option>
                <option value="Industrial / Nave Bodega">Industrial / Nave Bodega</option>
                <option value="Obra Pública Estatal">Obra Pública Estatal</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Notas especiales o condiciones de entrega (Opcional)
              </label>
              <textarea
                placeholder="Ej. Surtir por la mañana, requerimos camión con grúa para elevación, o indicar si se requiere factura fiscal de inmediato..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full text-xs border border-stone-200 rounded-lg p-3 focus:outline-none focus:border-brand-orange-500"
              />
            </div>

            <div className="pt-2">
              {isSubmitting ? (
                <div className="bg-brand-blue-900 text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-2 shadow-md">
                  <div className="w-5 h-5 border-2 border-brand-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-stone-200 font-mono">
                    {submitStep}
                  </span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold rounded-lg text-xs md:text-sm shadow-md cursor-pointer transition-all hover:scale-101 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Generar Cotización Oficial PDF</span>
                </button>
              )}
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
