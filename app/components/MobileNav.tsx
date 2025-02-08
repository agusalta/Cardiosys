"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Users, FileText, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: FileText, label: "Costos", href: "/estudios" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
];

export function MobileNav({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    try {
      // Realiza la solicitud de logout al backend
      const res = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include", // Asegúrate de que las cookies se envíen
      });

      if (res.ok) {
        // Actualiza el estado de autenticación
        setIsLoggedIn(false);
        // Redirige al login
        router.push("/login");
      } else {
        // Si hay un error, muestra un mensaje de error
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en el logout:", error);
    }
  };

  if (!isLoggedIn) {
    console.log("Sidebar not rendered due to login page or not logged in");
    return null;
  }

  return (
    <div className={cn("fixed top-0 left-0 w-full z-50", className)}>
      <div className="flex justify-end items-center px-4 py-2">
        <Button
          variant="ghost"
          className="p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background shadow-lg">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            {menuItems.map((item) => (
              <Button
                asChild
                key={item.href}
                variant="ghost"
                className="w-full justify-start text-lg"
                onClick={() => setIsOpen(false)}
              >
                <Link href={item.href}>
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6 mr-2" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </Button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-lg text-red-600"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
