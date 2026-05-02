import "./globals.css";
import { GarmentsProvider } from "./providers/GarmentsProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { UserProvider } from "./providers/UserProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F5EFE3]">
        <LanguageProvider>
          <UserProvider>
            <GarmentsProvider>{children}</GarmentsProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
