import { useState, useEffect } from "react";
import Estudio from "../types/Estudio";

export function useEstudios() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${backendUrl}/estudio`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEstudios(data);
      } catch (error) {
        ("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return { estudios, loading };
}
