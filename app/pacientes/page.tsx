"use client";

import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { PatientSearch } from "../components/PatientSearch";
import PatientList from "../components/PatientList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Paciente from "../types/Pacientes";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [originalPatients, setOriginalPatients] = useState<Paciente[]>([]);
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
        setOriginalPatients(data);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setPatients(originalPatients);
    } else {
      const filteredPatients = originalPatients.filter((patient) => {
        const matchesQuery =
          patient.Nombre.toLowerCase().includes(query.toLowerCase()) ||
          patient.Apellido.toLowerCase().includes(query.toLowerCase()) ||
          patient.DNI.includes(query);
        return matchesQuery;
      });
      setPatients(filteredPatients);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pacientes</h1>
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <PatientSearch onSearch={(query) => handleSearch(query)} />
        </div>
        <Button asChild>
          <Link href="/pacientes/nuevo" className="flex items-center gap-2">
            <AddIcon className="text-xl md:text-2xl" />
            <span className="hidden md:inline text-xs sm:text-sm">
              Agregar Nuevo Paciente
            </span>
          </Link>
        </Button>
      </div>
      <PatientList patients={patients} limit={Infinity} />
    </div>
  );
}
