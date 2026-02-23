import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/dataStore";
import { Product } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let products = getProducts().filter((p) => p.isActive);

  // Filter by category
  const category = searchParams.get("category");
  if (category && category !== "all") {
    products = products.filter((p) => p.categoryId === category);
  }

  // Filter by search
  const search = searchParams.get("search");
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameHi.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }

  // Filter by fabric
  const fabric = searchParams.get("fabric");
  if (fabric && fabric !== "all") {
    products = products.filter((p) => p.fabric.toLowerCase() === fabric.toLowerCase());
  }

  // Filter by price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  // Filter by stock
  const inStock = searchParams.get("inStock");
  if (inStock === "true") {
    products = products.filter((p) => p.stock > 0);
  }

  // Featured only
  const featured = searchParams.get("featured");
  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }

  // Sort
  const sortBy = searchParams.get("sortBy");
  switch (sortBy) {
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "name":
    default:
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return NextResponse.json({ products, total: products.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product: Product = {
      ...body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    const created = addProduct(product);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  const deleted = deleteProduct(id);
  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
