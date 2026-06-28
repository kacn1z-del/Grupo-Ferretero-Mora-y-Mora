/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Printer, Phone, Calendar, Mail, FileCheck, Copy, Check } from "lucide-react";
import { QuotationRequest } from "../types";
import { useLanguage } from "../contexts/LanguageContext";

interface QuoteModalProps {
  quote: QuotationRequest | null;
  onClose: () => void;
}

export default function QuoteModal({ quote, onClose }: QuoteModalProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!quote) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const textToCopy = `Cotización Mora y Mora Costa Rica: ${quote.id}\nCliente: ${quote.customerName}\nTotal: ₡${quote.total.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CRC\nVerifique sus detalles en línea.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSubtotal = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(quote.subtotal);

  const formattedIva = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(quote.iva);

  const formattedShipping = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(quote.shippingCost);

  const formattedTotal = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(quote.total);

  // Generate WhatsApp Direct link
  const itemsSummary = quote.items
    .map(it => `• ${it.quantity}x ${it.product.name} (${it.product.brand})`)
    .join("%0A");
  
  const entregaSurtidoInfo = quote.pickupBranch
    ? `*Retiro en Sucursal:* Mora y Mora ${quote.pickupBranch === "acosta_centro" ? "Acosta Centro" : quote.pickupBranch === "acosta" ? "Acosta Norte (Principal)" : "Vuelta de Jorco"}`
    : `*Envío a Domicilio:* ${quote.address}`;

  const waMessage = `Hola Grupo Ferretero Mora y Mora Costa Rica, solicito formalizar mi Cotización Oficial *${quote.id}*:%0A%0A*Cliente:* ${quote.customerName}%0A*Empresa:* ${quote.companyName || "N/A"}%0A*Teléfono:* ${quote.phone}%0A*Proyecto:* ${quote.projectType}%0A${entregaSurtidoInfo}%0A%0A*Artículos:*%0A${itemsSummary}%0A%0A*Subtotal:* ${formattedSubtotal}%0A*IVA (13%):* ${formattedIva}%0A*Envío / Flete:* ${formattedShipping}%0A*Total Estimado:* ${formattedTotal}%0A%0AFavor de indicarme los métodos de pago en Colones, depósito bancario y tiempos de entrega. ¡Muchas gracias!`;
  const waUrlAcosta = `https://wa.me/50660686454?text=${waMessage}`;
  const waUrlJorco = `https://wa.me/50687113034?text=${waMessage}`;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0" id="quote-modal-overlay">
      
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in print:shadow-none print:border-none print:max-h-none print:w-full">
        
        {/* Actions Bar (Hidden on print) */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-extrabold text-stone-800 text-sm md:text-base">
              {t("quoteSuccessTitle", "¡Cotización Generada Exitosamente!")}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 text-stone-600 hover:text-stone-950 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title={t("printTitle", "Imprimir documento")}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{t("print", "Imprimir")}</span>
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-2 text-stone-600 hover:text-stone-950 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title={t("copyTitle", "Copiar resumen")}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? t("copied", "Copiado") : t("copyFolio", "Copiar Folio")}</span>
            </button>

            {/* WhatsApp Branch Selectors */}
            <div className="flex items-center gap-1.5">
              <a
                href={waUrlAcosta}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title={t("sendAcostaTitle", "Enviar cotización a Sucursal Acosta")}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.198 1.485 4.85 1.485 5.47 0 9.917-4.417 9.92-9.845.002-2.628-1.02-5.101-2.88-6.963-1.858-1.861-4.328-2.885-6.957-2.887-5.483 0-9.93 4.418-9.933 9.848-.001 1.96.513 3.878 1.49 5.597l-.98 3.58 3.684-.966zm11.534-7.55c-.3-.15-1.772-.875-2.047-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.2-.6-1.95-1.05-2.725-2.375-.203-.35-.043-.544.131-.718.156-.156.3-.35.45-.525.07-.083.125-.162.175-.25.075-.15.037-.287-.018-.4-.056-.112-.475-1.15-.65-1.575-.171-.412-.345-.356-.475-.362-.122-.006-.263-.007-.402-.007-.139 0-.365.052-.556.262-.191.21-1.284 1.253-1.284 3.056s1.312 3.544 1.494 3.794c.182.25 2.583 3.944 6.257 5.531.874.378 1.557.602 2.087.771.878.279 1.678.24 2.312.145.706-.107 1.772-.725 2.022-1.425.25-.7 0-1.25-.1-1.375-.075-.125-.275-.2-.575-.35z" />
                </svg>
                <span className="hidden md:inline">{t("sendAcosta", "Enviar a Acosta")}</span>
                <span className="md:hidden">Acosta WA</span>
              </a>

              <a
                href={waUrlJorco}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title={t("sendJorcoTitle", "Enviar cotización a Sucursal Vuelta de Jorco")}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.464L0 24zm6.59-4.846c1.6.95 3.198 1.485 4.85 1.485 5.47 0 9.917-4.417 9.92-9.845.002-2.628-1.02-5.101-2.88-6.963-1.858-1.861-4.328-2.885-6.957-2.887-5.483 0-9.93 4.418-9.933 9.848-.001 1.96.513 3.878 1.49 5.597l-.98 3.58 3.684-.966zm11.534-7.55c-.3-.15-1.772-.875-2.047-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.2-.6-1.95-1.05-2.725-2.375-.203-.35-.043-.544.131-.718.156-.156.3-.35.45-.525.07-.083.125-.162.175-.25.075-.15.037-.287-.018-.4-.056-.112-.475-1.15-.65-1.575-.171-.412-.345-.356-.475-.362-.122-.006-.263-.007-.402-.007-.139 0-.365.052-.556.262-.191.21-1.284 1.253-1.284 3.056s1.312 3.544 1.494 3.794c.182.25 2.583 3.944 6.257 5.531.874.378 1.557.602 2.087.771.878.279 1.678.24 2.312.145.706-.107 1.772-.725 2.022-1.425.25-.7 0-1.25-.1-1.375-.075-.125-.275-.2-.575-.35z" />
                </svg>
                <span className="hidden md:inline">{t("sendJorco", "Enviar a Jorco")}</span>
                <span className="md:hidden">Jorco WA</span>
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable PDF Sheet Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white print:overflow-visible print:p-0" id="quote-printable-area">
          
          <div className="border border-stone-300 p-6 md:p-8 rounded-lg bg-white relative print:border-none">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="text-stone-900 border-[20px] border-stone-900 rounded-full p-24">
                <span className="text-8xl font-black font-display tracking-wider">MORA</span>
              </div>
            </div>

            {/* Brand Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b-2 border-stone-900 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-brand-blue-950">
                  GRUPO FERRETERO MORA Y MORA S.A.
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-1 font-bold">
                  CÉDULA JURÍDICA: 3-101-789456 • REGISTRO COMERCIAL NACIONAL
                </p>
                <div className="text-xs text-stone-600 mt-3 space-y-1.5 leading-normal">
                  <p><strong>• Oficina Principal (Acosta Norte):</strong> 100 metros norte de la Clínica de la CCSS, San Ignacio. Tel: 2410-1515 • WA: +506 6068-6454</p>
                  <p><strong>• Sucursal Acosta Centro:</strong> Frente al Parque Central, San Ignacio de Acosta. (Consultas canalizadas por Acosta Norte)</p>
                  <p><strong>• Sucursal Vuelta de Jorco:</strong> Vuelta de Jorco, contiguo al Supermercado Palí. Tels: 2410-4848 / 2410-4747 • WA: +506 8711-3034</p>
                  <p className="pt-1 text-brand-blue-950"><strong>Email Corporativo:</strong> ventas@ferreteriamoraymora.com • <strong>Sitio Oficial:</strong> www.ferreteriamoraymora.com</p>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-300 rounded-lg p-4 w-full md:w-64 text-right">
                <span className="text-[10px] font-bold text-brand-orange-600 uppercase tracking-wider block">
                  COTIZACIÓN OFICIAL
                </span>
                <span className="text-lg font-mono font-black text-brand-blue-950 block mt-0.5">
                  {quote.id}
                </span>
                <div className="text-xs text-stone-600 mt-2 space-y-1">
                  <p className="flex justify-between font-mono">
                    <span className="text-stone-400 font-sans">Fecha Emisión:</span>
                    <span className="font-semibold">{quote.createdAt}</span>
                  </p>
                  <p className="flex justify-between font-mono text-amber-800">
                    <span className="text-stone-400 font-sans">Vence el:</span>
                    <span className="font-bold">{quote.validUntil}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Client & Project Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs border-b border-stone-200 pb-6">
              <div>
                <h4 className="font-bold text-stone-400 uppercase tracking-wider mb-2">DATOS DEL CLIENTE</h4>
                <div className="space-y-1 text-stone-800 leading-normal">
                  <p className="text-sm font-bold text-brand-blue-950">{quote.customerName}</p>
                  {quote.companyName && <p><strong>Empresa:</strong> {quote.companyName}</p>}
                  {quote.cedula && <p className="font-mono"><strong>Cédula Física/Jurídica:</strong> {quote.cedula}</p>}
                  <p><strong>Email:</strong> {quote.email}</p>
                  <p><strong>Teléfono:</strong> {quote.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-400 uppercase tracking-wider mb-2">DETALLES DE ENTREGA / RETIRO</h4>
                <div className="space-y-1 text-stone-800 leading-normal">
                  <p><strong>Tipo de Obra:</strong> {quote.projectType}</p>
                  {quote.pickupBranch ? (
                    <>
                      <p className="text-brand-orange-600 font-bold">Retiro en Sucursal Seleccionada</p>
                      <p><strong>Sucursal Mora y Mora:</strong> {
                        quote.pickupBranch === "acosta_centro" ? "Acosta Centro" :
                        quote.pickupBranch === "acosta" ? "Acosta Norte (Principal)" : "Vuelta de Jorco"
                      }</p>
                      <p className="text-stone-500 text-[11px]">
                        📍 {
                          quote.pickupBranch === "acosta_centro" ? "Frente al Parque Central, San Ignacio de Acosta" :
                          quote.pickupBranch === "acosta" ? "100m norte de la Clínica de la CCSS, San Ignacio" :
                          "Vuelta de Jorco, contiguo al Supermercado Palí"
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-emerald-600 font-bold">Envío a Domicilio</p>
                      <p><strong>Dirección Surtido:</strong> {quote.address}</p>
                    </>
                  )}
                  {quote.notes && (
                    <p className="bg-stone-50 border border-stone-200 rounded-md p-2 text-stone-600 italic text-[11px] mt-1.5">
                      &ldquo;{quote.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b-2 border-stone-900 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 w-12">No.</th>
                    <th className="py-2.5">Descripción de Producto</th>
                    <th className="py-2.5 text-center w-20">Cant.</th>
                    <th className="py-2.5 text-center w-24">Unidad</th>
                    <th className="py-2.5 text-right w-28">P. Unitario</th>
                    <th className="py-2.5 text-right w-28">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => {
                    const rowPrice = item.product.price;
                    const rowTotal = rowPrice * item.quantity;
                    return (
                      <tr key={item.product.id} className="border-b border-stone-200 hover:bg-stone-50/50">
                        <td className="py-3 font-mono text-stone-500">{index + 1}</td>
                        <td className="py-3">
                          <p className="font-bold text-stone-900">{item.product.name}</p>
                          <span className="text-[10px] text-stone-400 font-bold uppercase">
                            Marca: {item.product.brand}
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="py-3 text-center text-stone-500">{item.product.unit}</td>
                        <td className="py-3 text-right font-mono">
                          {new Intl.NumberFormat("es-CR", {
                            style: "currency",
                            currency: "CRC",
                          }).format(rowPrice)}
                        </td>
                        <td className="py-3 text-right font-mono font-semibold">
                          {new Intl.NumberFormat("es-CR", {
                            style: "currency",
                            currency: "CRC",
                          }).format(rowTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary Block */}
            <div className="flex justify-end my-6 text-xs">
              <div className="w-full md:w-80 space-y-2 border-t border-stone-900 pt-4">
                <div className="flex justify-between font-mono">
                  <span className="text-stone-500">Subtotal (Neto):</span>
                  <span className="font-semibold text-stone-800">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-stone-500">I.V.A. Trasladado (13.00%):</span>
                  <span className="font-semibold text-stone-800">{formattedIva}</span>
                </div>
                <div className="flex justify-between font-mono border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Flete / Entrega en Obra:</span>
                  <span className="font-semibold text-stone-800">
                    {quote.shippingCost === 0 ? "GRATUITO" : formattedShipping}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-base font-extrabold text-brand-blue-950 pt-1">
                  <span>TOTAL ESTIMADO:</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-10 border-t border-stone-300 pt-6 text-[10px] text-stone-500 leading-normal">
              
              {/* Policies */}
              <div className="md:col-span-8 space-y-1">
                <p className="font-bold text-stone-700">TÉRMINOS Y CONDICIONES COMERCIALES:</p>
                <p>• Los precios expresados en esta cotización están sujetos a cambios sin previo aviso según fluctuaciones del mercado en Costa Rica.</p>
                <p>• Vigencia de cotización: 15 días naturales a partir de la fecha de emisión.</p>
                <p>• El surtido se liberará una vez acreditado el pago total vía transferencia bancaria en colones costarricenses (CRC).</p>
                <p>• Entregas a pie de camión en Acosta, Vuelta de Jorco y zonas aledañas. Maniobras de acarreo o elevación corren por cuenta del cliente.</p>
                <p>• Acosta y zonas vecinas: entrega gratis en compras mayores de ₡150,000.00. En caso menor, flete de ₡10,000.00.</p>
              </div>

              {/* Signatures */}
              <div className="md:col-span-4 flex flex-col justify-end items-center text-center pt-8 md:pt-0">
                <div className="w-40 border-b border-stone-400 mb-2" />
                <p className="font-bold text-stone-700 uppercase">Lic. Daniel Mora</p>
                <p className="text-stone-400">Dirección Comercial • Mora y Mora CR</p>
                <p className="text-stone-400 font-mono text-[8px] mt-1">Sello Digital: M&amp;M-CR-92015-DMC</p>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Footer (Hidden on Print) */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            {t("footerDudas", "Si tiene alguna duda, contáctenos: Acosta 2410-1515 • Jorco 2410-4848 con su número de Folio.")}
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {t("closeQuote", "Cerrar Cotización")}
          </button>
        </div>

      </div>
    </div>
  );
}
