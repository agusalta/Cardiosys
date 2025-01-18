"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddIcon from "@mui/icons-material/Add";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Delete, Receipt } from "@mui/icons-material";
import { Badge } from "@/components/ui/badge";
import {
  HistorialClinico,
  useHistorialClinico,
} from "@/app/data/HistorialClinico";
import { useToast } from "@/hooks/use-toast";

export default function ClinicalHistoryPage() {
  const { id } = useParams();
  const { historial, loading, error } = useHistorialClinico(Number(id));
  const [editingEntry, setEditingEntry] = useState<HistorialClinico | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  console.log("Historial", historial);

  const handleEdit = (entry: HistorialClinico) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
    setIsCreating(false);
  };

  const handleDelete = async (entryId: number) => {};

  const handleSave = async (updatedEntry: HistorialClinico) => {};

  const handleCreate = () => {};

  const filteredHistory = historial.filter((entry) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      entry.Fecha.toLowerCase().includes(lowercasedQuery) ||
      entry.Asunto.toLowerCase().includes(lowercasedQuery) ||
      entry.NombreTipoEstudio.toLowerCase().includes(lowercasedQuery)
    );
  });

  if (loading) {
    return <div>Cargando historial clínico...</div>;
  }

  if (error) {
    return <div>Error al cargar el historial clínico: {error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Historial Clínico</h1>

      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Buscar por fecha o asunto "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 italic lowercase"
        />
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            <SearchOffIcon className="text-xl md:text-2xl" />
          </Button>
          <Button onClick={handleCreate}>
            <AddIcon className="text-xl md:text-2xl mr-2" />
            <span className="hidden md:inline">Agregar nuevo item</span>
          </Button>
        </div>
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
                <TableHead>Tipo de Estudio</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={entry.ID_Estudio}>
                  <TableCell>
                    {new Date(entry.Fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.Asunto}</TableCell>
                  <TableCell>{entry.NombreTipoEstudio}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2">{entry.Observacion}</span>
                  </TableCell>
                  <TableCell>
                    {entry.Factura ? (
                      <Badge variant="secondary">
                        <Receipt className="w-4 h-4 mr-2" />
                        {entry.Factura}
                      </Badge>
                    ) : (
                      <span>No aplica</span>
                    )}
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
                        onClick={() => handleDelete(entry.ID_Estudio)}
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
            <DialogTitle>
              {isCreating
                ? "Crear Nueva Entrada"
                : "Editar Entrada del Historial"}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Ingrese los detalles de la nueva entrada del historial clínico."
                : "Modifique los detalles de la entrada del historial clínico aquí."}
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
                    value={editingEntry.Fecha}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        Fecha: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="asunto" className="text-right">
                    Asunto
                  </Label>
                  <Input
                    id="asunto"
                    type="text"
                    value={editingEntry.Asunto}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        Asunto: e.target.value,
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
                    value={editingEntry.Observacion}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        Observacion: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="factura" className="text-right">
                    Factura
                  </Label>
                  <Input
                    id="factura"
                    type="text"
                    value={editingEntry.Factura || ""}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        Factura: e.target.value || null,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {isCreating ? "Crear" : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
