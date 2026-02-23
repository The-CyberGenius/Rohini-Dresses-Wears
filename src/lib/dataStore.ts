import fs from "fs";
import path from "path";
import { Category, Product, Inquiry } from "@/types";
import { defaultCategories, defaultProducts, defaultInquiries } from "@/data/seed";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultData: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Categories
export function getCategories(): Category[] {
  return readJsonFile<Category[]>("categories.json", defaultCategories);
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function saveCategories(categories: Category[]): void {
  writeJsonFile("categories.json", categories);
}

export function addCategory(category: Category): Category {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
  return category;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  saveCategories(filtered);
  return true;
}

// Products
export function getProducts(): Product[] {
  return readJsonFile<Product[]>("products.json", defaultProducts);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return getProducts().filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.isFeatured && p.isActive);
}

export function saveProducts(products: Product[]): void {
  writeJsonFile("products.json", products);
}

export function addProduct(product: Product): Product {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Inquiries
export function getInquiries(): Inquiry[] {
  return readJsonFile<Inquiry[]>("inquiries.json", defaultInquiries);
}

export function addInquiry(inquiry: Inquiry): Inquiry {
  const inquiries = getInquiries();
  inquiries.push(inquiry);
  writeJsonFile("inquiries.json", inquiries);
  return inquiry;
}

export function updateInquiryStatus(id: string, status: Inquiry["status"]): Inquiry | null {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;
  inquiries[index].status = status;
  writeJsonFile("inquiries.json", inquiries);
  return inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length === inquiries.length) return false;
  writeJsonFile("inquiries.json", filtered);
  return true;
}
