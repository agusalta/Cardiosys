export interface DatosPaciente {
  nombre: string;
  edad: number;
  sexo: string;
  peso: number;
  fecha: string;
  solicitadoPor: string;
  modalidad: string;
  diagnostico: string;
}

export interface EtapaEjercicio {
  etapa: string;
  min: string;
  mets: string;
  pendiente: string;
  km: string;
  fc: string;
  ta: string;
  ecg: string;
  arrit: string;
  sint: string;
}
