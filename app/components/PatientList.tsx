"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import type Paciente from "../types/Pacientes";

interface PatientListProps {
  patients: Paciente[];
}

export default function PatientList({ patients }: PatientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPatients, setDisplayedPatients] = useState<Paciente[]>([]);
  const patientsPerPage = 5;

  const totalPages = useMemo(
    () => Math.ceil(patients.length / patientsPerPage),
    [patients.length]
  );

  useEffect(() => {
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    setDisplayedPatients(
      patients.slice(indexOfFirstPatient, indexOfLastPatient)
    );
  }, [patients, currentPage, patientsPerPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(() => {
      const newPage = Math.max(1, Math.min(pageNumber, totalPages));
      return newPage;
    });
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  if (!patients || patients.length === 0) {
    return <p>No hay pacientes para mostrar.</p>;
  }

  return (
    <div>
      <Table className="text-paragraph">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Fecha de Nacimiento</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedPatients.map((patient) => (
            <TableRow key={patient.ID_Paciente}>
              <TableCell className="capitalize">{patient.Nombre}</TableCell>
              <TableCell className="capitalize">{patient.Apellido}</TableCell>
              <TableCell>{patient.DNI}</TableCell>
              <TableCell>
                {new Date(patient.FechaNacimiento).toLocaleDateString("es-AR")}
              </TableCell>
              <TableCell>
                <Link href={`/pacientes/${patient.ID_Paciente}`} passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold border-2 rounded-lg button-text"
                  >
                    Ver Detalles
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Mostrando {(currentPage - 1) * patientsPerPage + 1} -{" "}
          {Math.min(currentPage * patientsPerPage, patients.length)} de{" "}
          {patients.length} pacientes
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            Primera Página
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
