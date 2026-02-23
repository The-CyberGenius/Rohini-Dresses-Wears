import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "rohini@2024";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        token: Buffer.from(`${username}:${Date.now()}`).toString("base64"),
      });
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
