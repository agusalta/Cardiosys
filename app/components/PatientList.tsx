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
import { Badge } from "@/components/ui/badge";
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

  const displayedPatients = limit ? patients.slice(0, limit) : patients;

  const getClinicaBadge = (clinica: string) => {
    switch (clinica) {
      case "La clinica del sol":
        return (
          <Badge
            variant="outline"
            color="blue"
            className="bg-blue-500 text-white border-blue-600 shadow-lg hover:bg-blue-600 transition-all"
          >
            <span className="sm:hidden">🌞</span> {/* Emoji para móvil */}
            <span className="hidden sm:inline">{clinica}</span>{" "}
            {/* Nombre para escritorio */}
          </Badge>
        );
      case "Pinamed":
        return (
          <Badge
            variant="outline"
            color="green"
            className="bg-green-500 text-white border-green-600 shadow-lg hover:bg-green-600 transition-all"
          >
            <span className="sm:hidden">🌲</span> {/* Emoji para móvil */}
            <span className="hidden sm:inline">{clinica}</span>{" "}
            {/* Nombre para escritorio */}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            color="gray"
            className="bg-gray-300 text-gray-800 border-gray-400 shadow-md hover:bg-gray-400 transition-all"
          >
            {clinica}
          </Badge>
        );
    }
  };

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
          <TableRow key={patient.id}>
            <TableCell>{patient.nombre}</TableCell>
            <TableCell>{patient.apellido}</TableCell>
            <TableCell>{patient.dni}</TableCell>
            <TableCell>{patient.fechaNacimiento}</TableCell>
            <TableCell>
              <Link href={`/pacientes/${patient.id}`} passHref>
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
