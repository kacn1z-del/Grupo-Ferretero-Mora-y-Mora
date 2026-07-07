/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const PRODUCT_CATEGORIES = [
  { id: "all", name: "Todos los Productos", icon: "Boxes" },
  { id: "construccion", name: "Construcción", icon: "BrickWall" },
  { id: "herramientas", name: "Herramientas Eléctricas", icon: "Zap" },
  { id: "ferreteria", name: "Ferretería General", icon: "Hammer" },
  { id: "plomeria", name: "Plomería y Grifería", icon: "Droplet" },
  { id: "electricidad", name: "Electricidad", icon: "Lightbulb" },
  { id: "pintura", name: "Pinturas y Acabados", icon: "Paintbrush" },
];

export const BRANDS = [
  "Holcim",
  "ArcelorMittal",
  "DeWalt",
  "Makita",
  "Truper",
  "Lanco",
  "Sur",
  "Rotoplas",
  "Phelps Dodge",
  "Square D",
  "Stanley",
  "Urrea"
];

export const PRODUCTS: Product[] = [
  // --- CONSTRUCCIÓN ---
  {
    id: "const-01",
    name: "Cemento Gris Portland Holcim de 50kg",
    brand: "Holcim",
    category: "construccion",
    price: 5800.0, // Colones antes de IVA
    description: "Cemento gris de alta calidad Holcim, ideal para firmes, losas, columnas, vigas y cimientos. Brinda máxima resistencia y durabilidad sísmica adecuada para Costa Rica.",
    unit: "Bulto de 50kg",
    stock: 250,
    featured: true,
    specifications: {
      "Tipo": "Cemento Portland estructural",
      "Peso": "50 kg",
      "Norma": "Cumple con norma nacional INTE 06-11-02",
      "Rendimiento aprox.": "Aproximadamente 4 bultos por m³ de mezcla para firmes"
    }
  },
  {
    id: "const-02",
    name: "Varilla de Hierro Corrugado Grado 40 3/8\"",
    brand: "ArcelorMittal",
    category: "construccion",
    price: 4500.0,
    description: "Varilla corrugada de acero grado 40 de alta ductilidad. Indispensable para el refuerzo sísmico de estructuras de concreto como losas, vigas de corona y columnas.",
    unit: "Pieza (Tramo de 12m)",
    stock: 500,
    featured: true,
    specifications: {
      "Calibre/Diámetro": "3/8\" (Número 3)",
      "Largo estándar": "12 metros",
      "Grado": "Grado 40 estructural",
      "Límite de fluencia": "2,800 kg/cm²"
    }
  },
  {
    id: "const-03",
    name: "Mortero Holcim Listo para Sellar y Repellar",
    brand: "Holcim",
    category: "construccion",
    price: 4200.0,
    description: "Mortero prediseñado especialmente para trabajos de albañilería, pegado de block, repellados finos y rústicos con excelente trabajabilidad y mínima fisuración.",
    unit: "Bulto de 40kg",
    stock: 120,
    featured: false,
    specifications: {
      "Peso": "40 kg",
      "Uso recomendado": "Pegado de block, repellados e instalación de acabados",
      "Beneficio": "Menor desperdicio, alta retención de agua, solo agregue agua"
    }
  },
  {
    id: "const-04",
    name: "Malla Electrosoldada de Alta Resistencia 6x6 - 10/10",
    brand: "ArcelorMittal",
    category: "construccion",
    price: 17500.0,
    description: "Malla electrosoldada ideal para refuerzo de losas de concreto, pisos de cocheras, aceras y firmes estructurales de alto impacto.",
    unit: "Pliego (2.4m x 6.0m)",
    stock: 150,
    featured: true,
    specifications: {
      "Dimensiones": "2.40 x 6.00 metros",
      "Espesor": "Calibre 10 (10/10)",
      "Área de cobertura": "14.4 m²",
      "Uso": "Pisos de concreto, losas de entrepiso y fundaciones"
    }
  },
  {
    id: "const-05",
    name: "Arena de Río Limpia para Mezcla de Concreto",
    brand: "Mora y Mora",
    category: "construccion",
    price: 19500.0,
    description: "Arena de río fina de excelente calidad, completamente limpia y cernida. Indispensable para la preparación de mezclas de concreto estructural de alta resistencia.",
    unit: "Metro Cúbico (m³)",
    stock: 500,
    featured: false,
    specifications: {
      "Presentación": "Metro cúbico o porción a granel",
      "Origen": "Acosta, San José",
      "Calidad": "Cernida, libre de lodos y materia orgánica"
    }
  },
  {
    id: "const-06",
    name: "Piedra Cuarta Triturada de Alta Resistencia",
    brand: "Mora y Mora",
    category: "construccion",
    price: 21500.0,
    description: "Piedra triturada de tamaño medio (Piedra Cuarta). Ideal para mezclas de concreto estructural de alta resistencia, vigas sísmicas de fundación, columnas y losas de tránsito pesado.",
    unit: "Metro Cúbico (m³)",
    stock: 500,
    featured: false,
    specifications: {
      "Tamaño aproximado": "1/2\" a 3/4\"",
      "Presentación": "Metro cúbico a granel",
      "Uso principal": "Concreto estructural, columnas, vigas y cimientos fuertes"
    }
  },
  {
    id: "const-07",
    name: "Piedra Quintilla Triturada para Acabados Finos",
    brand: "Mora y Mora",
    category: "construccion",
    price: 22000.0,
    description: "Piedra triturada pequeña (Piedra Quintilla). Recomendada para prefabricados, losas de entrepiso delgadas, firmes residenciales de menor espesor y concretos con denso armado de acero.",
    unit: "Metro Cúbico (m³)",
    stock: 500,
    featured: false,
    specifications: {
      "Tamaño aproximado": "1/4\" a 3/8\"",
      "Presentación": "Metro cúbico a granel",
      "Uso principal": "Prefabricados, losas delgadas de entrepiso y repellos"
    }
  },

  // --- HERRAMIENTAS ELÉCTRICAS ---
  {
    id: "herr-01",
    name: "Rotomartillo Inalámbrico XR 20V Max de 1/2\"",
    brand: "DeWalt",
    category: "herramientas",
    price: 115000.0,
    description: "Rotomartillo y taladro inalámbrico profesional de alto rendimiento con motor sin carbones (Brushless). Incluye 2 baterías de 2.0 Ah, cargador rápido y maletín.",
    unit: "Pieza (Estuche completo)",
    stock: 25,
    featured: true,
    specifications: {
      "Voltaje": "20V Max",
      "Mandril": "1/2\" (13 mm) de metal",
      "Velocidad": "0-550 / 0-2000 RPM",
      "Golpes por minuto": "0-34,000 GPM",
      "Garantía": "3 años directamente con fabricante"
    }
  },
  {
    id: "herr-02",
    name: "Esmeriladora Angular Profesional 4-1/2\" 850W",
    brand: "Makita",
    category: "herramientas",
    price: 45000.0,
    description: "Esmeriladora compacta y ligera, ideal para corte y desbaste de metales, piedra y concreto. Mango ergonómico de 2 posiciones y guarda ajustable.",
    unit: "Pieza",
    stock: 40,
    featured: false,
    specifications: {
      "Potencia": "850 Watts",
      "Diámetro de disco": "4-1/2\" (115 mm)",
      "Velocidad sin carga": "11,000 RPM",
      "Eje": "5/8\" - 11 UNC",
      "Peso": "1.8 kg"
    }
  },
  {
    id: "herr-03",
    name: "Sierra Circular Industrial de 7-1/4\" 1800W",
    brand: "Truper",
    category: "herramientas",
    price: 65000.0,
    description: "Sierra circular industrial con potente motor montado sobre baleros de bolas. Ideal para cortes rectos e inclinados en madera con gran precisión en talleres.",
    unit: "Pieza",
    stock: 18,
    featured: true,
    specifications: {
      "Potencia": "1800 Watts (2.4 HP)",
      "Diámetro de hoja": "7-1/4\" (184 mm)",
      "Capacidad de biselado": "0° a 45°",
      "Velocidad": "5,500 RPM",
      "Incluye": "Disco de carburo de tungsteno de 24 dientes, guía paralela"
    }
  },

  // --- FERRETERÍA GENERAL ---
  {
    id: "ferr-01",
    name: "Carretilla Reforzada Caja Plástica de 80 Litros",
    brand: "Truper",
    category: "ferreteria",
    price: 38000.0,
    description: "Carretilla reforzada con caja de polietileno de alta densidad que no se deforma ni se oxida en climas húmedos. Llanta neumática reforzada de uso pesado.",
    unit: "Pieza",
    stock: 35,
    featured: false,
    specifications: {
      "Capacidad": "80 Litros (4.5 ft³)",
      "Material de caja": "Plástico HDPE reforzado con espesor de 3.9 mm",
      "Soportes": "Tirantes dobles de acero templado",
      "Llanta": "Neumática de 16\" x 4\" con rin de acero"
    }
  },
  {
    id: "ferr-02",
    name: "Flexómetro Profesional de Alta Resistencia 8m",
    brand: "Stanley",
    category: "ferreteria",
    price: 9500.0,
    description: "Cinta métrica con carcasa de ABS de alta resistencia a impactos recubierta de goma anti-deslizante. Cinta con recubrimiento Mylar que dura hasta 10 veces más.",
    unit: "Pieza",
    stock: 150,
    featured: false,
    specifications: {
      "Longitud": "8 metros (26 pies)",
      "Ancho de cinta": "1\" (25 mm)",
      "Escala": "Métrica y en pulgadas",
      "Destacado": "Freno rápido y gancho triple remache de alta precisión"
    }
  },
  {
    id: "ferr-03",
    name: "Juego de Llaves Combinadas Cromo Vanadio 12 Pzas",
    brand: "Truper",
    category: "ferreteria",
    price: 21000.0,
    description: "Set de llaves españolas combinadas milimétricas fabricadas en acero al cromo vanadio de alta dureza con acabado satinado anticorrosivo. Incluye estuche organizador.",
    unit: "Juego (12 piezas)",
    stock: 45,
    featured: false,
    specifications: {
      "Medidas incluidas": "6 mm, 7 mm, 8 mm, 9 mm, 10 mm, 11 mm, 12 mm, 13 mm, 14 mm, 15 mm, 17 mm y 19 mm",
      "Material": "Acero Cromo Vanadio (Cr-V)",
      "Tipo de boca": "Española y de estrías de 12 puntas"
    }
  },

  // --- PLOMERÍA Y GRIFERÍA ---
  {
    id: "plom-01",
    name: "Tanque Tricapa para Agua de 1100 Litros",
    brand: "Rotoplas",
    category: "plomeria",
    price: 145000.0,
    description: "Tanque tricapa con tecnología Expel que evita la reproducción de bacterias en el agua. Capa exterior beige que protege de rayos UV, ideal para intemperie en Acosta.",
    unit: "Pieza (Incluye accesorios de conexión)",
    stock: 15,
    featured: true,
    specifications: {
      "Capacidad": "1,100 Litros (Recomendado para 5 personas)",
      "Material": "Polietileno de grado alimenticio",
      "Diámetro": "1.10 metros",
      "Altura": "1.40 metros",
      "Accesorios": "Válvula de llenado, flotador, multiconector con llave de paso y filtro de sedimentos"
    }
  },
  {
    id: "plom-02",
    name: "Bomba Periférica Silenciosa para Agua de 1/2 HP",
    brand: "Truper",
    category: "plomeria",
    price: 29000.0,
    description: "Bomba de agua de alto rendimiento ideal para bombear agua limpia desde cisternas o tanques. Genera gran presión con un consumo eléctrico mínimo.",
    unit: "Pieza",
    stock: 30,
    featured: false,
    specifications: {
      "Potencia": "1/2 HP (370 Watts)",
      "Flujo máximo": "40 Litros por minuto",
      "Altura máxima de empuje": "40 metros",
      "Diámetro de entrada/salida": "1\" NPT hembra",
      "Embobinado": "Cobre de alta calidad para mayor vida útil"
    }
  },
  {
    id: "plom-03",
    name: "Grifería Monomando para Fregadero Acero Satinado",
    brand: "Urrea",
    category: "plomeria",
    price: 58000.0,
    description: "Monomando para cocina de cuello de ganso flexible de acero inoxidable. Acabado satinado resistente a la corrosión y manchas de agua. Control preciso de temperatura.",
    unit: "Pieza",
    stock: 22,
    featured: false,
    specifications: {
      "Material": "Cuerpo de latón macizo, cuello de acero inoxidable",
      "Acabado": "Satinado / Cepillado",
      "Presión de operación": "Baja, media y alta",
      "Cartucho": "Cerámico de alta durabilidad"
    }
  },

  // --- ELECTRICIDAD ---
  {
    id: "elec-01",
    name: "Cable de Cobre THW-LS Calibre 12 AWG (100m)",
    brand: "Phelps Dodge",
    category: "electricidad",
    price: 39000.0,
    description: "Rollo de cable conductor de cobre suave multifilar Phelps Dodge, aislado con PVC antiflama de baja emisión de humos. Ideal para instalaciones eléctricas seguras.",
    unit: "Rollo de 100 metros",
    stock: 80,
    featured: true,
    specifications: {
      "Calibre": "12 AWG",
      "Capacidad de corriente": "20 Amperes",
      "Aislamiento": "PVC calificado THW-LS, 600V",
      "Temperatura máx.": "75°C en ambientes húmedos, 90°C en secos",
      "Marca": "Phelps Dodge (calidad premium nacional)"
    }
  },
  {
    id: "elec-02",
    name: "Centro de Carga QO de Empotrar de 4 Circuitos",
    brand: "Square D",
    category: "electricidad",
    price: 18000.0,
    description: "Centro de carga metálico para empotrar, capacidad para 4 interruptores termomagnéticos tipo QO (enchufables). Ideal para distribución eléctrica residencial.",
    unit: "Pieza",
    stock: 50,
    featured: false,
    specifications: {
      "Capacidad de polos": "4 polos / espacios",
      "Corriente nominal": "100 Amperes máximos",
      "Fases": "Monofásico / Bifásico",
      "Montaje": "Para empotrar en pared de concreto o madera"
    }
  },

  // --- PINTURAS Y ACABADOS ---
  {
    id: "pint-01",
    name: "Pintura Acrílica Cubeta Lanco Maxima Blanca (5 Galones)",
    brand: "Lanco",
    category: "pintura",
    price: 78000.0,
    description: "Pintura acrílica premium Lanco de máxima resistencia a la intemperie, sol, humedad y hongos, ideal para el clima tropical. Excelente cubrimiento a dos manos.",
    unit: "Cubeta de 5 Galones",
    stock: 60,
    featured: true,
    specifications: {
      "Capacidad": "5 Galones (18.9 Litros)",
      "Acabado": "Mate / Satinado",
      "Lavabilidad": "Excelente resistencia (fórmula de silicona acrílica)",
      "Rendimiento teórico": "160 a 180 m² por cubeta a dos manos",
      "Uso recomendado": "Superficies exteriores e interiores de concreto, yeso, madera"
    }
  },
  {
    id: "pint-02",
    name: "Sellador Acrílico Concentrado Wall-Prep Lanco (1 Galón)",
    brand: "Lanco",
    category: "pintura",
    price: 14500.0,
    description: "Sellador base agua transparente concentrado para paredes. Sella los poros de superficies de concreto preparándolas adecuadamente para reducir la absorción de pintura.",
    unit: "Galón de 3.8 Litros",
    stock: 85,
    featured: false,
    specifications: {
      "Capacidad": "1 Galón",
      "Función": "Promueve la adherencia de pintura, evita soplados por alcalinidad",
      "Dilución": "Listo para usar o dilución leve con agua limpia",
      "Rendimiento": "Hasta 35 m² por galón según porosidad"
    }
  }
  {
    id: "pint-03",
    name: "Pintura Acrílica Cubeta Sur Master Blanca (5 Galones)",
    brand: "Sur",
    category: "pintura",
    price: 69500.0,
    description: "Pintura acrílica de alto rendimiento marca Sur, buena opción costo-beneficio para proyectos residenciales interiores y exteriores.",
    unit: "Cubeta de 5 Galones",
    stock: 40,
    featured: false,
    specifications: {
      "Capacidad": "5 Galones (18.9 Litros)",
      "Acabado": "Mate",
      "Rendimiento teórico": "150 a 170 m² por cubeta a dos manos",
      "Uso recomendado": "Superficies interiores y exteriores de concreto y repello"
    }
  },
  {
    id: "pint-04",
    name: "Pintura Acrílica Cubeta Lanco Maxima Gris Perla (5 Galones)",
    brand: "Lanco",
    category: "pintura",
    price: 79500.0,
    description: "Pintura acrílica premium Lanco en tono gris perla, misma fórmula de máxima resistencia a la intemperie de la línea Maxima.",
    unit: "Cubeta de 5 Galones",
    stock: 35,
    featured: false,
    specifications: {
      "Capacidad": "5 Galones (18.9 Litros)",
      "Acabado": "Mate / Satinado",
      "Lavabilidad": "Excelente resistencia (fórmula de silicona acrílica)",
      "Rendimiento teórico": "160 a 180 m² por cubeta a dos manos",
      "Uso recomendado": "Superficies exteriores e interiores de concreto, yeso, madera"
    }
  }
];

