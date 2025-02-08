export function useSeguro() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL no está definido");
    throw new Error(
      "La variable de entorno NEXT_PUBLIC_BACKEND_URL no está configurada"
    );
  }

  async function getSeguroById(idSeguro: number) {
    try {
      const response = await fetch(`${backendUrl}/seguro/${idSeguro}`);

      if (!response.ok) {
        throw new Error(`Error al obtener el seguro: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error en getSeguroById:", error);
      return Promise.reject(error);
    }
  }

  async function getAllSeguros() {
    try {
      const response = await fetch(`${backendUrl}/seguro/seguros`);

      if (!response.ok) {
        throw new Error(
          `Error al obtener todos los seguros: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en getAllSeguros:", error);
      return Promise.reject(error);
    }
  }

  async function getEmpresaPrepagas() {
    try {
      const response = await fetch(`${backendUrl}/seguro/prepaga/empresas`);

      if (!response.ok) {
        throw new Error(
          `Error al obtener las empresas de prepagas: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error en getEmpresaPrepagas:", error);
      return Promise.reject(error);
    }
  }

  return { getSeguroById, getAllSeguros, getEmpresaPrepagas };
}
