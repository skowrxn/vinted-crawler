"use client";

export default function HistoryModal({ isOpen, onClose, history, onSelectHistory }) {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#111111] border border-gray-800 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-2xl font-bold text-white">
                        Historia wyszukiwań
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {history.length === 0 ? (
                        <p className="text-center text-white/60 py-8 text-base">
                            Brak historii wyszukiwań
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onSelectHistory(item.id)}
                                    className="p-5 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:bg-[#222] hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <span className="text-base font-medium text-white">
                                        {formatDate(item.created_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
