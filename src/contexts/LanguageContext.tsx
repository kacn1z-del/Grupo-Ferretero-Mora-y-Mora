import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

export type LanguageCode = "es" | "en" | "bri" | "cab" | "ngo" | "mal" | "bru" | "tel";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "es", name: "Español", nativeName: "Español", flag: "🇨🇷" },
  { code: "en", name: "Inglés", nativeName: "English", flag: "🇺🇸" },
  { code: "bri", name: "Bribri", nativeName: "Bribri tã", flag: "🏹" },
  { code: "cab", name: "Cabécar", nativeName: "Kabékora", flag: "🍃" },
  { code: "ngo", name: "Ngöbe", nativeName: "Ngäbere", flag: "☀️" },
  { code: "mal", name: "Maleku", nativeName: "Maléku jaíca", flag: "🛶" },
  { code: "bru", name: "Brunca", nativeName: "Boruca rá", flag: "🎭" },
  { code: "tel", name: "Telire", nativeName: "Telire sã", flag: "🌋" }
];

// Pre-defined zero-latency translations dictionary for all core UI elements
const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  es: {
    // Header & Hero
    title: "Grupo Ferretero Mora y Mora",
    subtitle: "Surtido Completo y Cotizaciones Oficiales en Acosta y Vuelta de Jorco",
    searchPlaceholder: "Buscar productos por nombre, marca o especificación...",
    catalogTab: "Catálogo de Productos",
    calculatorsTab: "Calculadoras de Obra",
    cartTab: "Mi Carrito",
    adminPortal: "Portal Sucursales",
    locales: "Locales",
    schedule: "Horario",
    
    // Categories
    all: "Todos",
    all_categories: "Todas las Categorías",
    herramientas: "Herramientas",
    pinturas: "Pinturas",
    construccion: "Construcción",
    electricidad: "Electricidad",
    fontaneria: "Fontanería",

    // Product Card
    stockAvailable: "Disponibles",
    brand: "Marca",
    add_to_cart: "Agregar al Carrito",
    adding: "Agregando...",
    view_details: "Ver Detalles",
    specifications: "Especificaciones",
    no_results: "No se encontraron productos que coincidan con la búsqueda.",
    branch_distribution: "Distribución por Sucursal",
    photos_per_branch: "Fotos de Inventario Real por Sucursal",
    no_branch_photos: "No hay fotos reales cargadas para esta sucursal por el momento.",

    // Cart Section
    cart_title: "Carrito de Cotización",
    cart_empty: "Su carrito está vacío. Explore nuestro catálogo para agregar materiales.",
    customer_info: "Información del Cliente",
    customer_name: "Nombre Completo",
    company_name: "Empresa / Proyecto (Opcional)",
    phone: "Teléfono Celular",
    project_type: "Tipo de Obra",
    project_type_placeholder: "Ej: Remodelación de baño, casa nueva, tapias",
    delivery_type: "Método de Entrega / Retiro",
    pickup: "Retiro en Sucursal Seleccionada",
    delivery: "Envío a Domicilio",
    delivery_address: "Dirección Exacta del Proyecto",
    delivery_address_placeholder: "Provincia, cantón, distrito y detalles específicos...",
    subtotal: "Subtotal (Sin IVA)",
    iva: "Impuesto de Ventas (13% IVA)",
    flete: "Flete / Transporte de Materiales",
    total: "Total Estimado",
    generating: "Generando Cotización...",
    generate_quote: "Generar Cotización Oficial PDF",
    add_materials: "Agregue materiales para generar su cotización.",

    // Calculator Section
    calc_title: "Calculadoras Técnicas de Construcción",
    calc_subtitle: "Estime con precisión científica los materiales ideales para su proyecto",
    calc_paint: "Calculadora de Pintura",
    calc_concrete: "Calculadora de Concreto",
    calc_paint_desc: "Calcule los galones de pintura o cubetas Lanco y sellador requeridos para cubrir sus paredes.",
    calc_concrete_desc: "Calcule el volumen de concreto y los bultos de cemento Holcim, metros de arena, piedra y varillas requeridos.",
    wall_height: "Altura de Paredes (metros)",
    wall_length: "Largo de Paredes (metros)",
    coat_number: "Número de Manos (Sugerido: 2)",
    calculate: "Calcular Requerimientos",
    results: "Resultados Estimados",
    add_to_cart_all: "Agregar Todo al Carrito",
    concrete_length: "Largo (metros)",
    concrete_width: "Ancho (metros)",
    concrete_thickness: "Espesor (metros - Ej: 0.10 para contrapiso)",

    // Footer & Interactive Branches
    branches_title: "Nuestras Sucursales",
    branches_subtitle: "Visítenos o contáctenos directamente para coordinar su entrega",
    principal_office: "Oficina Principal",
    call_direct: "Llamar Directo",
    whatsapp_express: "WhatsApp Express",
    contact_coordination: "Atención y Coordinación",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora S.A. Costa Rica. Todos los derechos reservados. Cédula Jurídica: 3-101-789456.",
    virtual_chat: "Asistente Virtual"
  },
  en: {
    title: "Mora y Mora Hardware Group",
    subtitle: "Complete Inventory & Official Quotations in Acosta and Vuelta de Jorco",
    searchPlaceholder: "Search products by name, brand, or specifications...",
    catalogTab: "Product Catalog",
    calculatorsTab: "Construction Calculators",
    cartTab: "My Cart",
    adminPortal: "Branch Portal",
    locales: "Branches",
    schedule: "Schedule",
    all: "All",
    all_categories: "All Categories",
    herramientas: "Tools",
    pinturas: "Paints",
    construccion: "Construction",
    electricidad: "Electricity",
    fontaneria: "Plumbing",
    stockAvailable: "Available",
    brand: "Brand",
    add_to_cart: "Add to Cart",
    adding: "Adding...",
    view_details: "View Details",
    specifications: "Specifications",
    no_results: "No products found matching your search.",
    branch_distribution: "Branch Distribution",
    photos_per_branch: "Real Inventory Photos per Branch",
    no_branch_photos: "No real photos uploaded for this branch at the moment.",
    cart_title: "Quotation Cart",
    cart_empty: "Your cart is empty. Explore our catalog to add materials.",
    customer_info: "Customer Information",
    customer_name: "Full Name",
    company_name: "Company / Project Name (Optional)",
    phone: "Cell Phone",
    project_type: "Project Type",
    project_type_placeholder: "e.g., Bathroom remodel, new house, retaining walls",
    delivery_type: "Delivery / Pickup Method",
    pickup: "Pickup at Selected Branch",
    delivery: "Home Delivery",
    delivery_address: "Exact Project Address",
    delivery_address_placeholder: "Province, canton, district, and specific directions...",
    subtotal: "Subtotal (Exc. Tax)",
    iva: "Sales Tax (13% VAT)",
    flete: "Shipping / Freight",
    total: "Estimated Total",
    generating: "Generating Quote...",
    generate_quote: "Generate Official PDF Quotation",
    add_materials: "Add materials to generate your quotation.",
    calc_title: "Technical Construction Calculators",
    calc_subtitle: "Accurately estimate the ideal materials for your project",
    calc_paint: "Paint Calculator",
    calc_concrete: "Concrete Calculator",
    calc_paint_desc: "Calculate the paint gallons or Lanco buckets and sealer required to cover your walls.",
    calc_concrete_desc: "Calculate the volume of concrete and the bags of Holcim cement, cubic meters of sand, stone, and rebars needed.",
    wall_height: "Wall Height (meters)",
    wall_length: "Wall Length (meters)",
    coat_number: "Number of Coats (Suggested: 2)",
    calculate: "Calculate Requirements",
    results: "Estimated Results",
    add_to_cart_all: "Add All to Cart",
    concrete_length: "Length (meters)",
    concrete_width: "Width (meters)",
    concrete_thickness: "Thickness (meters - e.g., 0.10 for subfloor)",
    branches_title: "Our Branches",
    branches_subtitle: "Visit us or contact us directly to coordinate your delivery",
    principal_office: "Main Office",
    call_direct: "Call Direct",
    whatsapp_express: "WhatsApp Express",
    contact_coordination: "Support & Coordination",
    footer_text: "© 2026 Mora y Mora Hardware Group S.A. Costa Rica. All rights reserved. Trade ID: 3-101-789456.",
    virtual_chat: "Virtual Assistant"
  },
  bri: {
    // Bribri Language
    title: "Mora y Mora ú kə̱́l tso'",
    subtitle: "Surtido dshí kãmí e sũwé̱ dika Acosta e Vuelta de Jorco kí",
    searchPlaceholder: "Sũwé̱ íyi kə̀l kië, klãtã tã...",
    catalogTab: "Íyi kə̱́l u sũwé̱",
    calculatorsTab: "Ú klãtã sũwé̱",
    cartTab: "Ye' íkã nã́",
    adminPortal: "Ú tso' klãtã sũwé̱",
    locales: "Ú tso'",
    schedule: "Ká̱ kə̱́l",
    all: "Dshí mɨ́",
    all_categories: "Dshí íyi tã",
    herramientas: "Kã̀ kə̱́l (Herramientas)",
    pinturas: "Shkã̀ (Pinturas)",
    construccion: "Ú klãtã kə̀l",
    electricidad: "Íyi dika (Luz)",
    fontaneria: "Di' kə̀l (Agua)",
    stockAvailable: "Kãmí tso'",
    brand: "Klãtã",
    add_to_cart: "Kua' ye' nã́ kĩ",
    adding: "Kuá'mí...",
    view_details: "Sũwé̱ dshí",
    specifications: "Dshí dika",
    no_results: "Íyi tso' kã kə̱ tẽ̀.",
    branch_distribution: "Ú tso' sũwé̱",
    photos_per_branch: "Sẽrẽ́ tsì kã kĩ ú tso' kĩ",
    no_branch_photos: "Sẽrẽ́ tsì kã kĩ kẽ̀ tẽ̀.",
    cart_title: "Ye' íkã nã́ sũwé̱",
    cart_empty: "Ye' íkã nã́ sɨrke. Kua' sũwé̱ tã.",
    customer_info: "Sẽrẽ́ kië sũwé̱",
    customer_name: "Ká̱ kië dshí tã",
    company_name: "Kã̀ tso' / Ú klãtã",
    phone: "Ñã̀kië dika (Teléfono)",
    project_type: "Kã̀ ú dika",
    project_type_placeholder: "Ej: Ú pɨ̃́, ú kə̀l tɨ́y...",
    delivery_type: "Íyi dshí kua'mí",
    pickup: "Retiro ú tso' se' sũwé̱ kĩ",
    delivery: "Kua' se' ú kĩ",
    delivery_address: "Ú dshí tso' dika",
    delivery_address_placeholder: "Provincia, cantón, distrito...",
    subtotal: "Subtotal",
    iva: "IVA (13%)",
    flete: "Flete / Ú nã́ dika",
    total: "Total Estimado",
    generating: "Klãtã dshí sũwé̱...",
    generate_quote: "Generar Cotización PDF",
    add_materials: "Kua' íyi se' nã́ kĩ.",
    calc_title: "Ú klãtã sũwé̱ kə̱́l",
    calc_subtitle: "Estime con precisión científica los materiales",
    calc_paint: "Shkã̀ sũwé̱",
    calc_concrete: "Cemento / Piedra sũwé̱",
    calc_paint_desc: "Calcule los galones de pintura o cubetas Lanco y sellador requeridos.",
    calc_concrete_desc: "Calcule cemento Holcim, piedra, arena y varillas.",
    wall_height: "Altura (metros)",
    wall_length: "Largo (metros)",
    coat_number: "Manos (Sugerido: 2)",
    calculate: "Sũwé̱ kə̱́l",
    results: "Resultados",
    add_to_cart_all: "Kua' dshí ye' nã́ kĩ",
    concrete_length: "Largo (metros)",
    concrete_width: "Ancho (metros)",
    concrete_thickness: "Espesor (metros)",
    branches_title: "Se' ú tso'",
    branches_subtitle: "Visítenos o contáctenos directamente",
    principal_office: "Ú tso' Acosta Norte",
    call_direct: "Llamar Directo",
    whatsapp_express: "WhatsApp Express",
    contact_coordination: "Atención y Coordinación",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora S.A. Costa Rica. Sa' ñã kã dshí tã.",
    virtual_chat: "Martina (Virtual)"
  },
  cab: {
    // Cabécar Language
    title: "Mora y Mora ju kshán tso'",
    subtitle: "Ju kshán íyi tã ju Acosta ju Vuelta de Jorco kĩ",
    searchPlaceholder: "Sá ju kshán íyi kië...",
    catalogTab: "Íyi tã ju kshán",
    calculatorsTab: "Ju kshán sũwé̱",
    cartTab: "Sá ju kshí",
    adminPortal: "Ju kshán dika",
    locales: "Ju tso'",
    schedule: "Ká̱ kə̱́l",
    all: "Dshí tã",
    all_categories: "Dshí tã ju kshán",
    herramientas: "Ju kshán (Herramientas)",
    pinturas: "Tsá (Pinturas)",
    construccion: "Ju kshán dika",
    electricidad: "Ju luz kshán",
    fontaneria: "Diju (Agua)",
    stockAvailable: "Kãmí tso'",
    brand: "Klãtã",
    add_to_cart: "Ju' sá kshí kĩ",
    adding: "Agregando...",
    view_details: "Sũwé̱ details",
    specifications: "Dshí dika",
    no_results: "Kẽ̀ tẽ̀ íyi tso' kã.",
    branch_distribution: "Ju tso' sũwé̱",
    photos_per_branch: "Fotos ju tso' kĩ",
    no_branch_photos: "No fotos ju kĩ por el momento.",
    cart_title: "Sá ju kshí sũwé̱",
    cart_empty: "Sá ju kshí está vacío.",
    customer_info: "Sẽrẽ́ kië sũwé̱",
    customer_name: "Ká̱ kië",
    company_name: "Empresa",
    phone: "Teléfono",
    project_type: "Ju kshán dika",
    project_type_placeholder: "Ej: Ju remodelación, ju nuevo...",
    delivery_type: "Método entrega",
    pickup: "Retiro ju kĩ",
    delivery: "Envío ju dshí kĩ",
    delivery_address: "Ju exacto",
    delivery_address_placeholder: "Dirección...",
    subtotal: "Subtotal",
    iva: "IVA (13%)",
    flete: "Flete / Transporte",
    total: "Total Estimado",
    generating: "Cotización sũwé̱...",
    generate_quote: "Generar Cotización PDF",
    add_materials: "Agregue materiales.",
    calc_title: "Ju kshán sũwé̱ kə̱́l",
    calc_subtitle: "Estime con precisión los materiales",
    calc_paint: "Tsá sũwé̱",
    calc_concrete: "Cemento sũwé̱",
    calc_paint_desc: "Calcule tsá y sellador Lanco.",
    calc_concrete_desc: "Calcule cemento, arena, piedra.",
    wall_height: "Altura (metros)",
    wall_length: "Largo (metros)",
    coat_number: "Manos (Sugerido: 2)",
    calculate: "Sũwé̱",
    results: "Resultados",
    add_to_cart_all: "Kua' dshí sá kshí kĩ",
    concrete_length: "Largo (metros)",
    concrete_width: "Ancho (metros)",
    concrete_thickness: "Espesor (metros)",
    branches_title: "Sá ju tso'",
    branches_subtitle: "Visítenos o contáctenos directamente",
    principal_office: "Ju Acosta Norte",
    call_direct: "Llamar Directo",
    whatsapp_express: "WhatsApp Express",
    contact_coordination: "Atención y Coordinación",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora S.A. Costa Rica. Sá jé jé.",
    virtual_chat: "Martina (Asistente)"
  },
  ngo: {
    // Ngöbe Language
    title: "Mora y Mora kri kran tso'",
    subtitle: "Dwen baka kran kwin ngäbe Acosta baka Vuelta de Jorco",
    searchPlaceholder: "Dwen baka tã kwin...",
    catalogTab: "Dwen baka kri kran",
    calculatorsTab: "Dwen baka kwin baka",
    cartTab: "Ji nã́ kwin",
    adminPortal: "Kri kran dika",
    locales: "Kri kran",
    schedule: "Kwin kə̱́l",
    all: "Tã mɨ́",
    all_categories: "Tã mɨ́ kri kran",
    herramientas: "Dwen baka (Herramientas)",
    paint: "Taka (Pintura)",
    pinturas: "Taka",
    construccion: "Ukri dika",
    electricidad: "Luz dika",
    fontaneria: "Ñö dika (Agua)",
    stockAvailable: "Kwin tso'",
    brand: "Brand",
    add_to_cart: "Kua' ji nã́ kĩ",
    adding: "Agregando...",
    view_details: "Sũwé̱",
    specifications: "Dshí dika",
    no_results: "Kẽ̀ tẽ̀ íyi tso'.",
    branch_distribution: "Kri kran sũwé̱",
    photos_per_branch: "Fotos kri kran",
    no_branch_photos: "No fotos.",
    cart_title: "Ji nã́ sũwé̱",
    cart_empty: "Ji nã́ kwin está vacío.",
    customer_info: "Kri tã kwin",
    customer_name: "Nombre",
    company_name: "Empresa",
    phone: "Teléfono",
    project_type: "Obra",
    project_type_placeholder: "Ej: Casa, baño...",
    delivery_type: "Entrega",
    pickup: "Retiro sucursal",
    delivery: "Envío domicilio",
    delivery_address: "Dirección",
    delivery_address_placeholder: "Dirección...",
    subtotal: "Subtotal",
    iva: "IVA",
    flete: "Flete",
    total: "Total",
    generating: "Generando...",
    generate_quote: "Cotización PDF",
    add_materials: "Agregue materiales.",
    calc_title: "Calculadoras",
    calc_subtitle: "Estime con precisión",
    calc_paint: "Taka sũwé̱",
    calc_concrete: "Cemento sũwé̱",
    calc_paint_desc: "Calcule pintura.",
    calc_concrete_desc: "Calcule cemento y arena.",
    wall_height: "Altura (m)",
    wall_length: "Largo (m)",
    coat_number: "Manos (2)",
    calculate: "Calcular",
    results: "Resultados",
    add_to_cart_all: "Agregar todo",
    concrete_length: "Largo (m)",
    concrete_width: "Ancho (m)",
    concrete_thickness: "Espesor (m)",
    branches_title: "Kri kran sucursales",
    branches_subtitle: "Visítenos o contáctenos",
    principal_office: "Acosta Norte Principal",
    call_direct: "Llamar Directo",
    whatsapp_express: "WhatsApp",
    contact_coordination: "Atención",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora. Kwin dshí tã.",
    virtual_chat: "Martina"
  },
  mal: {
    // Maleku Language
    title: "Mora y Mora u tón jaíca",
    subtitle: "U tón dwen baka Acosta dwen Vuelta de Jorco",
    searchPlaceholder: "U tón dwen kië...",
    catalogTab: "U tón catálogo",
    calculatorsTab: "Calculadoras",
    cartTab: "Sá u kshí",
    adminPortal: "Administrador",
    locales: "U tón",
    schedule: "Ká̱ kə̱́l",
    all: "Dwen tã",
    all_categories: "Categorías",
    herramientas: "Herramientas",
    pinturas: "Ní (Pinturas)",
    construccion: "U mará dika",
    electricidad: "Luz u tón",
    fontaneria: "Ti (Agua)",
    stockAvailable: "Kãmí tso'",
    brand: "Brand",
    add_to_cart: "Agregar",
    adding: "Adding...",
    view_details: "Ver",
    specifications: "Detalles",
    no_results: "No resultados.",
    branch_distribution: "Distribución",
    photos_per_branch: "Fotos u tón",
    no_branch_photos: "No fotos.",
    cart_title: "Carrito",
    cart_empty: "Carrito vacío.",
    customer_info: "Cliente",
    customer_name: "Nombre",
    company_name: "Empresa",
    phone: "Teléfono",
    project_type: "Obra",
    project_type_placeholder: "Ej: Casa...",
    delivery_type: "Entrega",
    pickup: "Retiro u tón",
    delivery: "Envío domicilio",
    delivery_address: "Dirección",
    delivery_address_placeholder: "Dirección...",
    subtotal: "Subtotal",
    iva: "IVA",
    flete: "Flete",
    total: "Total",
    generating: "Generando...",
    generate_quote: "Cotización",
    add_materials: "Agregue materiales.",
    calc_title: "Calculadoras",
    calc_subtitle: "Estime con precisión",
    calc_paint: "Ní sũwé̱",
    calc_concrete: "Cemento sũwé̱",
    calc_paint_desc: "Calcule ní.",
    calc_concrete_desc: "Calcule cemento.",
    wall_height: "Altura",
    wall_length: "Largo",
    coat_number: "Manos",
    calculate: "Calcular",
    results: "Resultados",
    add_to_cart_all: "Agregar todo",
    concrete_length: "Largo",
    concrete_width: "Ancho",
    concrete_thickness: "Espesor",
    branches_title: "U tón",
    branches_subtitle: "Visítenos",
    principal_office: "Acosta Norte Principal",
    call_direct: "Llamar",
    whatsapp_express: "WhatsApp",
    contact_coordination: "Atención",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora. Kapi kapi.",
    virtual_chat: "Martina"
  },
  bru: {
    // Brunca Language
    title: "Mora y Mora u rá boruca",
    subtitle: "U rá dwen baka Acosta rá Vuelta de Jorco",
    searchPlaceholder: "U rá search...",
    catalogTab: "U rá catálogo",
    calculatorsTab: "Calculadoras",
    cartTab: "Sá carrito",
    adminPortal: "Administrador",
    locales: "U rá",
    schedule: "Ká̱ kə̱́l",
    all: "Dshí tã",
    all_categories: "Categorías",
    herramientas: "Herramientas",
    pinturas: "Tsé (Pinturas)",
    construccion: "U construction",
    electricidad: "Luz u rá",
    fontaneria: "Di' (Agua)",
    stockAvailable: "Kãmí tso'",
    brand: "Brand",
    add_to_cart: "Agregar",
    adding: "Agregando...",
    view_details: "Ver",
    specifications: "Detalles",
    no_results: "No resultados.",
    branch_distribution: "Distribución",
    photos_per_branch: "Fotos u rá",
    no_branch_photos: "No fotos.",
    cart_title: "Carrito",
    cart_empty: "Carrito vacío.",
    customer_info: "Cliente",
    customer_name: "Nombre",
    company_name: "Empresa",
    phone: "Teléfono",
    project_type: "Obra",
    project_type_placeholder: "Ej: Casa...",
    delivery_type: "Entrega",
    pickup: "Retiro sucursal",
    delivery: "Envío domicilio",
    delivery_address: "Dirección",
    delivery_address_placeholder: "Dirección...",
    subtotal: "Subtotal",
    iva: "IVA",
    flete: "Flete",
    total: "Total",
    generating: "Generando...",
    generate_quote: "Cotización",
    add_materials: "Agregue materiales.",
    calc_title: "Calculadoras",
    calc_subtitle: "Estime con precisión",
    calc_paint: "Tsé sũwé̱",
    calc_concrete: "Cemento sũwé̱",
    calc_paint_desc: "Calcule tsé.",
    calc_concrete_desc: "Calcule cemento.",
    wall_height: "Altura",
    wall_length: "Largo",
    coat_number: "Manos",
    calculate: "Calcular",
    results: "Resultados",
    add_to_cart_all: "Agregar todo",
    concrete_length: "Largo",
    concrete_width: "Ancho",
    concrete_thickness: "Espesor",
    branches_title: "U rá sucursales",
    branches_subtitle: "Visítenos",
    principal_office: "Acosta Norte Principal",
    call_direct: "Llamar",
    whatsapp_express: "WhatsApp",
    contact_coordination: "Atención",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora. Ishi roríc.",
    virtual_chat: "Martina"
  },
  tel: {
    // Telire Language
    title: "Mora y Mora ú ñã telire",
    subtitle: "Surtido dshí kãmí Acosta e Vuelta de Jorco kí",
    searchPlaceholder: "Sũwé̱ íyi kə̀l...",
    catalogTab: "Íyi kə̱́l catálogo",
    calculatorsTab: "Calculadoras",
    cartTab: "Sá carrito",
    adminPortal: "Administrador",
    locales: "Ú ñã",
    schedule: "Ká̱ kə̱́l",
    all: "Dshí mɨ́",
    all_categories: "Categorías",
    herramientas: "Kã̀ kə̱́l (Herramientas)",
    pinturas: "Shkã̀ (Pinturas)",
    construccion: "Ú klãtã kə̀l",
    electricidad: "Íyi dika",
    fontaneria: "Di' kə̀l (Agua)",
    stockAvailable: "Kãmí tso'",
    brand: "Brand",
    add_to_cart: "Kua' carrito kĩ",
    adding: "Agregando...",
    view_details: "Sũwé̱ details",
    specifications: "Detalles",
    no_results: "No se encontraron productos.",
    branch_distribution: "Distribución sucursales",
    photos_per_branch: "Fotos ú ñã",
    no_branch_photos: "No fotos.",
    cart_title: "Sá carrito sũwé̱",
    cart_empty: "Sá carrito vacío.",
    customer_info: "Cliente",
    customer_name: "Nombre",
    company_name: "Empresa",
    phone: "Teléfono",
    project_type: "Obra",
    project_type_placeholder: "Ej: Casa...",
    delivery_type: "Entrega",
    pickup: "Retiro ú ñã kĩ",
    delivery: "Envío domicilio",
    delivery_address: "Dirección",
    delivery_address_placeholder: "Dirección...",
    subtotal: "Subtotal",
    iva: "IVA",
    flete: "Flete",
    total: "Total Estimado",
    generating: "Generando...",
    generate_quote: "Cotización PDF",
    add_materials: "Agregue materiales.",
    calc_title: "Calculadoras",
    calc_subtitle: "Estime con precisión",
    calc_paint: "Shkã̀ sũwé̱",
    calc_concrete: "Cemento sũwé̱",
    calc_paint_desc: "Calcule shkã̀.",
    calc_concrete_desc: "Calcule cemento.",
    wall_height: "Altura",
    wall_length: "Largo",
    coat_number: "Manos",
    calculate: "Calcular",
    results: "Resultados",
    add_to_cart_all: "Agregar todo",
    concrete_length: "Largo",
    concrete_width: "Ancho",
    concrete_thickness: "Espesor",
    branches_title: "Ú ñã",
    branches_subtitle: "Visítenos",
    principal_office: "Acosta Norte Principal",
    call_direct: "Llamar",
    whatsapp_express: "WhatsApp",
    contact_coordination: "Atención",
    footer_text: "© 2026 Grupo Ferretero Mora y Mora S.A. Sa' rraë.",
    virtual_chat: "Martina"
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultValue?: string) => string;
  translateProducts: (products: Product[]) => Promise<Product[]>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("moraymora_lang");
      return (saved as LanguageCode) || "es";
    } catch {
      return "es";
    }
  });

  const [productTranslationsCache, setProductTranslationsCache] = useState<Record<LanguageCode, Record<string, { name: string, description: string, category: string }>>>({
    es: {}, en: {}, bri: {}, cab: {}, ngo: {}, mal: {}, bru: {}, tel: {}
  });

  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("moraymora_lang", lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string, defaultValue?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return defaultValue || TRANSLATIONS["es"][key] || key;
  };

  // Helper to translate product catalog dynamically using the server-side proxy
  const translateProducts = async (products: Product[]): Promise<Product[]> => {
    if (language === "es") {
      return products;
    }

    // Check if we already have cache for all products in this language
    const langCache = productTranslationsCache[language];
    const missingProducts = products.filter(p => !langCache[p.id]);

    if (missingProducts.length === 0) {
      // Return fully translated products from cache
      return products.map(p => ({
        ...p,
        name: langCache[p.id].name,
        description: langCache[p.id].description,
        category: langCache[p.id].category,
      }));
    }

    setIsTranslating(true);
    try {
      // Gather unique texts to translate (name, description, category)
      const textsToTranslate: string[] = [];
      const mapping: { productId: string, field: "name" | "description" | "category" }[] = [];

      missingProducts.forEach(p => {
        textsToTranslate.push(p.name);
        mapping.push({ productId: p.id, field: "name" });

        textsToTranslate.push(p.description);
        mapping.push({ productId: p.id, field: "description" });

        textsToTranslate.push(p.category);
        mapping.push({ productId: p.id, field: "category" });
      });

      const langObj = LANGUAGES.find(l => l.code === language);
      const targetLangName = langObj ? langObj.name : "English";

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLang: targetLangName
        })
      });

      const data = await response.json();
      if (data.translatedTexts && Array.isArray(data.translatedTexts) && data.translatedTexts.length === textsToTranslate.length) {
        const newCache = { ...productTranslationsCache };
        const newLangCache = { ...newCache[language] };

        missingProducts.forEach(p => {
          if (!newLangCache[p.id]) {
            newLangCache[p.id] = { name: p.name, description: p.description, category: p.category };
          }
        });

        data.translatedTexts.forEach((translatedText: string, idx: number) => {
          const mapInfo = mapping[idx];
          if (mapInfo) {
            newLangCache[mapInfo.productId][mapInfo.field] = translatedText;
          }
        });

        newCache[language] = newLangCache;
        setProductTranslationsCache(newCache);

        setIsTranslating(false);
        return products.map(p => ({
          ...p,
          name: newLangCache[p.id]?.name || p.name,
          description: newLangCache[p.id]?.description || p.description,
          category: newLangCache[p.id]?.category || p.category,
        }));
      }
    } catch (e) {
      console.error("Failed to fetch translations:", e);
    }

    setIsTranslating(false);
    return products;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateProducts, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
