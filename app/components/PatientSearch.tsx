"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type Paciente from "../types/Pacientes";

interface PatientSearchProps {
  patients: Paciente[];
  onFilteredPatientsChange: (filteredPatients: Paciente[]) => void;
}

// Función para eliminar acentos
function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function PatientSearch({
  patients,
  onFilteredPatientsChange,
}: PatientSearchProps) {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = removeAccents(query.toLowerCase());
    return patients.filter((patient) =>
      removeAccents(
        `${patient.Nombre} ${patient.Apellido} ${patient.DNI}`.toLowerCase()
      ).includes(normalizedQuery)
    );
  }, [query, patients]);

  useEffect(() => {
    onFilteredPatientsChange(filteredPatients);
  }, [filteredPatients, onFilteredPatientsChange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por DNI, Nombre o Apellido"
        className="pl-8 w-full md:w-96 italic"
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}
