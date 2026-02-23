import { NextRequest, NextResponse } from "next/server";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/dataStore";
import { Category } from "@/types";

export async function GET() {
  const categories = getCategories().filter((c) => c.isActive);
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category: Category = {
      ...body,
      id: `cat-${Date.now()}`,
      slug: body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const created = addCategory(category);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    const updated = updateCategory(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
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
  const deleted = deleteCategory(id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
