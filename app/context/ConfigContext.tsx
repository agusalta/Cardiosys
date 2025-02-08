"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ConfigContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<number>(16);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchConfig = async () => {
      if (!backendUrl) {
        console.error(
          "La variable de entorno NEXT_PUBLIC_BACKEND_URL no está definida."
        );
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/config`);

        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();

        const fontSize = data.config.FontSize;

        setFontSize(Number(fontSize));
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig debe ser utilizado dentro de un ConfigProvider");
  }
  return context;
};
