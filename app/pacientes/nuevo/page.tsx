"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation";
import { useSeguro } from "@/app/data/ObraSocial";
import Os from "@/app/types/Seguro";
import EmpresaSeguro from "@/app/types/EmpresaSeguro";

export default function CreatePatientForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    altura: "",
    peso: "",
    sexo: "",
    obraSocial: "",
    prepaidType: "",
    empresaId: "", // Added empresaId to the state
  });

  const [showEmpresaSelect, setShowEmpresaSelect] = useState(false);
  const [seguros, setSeguros] = useState<Os[]>([]);
  const [EmpresaPrepaga, setEmpresaPrepagas] = useState<EmpresaSeguro[]>([]);
  const { getEmpresaPrepagas, getAllSeguros } = useSeguro();

  const handleGetEmpresasPrepagas = async () => {
    try {
      const empresas = await getEmpresaPrepagas();
      setEmpresaPrepagas(empresas);
    } catch (error) {
      console.error("Error al cargar las empresas:", error);
    }
  };

  const handleGetAllSeguros = async () => {
    try {
      const seguros = await getAllSeguros();
      setSeguros(seguros);
      console.log(seguros);
      return;
    } catch (error) {
      console.error("Error al cargar los seguros:", error);
    }
  };

  useEffect(() => {
    handleGetEmpresasPrepagas();
    handleGetAllSeguros();
  }, []);

  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "obraSocial") {
      setShowEmpresaSelect(value === "4");
      if (value !== "4") {
        setFormData((prevState) => ({
          ...prevState,
          empresaId: "",
        }));
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      telefono: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar datos antes de enviar la solicitud
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.dni ||
      !formData.correo
    ) {
      const validationError =
        "Todos los campos obligatorios deben ser completados.";
      toast({
        title: "Error de validación",
        description: validationError,
        variant: "destructive",
        duration: 5000,
      });
      return; // Detener el proceso de envío si los campos son inválidos
    }

    const patientData = {
      ID_Paciente: 0,
      ID_Seguro: Number.parseInt(formData.obraSocial),
      ID_Empresa:
        formData.obraSocial === "4"
          ? Number.parseInt(formData.empresaId)
          : null,
      Nombre: formData.nombre,
      Apellido: formData.apellido,
      DNI: formData.dni,
      Email: formData.correo,
      Telefono: formData.telefono,
      FechaNacimiento: formData.fechaNacimiento,
      Altura: formData.altura,
      Peso: formData.peso,
      FrecuenciaCardiaca: 75,
      FrecuenciaRespiratoria: 18,
      Sexo: formData.sexo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message;
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, maneja el éxito
      const data = await response.json();

      toast({
        title: "Éxito",
        description: `El paciente ha sido creado correctamente.`,
        duration: 5000,
      });

      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        fechaNacimiento: "",
        correo: "",
        telefono: "",
        altura: "",
        peso: "",
        sexo: "",
        obraSocial: "",
        prepaidType: "",
        empresaId: "",
      });

      const url = `/pacientes/${data.ID_Paciente}`;
      router.push(url);
    } catch (error: any) {
      console.error("Error:", error?.message);

      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-h1 text-2xl">
            Crear Nuevo Paciente
          </CardTitle>
          <CardDescription>
            Ingrese los datos del nuevo paciente en el formulario a
            continuación.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-paragraph">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Datos Personales</TabsTrigger>
                <TabsTrigger value="vitals">Signos Vitales</TabsTrigger>
                <TabsTrigger value="additional">
                  Información Adicional
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apellido"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellido
                    </label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Pérez"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dni"
                      className="block text-sm font-medium text-gray-700"
                    >
                      DNI
                    </label>
                    <Input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={handleInputChange}
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fechaNacimiento"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fecha de Nacimiento
                    </label>
                    <Input
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="correo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Correo
                    </label>
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleInputChange}
                      placeholder="juan.perez@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Teléfono
                    </label>
                    <PhoneInput
                      country={"ar"}
                      value={formData.telefono}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: "telefono",
                        required: true,
                        autoFocus: true,
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        fontSize: "16px",
                        paddingLeft: "48px",
                        borderRadius: "4px",
                      }}
                      buttonStyle={{
                        borderTopLeftRadius: "4px",
                        borderBottomLeftRadius: "4px",
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="vitals">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="altura"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Altura (en metros)
                    </label>
                    <Input
                      id="altura"
                      name="altura"
                      type="number"
                      step="0.01"
                      value={formData.altura}
                      onChange={handleInputChange}
                      placeholder="1.70"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Ingrese la altura en metros (ej. 1.70)
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="peso"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Peso (en kg)
                    </label>
                    <Input
                      id="peso"
                      name="peso"
                      type="number"
                      value={formData.peso}
                      onChange={handleInputChange}
                      placeholder="70"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Ingrese el peso en kilogramos
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="additional">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="sexo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sexo
                    </label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("sexo", value)
                      }
                      value={formData.sexo}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor="obraSocial"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Obra Social
                    </label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("obraSocial", value)
                      }
                      value={formData.obraSocial}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la obra social" />
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
                  </div>
                  {showEmpresaSelect && (
                    <div>
                      <label
                        htmlFor="empresaId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Empresa
                      </label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange("empresaId", value)
                        }
                        value={formData.empresaId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la empresa" />
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
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full button-text font-bold">
              Crear Paciente
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}
