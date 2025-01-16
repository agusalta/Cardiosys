export default interface Paciente {
  ID_Paciente: number;
  ID_Seguro: number;
  Nombre: string;
  DNI: string;
  Apellido: string;
  Email: string;
  Telefono: string;
  FechaNacimiento: string;
  Altura: number;
  Peso: number;
  FrecuenciaRespiratoria?: number;
  FrecuenciaCardiaca?: number;
  obraSocial: string;
  Sexo: Sexo;
}

export type Sexo = "M" | "F";
