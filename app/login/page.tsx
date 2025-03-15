"use client";

import type React from "react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Activity, Lock, User, Info } from "lucide-react";
import Loader from "../components/Loader";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isDemoMode) {
        // Use demo credentials
        await login("demo_user", "demo_password");
        toast({
          title: "Modo Demo Activado",
          description: "Has ingresado en modo demostración.",
        });
      } else {
        // Use provided credentials
        await login(username, password);
        toast({
          title: "Sesión iniciada",
          description: "Ahora puedes acceder a tus datos.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al iniciar sesión.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoToggle = (checked: boolean) => {
    setIsDemoMode(checked);
    if (checked) {
      setUsername("demo_user");
      setPassword("demo_password");
    } else {
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-background to-background/95">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 order-1 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              CardioSys
            </h1>
            <p className="text-muted-foreground">
              Sistema de gestión de pacientes y estadísticas
            </p>
          </div>

          <Card className="border-0 shadow-lg bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Iniciar sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium mb-1 block"
                    >
                      Usuario
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Tu nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isDemoMode}
                        className={`pl-10 ${isDemoMode ? "bg-muted" : ""}`}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="relative">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium mb-1 block"
                    >
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isDemoMode}
                        className={`pl-10 ${isDemoMode ? "bg-muted" : ""}`}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="demo-mode"
                        checked={isDemoMode}
                        onCheckedChange={handleDemoToggle}
                        aria-label="Activar modo demostración"
                      />
                      <Label
                        htmlFor="demo-mode"
                        className="text-sm cursor-pointer"
                      >
                        Modo Demo
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  variant={isDemoMode ? "secondary" : "default"}
                  size="lg"
                >
                  {isLoading ? (
                    <Loader />
                  ) : isDemoMode ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Entrar en Modo Demo
                    </span>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="pt-0 opacity-70 text-xs text-center">
              CardioSys © 2025 - Todos los derechos reservados
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Column - Illustration/Info */}
      <div className="lg:w-1/2 bg-primary/10 p-8 flex items-center justify-center order-2 lg:order-2 min-h-[30vh] lg:min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 z-0"></div>

        {/* Heartbeat line animation */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
          <svg
            viewBox="0 0 1200 200"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 L300,100 L320,20 L340,180 L360,100 L600,100 L620,20 L640,180 L660,100 L900,100 L920,20 L940,180 L960,100 L1200,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <div className="inline-block p-3 rounded-full bg-background/20 backdrop-blur-sm mb-6">
            <Activity className="h-12 w-12 text-primary" />
          </div>

          <h2 className="text-3xl font-bold mb-6">
            Gestión Integral de Pacientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-background/40 backdrop-blur-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Datos de pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Gestión completa de historiales clínicos y seguimiento de
                  pacientes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Estadísticas y finanzas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Seguimiento de costos, ganancias y estadísticas de estudios
                  realizados.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 bg-background/40 backdrop-blur-sm rounded-lg">
            <blockquote className="italic text-sm">
              "Todo sistema eficaz es, en el fondo, una forma de inteligencia
              organizada."
            </blockquote>
            <p className="text-sm font-medium mt-2">Norbert Wiener</p>
          </div>
        </div>
      </div>
    </div>
  );
}
