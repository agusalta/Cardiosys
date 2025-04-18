import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";
import type HistorialClinico from "../types/HistorialClinico";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { usePatients } from "../data/Paciente";
import type Paciente from "../types/Pacientes";

const ExportDialog = ({
  isExporting,
  setIsExporting,
  historial,
}: {
  isExporting: boolean;
  setIsExporting: (open: boolean) => void;
  historial: HistorialClinico[];
}) => {
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [cantidadEstudios, setCantidadEstudios] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estudiosFiltrados, setEstudiosFiltrados] = useState<
    HistorialClinico[]
  >([]);
  const { getPatientById } = usePatients();

  useEffect(() => {
    if (fechaDesde && fechaHasta) {
      const filtrados = historial.filter(({ Fecha }) => {
        const fechaEstudio = new Date(Fecha);

        // Establece las horas a 00:00 para comparar solo la fecha (sin la hora)
        const fechaDesdeSinHora = new Date(fechaDesde);
        const fechaHastaSinHora = new Date(fechaHasta);

        // Establece la hora de las fechas de comparación a las 23:59:59 para incluir todo el día
        fechaDesdeSinHora.setHours(0, 0, 0, 0);
        fechaHastaSinHora.setHours(23, 59, 59, 999);

        return (
          fechaEstudio >= fechaDesdeSinHora && fechaEstudio <= fechaHastaSinHora
        );
      });

      setEstudiosFiltrados(filtrados);
      setCantidadEstudios(filtrados.length);
      setError(null);

      if (filtrados.length > 0) {
        const patientId = filtrados[0].ID_Paciente;
        getPatientById(patientId).then(setPatient);
      } else {
        setPatient(null); // Si no hay estudios, reseteamos el paciente
      }
    } else {
      setEstudiosFiltrados([]);
      setCantidadEstudios(null);
    }
  }, [fechaDesde, fechaHasta, historial]);

  const handleExport = () => {
    if (!fechaDesde || !fechaHasta) {
      setError("Por favor selecciona ambas fechas para filtrar.");
      return;
    }

    if (fechaDesde > fechaHasta) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (estudiosFiltrados.length === 0) {
      setError(
        "No se encontraron estudios en el rango de fechas seleccionado."
      );
      setIsLoading(false);
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    // Add font support for special characters
    pdf.setFont("helvetica", "normal");

    // Header
    pdf.setFillColor(41, 128, 185); // A nice blue color
    pdf.rect(0, 0, 210, 40, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text("Historial Clínico", 105, 25, { align: "center" });

    // Patient info
    pdf.setFillColor(236, 240, 241); // Light gray background
    pdf.rect(0, 40, 210, 35, "F");
    pdf.setTextColor(44, 62, 80); // Dark blue text
    pdf.setFontSize(12);

    const patientName = patient
      ? `${patient?.Nombre || "No disponible"} ${
          patient?.Apellido || "No disponible"
        }`
      : "Paciente: No disponible";
    const patientEmail = patient?.Email ? patient.Email : "No disponible";
    const patientDNI = patient?.DNI ? patient.DNI : "No disponible";
    const patientPeriod =
      fechaDesde && fechaHasta
        ? `Período: ${format(fechaDesde, "dd/MM/yyyy")} - ${format(
            fechaHasta,
            "dd/MM/yyyy"
          )}`
        : "Período: No disponible";

    pdf.text(`Paciente: ${patientName}`, 15, 50);
    pdf.text(`Correo electrónico: ${patientEmail}`, 15, 57);
    pdf.text(`DNI: ${patientDNI}`, 15, 64);
    pdf.text(patientPeriod, 15, 71);

    // Table setup
    const tableColumn = [
      "Fecha",
      "Asunto",
      "Nombre del Estudio",
      "Observación", // Aquí hemos eliminado "Factura"
    ];
    const tableRows = estudiosFiltrados.map((estudio) => [
      format(new Date(estudio.Fecha), "dd/MM/yyyy"),
      estudio.Asunto,
      estudio.NombreTipoEstudio,
      estudio.Observacion, // Aquí también eliminamos la columna Factura
    ]);

    (pdf as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Fecha
        1: { cellWidth: 30 }, // Asunto
        2: { cellWidth: 40 }, // Nombre del Estudio
        3: { cellWidth: 75 }, // Observación (más grande)
      },
    });
    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128);
      pdf.text(
        `Página ${i} de ${pageCount}`,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        {
          align: "center",
        }
      );
    }

    pdf.save(`Informe-${patientName}.pdf`);
    setIsLoading(false);
  };

  const setToday = () => {
    const today = new Date();
    setFechaDesde(today);
    setFechaHasta(today);
  };

  const setLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setFechaDesde(lastWeek);
    setFechaHasta(today);
  };

  const setLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    setFechaDesde(lastMonth);
    setFechaHasta(today);
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  ) => {
    const date = e.target.value
      ? parse(e.target.value, "yyyy-MM-dd", new Date())
      : undefined;
    setDate(date);
  };

  return (
    <Dialog open={isExporting} onOpenChange={setIsExporting}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar historial como PDF</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="fechaDesde"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Desde
              </label>
              <Input
                type="date"
                id="fechaDesde"
                value={fechaDesde ? format(fechaDesde, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange(e, setFechaDesde)}
                className="w-full font-bold border-2 rounded-lg button-text bg-background"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="fechaHasta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hasta
              </label>
              <Input
                type="date"
                id="fechaHasta"
                value={fechaHasta ? format(fechaHasta, "yyyy-MM-dd") : ""}
                onChange={(e) => handleDateChange(e, setFechaHasta)}
                className="w-full font-bold border-2 rounded-lg button-text bg-background"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={setToday}
              variant="outline"
              className="flex-1 font-bold border-2 rounded-lg button-text bg-background"
            >
              Hoy
            </Button>
            <Button
              onClick={setLastWeek}
              variant="outline"
              className="flex-1 font-bold border-2 rounded-lg button-text bg-background"
            >
              Última semana
            </Button>
            <Button
              onClick={setLastMonth}
              variant="outline"
              className="flex-1 font-bold border-2 rounded-lg button-text bg-background"
            >
              Último mes
            </Button>
          </div>
          <Button
            onClick={handleExport}
            disabled={isLoading || cantidadEstudios === 0}
            title="Exportar historial como PDF"
            className="w-full mt-4 font-bold border-2 rounded-lg button-text bg-button"
          >
            {isLoading ? "Exportando..." : "Exportar"}
          </Button>
          {error && (
            <p className="text-center text-sm mt-2 text-red-500">{error}</p>
          )}
          {cantidadEstudios !== null && !error && (
            <p className="text-center text-sm mt-2 text-black text-border font-bold italic">
              {cantidadEstudios === 0
                ? "No se encontraron estudios en este rango."
                : cantidadEstudios === 1
                ? "Se encontró un estudio."
                : `Se encontraron ${cantidadEstudios} estudios.`}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