// --- CALCULADORAS DE MATERIALES ---

/**
 * Calcula la cantidad de botes o cubetas de pintura necesarias
 * @param area M² de la superficie a pintar
 * @param capas Cantidad de capas de pintura (default 2)
 * @returns { litros: number, cubetas19l: number, galones4l: number, productoSugerido: Product }
 */
export function calcularPintura(area: number, capas: number = 2, productoId: string = "pint-01") {
  // Un galón rinde aprox 35 m² por capa. Una cubeta (5 galones) rinde aprox 175 m² por capa.
  const rendimientoPorCubeta = 175;
  const cubetas19l = Math.max(1, Math.ceil((area * capas) / rendimientoPorCubeta));
  const galones4l = Math.max(1, Math.ceil((area * capas) / 35));

  const pinturaSugerida =
    PRODUCTS.find(p => p.id === productoId) ?? PRODUCTS.find(p => p.id === "pint-01")!;

  return {
    litrosTotales: parseFloat((area * capas * 0.11).toFixed(1)), // Estimado de litros aproximados (0.11 litros por m2)
    cubetas19l,
    galones4l,
    pinturaSugerida
  };
}

/**
 * Devuelve la lista de pinturas del catálogo que el cliente puede escoger
 * en la calculadora (excluye selladores y otros productos de preparación).
 */
