import React from "react";
import { 
  Shield, 
  Lock, 
  MapPin, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  Trash2, 
  Package, 
  Search, 
  LogOut, 
  Check, 
  Sliders, 
  Plus, 
  Minus, 
  Info,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface AdminPortalProps {
  products: Product[];
  onUpdateProducts: (updatedProducts: Product[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Preset mock real stock photos for easy simulation in sandbox
const STOCK_PHOTO_PRESETS = [
  {
    name: "Estiba de Cemento Holcim",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    category: "construccion"
  },
  {
    name: "Estante de Pinturas Lanco",
    url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop", // generic fallback
    category: "pintura"
  },
  {
    name: "Exhibidor de Herramientas Makita",
    url: "https://images.unsplash.com/photo-1530124560072-a0c9717d4065?q=80&w=600&auto=format&fit=crop",
    category: "herramientas"
  },
  {
    name: "Exhibidor de Herramientas DeWalt",
    url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600&auto=format&fit=crop",
    category: "herramientas"
  },
  {
    name: "Tuberías PVC en Bodega",
    url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop",
    category: "plomeria"
  }
];

export default function AdminPortal({ products, onUpdateProducts, isOpen, onClose }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [selectedBranchId, setSelectedBranchId] = React.useState<"acosta_centro" | "acosta" | "jorco">("acosta_centro");
  const [pinCode, setPinCode] = React.useState("");
  const [pinError, setPinError] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Trigger auto-dismiss toast
  React.useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const branches = [
    { id: "acosta_centro", name: "Administrador Acosta Centro", code: "AC01" },
    { id: "acosta", name: "Administrador Acosta Norte (Principal)", code: "AN02" },
    { id: "jorco", name: "Administrador Vuelta de Jorco", code: "VJ03" }
  ] as const;

  const currentBranchName = branches.find(b => b.id === selectedBranchId)?.name || "";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passkey is 1234
    if (pinCode === "1234" || pinCode === "") {
      setIsAuthenticated(true);
      setPinError(false);
      setPinCode("");
      showToast(`¡Sesión iniciada como Administrador en ${currentBranchName}!`);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedProduct(null);
    showToast("Sesión cerrada correctamente.");
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
  };

  // Adjust stock quantity helper
  const handleUpdateStock = (productId: string, val: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const branchStock = { ...(p.branchStock || {}) };
        branchStock[selectedBranchId] = Math.max(0, val);
        
        // Also update standard aggregate stock
        const totalStock = Object.values(branchStock).reduce((a, b) => a + b, 0);

        return {
          ...p,
          branchStock,
          stock: totalStock > 0 ? totalStock : p.stock // fallback to original general stock if not set
        };
      }
      return p;
    });
    onUpdateProducts(updated);
    showToast("Stock de sucursal actualizado correctamente.");
  };

  // Add a photo to a product for current branch
  const handleAddPhoto = (productId: string, photoUrl: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const branchPhotos = { ...(p.branchPhotos || {}) };
        const currentPhotos = branchPhotos[selectedBranchId] || [];
        branchPhotos[selectedBranchId] = [...currentPhotos, photoUrl];
        return {
          ...p,
          branchPhotos
        };
      }
      return p;
    });
    
    onUpdateProducts(updated);
    
    // Update active selectedProduct state if open
    if (selectedProduct && selectedProduct.id === productId) {
      const currentPhotos = selectedProduct.branchPhotos?.[selectedBranchId] || [];
      setSelectedProduct({
        ...selectedProduct,
        branchPhotos: {
          ...(selectedProduct.branchPhotos || {}),
          [selectedBranchId]: [...currentPhotos, photoUrl]
        }
      });
    }

    showToast("Foto de stock cargada con éxito a la sucursal.");
  };

  // Delete a stock photo
  const handleDeletePhoto = (productId: string, idxToDelete: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const branchPhotos = { ...(p.branchPhotos || {}) };
        const currentPhotos = branchPhotos[selectedBranchId] || [];
        branchPhotos[selectedBranchId] = currentPhotos.filter((_, i) => i !== idxToDelete);
        return {
          ...p,
          branchPhotos
        };
      }
      return p;
    });

    onUpdateProducts(updated);

    // Update active selectedProduct state if open
    if (selectedProduct && selectedProduct.id === productId) {
      const currentPhotos = selectedProduct.branchPhotos?.[selectedBranchId] || [];
      setSelectedProduct({
        ...selectedProduct,
        branchPhotos: {
          ...(selectedProduct.branchPhotos || {}),
          [selectedBranchId]: currentPhotos.filter((_, i) => i !== idxToDelete)
        }
      });
    }

    showToast("Foto eliminada de los registros.");
  };

  // Handle local device image upload
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        handleAddPhoto(productId, event.target.result);
      }
    };
    reader.readAsDataURL(file);
    
    // clear input
    e.target.value = "";
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "Todos" },
    { id: "construccion", name: "Obra Gris" },
    { id: "herramientas", name: "Herramientas" },
    { id: "ferreteria", name: "Ferretería" },
    { id: "plomeria", name: "Plomería" },
    { id: "electricidad", name: "Electricidad" },
    { id: "pintura", name: "Pintura" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Toast Notificación */}
        <AnimatePresence>
          {successToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-semibold text-xs py-2.5 px-5 rounded-full shadow-lg z-[60] flex items-center gap-2"
            >
              <Check className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Top Header */}
        <div className="bg-brand-blue-950 text-white px-6 py-4 flex justify-between items-center border-b border-brand-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-orange-500 p-2 rounded-lg text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xs md:text-sm uppercase tracking-wide">
                Portal Corporativo de Sucursales
              </h2>
              <p className="text-[10px] text-stone-300">
                Gestión de Inventario y Evidencias de Stock en Costa Rica
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
          >
            Volver al Sitio
          </button>
        </div>

        {/* LOGIN SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 bg-stone-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-md shadow-xl"
            >
              <div className="text-center space-y-2 mb-6">
                <div className="bg-brand-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-brand-orange-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-brand-blue-950 text-base uppercase">
                  Acceso de Administrador
                </h3>
                <p className="text-stone-500 text-xs">
                  Seleccione su sucursal autorizada e ingrese su PIN corporativo.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Branch Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Sucursal Autorizada
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {branches.map(b => (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => setSelectedBranchId(b.id)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          selectedBranchId === b.id
                            ? "bg-brand-blue-950/5 border-brand-blue-950 text-brand-blue-950 font-bold"
                            : "bg-stone-50/50 hover:bg-stone-50 border-stone-200 text-stone-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${selectedBranchId === b.id ? "text-brand-orange-500" : "text-stone-400"}`} />
                          {b.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded font-bold">
                          {b.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pin Code */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      PIN Corporativo
                    </label>
                    <span className="text-[9px] text-brand-orange-600 font-bold">
                      *Demo libre (o presione Acceso Directo)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Ingrese pin (ej: 1234)"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-center font-mono tracking-widest focus:outline-hidden focus:bg-white focus:border-brand-orange-500 ${
                        pinError ? "border-red-500 animate-shake" : "border-stone-250"
                      }`}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Iniciar Sesión en Sucursal</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(true);
                      showToast(`¡Acceso rápido concedido en ${currentBranchName}!`);
                    }}
                    className="w-full text-stone-500 hover:text-stone-800 text-[11px] font-bold py-2 mt-2 transition-colors cursor-pointer text-center"
                  >
                    Acceso Rápido de Prueba (Sin Clave)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-stone-50">
            
            {/* LEFT SIDE PANEL: Product List & Stock Adjustments */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-stone-200">
              
              {/* Dashboard Sub-Header */}
              <div className="bg-white border-b border-stone-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-emerald-100 text-emerald-800 w-2 h-2 rounded-full animate-pulse" />
                  <p className="text-xs text-stone-600">
                    Conectado en: <strong className="text-stone-800 uppercase">{currentBranchName}</strong>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-stone-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

              {/* Filtering & Searching Controls */}
              <div className="p-4 bg-white border-b border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar producto por ID o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden focus:border-brand-orange-500 focus:bg-white font-medium"
                  />
                </div>
                
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        selectedCategory === cat.id
                          ? "bg-brand-blue-950 text-white border-brand-blue-950"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of Products */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-stone-300">
                    <p className="text-stone-400 text-xs">No se encontraron productos coincidentes.</p>
                  </div>
                ) : (
                  filteredProducts.map(p => {
                    // Extract branch stock or fallback to 0
                    const currentBranchStock = p.branchStock?.[selectedBranchId] ?? 0;
                    const isSelected = selectedProduct?.id === p.id;
                    const totalPhotosCount = p.branchPhotos?.[selectedBranchId]?.length || 0;

                    return (
                      <div 
                        key={p.id}
                        className={`p-3.5 rounded-xl border bg-white transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-orange-500/30 ${
                          isSelected ? "ring-2 ring-brand-orange-500 border-brand-orange-500" : "border-stone-200/80"
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-black text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              {p.id}
                            </span>
                            <span className="text-[10px] font-black uppercase text-brand-orange-600">
                              {p.brand}
                            </span>
                          </div>
                          <h4 className="font-semibold text-stone-800 text-xs leading-snug">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-4 text-[10px] text-stone-500 font-medium">
                            <span>Unidad: <strong className="text-stone-700">{p.unit}</strong></span>
                            <span>Precio base: <strong className="text-stone-700">₡{p.price.toLocaleString("es-CR")}</strong></span>
                          </div>
                        </div>

                        {/* Controls (Stock adjust & Photo button) */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0 border-stone-100">
                          
                          {/* Stock Counter */}
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                              Stock en Sucursal
                            </span>
                            <div className="flex items-center border border-stone-250 rounded-lg overflow-hidden bg-stone-50/50">
                              <button
                                onClick={() => handleUpdateStock(p.id, currentBranchStock - 1)}
                                className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                                title="Restar 1"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                value={currentBranchStock}
                                onChange={(e) => handleUpdateStock(p.id, parseInt(e.target.value) || 0)}
                                className="w-12 text-center text-xs font-mono font-bold bg-white text-stone-800 focus:outline-none"
                              />
                              <button
                                onClick={() => handleUpdateStock(p.id, currentBranchStock + 1)}
                                className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
                                title="Sumar 1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Photos Manager Trigger */}
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-brand-blue-950 text-white"
                                : "bg-brand-orange-50 hover:bg-brand-orange-100 text-brand-orange-700"
                            }`}
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Fotos ({totalPhotosCount})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT SIDE PANEL: Stock Photo Management for Selected Product */}
            <div className="w-full md:w-[360px] bg-white p-6 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 border-stone-200">
              {selectedProduct ? (
                <div className="space-y-6 h-full flex flex-col justify-between">
                  <div className="space-y-5">
                    {/* Selected product banner */}
                    <div className="border-b border-stone-100 pb-4">
                      <span className="text-[10px] bg-brand-orange-100 text-brand-orange-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">
                        Cargar Evidencias
                      </span>
                      <h3 className="font-display font-black text-brand-blue-950 text-sm leading-snug uppercase">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-stone-400 text-[10px] mt-1">
                        Marca: {selectedProduct.brand} • ID: {selectedProduct.id}
                      </p>
                    </div>

                    {/* Current Photos Gallery */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        Fotos Registradas ({selectedProduct.branchPhotos?.[selectedBranchId]?.length || 0})
                      </h4>
                      
                      {(!selectedProduct.branchPhotos?.[selectedBranchId] || selectedProduct.branchPhotos[selectedBranchId].length === 0) ? (
                        <div className="text-center py-6 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                          <ImageIcon className="w-6 h-6 text-stone-300 mx-auto mb-1.5" />
                          <p className="text-[11px] text-stone-400 leading-normal px-4">
                            No hay fotos cargadas por sucursal para este artículo todavía.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {selectedProduct.branchPhotos[selectedBranchId].map((photo, pIdx) => (
                            <div key={pIdx} className="relative rounded-lg border border-stone-200 overflow-hidden group aspect-video bg-stone-100">
                              <img 
                                src={photo} 
                                alt="Warehouse stock view" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => handleDeletePhoto(selectedProduct.id, pIdx)}
                                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition-colors"
                                  title="Eliminar foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Direct Image File Selector */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Subir Foto desde Celular / PC
                      </h4>
                      <label className="border-2 border-dashed border-stone-300 hover:border-brand-orange-500 hover:bg-brand-orange-50/20 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                        <Upload className="w-6 h-6 text-stone-400 mb-1.5" />
                        <span className="text-[11px] font-bold text-stone-700 block">Elegir Archivo</span>
                        <span className="text-[9px] text-stone-400 block mt-0.5">JPG, PNG hasta 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLocalImageUpload(e, selectedProduct.id)}
                        />
                      </label>
                    </div>

                    {/* Simulation Presets Section */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-orange-500" />
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Simular Fotos de Bodega
                        </h4>
                      </div>
                      <p className="text-[9px] text-stone-400 leading-normal">
                        Use una de nuestras capturas profesionales de almacén predeterminadas:
                      </p>
                      
                      <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                        {STOCK_PHOTO_PRESETS.map((preset, prIdx) => (
                          <button
                            key={prIdx}
                            onClick={() => handleAddPhoto(selectedProduct.id, preset.url)}
                            className="text-left bg-stone-50 hover:bg-brand-orange-50/50 border border-stone-200 hover:border-brand-orange-200 p-2 rounded-lg text-[10px] font-bold text-stone-600 flex items-center justify-between cursor-pointer transition-all"
                          >
                            <span className="truncate">{preset.name}</span>
                            <Plus className="w-3.5 h-3.5 text-brand-orange-600 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 flex items-start gap-2 text-[10px] text-stone-500 mt-4">
                    <Info className="w-4 h-4 text-brand-orange-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Al subir fotos, los clientes que naveguen por el catálogo verán un distintivo de <strong>&quot;Foto Real Verificada en {currentBranchName}&quot;</strong> al seleccionar el producto, aumentando la confiabilidad del servicio Mora y Mora.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                  <div className="bg-stone-100 p-3.5 rounded-full text-stone-400">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-700 text-xs uppercase tracking-wider">
                      Gestor de Evidencias
                    </h3>
                    <p className="text-stone-400 text-[10px] mt-1.5 leading-relaxed">
                      Haga clic en el botón <strong>&quot;Fotos&quot;</strong> de cualquier producto de la lista izquierda para subir y ver fotos de stock real en bodega.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
