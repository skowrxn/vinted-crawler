"use client";

export default function HistorySidebar({ history, onSelectHistory }) {
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

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            rok: 31536000,
            miesiąc: 2592000,
            tydzień: 604800,
            dzień: 86400,
            godzina: 3600,
            minuta: 60,
        };

        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                if (name === "rok" || name === "miesiąc" || name === "tydzień" || name === "dzień") {
                    const plural = interval === 1
                        ? name
                        : name === "rok"
                            ? (interval < 5 ? "lata" : "lat")
                            : name === "miesiąc"
                                ? (interval < 5 ? "miesiące" : "miesięcy")
                                : name === "tydzień"
                                    ? (interval < 5 ? "tygodnie" : "tygodni")
                                    : (interval < 5 ? "dni" : "dni");
                    return `${interval} ${plural} temu`;
                } else if (name === "godzina") {
                    const plural = interval === 1 ? "godzinę" : interval < 5 ? "godziny" : "godzin";
                    return `${interval} ${plural} temu`;
                } else if (name === "minuta") {
                    const plural = interval === 1 ? "minutę" : interval < 5 ? "minuty" : "minut";
                    return `${interval} ${plural} temu`;
                }
            }
        }

        return "przed chwilą";
    };

    return (
        <div className="w-80 bg-[#111111] border-l border-gray-800 h-screen flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex-shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-yellow-500"
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
                    Historia
                </h3>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
                {history.length === 0 ? (
                    <p className="text-center text-white/60 py-8 text-sm">
                        Brak historii
                    </p>
                ) : (
                    <div className="space-y-2">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelectHistory(item.id)}
                                className="p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:bg-[#222] hover:border-white/10 transition-all cursor-pointer"
                            >
                                <span className="text-sm font-medium text-white block">
                                    {formatDate(item.created_at)}
                                </span>
                                <span className="text-xs text-white/50 block mt-1">
                                    {getTimeAgo(item.created_at)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
