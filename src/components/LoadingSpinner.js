export default function LoadingSpinner() {
    return (
        <div className="mb-8">
            <div className="max-w-[800px] mx-auto">
                <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="loading-spinner"></div>
                        <p className="text-white/70 text-base font-medium">
                            Pobieranie produktów z Vinted...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
