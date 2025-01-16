"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WcIcon from "@mui/icons-material/Wc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Height,
  MonitorWeight,
  MonitorHeart,
  AccessAlarm,
  Bloodtype,
  PersonRemoveAlt1,
  HealthAndSafety,
  History,
} from "@mui/icons-material";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Paciente, { Sexo } from "@/app/helpers/Pacientes";
import mockClinicalHistory from "@/app/data/HistorialClinico";

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

const calcularIMC = (peso: number, altura: number) => {
  return (peso / Math.pow(altura, 2)).toFixed(2);
};

function calcularSC(peso: number, altura: number): number | string {
  if (isNaN(peso) || isNaN(altura)) {
    return "Error: El peso y la altura deben ser números.";
  }
  if (peso <= 0 || altura <= 0) {
    return "Error: El peso y la altura deben ser valores positivos.";
  }
  if (peso > 500 || altura > 3) {
    return "Error: El peso y la altura parecen estar fuera de un rango razonable.";
  }

  const alturaCm = altura * 100;
  const scc = 0.007184;
  const superficieCorporal =
    scc * Math.pow(peso, 0.425) * Math.pow(alturaCm, 0.725);

  return parseFloat(superficieCorporal.toFixed(2));
}

interface Os {
  TipoSeguro: string;
}

export default function PatientDetailsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [os, setOs] = useState<Os | null>(null);
  const [originalPatient, setOriginalPatient] = useState<Paciente | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/pacientes/${id}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener el paciente con el id = " + id);
        }
        const data = await response.json();
        setPatient(data);
        setOriginalPatient(data);
      } catch (error) {
        console.error("Error al cargar el paciente:", error);
      }
    };

    fetchPatients();
  }, [id]);

  useEffect(() => {
    const fetchOS = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/seguro/seguros/${patient?.ID_Seguro}`
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener el seguro del paciente = " + patient?.ID_Paciente
          );
        }
        const data = await response.json();
        setOs(data);
      } catch (error) {
        console.error("Error al cargar el seguro:", error);
      }
    };

    fetchOS();
  });

  if (!patient) {
    return <p>Cargando detalles del paciente...</p>;
  }

  const edad = calcularEdad(patient.FechaNacimiento);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatient((prevPatient) => {
      if (prevPatient) {
        return {
          ...prevPatient,
          [name]:
            name === "altura" ||
            name === "peso" ||
            name === "frecRespiratoria" ||
            name === "frecCardiaca"
              ? value === ""
                ? ""
                : parseFloat(value)
              : value,
        };
      }
      return prevPatient;
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setPatient(originalPatient);
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    setOriginalPatient(patient);
    // Here you would typically save the changes to your backend
  };

  const handleSexChange = (value: Sexo) => {
    if (value === "M" || value === "F") {
      setPatient({ ...patient, Sexo: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Detalles del Paciente</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:space-x-4">
          <Button onClick={handleEditToggle} variant="outline">
            <EditIcon className="text-xl md:text-2xl" />
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveChanges} variant="default">
              Guardar
            </Button>
          )}
          <Button>
            <PersonRemoveAlt1 className="text-xl md:text-2xl" />
            <span className="hidden md:inline text-xs sm:text-sm">
              Eliminar paciente
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Datos del paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Nombre</div>
                  <Input
                    type="text"
                    name="Nombre"
                    value={patient.Nombre}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Apellido</div>
                  <Input
                    type="text"
                    name="Apellido"
                    value={patient.Apellido}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">DNI</div>
                  <Input
                    type="text"
                    name="DNI"
                    value={patient.DNI}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Correo electrónico</div>
                  <Input
                    type="email"
                    name="Email"
                    value={patient.Email}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Teléfono</div>
                  <Input
                    type="tel"
                    name="Telefono"
                    value={patient.Telefono}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Fecha de Nacimiento</div>
                  <Input
                    type="date"
                    name="FechaNacimiento"
                    value={
                      new Date(patient.FechaNacimiento)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Edad</div>
                  <div className="text-sm bg-transparent w-48">{edad} años</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Signos Vitales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <Height className="inline-block mr-2" />
                    Altura
                  </div>
                  <Input
                    type="number"
                    name="Altura"
                    value={patient.Altura}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    mts
                  </span>
                </div>

                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <MonitorWeight className="inline-block mr-2" />
                    Peso
                  </div>
                  <Input
                    type="number"
                    name="Peso"
                    value={patient.Peso}
                    onChange={handleInputChange}
                    step="0.1"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    kg
                  </span>
                </div>

                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <HealthAndSafety className="inline-block mr-2" />
                    Superficie Corporal
                  </div>
                  <Input
                    type="number"
                    name="sc"
                    value={calcularSC(patient.Peso, patient.Altura)}
                    onChange={handleInputChange}
                    step="0.1"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={true}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    sc
                  </span>
                </div>

                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <FitnessCenterIcon className="inline-block mr-2" />
                    IMC
                  </div>
                  <Input
                    type="number"
                    name="imc"
                    value={calcularIMC(patient.Peso, patient.Altura)}
                    onChange={handleInputChange}
                    step="0.1"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={true}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    kg
                  </span>
                </div>
                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <AccessAlarm className="inline-block mr-2" />
                    Frecuencia Respiratoria
                  </div>
                  <Input
                    type="number"
                    name="FrecuenciaRespiratoria"
                    value={patient.FrecuenciaRespiratoria}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    rpm
                  </span>
                </div>
                <div className="flex justify-between items-center relative">
                  <div className="font-semibold">
                    <MonitorHeart className="inline-block mr-2" />
                    Frecuencia Cardiaca
                  </div>
                  <Input
                    type="number"
                    name="FrecuenciaCardiaca"
                    value={patient.FrecuenciaCardiaca}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                  <span className="absolute right-0 mr-2 text-sm text-gray-300">
                    lpm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <HealthAndSafety className="inline-block mr-2" />
                    Obra Social
                  </div>
                  <Input
                    type="text"
                    name="obraSocial"
                    value={os?.TipoSeguro}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  <WcIcon className="inline-block mr-2" />
                  Sexo
                </div>
                <Select
                  name="Sexo"
                  value={patient.Sexo}
                  onValueChange={(value) => handleSexChange(value as Sexo)}
                  disabled={!isEditing}
                >
                  <SelectTrigger
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                  >
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full h-fit">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Historial Clínico</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/pacientes/${id}/historial-clinico`}>
                    <span className="hidden md:inline mr-2">
                      Ver Historial Completo
                    </span>
                    <History className="md:mr-0" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Observación</TableHead>
                    <TableHead>Estudio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClinicalHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.fecha}</TableCell>
                      <TableCell>{entry.observacion}</TableCell>
                      <TableCell>{entry.estudio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
