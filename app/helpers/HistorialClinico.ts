export default interface ClinicalHistoryEntry {
  id: number;
  dni: string;
  fecha: string;
  observacion: string;
  asunto: string;
  factura?: any;
  archivos: string[];
  estudio: string;
}
