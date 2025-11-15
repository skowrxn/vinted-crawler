import "./globals.css";

export const metadata = {
    title: "SellShark | Vinted Scraper",
    description: "Śledź najpopularniejsze produkty z Vinted",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pl">
            <body className="bg-black text-white min-h-screen">{children}</body>
        </html>
    );
}
