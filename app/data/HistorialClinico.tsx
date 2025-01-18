import { useState, useEffect } from "react";

export interface HistorialClinico {
  ID_Estudio: number;
  Fecha: string;
  Asunto: string;
  Observacion: string;
  Factura: string | null;
  ID_Paciente: number;
  ID_TipoEstudio: number;
  NombreTipoEstudio: string;
}

interface TipoEstudio {
  ID_TipoEstudio: number;
  NombreEstudio: string;
  Descripcion: string;
}

export function useHistorialClinico(patientId: number | undefined) {
  const [historial, setHistorial] = useState<HistorialClinico[]>([]);
  const [tiposEstudio, setTiposEstudio] = useState<Map<number, string>>(
    new Map()
  ); // Usamos un Map para guardar ID y nombre
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el nombre del tipo de estudio por su ID
  const getTipoEstudio = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tipoEstudio/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tipo de estudio");
      }
      const data = await response.json();
      return data[0]?.NombreEstudio; // Accedemos al nombre del estudio (en base al formato de la respuesta)
    } catch (err: any) {
      console.error("Error fetching tipo de estudio:", err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      fetch(`http://localhost:3000/api/estudio/${patientId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch historial clínico");
          }
          return response.json();
        })
        .then(async (data) => {
          // Actualizamos el historial con el nombre del tipo de estudio
          const updatedHistorial = await Promise.all(
            data.map(async (entry: HistorialClinico) => {
              const tipoEstudioNombre = await getTipoEstudio(
                entry.ID_TipoEstudio
              );
              return {
                ...entry,
                NombreTipoEstudio: tipoEstudioNombre || "Cargando...", // Si no hay nombre, ponemos un mensaje temporal
              };
            })
          );
          setHistorial(updatedHistorial); // Guardamos el historial actualizado con los nombres
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching historial clínico:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [patientId]);

  return { historial, loading, error, setHistorial };
}
