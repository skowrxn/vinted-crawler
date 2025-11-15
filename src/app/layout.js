import "./globals.css";

export const metadata = {
  title: "Vinted Viral Tracker",
  description: "Śledź najpopularniejsze produkty z Vinted",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
