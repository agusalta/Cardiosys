export function useSeguro() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function getSeguroById(idSeguro: number) {
    try {
      const response = await fetch(`${backendUrl}/seguro/${idSeguro}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async function getAllSeguros() {
    try {
      const response = await fetch(`${backendUrl}/seguro/seguros`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error al cargar los pacientes:", error);
    }
  }

  async function getEmpresaPrepagas() {
    try {
      const response = await fetch(`${backendUrl}/seguro/prepaga/empresas`);

      if (!response.ok) {
        throw new Error("Error al obtener las empresas");
      }
      const data = await response.json();

      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return { getSeguroById, getAllSeguros, getEmpresaPrepagas };
}
