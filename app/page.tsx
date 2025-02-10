"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useActivity } from "./data/Activity";
import useStore from "./context/store";
import Image from "next/image";
import ActivityList from "./components/ActivityList";

import InsurancePieChart from "./components/InsurancePieChart";
import Loader from "./components/Loader";

export default function Home() {
  const [showTotal, setShowTotal] = useState(true);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [monthTotalPatients, setMonthTotal] = useState(0);
  const [monthTotalCollected, setMonthTotalCollected] = useState(0);
  const { clinicImage, updateClinicForToday } = useStore();
  const { activities, loading } = useActivity();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    updateClinicForToday();
  }, [updateClinicForToday]);

  const getTotalPacientes = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/pacientes/get/count`);
      if (!response.ok)
        throw new Error("No se pudo traer el conteo total de pacientes");

      const data = await response.json();
      setTotalPacientes(data);
    } catch (error) {
      console.error(error);
      setTotalPacientes(0);
    }
  }, [backendUrl]);

  const getPacientesNuevosEsteMes = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/pacientes/get/month`);
      if (!response.ok)
        throw new Error(
          "No se pudo traer el conteo total de pacientes este mes"
        );

      const data = await response.json();
      setMonthTotal(data.total || 0);
    } catch (error) {
      console.error(error);
      setMonthTotal(0);
    }
  }, [backendUrl]);

  const getMonthTotalCollected = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/estudio/get/count`);
      if (!response.ok)
        throw new Error("No se pudo traer el conteo total del mes");

      const data = await response.json();
      setMonthTotalCollected(data.totalRecaudado || 0);
    } catch (error) {
      console.error(error);
      setMonthTotalCollected(0);
    }
  }, [backendUrl]);

  useEffect(() => {
    getTotalPacientes();
    getPacientesNuevosEsteMes();
    getMonthTotalCollected();
  }, [getTotalPacientes, getPacientesNuevosEsteMes, getMonthTotalCollected]);

  const toggleVisibility = () => {
    setShowTotal((prev) => !prev);
  };

  return (
    <div className="space-y-6 bg-background">
      <h1 className="text-4xl font-extrabold text-h1 h1">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 md:row-span-2 flex justify-center items-center border rounded-lg">
          <InsurancePieChart />
        </Card>

        {/* Resumen Mensual */}
        <Card className="md:col-span-2 border-2 rounded-lg">
          <CardHeader>
            <CardTitle className="text-h1 text-2xl">Resumen Mensual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:grid md:grid-cols-3 md:gap-2 text-paragraph">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Pacientes Nuevos</h3>
              <p className="text-2xl font-bold text-slate-600">
                {monthTotalPatients}
              </p>
              <p className="text-sm text-muted-foreground italic">Este mes</p>
            </div>
            <div className="relative mb-4 md:mb-0">
              <h3 className="text-lg font-semibold flex items-center">
                Total Recaudado
                <button
                  onClick={toggleVisibility}
                  className="ml-2 text-gray-500 hover:text-gray-800"
                  aria-label="Toggle visibility"
                >
                  {showTotal ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </h3>
              <p className="text-2xl font-bold text-slate-600">
                {showTotal
                  ? "******"
                  : monthTotalCollected.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    })}
              </p>
              <p className="text-sm text-muted-foreground italic">
                Facturas particulares
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pacientes Totales</h3>
              <p className="text-2xl font-bold text-slate-600">
                {totalPacientes}
              </p>
              <p className="text-sm text-muted-foreground italic">
                Desde el inicio
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visitas Recientes */}
        <Card className="md:col-span-2 md:row-span-2 border-2 rounded-lg">
          <CardHeader>
            <CardTitle className="text-h1 text-2xl">
              Visitas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : (
              <ActivityList activities={activities} limit={5} />
            )}
            <div className="mt-4">
              <Link
                href="/pacientes"
                className="text-blue-700 text-muted-foreground italic hover:underline"
              >
                Ver todos los pacientes
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Clínica de Hoy */}
        <Card className="md:col-span-1 border-2 rounded-lg">
          <CardHeader>
            <CardTitle className="text-h1 text-2xl">Clínica de Hoy:</CardTitle>
          </CardHeader>
          <CardContent>
            {clinicImage ? (
              <Image
                src={clinicImage}
                alt="Clínica de Hoy"
                className="object-cover mx-auto"
                width={200}
                height={200}
              />
            ) : (
              <p>Ninguna, buen fin de semana!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
