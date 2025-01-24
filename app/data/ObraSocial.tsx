export function useSeguro() {
  async function getSeguroById(idSeguro: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/seguro/${idSeguro}`
      );

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
      const response = await fetch("http://localhost:3000/api/seguro/seguros");
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
      const response = await fetch(
        "http://localhost:3000/api/seguro/prepaga/empresas"
      );

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
