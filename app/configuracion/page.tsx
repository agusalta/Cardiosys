"use client";

import { useState } from "react";
import { useConfig } from "@/app/context/ConfigContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ConfiguracionPage() {
  const { fontSize, setFontSize } = useConfig();
  const [localFontSize, setLocalFontSize] = useState<number>(fontSize);
  const { toast } = useToast();

  const handleSliderChange = (value: number[]) => {
    setLocalFontSize(value[0]);
  };

  const handleApplyChanges = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/config/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fontSize: localFontSize }),
      });

      if (response.ok) {
        setFontSize(localFontSize);
        document.documentElement.style.fontSize = `${localFontSize}px`;

        toast({
          title: "Éxito",
          description:
            "Se ha actualizado la configuración de la aplicación con éxito.",
        });
      } else {
        console.error("Error al actualizar la configuración.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="text-black">
        <CardHeader>
          <CardTitle>Configuración de Fuente</CardTitle>
          <CardDescription>
            Ajusta el tamaño de la fuente de la página
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Tamaño de Fuente: {localFontSize}px</span>
            </div>
            <Slider
              min={12}
              max={20}
              step={1}
              value={[localFontSize]}
              onValueChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg"
              thumbClassName="w-4 h-4 bg-blue-500 rounded-full shadow-lg"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleApplyChanges}
            className="w-full font-bold border-2 rounded-lg button-text bg-button"
          >
            Aplicar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