export function getOpcionesDePintura(): Product[] {
  return PRODUCTS.filter(
    p => p.category === "pintura" && !p.name.toLowerCase().includes("sellador")
  );
}

/**
 * Calcula los materiales de concreto para una losa/firme
 * @param largo en metros
 * @param ancho en metros
 * @param espesor en metros (ej. 0.10 para 10cm)
 * @param tipoPiedra "cuarta" | "quintilla"
 * @param incluirMalla si requiere malla electrosoldada para losas de alto impacto
 * @returns { volumenM3: number, bultosCemento: number, metrosCubicosArena: number, metrosCubicosPiedra: number, pliegosMalla: number, cementoSugerido: Product, varillaSugerida: Product, arenaSugerida: Product, piedraSugerida: Product, mallaSugerida?: Product, varillasEstimadas: number }
 */
export function calcularConcreto(
  largo: number, 
  ancho: number, 
  espesor: number, 
  tipoPiedra: "cuarta" | "quintilla" = "cuarta",
  incluirMalla: boolean = false
) {
  const volumenM3 = parseFloat((largo * ancho * espesor).toFixed(2));
  const areaLosa = largo * ancho;
  
  // Para 1 m³ de concreto estructural en Costa Rica:
  // - Cemento: ~7.5 bultos de 50kg
  // - Arena de río: ~0.55 m³
  // - Piedra triturada: ~0.85 m³
  const bultosCemento = Math.ceil(volumenM3 * 7.5);
  const metrosCubicosArena = parseFloat(Math.max(0.5, volumenM3 * 0.55).toFixed(1));
  const metrosCubicosPiedra = parseFloat(Math.max(0.5, volumenM3 * 0.85).toFixed(1));
  
  // Estimación de malla electrosoldada: 1 pliego cubre 14.4 m2 (2.4m x 6m). Añadimos 15% por traslapes.
  const pliegosMalla = incluirMalla ? Math.ceil((areaLosa / 14.4) * 1.15) : 0;
  
  // Estimación de varillas de refuerzo en malla cuadricular de 20cm x 20cm
  const varillasEspacio = 0.20; // 20cm
  const varillasLargo = Math.ceil(largo / varillasEspacio) + 1;
  const varillasAncho = Math.ceil(ancho / varillasEspacio) + 1;
  const metrosVarillaLargo = varillasAncho * largo;
  const metrosVarillaAncho = varillasLargo * ancho;
  const varillasEstimadas = Math.ceil((metrosVarillaLargo + metrosVarillaAncho) / 12 * 1.15); // +15% desperdicio y amarres

  const cementoSugerido = PRODUCTS.find(p => p.id === "const-01")!;
  const varillaSugerida = PRODUCTS.find(p => p.id === "const-02")!;
  const arenaSugerida = PRODUCTS.find(p => p.id === "const-05")!;
  const piedraSugerida = PRODUCTS.find(p => p.id === (tipoPiedra === "quintilla" ? "const-07" : "const-06"))!;
  const mallaSugerida = PRODUCTS.find(p => p.id === "const-04")!;
  
  return {
    volumenM3,
    bultosCemento,
    metrosCubicosArena,
    metrosCubicosPiedra,
    pliegosMalla,
    varillasEstimadas,
    cementoSugerido,
    varillaSugerida,
    arenaSugerida,
    piedraSugerida,
    mallaSugerida
  };
}
