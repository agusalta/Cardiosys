"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Asegúrate de incluir las cookies en la solicitud
      });

      const data = await res.json(); // Obtener la respuesta en formato JSON

      if (res.ok) {
        const token = data.token;

        document.cookie = `auth=${token}; path=/; secure; samesite=none; max-age=3600`;

        setIsLoggedIn(true);
        router.push("/");
      } else {
        throw new Error(data.message || "Error desconocido");
      }
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message || "Ocurrió un error al iniciar sesión.");
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        document.cookie =
          "auth=; path=/; secure; samesite=none; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en el logout:", error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${backendUrl}/auth/checkAuth`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isLoggedIn);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
