"use client";

import { useCallback, useEffect, useState } from "react";
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
import type HistorialClinico from "@/app/types/HistorialClinico";
import { useToast } from "@/hooks/use-toast";
import formatDateForInput from "@/app/utils/formatDateForInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import TipoEstudio from "@/app/types/TipoEstudio";

export default function ClinicalHistoryPage() {
  const { id } = useParams();
  const [historial, setHistorial] = useState<HistorialClinico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<HistorialClinico | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    entryId: number | null;
  }>({ isOpen: false, entryId: null });
  const [studyTypes, setStudyTypes] = useState<TipoEstudio[]>([]);

  const getTipoEstudio = useCallback(async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tipoEstudio/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tipo de estudio");
      }
      const data = await response.json();
      return data.NombreEstudio ?? "Cargando...";
    } catch (err: any) {
      console.error("Error fetching tipo de estudio:", err);
      setError(err.message);
      return "Error al cargar tipo de estudio";
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    setHistorial([]);
    setLoading(true);
    setError(null);

    const fetchHistorial = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/estudio/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch historial clínico");
        }
        const data = await response.json();

        const updatedHistorial = await Promise.all(
          data.map(async (entry: HistorialClinico) => {
            const tipoEstudioNombre = await getTipoEstudio(
              entry.ID_TipoEstudio
            );
            return {
              ...entry,
              NombreTipoEstudio: tipoEstudioNombre,
            };
          })
        );
        setHistorial(updatedHistorial);
      } catch (err: any) {
        console.error("Error fetching historial clínico:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  useEffect(() => {
    const fetchStudyTypes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tipoEstudio`);
        if (!response.ok) {
          throw new Error("Failed to fetch study types");
        }
        const data = await response.json();
        setStudyTypes(data);
      } catch (error) {
        console.error("Error fetching study types:", error);
        // Handle error appropriately, e.g., display an error message
      }
    };
    fetchStudyTypes();
  }, []);

  const handleEdit = (entry: HistorialClinico) => {
    const formattedDate = formatDateForInput(entry.Fecha);
    setEditingEntry({
      ...entry,
      Fecha: formattedDate,
    });
    setIsDialogOpen(true);
    setIsCreating(false);
  };

  const handleDelete = (entryId: number) => {
    console.log("Eliminando estudio con ID:", entryId);
    setDeleteConfirmation({ isOpen: true, entryId });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.entryId === null) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/estudio/${deleteConfirmation.entryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al eliminar el estudio: ${response.statusText}`);
      }

      toast({
        title: "Éxito",
        description: "Estudio eliminado correctamente.",
      });

      setHistorial((prevHistorial) =>
        prevHistorial.filter(
          (entry) => entry.ID_Estudio !== deleteConfirmation.entryId
        )
      );
    } catch (error) {
      console.error("Error al intentar eliminar el estudio:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el estudio.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmation({ isOpen: false, entryId: null });
    }
  };

  const handleSaveOrCreate = async (entry: HistorialClinico) => {
    try {
      const tipoEstudioNombre = entry.ID_TipoEstudio
        ? await getTipoEstudio(entry.ID_TipoEstudio)
        : "Cargando...";

      const entryWithNombreEstudio = {
        ...entry,
        NombreTipoEstudio: tipoEstudioNombre,
      };

      const url = isCreating
        ? "http://localhost:3000/api/estudio"
        : `http://localhost:3000/api/estudio/${entryWithNombreEstudio.ID_Estudio}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryWithNombreEstudio),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los datos: " + response.status);
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (isCreating) {
        entryWithNombreEstudio.ID_Estudio = responseData.data.ID_Estudio;

        setHistorial((prevHistorial) => {
          return [entryWithNombreEstudio, ...prevHistorial];
        });

        console.log(entryWithNombreEstudio);
      } else {
        setHistorial((prevHistorial) =>
          prevHistorial.map((item) =>
            item.ID_Estudio === entryWithNombreEstudio.ID_Estudio
              ? entryWithNombreEstudio
              : item
          )
        );
      }

      setIsDialogOpen(false);
      setIsCreating(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `No se pudo ${
          isCreating ? "crear" : "actualizar"
        } el estudio.`,
        variant: "destructive",
      });
    }
  };

  const handleCreate = () => {
    setEditingEntry({
      ID_Estudio: 0,
      Fecha: new Date().toISOString().split("T")[0],
      Asunto: "",
      Observacion: "",
      Factura: null,
      ID_Paciente: Number(id),
      ID_TipoEstudio: 1,
      NombreTipoEstudio: "",
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const filteredHistory = historial.filter((entry) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      (entry.Fecha?.toLowerCase() || "").includes(lowercasedQuery) ||
      (entry.Asunto?.toLowerCase() || "").includes(lowercasedQuery) ||
      (entry.NombreTipoEstudio?.toLowerCase() || "").includes(lowercasedQuery)
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
          placeholder="Buscar por fecha, asunto o estudio "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 italic "
        />
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            <SearchOffIcon className="text-xl md:text-2xl" />
          </Button>
          <Button onClick={handleCreate}>
            <AddIcon className="text-xl md:text-2xl mr-2" />
            <span className="hidden md:inline">Agregar un nuevo estudio</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estudios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Tipo de Estudio</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={`history-${entry.ID_Estudio}`}>
                  <TableCell>
                    <Link
                      href={`/pacientes/${id}/historial-clinico/${entry.ID_Estudio}`}
                      className="text-blue-600 hover:underline"
                    >
                      {entry.ID_Estudio}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(entry.Fecha).toLocaleDateString("es-AR", {
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>{entry.Asunto} </TableCell>
                  <TableCell>{entry.NombreTipoEstudio}</TableCell>
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setIsCreating(false);
            setEditingEntry(null);
          }
        }}
      >
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
                handleSaveOrCreate(editingEntry);
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
                  <Label htmlFor="tipoEstudio" className="text-right">
                    Tipo de Estudio
                  </Label>
                  <Select
                    value={editingEntry.ID_TipoEstudio.toString()}
                    onValueChange={(value) =>
                      setEditingEntry({
                        ...editingEntry,
                        ID_TipoEstudio: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione un tipo de estudio" />
                    </SelectTrigger>
                    <SelectContent>
                      {studyTypes.map((type) => (
                        <SelectItem
                          key={type.ID_TipoEstudio}
                          value={type.ID_TipoEstudio.toString()}
                        >
                          {type.NombreEstudio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      <Dialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(isOpen) => {
          setDeleteConfirmation({ isOpen, entryId: null });
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este estudio? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, entryId: null })
              }
            >
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
