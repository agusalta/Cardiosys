"use client";

import { useState } from "react";
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
  const patientsPerPage = 5;

  if (!patients || patients.length === 0) {
    return <p>No hay pacientes para mostrar.</p>;
  }

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
          {currentPatients.map((patient) => (
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
                    className="font-bold border-2 bg-background button-text"
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
          Mostrando {indexOfFirstPatient + 1} -{" "}
          {Math.min(indexOfLastPatient, patients.length)} de {patients.length}{" "}
          pacientes
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="font-bold border-2 bg-background button-text"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="font-bold border-2 bg-background button-text"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
