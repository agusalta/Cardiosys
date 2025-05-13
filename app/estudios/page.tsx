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

interface EstudiosMasRealizados {
  Cantidad_Realizados: number;
  Nombre_Estudio: string;
}

export default function EstudiosPage() {
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [studiesWithCost, setStudiesWithCost] = useState<TipoEstudioConCosto[]>(
    []
  );

  const { fetchTipoEstudios } = useTipoEstudio();
  const { getCostoEstudio, updateCostoEstudio, getEstudiosMasRealizados } =
    useCostoEstudio();
  const [estudiosMasRealizados, setEstudiosMasRealizados] = useState<
    EstudiosMasRealizados[]
  >([]);
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const { getAllSeguros } = useSeguro();
  const { toast } = useToast();

  const fetchEstudiosMasRealizados = async () => {
    try {
      const data = await getEstudiosMasRealizados();

      setEstudiosMasRealizados(data);
    } catch (error) {
      ("Error fetching studies:", error);
      setEstudiosMasRealizados([]);
    }
  };

  useEffect(() => {
    fetchTipoEstudios().then((studies) =>
      setStudiesWithCost(
        studies.map((study: TipoEstudioConCosto) => ({ ...study, costo: 0 }))
      )
    );
    getAllSeguros().then((seguros) => setSeguros(seguros));
    fetchEstudiosMasRealizados();
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
      ("Error al actualizar el costo:", error);

      toast({
        title: "Error",
        description:
          "Ocurrió un error al actualizar el costo. Por favor, intente nuevamente.",
      });
    }
  };

  const COLORS = [
    "#3498db", // Bright blue
    "#e74c3c", // Soft red
    "#2ecc71", // Emerald green
    "#f39c12", // Orange
    "#9b59b6", // Amethyst purple
    "#1abc9c", // Turquoise
    "#34495e", // Dark blue gray
    "#d35400", // Pumpkin orange
    "#16a085", // Sea green
    "#f1c40f", // Yellow
    "#e67e22", // Carrot orange
    "#95a5a6", // Concrete gray
    "#2c3e50", // Midnight blue
    "#8e44ad", // Purple
    "#27ae60", // Green
    "#2980b9", // Bright blue
    "#8e44ad", // Purple
    "#c0392b", // Strong red
    "#f4c542", // Light yellow
  ];

  const chartData = {
    labels: studiesWithCost.map((study) => study.NombreEstudio),
    datasets: [
      {
        label: "Costo de estudios",
        data: studiesWithCost.map((study) => study.costo),
        backgroundColor: COLORS,
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

  // Nuevo gráfico de distribución por estudios mas realizados
  const studiesDistributionData = {
    labels: estudiosMasRealizados?.map((study) => study?.Nombre_Estudio) || "",
    datasets: [
      {
        label: "Cantidad de estudios",
        data:
          estudiosMasRealizados?.map((study) => study?.Cantidad_Realizados) ||
          " ",
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-h1">Estudios Cardiológicos</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-paragraph">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Lista de Estudios</CardTitle>
            <CardDescription>
              Gestiona los costos de los estudios cardiológicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Estudio</TableHead>
                  <TableHead className="text-center">Costo</TableHead>
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
                        value={(study.costo && study.costo) || ""}
                        onChange={(e) =>
                          handleCostChange(
                            study.ID_TipoEstudio,
                            Number(e.target.value)
                          )
                        }
                        disabled={!selectedInsurance}
                        className="w-24 text-left"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleUpdateCost(study)}
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto button-text bg-button font-bold"
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
              <CardTitle>Gráfico de costos</CardTitle>
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
              <CardTitle>Cantidad de estudios realizados por tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: "450px", width: "100%" }}>
                <Pie
                  data={studiesDistributionData}
                  options={{
                    ...estudiosMasRealizados,
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
