"use client";

import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { PatientSearch } from "../components/PatientSearch";
import PatientList from "../components/PatientList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type Paciente from "../types/Pacientes";
import Loader from "../components/Loader";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchPatients = async () => {
      if (!backendUrl) {
        console.error("Error: NEXT_PUBLIC_BACKEND_URL no está definido.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/pacientes`);

        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error(
            "Error: el servidor no devolvió un array de pacientes."
          );
        }

        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleFilteredPatientsChange = (newFilteredPatients: Paciente[]) => {
    setFilteredPatients(newFilteredPatients);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-h1">Pacientes</h1>
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <PatientSearch
            patients={patients}
            onFilteredPatientsChange={handleFilteredPatientsChange}
          />
        </div>
        <Button asChild className="button-text bg-button font-semibold">
          <Link href="/pacientes/nuevo" className="flex items-center gap-2">
            <AddIcon className="text-xl md:text-2xl" />
            <span className="hidden md:inline text-xs sm:text-sm">
              Agregar Nuevo Paciente
            </span>
          </Link>
        </Button>
      </div>
      <PatientList patients={filteredPatients} />
    </div>
  );
}
