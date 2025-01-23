export default function useCostoEstudio() {
  async function getCostoEstudio(ID_Seguro: number, ID_TipoEstudio: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/costoEstudio/get`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID_Seguro, ID_TipoEstudio }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.costo;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  async function updateCostoEstudio(
    ID_TipoEstudio: number,
    ID_Seguro: number,
    Costo: number
  ) {
    try {
      console.log("Datos enviados al backend:", {
        ID_TipoEstudio,
        ID_Seguro,
        Costo,
      });

      const response = await fetch(
        `http://localhost:3000/api/costoEstudio/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ID_TipoEstudio, ID_Seguro, Costo }),
        }
      );

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
      console.log("Datos recibidos del backend:", data);
      return data;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }
  return { getCostoEstudio, updateCostoEstudio };
}
