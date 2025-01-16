"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditIcon, XIcon, CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { initialCardiologyStudies } from "../data/Estudios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const insuranceMultipliers: {
  [key: string]: { multiplier: number };
  IOMA: { multiplier: number };
  PAMI: { multiplier: number };
  PREPAGA: { multiplier: number };
  PARTICULAR: { multiplier: number };
} = {
  IOMA: { multiplier: 1.2 },
  PAMI: { multiplier: 1.1 },
  PREPAGA: { multiplier: 1.5 },
  PARTICULAR: { multiplier: 1.0 },
};
export default function EstudiosPage() {
  const [studies, setStudies] = useState(initialCardiologyStudies);
  const [isEditing, setIsEditing] = useState(false);
  const [tempStudies, setTempStudies] = useState(initialCardiologyStudies);
  const [newStudy, setNewStudy] = useState({ name: "", cost: "" });
  const [selectedInsurance, setSelectedInsurance] = useState("IOMA");

  useEffect(() => {
    updateStudiesPrices(selectedInsurance);
  }, [selectedInsurance]);

  const updateStudiesPrices = (insurance: string) => {
    const updatedStudies = initialCardiologyStudies.map((study) => ({
      ...study,
      cost: study.cost * insuranceMultipliers[insurance].multiplier,
    }));
    setStudies(updatedStudies);
    setTempStudies(updatedStudies);
  };

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
    const updatedStudies = tempStudies.filter((study) => study.id !== id);
    setTempStudies(updatedStudies);
  };

  const handleAddStudy = () => {
    if (newStudy.name && parseFloat(newStudy.cost) > 0) {
      const newId = Math.max(...tempStudies.map((s) => s.id)) + 1;
      setTempStudies([
        ...tempStudies,
        { ...newStudy, id: newId, cost: parseFloat(newStudy.cost) },
      ]);
      setNewStudy({ name: "", cost: "" });
    }
  };

  const chartData = {
    labels: studies.map((study) => study.name),
    datasets: [
      {
        label: "Costo de estudios",
        data: studies.map((study) => study.cost),
        backgroundColor: "hsl(var(--primary))",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Costo de estudios cardiológicos",
      },
    },
  };

  const frequencyData = {
    labels: [
      "Electrocardiograma",
      "Ecocardiograma",
      "Holter",
      "Prueba de esfuerzo",
    ],
    datasets: [
      {
        label: "Estudios más realizados",
        data: [12, 19, 7, 14], // Valores simulados
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--muted))",
        ],
      },
    ],
  };

  const frequencyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Estudios más realizados en el mes",
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          Estudios Cardiológicos
        </h1>
        <div className="flex space-x-2">
          <Select
            onValueChange={setSelectedInsurance}
            defaultValue={selectedInsurance}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar Obra Social" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IOMA">IOMA</SelectItem>
              <SelectItem value="PAMI">PAMI</SelectItem>
              <SelectItem value="PREPAGA">PREPAGA</SelectItem>
              <SelectItem value="PARTICULAR">PARTICULAR</SelectItem>
            </SelectContent>
          </Select>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              <EditIcon className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <>
              <Button onClick={handleCancel} variant="outline">
                <XIcon className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} variant="default">
                <CheckIcon className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Nuevo Estudio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Estudio</DialogTitle>
                <DialogDescription>
                  Ingrese los detalles del nuevo estudio cardiológico.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddStudy();
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      value={newStudy.name}
                      onChange={(e) =>
                        setNewStudy({ ...newStudy, name: e.target.value })
                      }
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Costo
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      value={newStudy.cost}
                      onChange={(e) =>
                        setNewStudy({
                          ...newStudy,
                          cost: e.target.value,
                        })
                      }
                      className="col-span-3"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Agregar Estudio</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudios</CardTitle>
            <CardDescription>
              Gestiona los estudios cardiológicos y sus costos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Estudio</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  {isEditing && (
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tempStudies.map((study) => (
                  <TableRow key={study.id}>
                    <TableCell>{study.name}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={study.cost.toFixed(2)}
                        onChange={(e) =>
                          handleCostChange(study.id, parseFloat(e.target.value))
                        }
                        className="w-24 text-right"
                        disabled={!isEditing}
                      />
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(study.id)}
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Costos</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "450px", width: "100%" }}>
                <Bar
                  data={chartData}
                  options={{ ...chartOptions, maintainAspectRatio: false }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estudios más realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "450px", width: "100%" }}>
                <Pie
                  data={frequencyData}
                  options={{
                    ...frequencyOptions,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
