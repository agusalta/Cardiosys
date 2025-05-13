export async function uploadFiles(files: File[], ID_Estudio: number) {
  try {
    // Itera sobre los archivos y los sube uno por uno
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    for (const file of files) {
      const formData = new FormData();

      formData.append("Archivo", file);
      formData.append("ID_Estudio", ID_Estudio.toString());

      const response = await fetch(`${backendUrl}/archivo/archivos`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Error uploading file ${file.name}: ${response.statusText}`
        );
      }

      await response.json();
    }

    return { message: "All files uploaded successfully" };
  } catch (error) {
    ("Error uploading files:", error);
    throw error;
  }
}

// Método para obtener archivos de un estudio específico
export async function fetchArchivosByEstudioId(idEstudio: number) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/archivo/estudio/${idEstudio}`);

    if (!response.ok) {
      throw new Error(`Error fetching archivos: ${response.statusText}`);
    }

    const archivos = await response.json();

    return archivos;
  } catch (error) {
    ("Error fetching archivos:", error);
    throw error;
  }
}

// Método para obtener un archivo por su id
export async function fetchArchivoContentById(idArchivo: number) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/archivo/${idArchivo}`);

    if (!response.ok) {
      throw new Error(`Error fetching archivos: ${response.statusText}`);
    }

    const archivo = await response.json();

    return archivo;
  } catch (error) {
    ("Error fetching archivos:", error);
    throw error;
  }
}

// Método para eliminar un archivo por su id
export async function deleteArchivo(idArchivo: number) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/archivo/${idArchivo}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      ("Error al eliminar el archivo:", errorData);
      throw new Error(
        errorData.error || "Error desconocido al eliminar el archivo"
      );
    }

    return await response.json();
  } catch (error: any) {
    ("Error:", error.message);
  }
}
