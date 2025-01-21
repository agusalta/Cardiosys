export default interface Archivo {
  ID_Archivo: number;
  ID_Estudio: number | null;
  NombreArchivo: string | null;
  Archivo: Buffer;
  Fecha_Subida: Date | null;
}
