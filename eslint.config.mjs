import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"], // Deshabilita la regla para `any`
      "react-hooks/exhaustive-deps": ["warn"], // Se elimina la configuración adicional incorrecta
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignora variables de argumentos que comienzan con _
          varsIgnorePattern: "^_", // Ignora variables que comienzan con _
        },
      ],
      "prefer-const": "error", // Asegúrate de usar `const` para variables no reasignadas
    },
  },
];

export default eslintConfig;
