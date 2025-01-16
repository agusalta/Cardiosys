import { z } from "zod";

export const patientSchema = z.object({
  Nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  Apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  DNI: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos"),
  Email: z.string().email("Ingrese un email válido"),
  Telefono: z.string().regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  FechaNacimiento: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return birthDate < today;
  }, "La fecha de nacimiento no puede ser en el futuro"),
  Altura: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 0.1 && num <= 3;
    }, "La altura debe estar entre 0.1 y 3 metros")
    .transform((val) => parseFloat(val as string)),
  Peso: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 1 && num <= 500;
    }, "El peso debe estar entre 1 y 500 kg")
    .transform((val) => parseFloat(val as string)),
  FrecuenciaRespiratoria: z
    .number()
    .int()
    .min(1)
    .max(100, "La frecuencia respiratoria debe estar entre 1 y 100"),
  FrecuenciaCardiaca: z
    .number()
    .int()
    .min(20)
    .max(250, "La frecuencia cardíaca debe estar entre 20 y 250"),
  Sexo: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Seleccione un sexo válido" }),
  }),
  ID_Seguro: z
    .number()
    .int()
    .min(1, "Seleccione un seguro válido")
    .max(4, "El ID del seguro no es válido"),
});

export type PatientFormData = z.infer<typeof patientSchema>;
