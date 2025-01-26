"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type Archivo from "@/app/types/Archivo";
import { PDFDocument } from "pdf-lib";

export default function ArchivoViewer({ archivos }: { archivos: Archivo[] }) {
  const [selectedArchivo, setSelectedArchivo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleArchivoChange = async (ID_Archivo: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/archivo/${ID_Archivo}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener el archivo: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pdfBytes = await pdfDoc.save();

      const fileUrl = URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" })
      );
      setSelectedArchivo(fileUrl);
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
      setSelectedArchivo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedArchivo) {
        URL.revokeObjectURL(selectedArchivo);
      }
    };
  }, [selectedArchivo]);

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col text-paragraph">
      <Card className="mb-4 text-black border-none shadow-none">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ">
          <Label
            htmlFor="archivoSelect"
            className="text-xl font-bold text-center sm:text-left"
          >
            Seleccione un archivo
          </Label>
          <Select onValueChange={handleArchivoChange}>
            <SelectTrigger
              id="archivoSelect"
              className="w-full sm:w-64 bg-white text-black border border-gray-300 rounded-md" // Fondo blanco y borde gris
            >
              <SelectValue placeholder="Elegir archivo" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {archivos.map((a: Archivo) => (
                <SelectItem key={a.ID_Archivo} value={String(a.ID_Archivo)}>
                  {a.NombreArchivo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="flex-grow overflow-hidden text-paragraph">
        <CardContent className="p-0 h-full relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
              >
                <div className="text-white text-center p-4">
                  <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin mx-auto mb-4" />
                  <p className="text-lg sm:text-xl font-semibold">
                    Cargando archivo...
                  </p>
                </div>
              </motion.div>
            ) : selectedArchivo ? (
              <motion.iframe
                key="pdf"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedArchivo}
                className="w-full h-full border-0"
                style={{ minHeight: "300px" }}
              ></motion.iframe>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center"
              >
                <FileText className="h-16 w-16 sm:h-24 sm:w-24 mb-4 text-gray-400" />
                <p className="text-xl sm:text-2xl font-semibold mb-2">
                  No hay archivo PDF seleccionado
                </p>
                <p className="text-base sm:text-lg">
                  Elija un archivo en formato PDF para visualizar
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
