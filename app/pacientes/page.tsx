"use client";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { PatientSearch } from "../components/PatientSearch";
import PatientList from "../components/PatientList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import initialPatients from "../data/Paciente";

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  // const [clinicFilter, setClinicFilter] = useState<string>("");

  const handleSearch = (query: string) => {
    const filteredPatients = initialPatients.filter((patient) => {
      const matchesQuery =
        patient.nombre.toLowerCase().includes(query.toLowerCase()) ||
        patient.apellido.toLowerCase().includes(query.toLowerCase()) ||
        patient.dni.includes(query);

      // const matchesClinic = clinic
      //   ? patient.clinica.toLowerCase() === clinic.toLowerCase()
      //   : true;

      return matchesQuery;
    });
    setPatients(filteredPatients);
  };

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
      <PatientList patients={patients} />
    </div>
  );
}
