"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PatientForm() {
  const [patient, setPatient] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    obraSocial: "",
    fechaNacimiento: "",
    altura: "",
    peso: "",
    motivoConsulta: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(patient);
    // Aquí iría la lógica para enviar los datos al backend
    setPatient({
      nombre: "",
      apellido: "",
      dni: "",
      obraSocial: "",
      fechaNacimiento: "",
      altura: "",
      peso: "",
      motivoConsulta: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={patient.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            value={patient.apellido}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dni">DNI</Label>
        <Input
          id="dni"
          name="dni"
          value={patient.dni}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="obraSocial">Obra Social</Label>
        <Input
          id="obraSocial"
          name="obraSocial"
          value={patient.obraSocial}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
          <Input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            value={patient.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altura">Altura (cm)</Label>
          <Input
            id="altura"
            name="altura"
            type="number"
            value={patient.altura}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            name="peso"
            type="number"
            value={patient.peso}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="motivoConsulta">Motivo de Consulta</Label>
        <Textarea
          id="motivoConsulta"
          name="motivoConsulta"
          value={patient.motivoConsulta}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Guardar Paciente
      </Button>
    </form>
  );
}
