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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(patient.altura) <= 0 || parseInt(patient.peso) <= 0) {
      setError("La altura y el peso deben ser valores positivos.");
      return;
    }
    setLoading(true);
    try {
      console.log(patient);
      // Lógica para enviar los datos al backend
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
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setLoading(false);
    }
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
            value={patient.altura.toString()}
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
            value={patient.peso.toString()}
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Paciente"}
      </Button>
    </form>
  );
}
