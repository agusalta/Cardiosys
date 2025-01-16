"use client";

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
import Paciente from "../helpers/Pacientes";

interface PatientListProps {
  patients?: Paciente[];
  limit?: number;
}

export default function PatientList({
  patients = [],
  limit,
}: PatientListProps) {
  if (!patients || patients.length === 0) {
    return <p>No hay pacientes para mostrar.</p>;
  }

  // Si se proporciona un límite, muestra solo los primeros 'limit' pacientes
  const displayedPatients = limit ? patients.slice(0, limit) : patients;

  return (
    <Table>
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
            <TableCell>{patient.Nombre}</TableCell>
            <TableCell>{patient.Apellido}</TableCell>
            <TableCell>{patient.DNI}</TableCell>
            <TableCell>
              {new Date(patient.FechaNacimiento).toLocaleDateString("es-AR")}
            </TableCell>
            <TableCell>
              <Link href={`/pacientes/${patient.ID_Paciente}`} passHref>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
