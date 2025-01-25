export async function uploadFiles(files: File[], ID_Estudio: number) {
  try {
    // Itera sobre los archivos y los sube uno por uno
    for (let file of files) {
      const formData = new FormData();

      formData.append("Archivo", file);
      formData.append("ID_Estudio", ID_Estudio.toString());

      const response = await fetch(
        "http://localhost:3000/api/archivo/archivos",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error uploading file ${file.name}: ${response.statusText}`
        );
      }

      // Si todo va bien, puedes manejar la respuesta (si necesitas hacer algo con la respuesta)
      const result = await response.json();
    }

    return { message: "All files uploaded successfully" };
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}

// Método para obtener archivos de un estudio específico
export async function fetchArchivosByEstudioId(idEstudio: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/archivo/estudio/${idEstudio}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching archivos: ${response.statusText}`);
    }

    const archivos = await response.json();

    return archivos;
  } catch (error) {
    console.error("Error fetching archivos:", error);
    throw error;
  }
}

// Método para obtener un archivo por su id
export async function fetchArchivoContentById(idArchivo: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/archivo/${idArchivo}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching archivos: ${response.statusText}`);
    }

    const archivo = await response.json();

    return archivo;
  } catch (error) {
    console.error("Error fetching archivos:", error);
    throw error;
  }
}

// Método para eliminar un archivo por su id
export async function deleteArchivo(idArchivo: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/archivo/${idArchivo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al eliminar el archivo:", errorData);
      throw new Error(
        errorData.error || "Error desconocido al eliminar el archivo"
      );
    }

    const responseData = await response.json();
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}
