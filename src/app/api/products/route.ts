import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapDbProductToFrontend(p: any) {
  return {
    ...p,
    categoryId: p.category_id,
    nameHi: p.name_hi,
    bulkPricing: p.bulk_pricing || [],
    minOrderQty: p.min_order_qty,
    isFeatured: p.is_featured,
    isActive: p.is_active,
    createdAt: p.created_at,
    categoryName: p.categories?.name, // From joined table
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let query = supabase
    .from("products")
    .select("*, categories(name)")
    .eq("is_active", true);

  // Filter by category
  const category = searchParams.get("category");
  if (category && category !== "all") {
    query = query.eq("category_id", category);
  }

  // Filter by search
  const search = searchParams.get("search");
  if (search) {
    const q = search.toLowerCase();
    // In Supabase, doing a complex OR search can be done with .or()
    query = query.or(`name.ilike.%${q}%,name_hi.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Filter by fabric
  const fabric = searchParams.get("fabric");
  if (fabric && fabric !== "all") {
    query = query.ilike("fabric", fabric);
  }

  // Filter by price range
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));

  // Filter by stock
  const inStock = searchParams.get("inStock");
  if (inStock === "true") {
    query = query.gt("stock", 0);
  }

  // Featured only
  const featured = searchParams.get("featured");
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  // Sort
  const sortBy = searchParams.get("sortBy");
  switch (sortBy) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "name":
    default:
      query = query.order("name", { ascending: true });
      break;
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = data.map(mapDbProductToFrontend);
  return NextResponse.json({ products, total: products.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert frontend camelCase back to snake_case for DB
    const insertData = {
      name: body.name,
      name_hi: body.nameHi,
      description: body.description,
      category_id: body.categoryId,
      images: body.images || [],
      price: body.price,
      bulk_pricing: body.bulkPricing || [],
      fabric: body.fabric,
      colors: body.colors || [],
      sizes: body.sizes || [],
      min_order_qty: body.minOrderQty || 1,
      stock: body.stock || 0,
      unit: body.unit || "pieces",
      is_featured: body.isFeatured || false,
      is_active: true,
      tags: body.tags || [],
    };

    const { data: created, error } = await supabase
      .from("products")
      .insert(insertData)
      .select("*, categories(name)")
      .single();

    if (error) throw error;
    return NextResponse.json(mapDbProductToFrontend(created), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, categoryName, ...updates } = body; 
    
    // Map camelCase to snake_case
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.nameHi !== undefined) dbUpdates.name_hi = updates.nameHi;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.bulkPricing !== undefined) dbUpdates.bulk_pricing = updates.bulkPricing;
    if (updates.fabric !== undefined) dbUpdates.fabric = updates.fabric;
    if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
    if (updates.minOrderQty !== undefined) dbUpdates.min_order_qty = updates.minOrderQty;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    const { data: updated, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id)
      .select("*, categories(name)")
      .single();

    if (error) throw error;
    return NextResponse.json(mapDbProductToFrontend(updated));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
