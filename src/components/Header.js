"use client";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">
                        Vinted Viral Tracker
                    </h1>
                    <div className="bg-zinc-900/80 rounded-full px-4 py-1.5">
                        <span className="text-sm text-white/70">Beta</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
