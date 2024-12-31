export default interface ClinicalHistoryEntry {
  id: number;
  fecha: string;
  observacion: string;
  asunto: string;
  factura?: string;
  archivos: string[];
  estudio:
    | "Eco-doppler"
    | "Ecocardiograma Doppler"
    | "Ergometría"
    | "Eco-stress"
    | "Electrocardiograma"
    | "Coronariografía"
    | "TAC";
}
