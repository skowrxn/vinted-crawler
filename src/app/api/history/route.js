import { NextResponse } from "next/server";
import { getSearchHistory, getSearchResult } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            // Get specific search result
            const result = await getSearchResult(id);
            if (!result) {
                return NextResponse.json(
                    { error: "Search result not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, data: result });
        } else {
            // Get search history
            const history = await getSearchHistory();
            return NextResponse.json({ success: true, history });
        }
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
