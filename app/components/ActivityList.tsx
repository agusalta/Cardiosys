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
import Actividad from "../types/Activity";

interface ActivityListProps {
  activities?: Actividad[];
  limit?: number;
}

export default function ActivityList({
  activities = [],
  limit,
}: ActivityListProps) {
  if (!activities || activities.length === 0) {
    return <p>No hay actividades recientes para mostrar.</p>;
  }

  const displayedActivities = limit ? activities.slice(0, limit) : activities;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo de Actividad</TableHead>
          <TableHead>Detalle</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedActivities.map((activity) => (
          <TableRow key={activity.ID}>
            <TableCell>{activity.Tipo}</TableCell>
            <TableCell>{activity.Detalle}</TableCell>
            <TableCell>{activity.Paciente}</TableCell>
            <TableCell>
              {new Date(activity.Fecha).toLocaleDateString("es-AR")}
            </TableCell>
            <TableCell>
              <Link
                href={
                  activity.Tipo === "Estudio"
                    ? `/pacientes/${activity.ID_Paciente}/historial-clinico/${activity.ID}`
                    : `/pacientes/${activity.ID}`
                }
                passHref
              >
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
