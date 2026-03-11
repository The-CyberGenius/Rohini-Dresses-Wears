import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map snake_case from DB to camelCase for frontend
  const formattedCategories = categories.map(cat => ({
    ...cat,
    nameHi: cat.name_hi,
    isActive: cat.is_active,
    createdAt: cat.created_at,
  }));

  return NextResponse.json({ categories: formattedCategories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const { data: created, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        name_hi: body.nameHi,
        description: body.description,
        image: body.image,
        icon: body.icon,
        slug: slug,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...created,
      nameHi: created.name_hi,
      isActive: created.is_active,
      createdAt: created.created_at,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, targetContent, ...updates } = body; // Destructure anything not heading to DB
    
    const dbUpdates: any = { ...updates };
    if (updates.name) {
      dbUpdates.slug = updates.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    if (updates.nameHi !== undefined) dbUpdates.name_hi = updates.nameHi;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    // clean up frontend-specific camelCase keys if they exist in updates
    delete dbUpdates.nameHi;
    delete dbUpdates.isActive;
    delete dbUpdates.createdAt;

    const { data: updated, error } = await supabase
      .from("categories")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...updated,
      nameHi: updated.name_hi,
      isActive: updated.is_active,
      createdAt: updated.created_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }
  
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
