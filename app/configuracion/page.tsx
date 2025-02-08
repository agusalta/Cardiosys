"use client";

import { useState, useEffect } from "react";
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
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Sincronizar localFontSize con fontSize cuando cambie
  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  const handleSliderChange = (value: number[]) => {
    setLocalFontSize(value[0]);
  };

  const handleApplyChanges = async () => {
    try {
      const response = await fetch(`${backendUrl}/config/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FontSize: localFontSize }),
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
        const errorData = await response.json();
        console.error("Error al actualizar la configuración:", errorData);
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
