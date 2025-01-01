"use client";
import React, { useState } from "react";

type Props = {};

function CreatePatientForm({}: Props) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    altura: "",
    peso: "",
    clinica: "",
    obraSocial: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí puedes agregar la lógica para enviar los datos al backend
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Crear Nuevo Paciente</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Datos del Paciente */}
          <div className="card mb-3">
            <div className="card-header">Datos del Paciente</div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  className="form-control"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  className="form-control"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Signos Vitales */}
          <div className="card mb-3">
            <div className="card-header">Signos Vitales</div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="altura">Altura (en metros)</label>
                <input
                  type="number"
                  id="altura"
                  name="altura"
                  className="form-control"
                  value={formData.altura}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="peso">Peso (en kg)</label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  className="form-control"
                  value={formData.peso}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="card mb-3">
            <div className="card-header">Información Adicional</div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="clinica">Clínica</label>
                <input
                  type="text"
                  id="clinica"
                  name="clinica"
                  className="form-control"
                  value={formData.clinica}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="obraSocial">Obra Social</label>
                <input
                  type="text"
                  id="obraSocial"
                  name="obraSocial"
                  className="form-control"
                  value={formData.obraSocial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Crear Paciente
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePatientForm;
