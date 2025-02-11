"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  HealthAndSafety,
  History,
  Delete,
} from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import Link from "next/link";
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
import {
  patientSchema,
  type PatientFormData,
} from "@/app/schemas/patientSchema";
import type Paciente from "@/app/types/Pacientes";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useHistorialClinico } from "@/app/data/HistorialClinico";
import { useSeguro } from "@/app/data/ObraSocial";
import type EmpresaSeguro from "@/app/types/EmpresaSeguro";
import { format } from "date-fns";
import Loader from "@/app/components/Loader";

const calcularIMC = (peso: number, altura: number) => {
  if (!peso || !altura) return "N/A";
  return (peso / Math.pow(altura, 2)).toFixed(2);
};

function calcularSC(peso: number, altura: number): number | string {
  if (!peso || !altura) return "N/A";
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

  return Number.parseFloat(superficieCorporal.toFixed(2));
}

interface Os {
  ID_Seguro: number;
  TipoSeguro: string;
}

function calcularEdad(fechaNacimiento: string | null): number {
  if (!fechaNacimiento) return 0;
  const nacimiento = new Date(fechaNacimiento);
  if (isNaN(nacimiento.getTime())) return 0;
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
  const router = useRouter();
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [EmpresaPrepaga, setEmpresaPrepagas] = useState<EmpresaSeguro[]>([]);
  const [showEmpresaSelect, setShowEmpresaSelect] = useState(false);
  const [seguros, setSeguros] = useState<Os[]>([]);
  const [os, setOs] = useState<Os | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { getSeguroById, getAllSeguros, getEmpresaPrepagas } = useSeguro();
  const { historial } = useHistorialClinico(patient?.ID_Paciente);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: PatientFormData = {
    Nombre: "",
    Apellido: "",
    DNI: "",
    Email: "",
    Telefono: "",
    FechaNacimiento: "",
    Altura: 0,
    Peso: 0,
    FrecuenciaRespiratoria: 0,
    FrecuenciaCardiaca: 0,
    Sexo: "M",
    ID_Seguro: 0,
    ID_Empresa: 0,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues,
  });

  const edad = calcularEdad(watch("FechaNacimiento") || null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Memoizar funciones para evitar recrearlas en cada renderizado
  const fetchPatientData = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/pacientes/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el paciente con el id = " + id);
      }
      const patientData = await response.json();
      setPatient(patientData);

      if (
        (patientData.ID_Empresa !== null && patientData.ID_Seguro == 25) ||
        patientData.ID_Seguro == 4
      ) {
        setShowEmpresaSelect(true);
      }
      reset(patientData);
    } catch (error) {
      console.error("Error al cargar el paciente:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del paciente.",
        variant: "destructive",
      });
    }
  }, [id, reset, toast, backendUrl]);

  const fetchSeguroData = useCallback(async () => {
    if (!patient?.ID_Seguro) return;

    try {
      const seguro = await getSeguroById(patient.ID_Seguro);
      setOs(seguro);
    } catch (error) {
      console.error("Error al cargar el seguro:", error);
    }
  }, [patient?.ID_Seguro, getSeguroById]);

  const fetchAllSeguros = useCallback(async () => {
    try {
      const seguros = await getAllSeguros();
      setSeguros(seguros);
    } catch (error) {
      console.error("Error al cargar los seguros:", error);
    }
  }, [getAllSeguros]);

  const fetchEmpresasPrepagas = useCallback(async () => {
    try {
      const empresas = await getEmpresaPrepagas();
      setEmpresaPrepagas(empresas);
    } catch (error) {
      console.error("Error al cargar las empresas:", error);
    }
  }, [getEmpresaPrepagas]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  // Cargar datos relacionados cuando el paciente cambia
  useEffect(() => {
    if (patient) {
      fetchSeguroData();
      fetchAllSeguros();
      fetchEmpresasPrepagas();
    }
  }, [patient, fetchSeguroData, fetchAllSeguros, fetchEmpresasPrepagas]);

  const handleMostrarEmpresa = (selectedSeguroId: number) => {
    const prepaga = seguros.find((seguro) => seguro.TipoSeguro === "Prepaga");

    setShowEmpresaSelect(selectedSeguroId === prepaga?.ID_Seguro);
  };

  if (!patient || isLoading) {
    return <Loader />;
  }

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      reset(patient); // Restaurar los valores originales al cancelar la edición
    }
  };

  const handleDeletePatient = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `${backendUrl}/pacientes/${patient?.ID_Paciente}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Error al eliminar el paciente");
      }

      toast({
        title: "Paciente eliminado",
        description: "El paciente ha sido eliminado correctamente.",
        variant: "default",
      });

      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error inesperado:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar el paciente",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: PatientFormData) => {
    try {
      const formattedData = {
        ...data,
        FechaNacimiento: data.FechaNacimiento
          ? new Date(data.FechaNacimiento).toISOString().split("T")[0]
          : null,
        ID_Seguro: data.ID_Seguro,
        Sexo: data.Sexo,
      };

      const response = await fetch(`${backendUrl}/pacientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el paciente");
      }

      const updatedPatient = await response.json();
      if (updatedPatient.message) {
        // This is likely an error or success message, not the updated patient data
        toast({
          title: "Éxito",
          description: updatedPatient.message,
        });
      } else {
        setPatient(updatedPatient);
      }
      setIsEditing(false);
      toast({
        title: "Éxito",
        description: `La información del paciente ${data.Apellido} se ha actualizado correctamente.`,
      });
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la información de este paciente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-h1">Detalles del Paciente</h1>
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:space-x-4">
          <Button
            onClick={handleEditToggle}
            variant="outline"
            className="font-bold border-2 rounded-lg button-text bg-background "
          >
            {!isEditing && <EditIcon className="text-xl md:text-2xl" />}
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="default"
              className="font-bold border-2 rounded-lg button-text bg-button "
            >
              Guardar
            </Button>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold border-2 rounded-lg text-background bg-danger">
                <Delete className="w-4 h-4" />
                Eliminar Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea eliminar al paciente? Esta acción no se
                  puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeletePatient}
                  disabled={isDeleting}
                  variant="destructive"
                  className="font-bold border-2 rounded-lg text-background bg-danger"
                >
                  {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="text-paragraph">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Datos del paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Nombre</div>
                    <Controller
                      name="Nombre"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.Nombre && (
                    <p className="text-red-500 text-sm">
                      {errors.Nombre.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Apellido</div>
                    <Controller
                      name="Apellido"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.Apellido && (
                    <p className="text-red-500 text-sm">
                      {errors.Apellido.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="font-semibold">DNI</div>
                    <Controller
                      name="DNI"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.DNI && (
                    <p className="text-red-500 text-sm">{errors.DNI.message}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Correo electrónico</div>
                    <Controller
                      name="Email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.Email && (
                    <p className="text-red-500 text-sm">
                      {errors.Email.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Teléfono</div>
                    <Controller
                      name="Telefono"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="tel"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.Telefono && (
                    <p className="text-red-500 text-sm">
                      {errors.Telefono.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Fecha de Nacimiento</div>
                    <Controller
                      name="FechaNacimiento"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          value={
                            field.value
                              ? format(new Date(field.value), "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? value : null);
                          }}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                  </div>
                  {errors.FechaNacimiento && (
                    <p className="text-red-500 text-sm">
                      {errors.FechaNacimiento.message}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Edad</div>
                    <div className="text-sm bg-transparent w-48">
                      {edad} años
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Signos Vitales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center relative">
                    <div className="font-semibold">
                      <Height className="inline-block mr-2" />
                      Altura
                    </div>
                    <Controller
                      name="Altura"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? null : Number.parseFloat(value)
                            );
                          }}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                    <span className="absolute right-0 mr-2 text-sm text-gray-300">
                      mts
                    </span>
                  </div>
                  {errors.Altura && (
                    <p className="text-red-500 text-sm">
                      {errors.Altura.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center relative">
                    <div className="font-semibold">
                      <MonitorWeight className="inline-block mr-2" />
                      Peso
                    </div>
                    <Controller
                      name="Peso"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? null : Number.parseFloat(value)
                            );
                          }}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                    <span className="absolute right-0 mr-2 text-sm text-gray-300">
                      kg
                    </span>
                  </div>
                  {errors.Peso && (
                    <p className="text-red-500 text-sm">
                      {errors.Peso.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center relative">
                    <div className="font-semibold">
                      <HealthAndSafety className="inline-block mr-2" />
                      Superficie Corporal
                    </div>
                    <Input
                      type="text"
                      name="sc"
                      value={calcularSC(watch("Peso"), watch("Altura"))}
                      className="w-48 bg-gray-100"
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
                      type="text"
                      name="imc"
                      value={calcularIMC(watch("Peso"), watch("Altura"))}
                      className="w-48 bg-gray-100"
                      disabled={true}
                    />
                    <span className="absolute right-0 mr-2 text-sm text-gray-300">
                      kg/m²
                    </span>
                  </div>

                  <div className="flex justify-between items-center relative">
                    <div className="font-semibold">
                      <AccessAlarm className="inline-block mr-2" />
                      Frecuencia Respiratoria
                    </div>
                    <Controller
                      name="FrecuenciaRespiratoria"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 0 : Number.parseInt(value, 10)
                            );
                          }}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                    <span className="absolute right-0 mr-2 text-sm text-gray-300">
                      rpm
                    </span>
                  </div>
                  {errors.FrecuenciaRespiratoria && (
                    <p className="text-red-500 text-sm">
                      {errors.FrecuenciaRespiratoria.message}
                    </p>
                  )}

                  <div className="flex justify-between items-center relative">
                    <div className="font-semibold">
                      <MonitorHeart className="inline-block mr-2" />
                      Frecuencia Cardiaca
                    </div>
                    <Controller
                      name="FrecuenciaCardiaca"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 0 : Number.parseInt(value, 10)
                            );
                          }}
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                          disabled={!isEditing}
                        />
                      )}
                    />
                    <span className="absolute right-0 mr-2 text-sm text-gray-300">
                      lpm
                    </span>
                  </div>
                  {errors.FrecuenciaCardiaca && (
                    <p className="text-red-500 text-sm">
                      {errors.FrecuenciaCardiaca.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">
                      <HealthAndSafety className="inline-block mr-2" />
                      Obra Social
                    </div>
                    <Controller
                      name="ID_Seguro"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            const seguroId = Number.parseInt(value);
                            field.onChange(seguroId);
                            handleMostrarEmpresa(seguroId);
                          }}
                          value={field.value?.toString()}
                          disabled={!isEditing}
                        >
                          <SelectTrigger
                            className={`w-48 ${
                              isEditing ? "bg-white" : "bg-gray-100"
                            }`}
                          >
                            <SelectValue placeholder="Seleccionar obra social" />
                          </SelectTrigger>
                          <SelectContent>
                            {seguros.map((seguro) => (
                              <SelectItem
                                key={seguro.ID_Seguro.toString()}
                                value={seguro.ID_Seguro.toString()}
                              >
                                {seguro.TipoSeguro}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.ID_Seguro && (
                    <p className="text-red-500 text-sm">
                      {errors.ID_Seguro.message}
                    </p>
                  )}
                </div>
              </CardContent>

              {showEmpresaSelect && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">
                        <BusinessIcon className="inline-block mr-2" />
                        Empresa
                      </div>
                      <Controller
                        name="ID_Empresa"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number.parseInt(value))
                            }
                            value={field.value?.toString()}
                            disabled={!isEditing}
                          >
                            <SelectTrigger
                              className={`w-48 ${
                                isEditing ? "bg-white" : "bg-gray-100"
                              }`}
                            >
                              <SelectValue placeholder="Seleccionar empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              {EmpresaPrepaga.map((empresa) => (
                                <SelectItem
                                  key={empresa.ID_Empresa}
                                  value={empresa.ID_Empresa.toString()}
                                >
                                  {empresa.NombreEmpresa}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {errors.ID_Empresa && (
                      <p className="text-red-500 text-sm">
                        {errors.ID_Empresa.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              )}

              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">
                    <WcIcon className="inline-block mr-2" />
                    Sexo
                  </div>
                  <Controller
                    name="Sexo"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        value={field.value || ""}
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          className={`w-48 ${
                            isEditing ? "bg-white" : "bg-gray-100"
                          }`}
                        >
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {errors.Sexo && (
                  <p className="text-red-500 text-sm">{errors.Sexo.message}</p>
                )}
              </CardContent>
            </Card>

            <Card className="w-full h-fit">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Historial Clínico</CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="font-bold border-2 rounded-lg button-text bg-button"
                  >
                    <Link href={`/pacientes/${id}/historial-clinico`}>
                      <History className="md:mr-0" />
                      <span className="hidden md:inline mr-2">
                        Ver Historial Completo
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Asunto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historial.map((entry) => (
                      <TableRow key={entry.ID_Estudio}>
                        <TableCell>
                          {new Date(entry.Fecha).toLocaleDateString("es-AR")}
                        </TableCell>
                        <TableCell>{entry.Asunto}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
}
