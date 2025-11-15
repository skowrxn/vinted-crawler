import { NextResponse } from "next/server";
import { saveSearchResult, initializeDatabase } from "@/lib/db";

// Initialize database on module load
initializeDatabase();

export async function POST(request) {
    try {
        const body = await request.json();
        const { items, baseUrl, params } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: "Invalid items format" },
                { status: 400 }
            );
        }

        // Save to database
        const savedId = await saveSearchResult(items, baseUrl, params);

        return NextResponse.json({
            success: true,
            searchId: savedId,
            count: items.length,
        });
    } catch (error) {
        console.error("Error saving products:", error.message);
        return NextResponse.json(
            {
                error: "Failed to save products",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
