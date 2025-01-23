import { useState, useEffect } from "react";
import TipoEstudio from "../types/TipoEstudio";

export function useTipoEstudio(id?: number) {
  const [tipoEstudio, setTipoEstudio] = useState<TipoEstudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTipoEstudios() {
    try {
      const response = await fetch("http://localhost:3000/api/tipoEstudio");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los pacientes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTipoEstudio = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/tipoEstudio/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tipo estudio");
        }
        const data = await response.json();
        setTipoEstudio(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTipoEstudio();
  }, [id]);

  return { tipoEstudio, fetchTipoEstudios, loading, error };
}
