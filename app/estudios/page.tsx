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
import { SaveIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { useTipoEstudio } from "../data/TipoEstudio";
import type TipoEstudio from "../types/TipoEstudio";
import { useSeguro } from "../data/ObraSocial";
import useCostoEstudio from "../data/CostoEstudio";
import type Seguro from "../types/Seguro";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TipoEstudioConCosto extends TipoEstudio {
  costo: number;
}

export default function EstudiosPage() {
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [studiesWithCost, setStudiesWithCost] = useState<TipoEstudioConCosto[]>(
    []
  );
  const { fetchTipoEstudios } = useTipoEstudio();
  const { getCostoEstudio, updateCostoEstudio } = useCostoEstudio();
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const { getAllSeguros } = useSeguro();
  const { toast } = useToast();

  useEffect(() => {
    fetchTipoEstudios().then((studies) =>
      setStudiesWithCost(
        studies.map((study: TipoEstudioConCosto) => ({ ...study, costo: 0 }))
      )
    );
    getAllSeguros().then((seguros) => setSeguros(seguros));
  }, []);

  useEffect(() => {
    if (selectedInsurance) {
      fetchUpdatedCosts();
    }
  }, [selectedInsurance]);

  const fetchUpdatedCosts = async () => {
    if (selectedInsurance) {
      const updatedStudies = await Promise.all(
        studiesWithCost.map(async (study) => {
          const costo = await getCostoEstudio(
            Number.parseInt(selectedInsurance, 10),
            study.ID_TipoEstudio
          );
          return {
            ...study,
            costo: costo !== null && costo !== undefined ? costo : 0,
          };
        })
      );
      setStudiesWithCost(updatedStudies);
    }
  };

  const handleCostChange = (id: number, newCost: number) => {
    setStudiesWithCost((prevStudies) =>
      prevStudies.map((study) =>
        study.ID_TipoEstudio === id ? { ...study, costo: newCost } : study
      )
    );
  };

  const handleUpdateCost = async (study: TipoEstudioConCosto) => {
    if (!selectedInsurance) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una obra social primero.",
      });
      return;
    }

    try {
      await updateCostoEstudio(
        study.ID_TipoEstudio,
        Number.parseInt(selectedInsurance, 10),
        study.costo
      );

      toast({
        title: "Éxito",
        description: "Costo actualizado exitosamente",
      });

      await fetchUpdatedCosts();
    } catch (error) {
      console.error("Error al actualizar el costo:", error);

      toast({
        title: "Error",
        description:
          "Ocurrió un error al actualizar el costo. Por favor, intente nuevamente.",
      });
    }
  };

  const chartData = {
    labels: studiesWithCost.map((study) => study.NombreEstudio),
    datasets: [
      {
        label: "Costo de estudios",
        data: studiesWithCost.map((study) => study.costo),
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

  // Nuevo gráfico de distribución de costos
  const studiesDistributionData = {
    labels: studiesWithCost.map((study) => study.NombreEstudio),
    datasets: [
      {
        label: "Cantidad de estudios",
        data: studiesWithCost.map((study) => (study.costo > 0 ? 1 : 0)),
        backgroundColor: [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--muted))",
          "hsl(var(--card))",
          "hsl(var(--card-foreground))",
          "hsl(var(--popover))",
          "hsl(var(--popover-foreground))",
        ],
      },
    ],
  };

  const studiesDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: `Distribución de estudios para ${
          seguros.find((s) => s.ID_Seguro === Number(selectedInsurance))
            ?.TipoSeguro || "seguro seleccionado"
        }`,
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Estudios Cardiológicos</h1>
        <Select onValueChange={setSelectedInsurance} value={selectedInsurance}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Seleccionar Obra Social" />
          </SelectTrigger>
          <SelectContent>
            {seguros &&
              seguros.map((s: Seguro) => (
                <SelectItem key={s.ID_Seguro} value={String(s.ID_Seguro)}>
                  {s.TipoSeguro}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudios</CardTitle>
            <CardDescription>
              Gestiona los costos de los estudios cardiológicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Estudio</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studiesWithCost.map((study) => (
                  <TableRow key={study.ID_TipoEstudio}>
                    <TableCell>{study.NombreEstudio}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={study.costo}
                        onChange={(e) =>
                          handleCostChange(
                            study.ID_TipoEstudio,
                            Number(e.target.value)
                          )
                        }
                        disabled={!selectedInsurance}
                        className="w-24 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleUpdateCost(study)}
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={!selectedInsurance}
                      >
                        <SaveIcon className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Actualizar</span>
                      </Button>
                    </TableCell>
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
              <CardTitle>Distribución de Estudios por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "450px", width: "100%" }}>
                <Pie
                  data={studiesDistributionData}
                  options={{
                    ...studiesDistributionOptions,
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
