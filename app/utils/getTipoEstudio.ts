interface TipoEstudio {
  ID_TipoEstudio: number;
  NombreEstudio: string;
}

const tipoEstudioCache: { [key: number]: string } = {};

export async function getTipoEstudio(id: number): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (tipoEstudioCache[id]) {
    return tipoEstudioCache[id];
  }

  try {
    const response = await fetch(`${backendUrl}/tipoEstudio/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tipo estudio");
    }
    const data: TipoEstudio = await response.json();
    tipoEstudioCache[id] = data.NombreEstudio;

    return data.NombreEstudio;
  } catch (error) {
    ("Error fetching tipo estudio:", error);
    return "Error al cargar";
  }
}
