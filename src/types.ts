/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // Precio en MXN antes de IVA
  description: string;
  unit: string; // "pieza", "bulto de 50kg", "metro", "litro", "caja", etc.
  stock: number;
  featured: boolean;
  specifications: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuotationRequest {
  id: string;
  customerName: string;
  companyName?: string;
  cedula?: string;
  email: string;
  phone: string;
  address: string;
  projectType: string; // "Residencial" | "Comercial" | "Industrial" | "Obra Pública" | "Particular"
  notes?: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  createdAt: string;
  validUntil: string;
  shippingCost: number;
}
