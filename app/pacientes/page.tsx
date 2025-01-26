"use client";

import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { PatientSearch } from "../components/PatientSearch";
import PatientList from "../components/PatientList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type Paciente from "../types/Pacientes";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pacientes");
        if (!response.ok) {
          throw new Error("Error al obtener los pacientes");
        }
        const data = await response.json();
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
    return <div>Cargando...</div>;
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
