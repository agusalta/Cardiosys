"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { PatientSearch } from "../components/PatientSearch";
import PatientList from "../components/PatientList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import initialPatients from "../data/Patient";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [clinicFilter, setClinicFilter] = useState<string>(""); // Estado para la clínica seleccionada

  const handleSearch = (query: string, clinic: string) => {
    // Filtramos primero por la búsqueda y luego por la clínica seleccionada
    const filteredPatients = initialPatients.filter((patient) => {
      const matchesQuery =
        patient.nombre.toLowerCase().includes(query.toLowerCase()) ||
        patient.apellido.toLowerCase().includes(query.toLowerCase()) ||
        patient.dni.includes(query);

      const matchesClinic = clinic
        ? patient.clinica.toLowerCase() === clinic.toLowerCase()
        : true; // Si no se ha seleccionado clínica, no aplica filtro por clínica

      return matchesQuery && matchesClinic;
    });
    setPatients(filteredPatients);
  };

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClinicFilter(e.target.value); // Actualiza el filtro por clínica
    handleSearch("", e.target.value); // Aplica el filtro por clínica al hacer el cambio
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pacientes</h1>
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {/* Actualiza el componente de búsqueda para incluir filtro por clínica */}
          <PatientSearch
            onSearch={(query) => handleSearch(query, clinicFilter)}
          />
          {/* Filtro por clínica */}
          <select
            value={clinicFilter}
            onChange={handleClinicChange}
            className="border px-4 py-2 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="">Toda s</option>
            <option value="La clinica del sol">La clinica del sol</option>
            <option value="Pinamed">Pinamed</option>
          </select>
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
