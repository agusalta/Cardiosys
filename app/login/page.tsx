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
import { Sparkles } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-muted-foreground/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Modo Demostración</span>
              </div>
              <Switch
                checked={isDemoMode}
                onCheckedChange={handleDemoToggle}
                aria-label="Activar modo demostración"
              />
            </div>
            {isDemoMode && (
              <p className="text-xs text-muted-foreground mt-2">
                Prueba el sistema con datos de ejemplo sin necesidad de
                credenciales reales.
              </p>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isDemoMode}
                  className={isDemoMode ? "bg-muted" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isDemoMode}
                  className={isDemoMode ? "bg-muted" : ""}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                variant={isDemoMode ? "secondary" : "default"}
              >
                {isLoading ? (
                  <Loader />
                ) : isDemoMode ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Entrar en Modo Demo
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground text-center">
            <span className="text-primary font-semibold hover:underline ml-1">
              CardioSys
            </span>
            <span className="text-[9px] align-top"> &#169; 2025</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
