import { useState, useEffect } from "react";
import Estudio from "../types/Estudio";

export function useEstudios() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/api/estudio");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEstudios(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return { estudios, loading };
}
