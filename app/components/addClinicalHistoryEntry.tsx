import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HistorialClinico } from "@/app/data/HistorialClinico";

interface AddClinicalHistoryEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (newEntry: HistorialClinico) => void;
  patientId: number;
}

export function AddClinicalHistoryEntry({
  isOpen,
  onClose,
  onAddEntry,
  patientId,
}: AddClinicalHistoryEntryProps) {
  const [newEntry, setNewEntry] = useState<Partial<HistorialClinico>>({
    Fecha: new Date().toISOString().split("T")[0],
    Asunto: "",
    Observacion: "",
    Factura: null,
    ID_Paciente: patientId,
    ID_TipoEstudio: 1,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/estudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to create new entry");
      }

      const createdEntry = await response.json();
      onAddEntry(createdEntry);
      onClose();
      toast({
        title: "Entrada creada",
        description:
          "La nueva entrada del historial clínico ha sido creada con éxito.",
      });
    } catch (error) {
      console.error("Error creating entry:", error);
      toast({
        title: "Error",
        description:
          "No se pudo crear la entrada. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Entrada</DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la nueva entrada del historial clínico.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha
              </Label>
              <Input
                id="fecha"
                type="date"
                value={newEntry.Fecha}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, Fecha: e.target.value })
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
                value={newEntry.Asunto}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, Asunto: e.target.value })
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
                value={newEntry.Observacion}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, Observacion: e.target.value })
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
                value={newEntry.Factura || ""}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, Factura: e.target.value || null })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
