export interface Category {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  image: string;
  icon: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

export interface BulkPricing {
  minQty: number;
  maxQty: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  price: number;
  bulkPricing: BulkPricing[];
  fabric: string;
  colors: string[];
  sizes: string[];
  minOrderQty: number;
  stock: number;
  unit: string;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  productId?: string;
  productName?: string;
  message: string;
  quantity?: number;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface AdminUser {
  username: string;
  password: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  fabric: string;
  search: string;
  sortBy: "name" | "price-low" | "price-high" | "newest";
  inStock: boolean;
}
