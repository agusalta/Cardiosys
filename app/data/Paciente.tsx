import { useState, useEffect } from "react";
import Paciente from "../types/Pacientes";

export function usePatients() {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  async function getPatientById(id: number) {
    try {
      const response = await fetch(`http://localhost:3000/api/pacientes/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el paciente:", error);
    }
  }

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/api/pacientes");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return { patients, loading, getPatientById };
}
