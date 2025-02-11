import { z } from "zod";

export const patientSchema = z.object({
  Nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  Apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  DNI: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos")
    .nullable() // Permite null
    .or(z.literal("")) // También permite una cadena vacía
    .optional(), // Hace que sea opcional

  Email: z
    .string()
    .email("Ingrese un email válido")
    .optional()
    .nullable()
    .or(z.literal("")),
  Telefono: z
    .string()
    .regex(/^[\d\s]{1,20}$/, "El teléfono debe tener entre 1 y 20 dígitos")
    .optional()
    .nullable()
    .or(z.literal("")),
  FechaNacimiento: z
    .string()
    .or(z.literal(""))
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
    }, "La fecha de nacimiento no puede ser en el futuro"),

  Altura: z
    .union([z.string(), z.number()])
    .nullable()
    .or(z.literal(""))
    .refine((val) => {
      if (val === "" || val === null) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 0.1 && num <= 3;
    }, "La altura debe estar entre 0.1 y 3 metros")
    .transform((val) => (val === "" ? 0 : parseFloat(val as string))),

  Peso: z
    .union([z.string(), z.number()])
    .nullable()
    .or(z.literal(""))
    .refine((val) => {
      if (val === "" || val === null) return true;
      const num = typeof val === "string" ? parseFloat(val) : val;
      return num >= 1 && num <= 500;
    }, "El peso debe estar entre 1 y 500 kg")
    .transform((val) => (val === "" ? 0 : parseFloat(val as string))),

  FrecuenciaRespiratoria: z
    .union([z.string(), z.number()])
    .nullable()
    .or(z.literal(0))
    .transform((val) => {
      if (val === "" || val === null) return 0;
      return parseInt(val as string, 10) || 0;
    })
    .refine((val) => val >= 0 && val <= 100, {
      message: "La frecuencia respiratoria debe estar entre 0 y 100",
    }),

  FrecuenciaCardiaca: z
    .union([z.string(), z.number()])
    .nullable()
    .or(z.literal(0))
    .transform((val) => {
      if (val === "" || val === null) return 0;
      return parseInt(val as string, 10) || 0;
    })
    .refine((val) => val >= 0 && val <= 250, {
      message: "La frecuencia cardíaca debe estar entre 0 y 250",
    }),

  Sexo: z.enum(["M", "F"]).optional().or(z.literal("")).nullable(),
  ID_Seguro: z.number().int().nullable().or(z.literal(0)),
  ID_Empresa: z.number().int().nullable().or(z.literal(0)),
});

export type PatientFormData = z.infer<typeof patientSchema>;
