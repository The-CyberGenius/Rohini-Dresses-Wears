import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.name.split('.').pop() || 'tmp';
        const filename = `upload-${uniqueSuffix}.${extension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("uploads")
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase Upload error:", error);
            throw error;
        }

        // Return the public URL
        const { data: publicUrlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(filename);

        if (!publicUrlData) throw new Error("Could not get public URL");

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
