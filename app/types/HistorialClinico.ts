export default interface HistorialClinico {
  ID_Estudio: number;
  Fecha: string;
  Asunto: string;
  Observacion: string;
  Factura: string | null;
  ID_Paciente: number;
  ID_TipoEstudio: number;
  NombreTipoEstudio?: string;
}
