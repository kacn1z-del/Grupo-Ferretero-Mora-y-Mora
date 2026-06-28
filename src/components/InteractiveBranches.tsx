import React from "react";
import { motion } from "motion/react";
import { MapPin, Phone, MessageSquare, Clock, ArrowRight, Compass, Heart, ShieldCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function InteractiveBranches() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<"acosta" | "acosta_norte" | "jorco">("acosta");
  const [crTime, setCrTime] = React.useState<string>("");
  const [isOpenNow, setIsOpenNow] = React.useState<boolean>(true);
  const [statusMessage, setStatusMessage] = React.useState<string>("");

  // Periodically calculate Costa Rica local time (GMT-6) and check opening status
  React.useEffect(() => {
    const calculateStatus = () => {
      // Costa Rica is GMT-6. Get UTC and subtract 6 hours.
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const crDate = new Date(utc - (3600000 * 6));

      const day = crDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = crDate.getHours();
      const min = crDate.getMinutes();
      const timeInMins = hour * 60 + min;

      // 7:00 AM is 420 mins. 6:00 PM is 1080 mins.
      const openingTime = 7 * 60;
      const closingTime = 18 * 60;

      const isSunday = day === 0;
      const isWithinHours = timeInMins >= openingTime && timeInMins < closingTime;
      const open = !isSunday && isWithinHours;

      setIsOpenNow(open);

      // Pretty print Costa Rica time
      const timeString = crDate.toLocaleTimeString("es-CR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true 
      });
      setCrTime(timeString);

      if (isSunday) {
        setStatusMessage(language === "en" ? "Closed Today Sunday • Open Monday at 7:00 AM" : "Cerrado hoy Domingo • Abrimos Mañana a las 7:00 AM");
      } else if (timeInMins < openingTime) {
        setStatusMessage(language === "en" ? "Not Open Yet • Opening Today at 7:00 AM" : `Aún Cerrado • Abrimos hoy a las 7:00 AM`);
      } else if (timeInMins >= closingTime) {
        const nextDayMsg = day === 6 ? (language === "en" ? "Monday at 7:00 AM" : "el Lunes a las 7:00 AM") : (language === "en" ? "Tomorrow at 7:00 AM" : "Mañana a las 7:00 AM");
        setStatusMessage(language === "en" ? `Closed • Opening ${nextDayMsg}` : `Cerrado • Abrimos ${nextDayMsg}`);
      } else {
        setStatusMessage(language === "en" ? `Open Now • Closes at 6:00 PM (Local time: ${timeString})` : `Abierto Ahora • Cierra a las 6:00 PM (Hora local: ${timeString})`);
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [language]);

  const branchData = {
    acosta: {
      name: "Acosta Centro",
      exactLocation: "Frente al Parque Central de Acosta, San Ignacio, San José, Costa Rica.",
      phones: [] as string[],
      whatsapp: "",
      whatsappLink: "",
      wazeLink: "https://waze.com/ul?q=Parque%20Central%20Acosta",
      gmapsLink: "https://maps.google.com/?q=Parque+Central+San+Ignacio+Acosta",
      description: "Sucursal ubicada estratégicamente frente al parque central. Por el momento no disponemos de líneas de atención directa exclusivas para este punto, por lo que toda la asistencia, presupuestos y coordinación de retiro en este local se gestionan a través de nuestra Oficina Principal en Acosta Norte.",
      specialty: "Surtido General y Retiro de Materiales"
    },
    acosta_norte: {
      name: "Acosta Norte (Principal)",
      exactLocation: "100 metros norte de la Clínica de la CCSS, San Ignacio de Acosta.",
      phones: ["2410-1515"],
      whatsapp: "+506 6068-6454",
      whatsappLink: "https://wa.me/50660686454?text=Hola%20Mora%20y%20Mora%20Acosta%20Norte,%20vengo%20del%20sitio%20web%20y%20deseo%20asistencia.",
      wazeLink: "https://waze.com/ul?q=Clinica%20CCSS%20Acosta",
      gmapsLink: "https://maps.google.com/?q=Clinica+CCSS+San+Ignacio+Acosta",
      description: "Nuestra oficina y sucursal principal. Cuenta con una completa exhibición de acabados, ferretería fina, un centro avanzado de pinturas Lanco computarizadas, y el patio principal de agregados pesados (cemento estructural Holcim, varillas, arena fina de río y piedra triturada).",
      specialty: "Surtido pesado, Pintura Computarizada e Hidráulica"
    },
    jorco: {
      name: "Vuelta de Jorco",
      exactLocation: "Vuelta de Jorco, contiguo al supermercado Palí, Acosta.",
      phones: ["2410-4848", "2410-4747"],
      whatsapp: "+506 8711-3034",
      whatsappLink: "https://wa.me/50687113034?text=Hola%20Mora%20y%20Mora%20Vuelta%20de%20Jorco,%20vengo%20del%20sitio%20web%20y%20deseo%20asistencia.",
      wazeLink: "https://waze.com/ul?q=Pali%20Vuelta%20de%20Jorco",
      gmapsLink: "https://maps.google.com/?q=Pali+Vuelta+de+Jorco+Costa+Rica",
      description: "Nuestra sucursal dedicada a brindar cobertura a toda la comunidad de Vuelta de Jorco, ubicada de manera sumamente conveniente contiguo al supermercado Palí. Cuenta con un amplio inventario en plomería, grifería, iluminación, herramientas y bultos para construcción.",
      specialty: "Plomería, Grifería, Electricidad y Retiro en Sitio"
    }
  };

  const activeBranch = branchData[activeTab];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden" id="interactive-branches-panel">
      {/* Dynamic Status Ribbon */}
      <div className={`px-5 py-2.5 text-xs font-bold flex flex-col sm:flex-row justify-between items-center gap-2 transition-colors duration-500 ${
        isOpenNow 
          ? "bg-emerald-50 text-emerald-800 border-b border-emerald-100" 
          : "bg-amber-50 text-amber-800 border-b border-amber-100"
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isOpenNow ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
          <span className="font-display tracking-tight uppercase">{statusMessage}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] opacity-90">
          <Clock className="w-3.5 h-3.5" />
          <span>{t("hours_mon_sat", "Lunes a Sábado: 7:00 AM - 6:00 PM • Domingos Cerrado")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Branch selectors sidebar */}
        <div className="md:col-span-4 bg-stone-50 p-4 border-r border-stone-200/60 space-y-2 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-0">
          <div className="hidden md:block pb-2 mb-1">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t("branches_title", "Nuestras Sucursales")}</h4>
          </div>
          
          {(Object.keys(branchData) as Array<keyof typeof branchData>).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer shrink-0 md:shrink ${
                activeTab === tab
                  ? "bg-brand-blue-950 border-brand-blue-950 text-white shadow-xs font-bold"
                  : "bg-white border-stone-200 hover:border-brand-orange-500/30 text-stone-700 hover:bg-stone-50/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${activeTab === tab ? "text-brand-orange-500" : "text-stone-400"}`} />
                <div className="text-left">
                  <span className="text-xs font-black block leading-none">{branchData[tab].name}</span>
                  <span className={`text-[9px] block mt-1 ${activeTab === tab ? "text-stone-300" : "text-stone-500"}`}>
                    {tab === "jorco" ? t("sub_jorco", "Contiguo Supermercado Palí") : tab === "acosta_norte" ? t("sub_acosta_norte", "Oficina Principal") : t("sub_acosta", "San Ignacio Centro")}
                  </span>
                </div>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 hidden md:block transition-transform ${activeTab === tab ? "translate-x-1 text-brand-orange-500" : "text-stone-400"}`} />
            </button>
          ))}
        </div>

        {/* Selected Branch Content area */}
        <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] bg-brand-orange-100/50 text-brand-orange-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {t("specialty", "Especialidad")}: {activeBranch.specialty}
              </span>
              <h3 className="font-display font-black text-brand-blue-950 text-lg md:text-xl uppercase mt-2 tracking-tight">
                {activeBranch.name}
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {activeBranch.description}
            </p>

            <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-brand-orange-600 shrink-0 mt-0.5" />
                <p className="text-stone-700 leading-normal font-semibold">
                  {activeBranch.exactLocation}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-stone-200/50">
                {activeBranch.phones.length > 0 ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t("call_direct", "Llamar Directo")}</span>
                      {activeBranch.phones.map((phone, pIdx) => (
                        <a
                          key={pIdx}
                          href={`tel:${phone.replace("-", "")}`}
                          className="text-xs font-bold text-brand-blue-950 hover:text-brand-orange-600 flex items-center gap-1 font-mono transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-blue-950/70" />
                          {phone}
                        </a>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t("whatsapp_express", "WhatsApp Express")}</span>
                      <a
                        href={activeBranch.whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-mono transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        {activeBranch.whatsapp}
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5 col-span-2 bg-brand-orange-500/10 p-3 rounded-lg border border-brand-orange-500/20">
                    <span className="text-[9px] font-black text-brand-orange-700 uppercase tracking-wider block">📞 {t("attention_coordination", "Atención y Coordinación")}</span>
                    <p className="text-[11px] text-stone-600 leading-normal font-medium">
                      Para consultas de existencias, presupuestos o coordinar entregas/retiros en este local, por favor comuníquese con nuestra <strong>Oficina Principal (Acosta Norte)</strong> al teléfono <a href="tel:24101515" className="text-brand-blue-950 underline font-bold whitespace-nowrap">2410-1515</a> o al WhatsApp <a href="https://wa.me/50660686454" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-bold whitespace-nowrap">+506 6068-6454</a>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Map Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <a
              href={activeBranch.wazeLink}
              target="_blank"
              rel="noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm text-center shadow-md shadow-sky-500/15 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-101 active:scale-99"
            >
              <Compass className="w-4 h-4 fill-white/10" />
              {t("waze_navigate", "Navegar con Waze")} 🚘
            </a>
            <a
              href={activeBranch.gmapsLink}
              target="_blank"
              rel="noreferrer"
              className="bg-stone-900 hover:bg-stone-950 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm text-center shadow-md shadow-stone-900/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-101 active:scale-99"
            >
              <Compass className="w-4 h-4 text-brand-orange-500" />
              {t("gmaps_navigate", "Google Maps")} 🗺️
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
