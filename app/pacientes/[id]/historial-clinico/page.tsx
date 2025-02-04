"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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
import {
  Edit,
  Delete,
  Receipt,
  FileOpen,
  DeleteForever,
} from "@mui/icons-material";
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
import type TipoEstudio from "@/app/types/TipoEstudio";
import {
  deleteArchivo,
  fetchArchivosByEstudioId,
  uploadFiles,
} from "@/app/lib/fileManager";
import { getTipoEstudio } from "@/app/utils/getTipoEstudio";
import { fetchArchivoContentById } from "@/app/lib/fileManager";
import useCostoEstudio from "@/app/data/CostoEstudio";
import Paciente from "@/app/types/Pacientes";
import { set } from "zod";
import ExportDialog from "@/app/components/ExportDialog";

interface ArchivoEstudio {
  ID_Archivo: number;
  NombreArchivo: string;
}

interface StudyFiles {
  [key: number]: ArchivoEstudio[];
}

export default function ClinicalHistoryPage() {
  const { id } = useParams();
  const [historial, setHistorial] = useState<HistorialClinico[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [editingEntry, setEditingEntry] = useState<HistorialClinico | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    entryId: number | null;
  }>({ isOpen: false, entryId: null });
  const [studyTypes, setStudyTypes] = useState<TipoEstudio[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [studyFiles, setStudyFiles] = useState<StudyFiles>({});
  const [editingFiles, setEditingFiles] = useState<ArchivoEstudio[]>([]);
  const { getCostoEstudio } = useCostoEstudio();
  const [costoEstudio, setCostoEstudio] = useState<number | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleGetCostoEstudio = async (ID_TipoEstudio: number) => {
    if (!id || !paciente) return;
    try {
      const costo = await getCostoEstudio(paciente?.ID_Seguro, ID_TipoEstudio);
      setCostoEstudio(costo);
    } catch (error) {
      console.error("Error al obtener el costo del estudio:", error);
    }
  };

  useEffect(() => {
    if (!id || !paciente || !editingEntry) return;
    handleGetCostoEstudio(editingEntry?.ID_TipoEstudio);
  }, [editingEntry]);

  useEffect(() => {
    if (!id) return;

    setHistorial([]);
    setLoading(true);
    setError(null);

    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${backendUrl}/estudio/${id}`);

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
        const response = await fetch(`${backendUrl}/tipoEstudio`);
        if (!response.ok) {
          throw new Error("Failed to fetch study types");
        }
        const data = await response.json();
        setStudyTypes(data);
      } catch (error) {
        console.error("Error fetching study types:", error);
      }
    };
    fetchStudyTypes();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const filesByStudy: any = {};
        for (const entry of historial) {
          const files = await fetchArchivosByEstudioId(entry.ID_Estudio);
          filesByStudy[entry.ID_Estudio] = files;
        }
        setStudyFiles(filesByStudy);
      } catch (error) {
        console.error("Error fetching study files:", error);
      }
    };
    if (historial.length > 0) {
      fetchFiles();
    }
  }, [historial]);

  useEffect(() => {
    async function fetchNombre() {
      try {
        const response = await fetch(`${backendUrl}/pacientes/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        const nombreCompleto = `${data.Nombre} ${data.Apellido}`;
        setPaciente(data);
        setNombreCompleto(nombreCompleto);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNombre();
  }, []);

  const handleEdit = (entry: HistorialClinico) => {
    const formattedDate = formatDateForInput(entry.Fecha);
    setEditingEntry({
      ...entry,
      Fecha: formattedDate,
    });
    setEditingFiles(studyFiles[entry.ID_Estudio] || []);
    setIsDialogOpen(true);
    setIsCreating(false);
  };

  const handleExportar = async () => {
    setIsExporting(true);
  };

  const handleDelete = (entryId: number) => {
    setDeleteConfirmation({ isOpen: true, entryId });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.entryId === null) return;

    try {
      const response = await fetch(
        `${backendUrl}/estudio/${deleteConfirmation.entryId}`,
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

      const totalEstudio = Number(costoEstudio) + (Number(entry.Factura) || 0);

      const entryWithNombreEstudio = {
        ...entry,
        NombreTipoEstudio: tipoEstudioNombre,
        Factura: totalEstudio,
      };

      const url = isCreating
        ? `${backendUrl}/estudio`
        : `${backendUrl}/estudio/${entryWithNombreEstudio.ID_Estudio}`;
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

      // Obtener el ID_Estudio del nuevo o actualizado estudio
      const estudioId = isCreating
        ? responseData.data.ID_Estudio
        : entryWithNombreEstudio.ID_Estudio;

      // Si es una actualización, asociar archivos existentes al estudio
      if (!isCreating) {
        const updatedFiles = editingFiles.map((file) => file.ID_Archivo);
        await fetch(`${backendUrl}/archivo/archivos/${entry.ID_Estudio}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ archivos: updatedFiles }),
        });
      }

      // Si hay archivos nuevos, cargarlos y asignarles el ID_Estudio
      if (files.length > 0) {
        await uploadFiles(files, estudioId);
      }

      if (isCreating) {
        entryWithNombreEstudio.ID_Estudio = estudioId;

        setHistorial((prevHistorial) => {
          return [entryWithNombreEstudio, ...prevHistorial];
        });
      } else {
        setHistorial((prevHistorial) =>
          prevHistorial.map((item) =>
            item.ID_Estudio === entryWithNombreEstudio.ID_Estudio
              ? entryWithNombreEstudio
              : item
          )
        );
      }

      // Actualizar los archivos en el estado
      setStudyFiles((prev) => ({
        ...prev,
        [estudioId]: [
          ...editingFiles,
          ...files.map((file, index) => ({
            ID_Archivo: Date.now() + index, // Temporal ID para nuevos archivos
            NombreArchivo: file.name,
            ID_Estudio: estudioId, // Asignar el ID_Estudio a cada archivo
          })),
        ],
      }));

      setIsDialogOpen(false);
      setIsCreating(false);
      setFiles([]);
      setEditingFiles([]);

      if (isCreating) {
        toast({
          title: "Éxito",
          description: "El estudio se ha creado correctamente.",
        });
      } else {
        toast({
          title: "Éxito",
          description: "El estudio se ha actualizado correctamente.",
        });
      }
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
      Factura: 0,
      ID_Paciente: Number(id),
      ID_TipoEstudio: 1,
      NombreTipoEstudio: "",
    });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleDeleteArchive = async (ID_Archivo: number) => {
    setEditingFiles(editingFiles.filter((f) => f.ID_Archivo !== ID_Archivo));
    await deleteArchivo(ID_Archivo);
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
    return <div>Cargando historial clínico de {nombreCompleto}</div>;
  }

  if (error) {
    return <div>Error al cargar el historial clínico: {error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-h1">
        Historial Clínico de {nombreCompleto}
      </h1>

      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Buscar por fecha, asunto o estudio "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 italic "
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            title="Limpiar búsqueda"
            className="font-bold border-2 rounded-lg button-text bg-background"
          >
            <SearchOffIcon className="text-xl md:text-2xl" />
          </Button>
          <Button
            onClick={handleCreate}
            title="Crear nuevo estudio"
            className="font-bold border-2 rounded-lg button-text bg-button"
          >
            <AddIcon className="text-xl md:text-2xl" />
            <span className="hidden md:inline">Nuevo Estudio</span>
          </Button>
          <Button
            onClick={handleExportar}
            title="Exportar historial como PDF"
            className="font-bold border-2 rounded-lg button-text bg-button"
          >
            <PictureAsPdfIcon className="text-xl md:text-2xl" />
            <span className="hidden md:inline">Exportar Historial</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Estudios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="text-paragraph">
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Motivo de consulta</TableHead>
                <TableHead>Tipo de Estudio</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Archivo(s)</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={`history-${entry.ID_Estudio}`}>
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
                        {new Intl.NumberFormat("es-AR", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(entry.Factura)}{" "}
                        ARS
                      </Badge>
                    ) : (
                      <span>No aplica</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {studyFiles[entry.ID_Estudio]?.map((file, index) => (
                      <div key={file.ID_Archivo}>
                        <Button
                          variant="link"
                          onClick={async () => {
                            await fetchArchivoContentById(file.ID_Archivo);
                          }}
                          disabled
                          className="text-border"
                        >
                          {file.NombreArchivo || `File ${index + 1}`}
                        </Button>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/pacientes/${id}/historial-clinico/${entry.ID_Estudio}`}
                          title="Ver"
                          className="font-bold border-2 rounded-lg button-text bg-background"
                        >
                          <FileOpen className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                        title="Editar"
                        className="font-bold border-2 rounded-lg button-text bg-tertiary"
                      >
                        <Edit className="w-4 h-4 text-black" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.ID_Estudio)}
                        title="Eliminar"
                        className="font-bold border-2 rounded-lg button-text bg-danger"
                      >
                        <Delete className="w-4 h-4 text-background" />
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
            setEditingFiles([]);
            setFiles([]);
          }
        }}
      >
        <DialogContent className="max-w-[600px] sm:max-w-[650px] max-h-[80vh] overflow-y-auto text-paragraph">
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
                  <Label htmlFor="asunto" className="text-right">
                    Motivo de consulta
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

                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="factura" className="text-right font-medium">
                      Monto de consulta
                    </Label>
                    <Input
                      id="factura"
                      type="number"
                      min={0}
                      value={editingEntry.Factura || ""}
                      onChange={(e) =>
                        setEditingEntry({
                          ...editingEntry,
                          Factura: Number(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      Costo del estudio:
                    </Label>
                    <div className="col-span-3">
                      <Input
                        type="text"
                        value={costoEstudio?.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                        disabled
                        className="font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">Total:</Label>
                    <div className="col-span-3">
                      <Input
                        type="text"
                        value={(
                          Number(costoEstudio) +
                          Number(editingEntry.Factura || 0)
                        ).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                        disabled
                        className="font-bold text-danger"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="archivo" className="text-right">
                    Archivo(s) existentes
                  </Label>
                  <div className="col-span-3">
                    {editingFiles.map((file) => (
                      <div
                        key={file.ID_Archivo}
                        className="flex items-center justify-between mb-2"
                      >
                        <span>{file.NombreArchivo}</span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteArchive(file.ID_Archivo)}
                          className="font-bold border-2 rounded-lg button-text bg-danger"
                          title="Borrar archivo para siempre"
                        >
                          <DeleteForever className="w-4 h-4 text-background" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nuevoArchivo" className="text-right">
                    Agregar archivo(s)
                  </Label>
                  <Input
                    id="nuevoArchivo"
                    multiple
                    type="file"
                    onChange={(e) => {
                      const newFiles = Array.from(e.target.files || []);
                      setFiles(newFiles);
                    }}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="font-bold border-2 rounded-lg button-text bg-background"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="font-bold border-2 rounded-lg button-text bg-button"
                >
                  {isCreating ? "Cargar estudio" : "Guardar cambios"}
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
        <DialogContent className="sm:max-w-[425px] text-paragraph">
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
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              className="font-bold border-2 rounded-lg text-background bg-danger"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExportDialog
        isExporting={isExporting}
        setIsExporting={setIsExporting}
        historial={historial}
      />
    </div>
  );
}
