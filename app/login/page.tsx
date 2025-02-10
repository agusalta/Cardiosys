"use client";

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
import Loader from "../components/Loader";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      toast({
        title: "Sesión iniciada",
        description: "Ahora puedes acceder a tus datos.",
      });
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader /> : "Entrar"}
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
