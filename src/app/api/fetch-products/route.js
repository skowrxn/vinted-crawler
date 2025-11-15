import { NextResponse } from "next/server";
import axios from "axios";
import { saveSearchResult, initializeDatabase } from "@/lib/db";

// Initialize database on module load
initializeDatabase();

/**
 * Format cookies from JSON array to HTTP header string
 */
function formatCookies(cookies) {
    if (!Array.isArray(cookies)) {
        throw new Error("Cookies must be an array");
    }
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { cookies, baseUrl, params } = body;

        if (!cookies || !Array.isArray(cookies)) {
            return NextResponse.json(
                { error: "Invalid cookies format" },
                { status: 400 }
            );
        }

        const cookieHeader = formatCookies(cookies);
        const pagesToFetch = [1, 2, 3];
        let allItems = [];

        const requests = pagesToFetch.map((page) =>
            axios.get(`${baseUrl}?page=${page}&${params}`, {
                headers: {
                    Cookie: cookieHeader,
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response) => {
            if (response.data && Array.isArray(response.data.items)) {
                allItems = allItems.concat(response.data.items);
            }
        });

        // Sort by favourite_count descending
        allItems.sort((a, b) => b.favourite_count - a.favourite_count);

        // Get top 30
        const top30Items = allItems.slice(0, 30);

        // Save to database
        const savedId = await saveSearchResult(top30Items, baseUrl, params);

        return NextResponse.json({
            success: true,
            items: top30Items,
            searchId: savedId,
            count: top30Items.length,
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return NextResponse.json(
            {
                error: "Failed to fetch products",
                details: error.response
                    ? `${error.response.status} ${error.response.statusText}`
                    : error.message,
            },
            { status: 500 }
        );
    }
}
