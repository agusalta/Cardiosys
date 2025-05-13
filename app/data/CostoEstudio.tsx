export default function useCostoEstudio() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function getCostoEstudio(ID_Seguro: number, ID_TipoEstudio: number) {
    try {
      const response = await fetch(`${backendUrl}/costoEstudio/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID_Seguro, ID_TipoEstudio }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.costo;
    } catch (error: any) {
      (error.message);
      return null;
    }
  }

  async function updateCostoEstudio(
    ID_TipoEstudio: number,
    ID_Seguro: number,
    Costo: number
  ) {
    try {
      const response = await fetch(`${backendUrl}/costoEstudio/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID_TipoEstudio, ID_Seguro, Costo }),
      });

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => null);
        throw new Error(
          `Error al realizar la solicitud: ${response.status} - ${
            response.statusText
          }
              URL: ${response.url}
              ${
                errorDetails
                  ? `Detalles: ${JSON.stringify(errorDetails)}`
                  : "No se encontraron detalles adicionales."
              }`
        );
      }

      const data = await response.json();

      return data;
    } catch (error: any) {
      (error.message);
      return null;
    }
  }

  async function getEstudiosMasRealizados() {
    try {
      const response = await fetch(`${backendUrl}/estudio/get/realizados`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      (error.message);
      return null;
    }
  }
  return { getCostoEstudio, updateCostoEstudio, getEstudiosMasRealizados };
}
