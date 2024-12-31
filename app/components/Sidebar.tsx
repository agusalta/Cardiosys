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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: FileText, label: "Estudios", href: "/estudios" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
];

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative hidden md:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full py-4">
        <div className="px-3 py-2">
          {!isCollapsed && (
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              CardioSys
            </h2>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <TooltipProvider key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={cn("h-4 w-4", !isCollapsed && "mr-2")}
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
