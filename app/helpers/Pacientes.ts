export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  sexo: Sexo;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  altura: number;
  peso: number;
  frecRespiratoria?: number;
  frecCardiaca?: number;
  presionArterial?: string;
  obraSocial: string;
}

export type Sexo = "M" | "F";
