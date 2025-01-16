import Paciente from "../helpers/Pacientes";

export async function getPatients(): Promise<Paciente[]> {
  try {
    const response = await fetch("http://localhost:3000/api/pacientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los pacientes: ${response.statusText}`);
    }
    const data = await response.json();
    return data as Paciente[];
  } catch (error) {
    console.error("Error al cargar los pacientes:", error);
    return [];
  }
}

let initialPatients: Paciente[] = [];

getPatients().then((patients) => {
  initialPatients = patients;
});

export default initialPatients;
