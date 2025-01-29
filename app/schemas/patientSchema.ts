import { z } from "zod";

export const patientSchema = z.object({
  Nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  Apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  DNI: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos"),
  Email: z.string().email("Ingrese un email válido"),
  Telefono: z
    .string()
    .regex(/^[\d\s]{1,20}$/, "El teléfono debe tener entre 1 y 20 dígitos"),
  FechaNacimiento: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
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
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val as string, 10) || 0)
    .refine((val) => val >= 1 && val <= 100, {
      message: "La frecuencia respiratoria debe estar entre 1 y 100",
    }),

  FrecuenciaCardiaca: z
    .union([z.string(), z.number()])
    .transform((val) => parseInt(val as string, 10))
    .refine((val) => val >= 20 && val <= 250, {
      message: "La frecuencia cardíaca debe estar entre 20 y 250",
    }),

  Sexo: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Seleccione un sexo válido" }),
  }),
  ID_Seguro: z.number().int(),
  ID_Empresa: z.number().int().nullable().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
