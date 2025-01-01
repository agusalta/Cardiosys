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
import { EditIcon, XIcon, CheckIcon, TrashIcon } from "lucide-react";
import { Archive, Delete } from "@mui/icons-material";

const initialCardiologyStudies = [
  { id: 1, name: "Electrocardiograma", cost: 100 },
  { id: 2, name: "Ecocardiograma", cost: 200 },
  { id: 3, name: "Prueba de esfuerzo", cost: 150 },
];

export default function EstudiosPage() {
  const [studies, setStudies] = useState(initialCardiologyStudies);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudies, setTempStudies] = useState(initialCardiologyStudies);

  const handleCostChange = (id: number, newCost: number) => {
    const updatedStudies = tempStudies.map((study) =>
      study.id === id ? { ...study, cost: newCost } : study
    );
    setTempStudies(updatedStudies);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempStudies(studies);
    setIsEditing(false);
  };

  const handleSave = () => {
    setStudies(tempStudies);
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    const updatedStudies = studies.filter((study) => study.id !== id);
    setStudies(updatedStudies);
    setTempStudies(updatedStudies);
  };

  return (
    <div className="space-y-6">
      {/* Contenedor de título y botones */}
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">Estudios</h1>
        <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <EditIcon className="text-xl md:text-2xl" />
              Editar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <XIcon className="text-xl md:text-2xl" />
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <CheckIcon className="text-xl md:text-2xl" />
                Guardar
              </Button>
            </div>
          )}

          <Button>
            <Archive className="text-xl md:text-2xl" />
            <span className="hidden md:inline text-xs sm:text-sm">
              Nuevo estudio
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Estudios Cardiológicos */}
        <Card>
          <CardHeader>
            <CardTitle>Estudios Cardiológicos</CardTitle>
            <CardDescription>Lista de estudios con su costo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tempStudies.map((study) => (
                <li
                  key={study.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{study.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={study.cost}
                      onChange={(e) =>
                        handleCostChange(study.id, parseFloat(e.target.value))
                      }
                      className="w-24 text-right"
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(study.id)}
                        className="flex items-center gap-2"
                      >
                        <Delete className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Card de prueba */}
        <Card>
          <CardHeader>
            <CardTitle>Card de Prueba</CardTitle>
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
