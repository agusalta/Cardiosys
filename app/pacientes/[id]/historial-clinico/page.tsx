"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Delete,
  AttachFile,
  Receipt,
  Visibility,
} from "@mui/icons-material";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClinicalHistoryEntry from "@/app/helpers/HistorialClinico";
import mockClinicalHistory from "@/app/data/HistorialClinico";

export default function ClinicalHistoryPage() {
  const { id } = useParams();
  const [clinicalHistory, setClinicalHistory] = useState<
    ClinicalHistoryEntry[]
  >([]);
  const [editingEntry, setEditingEntry] = useState<ClinicalHistoryEntry | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // In a real application, you would fetch the clinical history for the specific patient
    setClinicalHistory(mockClinicalHistory);
  }, [id]);

  const handleEdit = (entry: ClinicalHistoryEntry) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entryId: number) => {
    setClinicalHistory(clinicalHistory.filter((entry) => entry.id !== entryId));
  };

  const handleSave = (updatedEntry: ClinicalHistoryEntry) => {
    if (newFile) {
      updatedEntry.archivos = [...updatedEntry.archivos, newFile.name];
    }
    setClinicalHistory(
      clinicalHistory.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setIsDialogOpen(false);
    setEditingEntry(null);
    setNewFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
    }
  };

  const filteredHistory = clinicalHistory.filter((entry) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      entry.fecha.toLowerCase().includes(lowercasedQuery) ||
      entry.estudio.toLowerCase().includes(lowercasedQuery)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Historial Clínico</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por fecha o estudio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2"
        />
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Limpiar búsqueda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entradas del Historial</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estudio</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Archivos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.fecha}</TableCell>
                  <TableCell>{entry.asunto}</TableCell>
                  <TableCell>{entry.estudio}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2">{entry.observacion}</span>
                  </TableCell>
                  <TableCell>
                    {entry.factura ? (
                      <Badge variant="secondary">
                        <Receipt className="w-4 h-4 mr-2" />
                        {typeof entry.factura === "number"
                          ? `${entry.factura.toLocaleString("es-AR")} ARS`
                          : entry.factura}
                      </Badge>
                    ) : (
                      <span>No aplica</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {entry.archivos.map((archivo, index) => (
                        <Badge key={index} variant="outline">
                          <AttachFile className="w-4 h-4 mr-2" />
                          {archivo}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Delete className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Entrada del Historial</DialogTitle>
            <DialogDescription>
              Modifique los detalles de la entrada del historial clínico aquí.
            </DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingEntry);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fecha" className="text-right">
                    Fecha
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={editingEntry.fecha}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        fecha: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estudio" className="text-right">
                    Estudio
                  </Label>
                  <Input
                    id="estudio"
                    type="text"
                    value={editingEntry.estudio}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        estudio: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="observacion" className="text-right">
                    Observación
                  </Label>
                  <Textarea
                    id="observacion"
                    value={editingEntry.observacion}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        observacion: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="archivo" className="text-right">
                    Archivo
                  </Label>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
