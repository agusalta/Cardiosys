"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatientList from "./components/PatientList";
import InsurancePieChart from "./components/InsurancePieChart";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import initialPatients from "./data/Patient";
import useStore from "./context/store";

const insuranceData = [
  { name: "OSDE", value: 400 },
  { name: "Swiss Medical", value: 300 },
  { name: "Medifé", value: 300 },
  { name: "Galeno", value: 200 },
  { name: "Ioma", value: 200 },
  { name: "Pami", value: 200 },
];

export default function Home() {
  const [showTotal, setShowTotal] = useState(true);
  const { clinicToday, clinicImage, updateClinicForToday } = useStore(); // Traemos los valores del estado global

  useEffect(() => {
    // Llamamos a la función para actualizar la clínica de hoy en el estado global
    updateClinicForToday();
  }, [updateClinicForToday]);

  const toggleVisibility = () => {
    setShowTotal((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bloque vertical: Obra Social Más Usada */}
        <Card className="md:col-span-1 md:row-span-2">
          <CardHeader>
            <CardTitle>Obra Social Más Usada</CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <InsurancePieChart data={insuranceData} />
          </CardContent>
        </Card>

        {/* Bloque horizontal: Pacientes Nuevos y Total Recaudado */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resumen Mensual</CardTitle>
            <hr />
          </CardHeader>
          <CardContent className="flex flex-col md:grid md:grid-cols-3 md:gap-2">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Pacientes Nuevos</h3>
              <p className="text-3xl font-bold">28</p>
              <p className="text-sm text-muted-foreground">Este mes</p>
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
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </button>
              </h3>
              <p className="text-3xl font-bold">
                {showTotal ? "$15,750" : "******"}
              </p>
              <p className="text-sm text-muted-foreground">
                Facturas particulares
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Pacientes</h3>
              <p className="text-3xl font-bold">120</p>
            </div>
          </CardContent>
        </Card>

        {/* Bloque vertical: Pacientes Recientes */}
        <Card className="md:col-span-2 md:row-span-2">
          <CardHeader>
            <CardTitle>Visitas Recientes</CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <PatientList patients={initialPatients} limit={5} />
            <div className="mt-4">
              <Link href="/pacientes" className="text-blue-500 hover:underline">
                Ver todos los pacientes
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Card de Clínica */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Clínica de Hoy: {clinicToday}</CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <img
              src={clinicImage || null} // Usamos la imagen determinada por el día de la semana desde el estado global
              alt="Clínica de Hoy"
              className="w-35 h-35 object-cover mx-auto" // Tamaño fijo de 100px por 100px
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
