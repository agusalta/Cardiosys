import { useState, useEffect } from "react";
import TipoEstudio from "../types/TipoEstudio";

export function useTipoEstudio(id: number) {
  const [tipoEstudio, setTipoEstudio] = useState<TipoEstudio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { tipoEstudio, loading, error };
}
