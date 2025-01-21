"use client";

import { useState } from "react";
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
import { AttachFile, Delete } from "@mui/icons-material";

interface File {
  name: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<File[]>([]);
  const [newFileName, setNewFileName] = useState("");

  const handleAddFile = () => {
    if (newFileName.trim() !== "") {
      const newFile = {
        name: newFileName,
        date: new Date().toLocaleDateString(),
      };
      setFiles([...files, newFile]);
      setNewFileName("");
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Nombre del archivo"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <Button onClick={handleAddFile}>
          <AttachFile className="mr-2 h-4 w-4" /> Agregar Archivo
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del Archivo</TableHead>
            <TableHead>Fecha de Subida</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={index}>
              <TableCell>{file.name}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteFile(index)}
                >
                  <Delete className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
