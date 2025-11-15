"use client";

import Image from "next/image";

export default function ProductCard({ product }) {
    const handleClick = () => {
        window.open(product.url, "_blank");
    };

    return (
        <div
            onClick={handleClick}
            className="product-card group relative bg-[#111111] border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-white/10 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square bg-black overflow-hidden">
                {product.photo?.url ? (
                    <Image
                        src={product.photo.url}
                        alt={product.title}
                        fill
                        className="product-card-image object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                        <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Like Badge */}
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {product.favourite_count}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-base text-white font-medium line-clamp-2 mb-3 leading-relaxed">
                    {product.title}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                        {typeof product.price === 'object'
                            ? `${product.price.amount} ${product.price.currency_code}`
                            : `${product.price} ${product.currency || ''}`}
                    </span>
                </div>
            </div>
        </div>
    );
}
