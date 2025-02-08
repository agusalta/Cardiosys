"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useStore from "../context/store";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: FileText, label: "Costos", href: "/estudios" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { clinicToday } = useStore();
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

  const clinicEmoji =
    clinicToday === "Pinamed"
      ? "🌲"
      : clinicToday === "Clínica del Sol"
      ? "🌞"
      : "🏥";

  if (!isLoggedIn) {
    return null;
  } else {
    return (
      <div
        className={cn(
          "relative hidden md:block transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="flex flex-col h-full py-4">
          <div className="px-3 py-2 flex flex-col h-full">
            {!isCollapsed && (
              <h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight">
                CardioSys {clinicEmoji}
              </h2>
            )}

            <div className="space-y-1 flex-grow">
              {menuItems.map((item) => (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-lg",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon
                            className={cn("h-8 w-8", !isCollapsed && "mr-2")}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      </Button>
                    </TooltipTrigger>

                    {isCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg mt-auto",
                      isCollapsed && "justify-center px-2"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className={cn("h-8 w-8", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Cerrar Sesión</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">Cerrar Sesión</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Button
          variant="ghost"
          className="absolute top-2 -right-4 p-1 rounded-full bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
}
