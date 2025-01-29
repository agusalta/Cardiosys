import { useState, useEffect, useCallback } from "react";
import HistorialClinico from "../types/HistorialClinico";

export function useHistorialClinico(patientId: number | undefined) {
  const [historial, setHistorial] = useState<HistorialClinico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getTipoEstudio = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`${backendUrl}/tipoEstudio/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tipo de estudio");
        }
        const data = await response.json();
        return data[0]?.NombreEstudio ?? "Cargando...";
      } catch (err: any) {
        console.error("Error fetching tipo de estudio:", err);
        setError(err.message);
        return "Error al cargar tipo de estudio";
      }
    },
    [backendUrl]
  );

  useEffect(() => {
    if (!patientId) return;

    setHistorial([]);
    setLoading(true);
    setError(null);

    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${backendUrl}/estudio/${patientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch historial clínico");
        }
        const data = await response.json();

        const updatedHistorial = await Promise.all(
          data.map(async (entry: HistorialClinico) => {
            const tipoEstudioNombre = await getTipoEstudio(
              entry.ID_TipoEstudio
            );
            return {
              ...entry,
              NombreTipoEstudio: tipoEstudioNombre,
            };
          })
        );
        setHistorial(updatedHistorial);
      } catch (err: any) {
        console.error("Error fetching historial clínico:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [patientId, getTipoEstudio, backendUrl]);

  return { historial, loading, error, setHistorial };
}
