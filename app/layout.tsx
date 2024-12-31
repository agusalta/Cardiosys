import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="flex h-screen bg-background">
          <Sidebar className="hidden md:block" />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center p-4 md:hidden">
              <MobileNav />
              <h1 className="text-2xl font-bold ml-4">CardioSys</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
