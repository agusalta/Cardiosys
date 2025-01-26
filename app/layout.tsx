import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import { ConfigProvider } from "@/app/context/ConfigContext";
import { FontSizeProvider } from "./configuracion/FontSizeProvider";

export const metadata = {
  title: "Sistema Médico - Cardiología",
  description: "Sistema de gestión de pacientes para cardiología",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-background">
        <ConfigProvider>
          <FontSizeProvider />
          <div className="flex h-screen bg-background">
            <Sidebar className="hidden md:block" />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="flex items-center p-4 md:hidden">
                <MobileNav />
                <h1 className="text-2xl font-bold ml-4">CardioSys</h1>
              </header>
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
              <Toaster />
            </div>
          </div>
        </ConfigProvider>
      </body>
    </html>
  );
}
