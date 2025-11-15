import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();
        const { url, cookies } = body;

        if (!url || !cookies) {
            return NextResponse.json(
                { error: "Missing url or cookies" },
                { status: 400 }
            );
        }

        // Format cookies
        const cookieHeader = cookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");

        // Fetch from Vinted with proper headers
        const response = await axios.get(url, {
            headers: {
                Cookie: cookieHeader,
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                Referer: "https://www.vinted.pl/",
                Origin: "https://www.vinted.pl",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
            },
        });

        return NextResponse.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Proxy error:", error.message);
        return NextResponse.json(
            {
                error: "Proxy request failed",
                details:
                    error.response?.status +
                        " " +
                        error.response?.statusText || error.message,
            },
            { status: error.response?.status || 500 }
        );
    }
}
