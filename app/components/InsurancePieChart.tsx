"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";

// Registra los componentes necesarios de Chart.js
Chart.register(PieController, ArcElement, Tooltip, Legend);

interface InsuranceData {
  Seguro: string;
  NumeroDePacientes: number;
}

const COLORS = [
  "#3498db", // Bright blue
  "#e74c3c", // Soft red
  "#2ecc71", // Emerald green
  "#f39c12", // Orange
  "#9b59b6", // Amethyst purple
  "#1abc9c", // Turquoise
  "#34495e", // Dark blue gray
  "#d35400", // Pumpkin orange
];

export default function InsurancePieChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"pie"> | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backendUrl}/seguro/empresa/cant`);
        const data: InsuranceData[] = await response.json();

        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");

          if (ctx) {
            // Destruye la instancia anterior del gráfico si existe
            if (chartInstance.current) {
              chartInstance.current.destroy();
            }

            // Crea el gráfico de torta
            chartInstance.current = new Chart(ctx, {
              type: "pie",
              data: {
                labels: data.map((item) => item.Seguro),
                datasets: [
                  {
                    label: "Número de Pacientes",
                    data: data.map((item) => item.NumeroDePacientes),
                    backgroundColor: COLORS,
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value} pacientes`;
                      },
                    },
                  },
                  legend: {
                    position: "right",
                    align: "center",
                    labels: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                },
              },
            });
          }
        }
      } catch (error) {
        ("Error fetching insurance data:", error);
      }
    };

    fetchData();
  }, [backendUrl]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-left text-3xl font-bold">
          Distribución de Seguros
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[calc(100%-4rem)]">
        <canvas ref={chartRef} className="w-full h-full max-w-md" />
      </CardContent>
    </Card>
  );
}
