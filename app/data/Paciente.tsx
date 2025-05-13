import { useState, useEffect } from "react";
import Paciente from "../types/Pacientes";

export function usePatients() {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function getPatientById(id: number) {
    try {
      const response = await fetch(`${backendUrl}/pacientes/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      ("Error al obtener el paciente:", error);
    }
  }

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${backendUrl}/pacientes`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        ("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  return { patients, loading, getPatientById };
}
