import ClinicalHistoryEntry from "../helpers/HistorialClinico";

function getHistorialClinico(): ClinicalHistoryEntry[] {
  return [
    {
      id: 1,
      fecha: "2023-05-15",
      observacion: "Consulta de rutina",
      asunto: "Chequeo anual",
      estudio: "Eco-doppler",
      archivos: ["chequeo_anual.pdf"],
    },
    {
      id: 2,
      fecha: "2023-06-20",
      observacion: "Control de presión arterial",
      asunto: "Seguimiento",
      factura: "F001",
      estudio: "Ecocardiograma Doppler",
      archivos: ["presion_arterial.pdf", "receta.pdf"],
    },
    {
      id: 3,
      fecha: "2023-07-10",
      observacion: "Exámenes de laboratorio",
      asunto: "Análisis de sangre",
      factura: "F002",
      estudio: "Eco-stress",
      archivos: ["resultados_laboratorio.pdf"],
    },
  ];
}

const mockClinicalHistory: ClinicalHistoryEntry[] = getHistorialClinico();

export default mockClinicalHistory;
