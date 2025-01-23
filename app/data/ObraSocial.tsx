import { useState, useEffect } from "react";
import Seguro from "../types/Seguro";

export function useSeguro() {
  const [seguros, setSeguros] = useState<Seguro[]>([]);

  async function getSeguroById(idSeguro: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/seguro/${idSeguro}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    async function fetchSeguros() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/seguro/seguros"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setSeguros(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      }
    }
    fetchSeguros();
  }, []);

  return { seguros, getSeguroById };
}
