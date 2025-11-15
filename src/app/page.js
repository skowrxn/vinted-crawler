"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import HistorySidebar from "@/components/HistorySidebar";

export default function Home() {
    const [cookiesInput, setCookiesInput] = useState("");
    const [cookiesStatus, setCookiesStatus] = useState({
        show: false,
        message: "",
        isError: false,
    });
    const [baseUrl, setBaseUrl] = useState(
        "https://www.vinted.pl/api/v2/catalog/items"
    );
    const [searchParams, setSearchParams] = useState(
        "per_page=200&search_text=&catalog_ids=&order=newest_first&size_ids=&brand_ids=15971&status_ids[]=1&status_ids[]=6&color_ids=&material_ids="
    );
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadedFromHistory, setLoadedFromHistory] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Handle cookies input change
    const handleCookiesChange = (e) => {
        const value = e.target.value;
        setCookiesInput(value);

        if (value.trim()) {
            try {
                JSON.parse(value);
                setCookiesStatus({
                    show: true,
                    message: "✓ Pliki cookies wklejone pomyślnie",
                    isError: false,
                });
            } catch (error) {
                setCookiesStatus({
                    show: true,
                    message: "✗ Nieprawidłowy format JSON",
                    isError: true,
                });
            }
        } else {
            setCookiesStatus({ show: false, message: "", isError: false });
        }
    };

    // Fetch products
    const handleFetchProducts = async () => {
        try {
            let cookies;
            try {
                cookies = JSON.parse(cookiesInput);
            } catch (error) {
                setCookiesStatus({
                    show: true,
                    message: "✗ Nieprawidłowy format JSON cookies",
                    isError: true,
                });
                return;
            }

            setIsLoading(true);
            setProducts([]);

            // Scroll down smoothly
            window.scrollTo({
                top: 600,
                behavior: "smooth"
            });

            const pagesToFetch = [1, 2, 3];
            let allItems = [];

            // Fetch through our proxy to properly send cookies
            const requests = pagesToFetch.map((page) =>
                fetch("/api/proxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        url: `${baseUrl}?page=${page}&${searchParams}`,
                        cookies: cookies,
                    }),
                })
            );

            const responses = await Promise.all(requests);

            for (const response of responses) {
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data && Array.isArray(result.data.items)) {
                        allItems = allItems.concat(result.data.items);
                    }
                }
            }

            if (allItems.length === 0) {
                alert("Nie znaleziono produktów. Sprawdź cookies i parametry.");
                setIsLoading(false);
                return;
            }

            // Sort by favourite_count descending
            allItems.sort((a, b) => b.favourite_count - a.favourite_count);

            // Get top 100
            const top100Items = allItems.slice(0, 100);

            setProducts(top100Items);
            setLoadedFromHistory(null); // Clear history info for new search

            // Save to database via API
            try {
                await fetch("/api/fetch-products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: top100Items,
                        baseUrl,
                        params: searchParams,
                    }),
                });
            } catch (saveError) {
                console.error("Failed to save to database:", saveError);
                // Don't alert user - products are still displayed
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Wystąpił błąd podczas pobierania produktów");
        } finally {
            setIsLoading(false);
        }
    };

    // Load history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await fetch("/api/history");
                const data = await response.json();

                if (data.success) {
                    setHistory(data.history);
                }
            } catch (error) {
                console.error("Error loading history:", error);
            }
        };

        loadHistory();
    }, []);

    // Load historical search
    const handleSelectHistory = async (id) => {
        try {
            setIsLoadingHistory(true);
            setProducts([]); // Clear products for smooth transition

            const response = await fetch(`/api/history?id=${id}`);
            const data = await response.json();

            if (data.success) {
                // items_data is already parsed as an object from PostgreSQL JSONB
                const items = typeof data.data.items_data === 'string'
                    ? JSON.parse(data.data.items_data)
                    : data.data.items_data;

                // Small delay for smooth transition
                setTimeout(() => {
                    setProducts(items);
                    setLoadedFromHistory(data.data.created_at);
                    setIsLoadingHistory(false);
                }, 300);
            } else {
                alert("Nie udało się załadować wyników");
                setIsLoadingHistory(false);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Wystąpił błąd podczas ładowania wyników");
            setIsLoadingHistory(false);
        }
    };

    return (
        <div className="flex h-screen bg-black">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="max-w-[1400px] mx-auto pt-16 pb-20 px-8">
                    {/* Input Section */}
                    <section className="max-w-[800px] mx-auto mb-16">
                        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-4 sm:p-6 md:p-8">
                            {/* Cookies Input */}
                            <div className="mb-6">
                                <label className="block text-base font-medium text-white mb-4">
                                    Pliki cookies (JSON)
                                </label>
                                <div
                                    className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 hover:bg-[#222] hover:border-white/10 transition-all cursor-pointer group"
                                    onClick={() =>
                                        document
                                            .getElementById("cookiesInput")
                                            .focus()
                                    }
                                >
                                    <input
                                        id="cookiesInput"
                                        type="text"
                                        value={cookiesInput}
                                        onChange={handleCookiesChange}
                                        placeholder=""
                                        className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-4 pointer-events-none">
                                        {!cookiesStatus.show ? (
                                            <>
                                                <svg
                                                    className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <div className="text-center">
                                                    <p className="text-white/70 text-base font-medium">
                                                        Kliknij i wklej pliki
                                                        cookies
                                                    </p>
                                                    <p className="text-white/50 text-sm mt-1">
                                                        Format: JSON Array
                                                    </p>
                                                </div>
                                            </>
                                        ) : cookiesStatus.isError ? (
                                            <>
                                                <svg
                                                    className="w-12 h-12 text-red-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="text-center">
                                                    <p className="text-red-400 text-base font-medium">
                                                        Nieprawidłowy format
                                                        JSON
                                                    </p>
                                                    <p className="text-white/50 text-sm mt-1">
                                                        Spróbuj ponownie
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-12 h-12 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="text-center">
                                                    <p className="text-green-400 text-base font-medium">
                                                        Cookies wklejone
                                                        pomyślnie
                                                    </p>
                                                    <p className="text-white/50 text-sm mt-1">
                                                        {
                                                            JSON.parse(
                                                                cookiesInput
                                                            ).length
                                                        }{" "}
                                                        cookies załadowanych
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* URL Configuration */}
                            <div className="mb-8">
                                <label className="block text-base font-medium text-white mb-4">
                                    URL wyszukiwania
                                </label>
                                <input
                                    type="text"
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-base text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all mb-4 hover:bg-[#222]"
                                />

                                <label className="block text-base font-medium text-white mb-4">
                                    Parametry wyszukiwania
                                </label>
                                <input
                                    type="text"
                                    value={searchParams}
                                    onChange={(e) =>
                                        setSearchParams(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-base text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all hover:bg-[#222]"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleFetchProducts}
                                    disabled={isLoading || !cookiesInput.trim()}
                                    className="flex-1 justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 shadow h-11 bg-white text-black hover:bg-white/90 py-3 px-8 rounded-full font-medium transition-colors w-fit inline-flex items-center group text-base mx-auto sm:mx-0"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    <span>Znajdź produkty</span>
                                    <svg
                                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Loading Animation */}
                    {(isLoading || isLoadingHistory) && <LoadingSpinner />}

                    {/* Results Section */}
                    {!isLoading && !isLoadingHistory && products.length > 0 && (
                        <section>
                            {loadedFromHistory && (
                                <div className="max-w-[800px] mx-auto mb-8">
                                    <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                                        <svg
                                            className="w-5 h-5 text-yellow-500 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <p className="text-white/70 text-base">
                                            Dane historyczne z dnia{" "}
                                            <span className="text-white font-medium">
                                                {new Date(loadedFromHistory).toLocaleString("pl-PL", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-4xl font-bold text-white">
                                    Najpopularniejsze produkty
                                </h3>
                                <span className="text-base text-white/70">
                                    {products.length} produktów
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={product.id || index}
                                        product={product}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* History Sidebar */}
            <HistorySidebar
                history={history}
                onSelectHistory={handleSelectHistory}
            />
        </div>
    );
}
