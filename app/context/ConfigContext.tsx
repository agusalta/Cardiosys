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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/config");
        if (response.ok) {
          const data = await response.json();
          console.log(data.config.FontSize);
          setFontSize(Number(data.config.FontSize));

          document.documentElement.style.fontSize = `${data.fontSize}px`;
        } else {
          console.error("Error al obtener la configuración desde el servidor.");
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
      }
    };

    fetchConfig();
  }, []);

  console.log("fontSize", fontSize);

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
