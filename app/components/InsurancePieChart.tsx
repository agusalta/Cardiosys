"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  const [data, setData] = useState<InsuranceData[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/seguro/empresa/cant`)
      .then((response) => response.json())
      .then(setData)
      .catch((error: any) =>
        console.error("Error fetching insurance data:", error)
      );
  }, [backendUrl]);

  const totalPatients = data.reduce(
    (sum, item) => sum + item.NumeroDePacientes,
    0
  );

  return (
    <Card className="w-full h-full border-2 rounded-lg">
      <CardHeader>
        <CardTitle className="text-left text-3xl text-bold">
          Distribución de Seguros
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[calc(100%-4rem)]">
        <ChartContainer
          config={{
            ...Object.fromEntries(
              data.map((item, index) => [
                item.Seguro,
                { label: item.Seguro, color: COLORS[index % COLORS.length] },
              ])
            ),
          }}
          className="w-full h-full max-w-md"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="NumeroDePacientes"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs font-medium"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.Seguro}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry, index) => (
                  <span className="text-sm font-medium">
                    {data[index]?.Seguro} (
                    {(
                      ((data[index]?.NumeroDePacientes || 0) / totalPatients) *
                      100
                    ).toFixed(1)}
                    %)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
