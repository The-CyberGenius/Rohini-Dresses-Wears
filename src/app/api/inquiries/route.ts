import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function mapDbInquiryToFrontend(inq: any) {
  return {
    ...inq,
    productId: inq.product_id,
    productName: inq.products?.name, 
    createdAt: inq.created_at,
  };
}

export async function GET() {
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*, products(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formattedInquiries = inquiries.map(mapDbInquiryToFrontend);
  return NextResponse.json({ inquiries: formattedInquiries });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const insertData = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      product_id: body.productId,
      message: body.message,
      quantity: body.quantity || 1,
      status: "new",
    };

    const { data: created, error } = await supabase
      .from("inquiries")
      .insert(insertData)
      .select("*, products(name)")
      .single();

    if (error) throw error;
    
    return NextResponse.json(mapDbInquiryToFrontend(created), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    const { data: updated, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select("*, products(name)")
      .single();

    if (error) throw error;
    
    return NextResponse.json(mapDbInquiryToFrontend(updated));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
