import "./globals.css";
import { LanguageProvider } from "./providers/LanguageProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F5EFE3]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
