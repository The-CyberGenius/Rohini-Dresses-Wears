import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ value: null }); // Not found
            }
            throw error;
        }

        return NextResponse.json({ value: data.value });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("site_settings")
            .upsert({ 
                key, 
                value, 
                updated_at: new Date().toISOString() 
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, setting: data });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
