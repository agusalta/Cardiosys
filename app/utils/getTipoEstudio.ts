interface TipoEstudio {
  ID_TipoEstudio: number;
  NombreEstudio: string;
}

const tipoEstudioCache: { [key: number]: string } = {};

export async function getTipoEstudio(id: number): Promise<string> {
  if (tipoEstudioCache[id]) {
    return tipoEstudioCache[id];
  }

  try {
    const response = await fetch(`http://localhost:3000/api/tipoEstudio/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tipo estudio");
    }
    const data: TipoEstudio = await response.json();
    tipoEstudioCache[id] = data.NombreEstudio;

    console.log(data.NombreEstudio);
    return data.NombreEstudio;
  } catch (error) {
    console.error("Error fetching tipo estudio:", error);
    return "Error al cargar";
  }
}
