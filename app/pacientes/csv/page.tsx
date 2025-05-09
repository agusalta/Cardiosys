"use client"

import type React from "react"

import { useState } from "react"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  HelpCircle,
  Info,
  Table,
  AlertTriangle,
  XCircle,
  User,
  Users,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link";

interface ImportError {
  nombre: string
  apellido: string
  dni: string
  error: string
}

interface ImportSuccess {
  nombre: string
  apellido: string
  dni: string
}

interface ImportSummary {
  total: number
  success: number
  errors: number
}

interface ImportResponse {
  message: string
  summary: ImportSummary
  details: {
    success: ImportSuccess[]
    errors: ImportError[]
  }
}

export default function UploadCSVs() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [importResult, setImportResult] = useState<ImportResponse | null>(null)
  const [activeTab, setActiveTab] = useState<"success" | "errors">("errors")
  const [searchTerm, setSearchTerm] = useState("")
  const [errorFilter, setErrorFilter] = useState<string | null>(null)
  const { toast } = useToast()

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api"

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Validate file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, sube un archivo CSV válido.",
        variant: "destructive",
      })
      return
    }

    setFile(file)
    setUploadStatus("idle")
    setImportResult(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setImportResult(null)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${backendUrl}/pacientes/import`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al procesar el archivo. Intente nuevamente.")
      }

      const data: ImportResponse = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Determinar el estado basado en los resultados
      if (data.summary.errors > 0) {
        if (data.summary.success > 0) {
          setUploadStatus("success") // Parcialmente exitoso
          setActiveTab("errors") // Mostrar errores primero si hay una mezcla
        } else {
          setUploadStatus("error") // Completamente fallido
          setActiveTab("errors")
        }
      } else {
        setUploadStatus("success") // Completamente exitoso
        setActiveTab("success")
      }

      setImportResult(data)

      // Simplificar el toast para solo indicar que ocurrió el intercambio
      toast({
        title: "Procesamiento completado",
        description: "El archivo ha sido procesado. Revisa los resultados a continuación.",
        variant: "default",
      })
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus("error")

      toast({
        title: "Error al cargar",
        description: "Ocurrió un error al procesar el archivo. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadStatus("idle")
    setImportResult(null)
    setSearchTerm("")
    setErrorFilter(null)
  }

  const downloadTemplate = () => {
    const headers =
      "Nombre,Apellido,DNI,Email,Teléfono,FechaNacimiento,Sexo,Altura,Peso,FrecuenciaCardiaca,FrecuenciaRespiratoria"
    const exampleRow = "Juan,Pérez,12345678,juan@email.com,1234567890,1990-01-01,M,170,70,80,16"
    const csvContent = `${headers}\n${exampleRow}`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "plantilla_pacientes.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para exportar errores a CSV
  const exportErrorsToCSV = () => {
    if (!importResult || importResult.details.errors.length === 0) return

    const headers = "Nombre,Apellido,DNI,Error"
    const rows = importResult.details.errors.map(
      (error) => `${error.nombre},${error.apellido},${error.dni},"${error.error}"`,
    )
    const csvContent = `${headers}\n${rows.join("\n")}`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "errores_importacion.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Obtener tipos de errores únicos para el filtro
  const uniqueErrorTypes = importResult ? [...new Set(importResult.details.errors.map((error) => error.error))] : []

  // Filtrar errores basados en búsqueda y tipo de error
  const filteredErrors = importResult
    ? importResult.details.errors.filter((error) => {
        const matchesSearch =
          searchTerm === "" ||
          `${error.nombre} ${error.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          error.dni.includes(searchTerm)
        const matchesFilter = errorFilter === null || error.error === errorFilter
        return matchesSearch && matchesFilter
      })
    : []

  // Filtrar éxitos basados en búsqueda
  const filteredSuccess = importResult
    ? importResult.details.success.filter(
        (success) =>
          searchTerm === "" ||
          `${success.nombre} ${success.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          success.dni.includes(searchTerm),
      )
    : []

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Agregar nuevos pacientes</CardTitle>
          <CardDescription>
            Esta es una sección para subir múltiples pacientes con sus respectivos datos en archivos CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importResult && (
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-primary"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                {file ? (
                  <>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetUpload}>
                      Cambiar archivo
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Arrastrá y soltá tu archivo CSV acá</p>
                      <p className="text-sm text-gray-500">o hace clic para seleccionar un archivo</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="csv-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        Seleccionar archivo
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {uploadProgress > 0 && !importResult && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Resultados de importación */}
          {importResult && (
            <div className="space-y-6">
              {/* Resumen */}
              <div
                className={`rounded-lg p-4 ${
                  importResult.summary.errors === 0
                    ? "bg-green-50 border border-green-100"
                    : importResult.summary.success > 0
                      ? "bg-yellow-50 border border-yellow-100"
                      : "bg-red-50 border border-red-100"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {importResult.summary.errors === 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : importResult.summary.success > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="ml-3 flex-grow">
                    <h3 className="text-sm font-medium">
                      {importResult.summary.errors === 0
                        ? "Importación exitosa"
                        : importResult.summary.success > 0
                          ? "Importación parcial"
                          : "Importación fallida"}
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className="text-gray-700">{importResult.message}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">
                        Total: {importResult.summary.total}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          importResult.summary.success > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-white"
                        }`}
                      >
                        Exitosos: {importResult.summary.success}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          importResult.summary.errors > 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-white"
                        }`}
                      >
                        Errores: {importResult.summary.errors}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs para alternar entre éxitos y errores */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "success" | "errors")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="success" disabled={importResult.details.success.length === 0}>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>Exitosos ({importResult.details.success.length})</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="errors" disabled={importResult.details.errors.length === 0}>
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      <span>Errores ({importResult.details.errors.length})</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                {/* Contenido de la pestaña de éxitos */}
                <TabsContent value="success" className="mt-4">
                  {importResult.details.success.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center">
                          <Users className="h-5 w-5 mr-2 text-green-600" />
                          Pacientes importados exitosamente
                        </h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {importResult.details.success.length} pacientes
                        </Badge>
                      </div>

                      {/* Buscador */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar por nombre o DNI..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      {/* Lista de pacientes importados exitosamente */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 px-4 py-3 border-b">
                          <div className="grid grid-cols-3 gap-4 font-medium text-sm text-green-800">
                            <div>Nombre</div>
                            <div>Apellido</div>
                            <div>DNI</div>
                          </div>
                        </div>
                        <div className="divide-y max-h-60 overflow-y-auto">
                          {filteredSuccess.length > 0 ? (
                            filteredSuccess.map((success, index) => (
                              <div key={index} className="px-4 py-3 hover:bg-gray-50">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>{success.nombre}</div>
                                  <div>{success.apellido}</div>
                                  <div>{success.dni}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                              No se encontraron resultados para tu búsqueda
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No hay pacientes importados</h3>
                      <p className="text-gray-500">No se pudo importar ningún paciente del archivo CSV.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Contenido de la pestaña de errores */}
                <TabsContent value="errors" className="mt-4">
                  {importResult.details.errors.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                          Errores de importación
                        </h3>
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={exportErrorsToCSV}
                                  className="h-8 px-2 text-xs"
                                >
                                  <Download className="h-3.5 w-3.5 mr-1" />
                                  Exportar errores
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Descargar lista de errores en formato CSV</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Badge variant="destructive">{importResult.details.errors.length} errores</Badge>
                        </div>
                      </div>

                      {/* Filtros y búsqueda */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por nombre o DNI..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        {uniqueErrorTypes.length > 0 && (
                          <div className="relative min-w-[180px]">
                            <select
                              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              value={errorFilter || ""}
                              onChange={(e) => setErrorFilter(e.target.value || null)}
                            >
                              <option value="">Todos los errores</option>
                              {uniqueErrorTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Lista de errores */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-red-50 px-4 py-3 border-b">
                          <div className="grid grid-cols-12 gap-4 font-medium text-sm text-red-800">
                            <div className="col-span-3">Nombre</div>
                            <div className="col-span-3">Apellido</div>
                            <div className="col-span-2">DNI</div>
                            <div className="col-span-4">Error</div>
                          </div>
                        </div>
                        <div className="divide-y max-h-60 overflow-y-auto">
                          {filteredErrors.length > 0 ? (
                            filteredErrors.map((error, index) => (
                              <div key={index} className="px-4 py-3 hover:bg-gray-50">
                                <div className="grid grid-cols-12 gap-4 text-sm">
                                  <div className="col-span-3">{error.nombre}</div>
                                  <div className="col-span-3">{error.apellido}</div>
                                  <div className="col-span-2">{error.dni}</div>
                                  <div className="col-span-4">
                                    <Badge variant="destructive" className="font-normal">
                                      {error.error}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                              No se encontraron resultados para tu búsqueda
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sugerencias para corregir errores */}
                      <Accordion type="single" collapsible className="border rounded-lg">
                        <AccordionItem value="suggestions">
                          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-center text-sm font-medium">
                              <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                              Sugerencias para corregir errores
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start space-x-2">
                                <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-blue-700" />
                                </div>
                                <p>
                                  <strong>DNI duplicado:</strong> El paciente ya existe en el sistema. Verifica el DNI o
                                  actualiza el registro existente.
                                </p>
                              </div>
                              <div className="flex items-start space-x-2">
                                <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-blue-700" />
                                </div>
                                <p>
                                  <strong>Formato inválido:</strong> Asegúrate de que los datos cumplan con el formato
                                  requerido (fechas, números, etc.).
                                </p>
                              </div>
                              <div className="flex items-start space-x-2">
                                <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                                  <CheckCircle className="h-3 w-3 text-blue-700" />
                                </div>
                                <p>
                                  <strong>Datos faltantes:</strong> Completa todos los campos obligatorios en el archivo
                                  CSV.
                                </p>
                              </div>
                              <div className="mt-3">
                                <Button variant="link" size="sm" className="h-auto p-0" onClick={downloadTemplate}>
                                  <Download className="h-3.5 w-3.5 mr-1" />
                                  Descargar plantilla correcta
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">¡No hay errores!</h3>
                      <p className="text-gray-500">Todos los pacientes fueron importados correctamente.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" size="sm" onClick={resetUpload}>
                  Subir otro archivo
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="default" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <Link href="/pacientes">Ver listado de pacientes</Link>
              
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ir al listado completo de pacientes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          {uploadStatus === "success" && !importResult && (
            <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Archivo procesado correctamente</span>
            </div>
          )}

          {uploadStatus === "error" && !importResult && (
            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error al procesar el archivo. Intente nuevamente.</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!importResult && (
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
              {isUploading ? "Procesando..." : "Subir y procesar pacientes"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full max-w-2xl mx-auto mt-6 overflow-hidden border-0 shadow-lg">
        <div className="bg-card p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-h1">Guía de archivos CSV</CardTitle>
              <CardDescription className="text-paragraph">
                Todo lo que necesitas saber para crear y usar archivos CSV
              </CardDescription>
            </div>
          </div>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>¿Qué es?</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Cómo crear</span>
              </TabsTrigger>
              <TabsTrigger value="example" className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                <span>Ejemplo</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="about" className="p-6 pt-4">
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-paragraph mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  ¿Qué es un archivo CSV?
                </h3>
                <p className="text-gray-700">
                  Un archivo <strong>CSV (Comma Separated Values)</strong> es un formato simple para almacenar datos
                  tabulares en texto plano.
                </p>
                <div className="mt-3 flex items-start space-x-2">
                  <div className="bg-primary p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Cada línea del archivo representa una fila de datos (un paciente)
                  </p>
                </div>
                <div className="mt-2 flex items-start space-x-2">
                  <div className="bg-primary p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Los valores están separados por comas, representando cada columna
                  </p>
                </div>
                <div className="mt-2 flex items-start space-x-2">
                  <div className="bg-primary p-1 rounded-full mt-1">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Es compatible con Excel, Google Sheets y la mayoría de software de hojas de cálculo
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Descargar plantilla CSV
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Descarga un archivo CSV de ejemplo con el formato correcto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="p-6 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Cómo crear un archivo CSV</h3>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Usando Excel</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Abrí Microsoft Excel y creá una tabla con los datos de tus pacientes. Luego guardá el archivo como
                      "CSV UTF-8 (delimitado por comas)" desde el menú Archivo &gt; Guardar como.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Usando Google Sheets</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Creá una hoja de cálculo en Google Sheets con tus datos. Luego descargá el archivo como CSV desde
                      el menú Archivo &gt; Descargar &gt; Valores separados por comas (.csv).
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start">
                  <div className="bg-primary text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Usando un editor de texto</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Podés crear un archivo CSV con cualquier editor de texto como Notepad o TextEdit. Simplemente
                      escribí los datos separados por comas y guardá el archivo con extensión .csv.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="example" className="p-6 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Estructura del archivo CSV</h3>

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nombre
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Apellido
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            DNI
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Teléfono
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Juan</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Pérez</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">12345678</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">juan@email.com</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">1234567890</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">María</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">González</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">87654321</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">maria@email.com</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">0987654321</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Así se vería en formato CSV:</p>
                <div className="bg-gray-800 text-gray-200 p-3 rounded font-mono text-xs overflow-x-auto">
                  Nombre,Apellido,DNI,Email,Teléfono,FechaNacimiento,Sexo,Altura,Peso
                  <br />
                  Juan,Pérez,12345678,juan@email.com,1234567890,1990-01-01,M,170,70
                  <br />
                  María,González,87654321,maria@email.com,0987654321,1985-05-15,F,165,60
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={downloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar plantilla CSV
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  )
}
