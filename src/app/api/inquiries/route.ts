import { NextRequest, NextResponse } from "next/server";
import { getInquiries, addInquiry, updateInquiryStatus, deleteInquiry } from "@/lib/dataStore";
import { Inquiry } from "@/types";

export async function GET() {
  const inquiries = getInquiries();
  inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ inquiries });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inquiry: Inquiry = {
      ...body,
      id: `inq-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    const created = addInquiry(inquiry);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    const updated = updateInquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
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
  const deleted = deleteInquiry(id);
  if (!deleted) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
