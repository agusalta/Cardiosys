"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Set the auth cookie with the token value
        document.cookie = `auth=${data.token}; path=/; max-age=3600; SameSite=Strict; Secure`;

        toast({
          title: "Sesión iniciada",
          description: "Ahora puedes acceder a tus datos.",
        });

        router.push("/");
      } else {
        const data = await res.json();
        console.error(data.message);
        setError(data.message);
      }
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al iniciar sesión.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-button button-text p-2 rounded hover:bg-tertiary transition-all duration-300 ease-in-out"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
