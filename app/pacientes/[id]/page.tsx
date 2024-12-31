"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonRemoveAlt1 } from "@mui/icons-material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Person,
  Height,
  MonitorWeight,
  MonitorHeart,
  AccessAlarm,
  Bloodtype,
  AttachFile,
  HealthAndSafety,
  LocalHospital,
  History,
  Visibility,
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
import Patient from "@/app/helpers/Patient";
import initialPatients from "@/app/data/Patient";
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

export default function PatientDetailsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const foundPatient = initialPatients.find(
      (patient) => patient.id.toString() === id
    );
    setPatient(foundPatient || null);
  }, [id]);

  if (!patient) {
    return <p>Cargando detalles del paciente...</p>;
  }

  const edad = calcularEdad(patient.fechaNacimiento);

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
              ? parseFloat(value)
              : value,
        };
      }
      return prevPatient;
    });
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Detalles del Paciente</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:space-x-4">
          <Button onClick={handleEditToggle} variant="outline">
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveChanges} variant="default">
              Guardar
            </Button>
          )}
          <Button>
            <PersonRemoveAlt1 />
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
                    name="nombre"
                    value={patient.nombre}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Apellido</div>
                  <Input
                    type="text"
                    name="apellido"
                    value={patient.apellido}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">DNI</div>
                  <Input
                    type="text"
                    name="dni"
                    value={patient.dni}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Fecha de Nacimiento</div>
                  <Input
                    type="date"
                    name="fechaNacimiento"
                    value={patient.fechaNacimiento}
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
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <Height className="inline-block mr-2" />
                    Altura
                  </div>
                  <Input
                    type="number"
                    name="altura"
                    value={patient.altura}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <MonitorWeight className="inline-block mr-2" />
                    Peso
                  </div>
                  <Input
                    type="number"
                    name="peso"
                    value={patient.peso}
                    onChange={handleInputChange}
                    step="0.1"
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <AccessAlarm className="inline-block mr-2" />
                    Frecuencia Respiratoria
                  </div>
                  <Input
                    type="number"
                    name="frecRespiratoria"
                    value={patient.frecRespiratoria}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <MonitorHeart className="inline-block mr-2" />
                    Frecuencia Cardiaca
                  </div>
                  <Input
                    type="number"
                    name="frecCardiaca"
                    value={patient.frecCardiaca}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <Bloodtype className="inline-block mr-2" />
                    Presión Arterial
                  </div>
                  <Input
                    type="text"
                    name="presionArterial"
                    value={patient.presionArterial}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
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
                    value={patient.obraSocial}
                    onChange={handleInputChange}
                    className={`w-48 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <LocalHospital className="inline-block mr-2" />
                    Clínica
                  </div>
                  <Select
                    name="clinica"
                    value={patient.clinica}
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "clinica", value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      className={`w-48 ${
                        isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar clínica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="La clinica del sol">
                        La clinica del sol
                      </SelectItem>
                      <SelectItem value="Pinamed">Pinamed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
