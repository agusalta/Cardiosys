"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react"; // Para el ícono de editar

// Datos de ejemplo para estudios cardiológicos
const initialCardiologyStudies = [
  { id: 1, name: "Electrocardiograma", cost: 100 },
  { id: 2, name: "Ecocardiograma", cost: 200 },
  { id: 3, name: "Prueba de esfuerzo", cost: 150 },
];

export default function EstudiosPage() {
  const [studies, setStudies] = useState(initialCardiologyStudies);

  const handleCostChange = (id: number, newCost: number) => {
    const updatedStudies = studies.map((study) =>
      study.id === id ? { ...study, cost: newCost } : study
    );
    setStudies(updatedStudies);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Estudios</h1>
      <div className="flex space-x-6">
        {/* Card 1: Estudios Cardiológicos */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Estudios Cardiológicos</CardTitle>
            <CardDescription>Lista de estudios con su costo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {studies.map((study) => (
                <li
                  key={study.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{study.name}</span>
                    <span className="text-sm text-gray-500">Costo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={study.cost}
                      onChange={(e) =>
                        handleCostChange(study.id, parseFloat(e.target.value))
                      }
                      className="w-24 text-right"
                    />
                    <Button variant="link">
                      <EditIcon className="text-gray-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Card de prueba */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Estudio de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Esta es una card de prueba para mostrar otra información.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
