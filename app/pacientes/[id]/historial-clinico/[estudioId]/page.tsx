import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Receipt,
  Calendar,
  FileText,
  Microscope,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTipoEstudio } from "@/app/utils/getTipoEstudio";
import Archivo from "@/app/types/Archivo";
import { Label } from "@/components/ui/label";
import ArchivoSelect from "./ArchivoSelect";

async function getEstudio(estudioId: string) {
  const res = await fetch(
    `http://localhost:3000/api/estudio/search/${estudioId}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch estudio");
  }
  return res.json();
}

async function getArchivosEstudio(estudioId: string) {
  const ID_Estudio = Number(estudioId);

  try {
    const response = await fetch(
      `http://localhost:3000/api/archivo/estudio/${ID_Estudio}`
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener los archivos");
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error("No se encontraron archivos para este estudio");
    }

    return data;
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
    return [];
  }
}

export default function EstudioDetailPage({
  params,
}: {
  params: Promise<{ id: string; estudioId: string }>;
}) {
  const resolvedParams = use(params);

  const estudio = use(getEstudio(resolvedParams.estudioId).catch(() => null));

  const archivosEstudio = use(getArchivosEstudio(resolvedParams.estudioId));

  const tipoEstudio = use(
    getTipoEstudio(estudio?.ID_TipoEstudio || 0).catch(() => "Error al cargar")
  );

  if (!estudio) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/pacientes/${resolvedParams.id}/historial-clinico`}
          passHref
        >
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Historial Clínico
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Detalle del Estudio</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col space-y-1">
                <dt className="font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha
                </dt>
                <dd>
                  {new Date(estudio.Fecha).toLocaleDateString("es-AR", {
                    timeZone: "UTC",
                  })}
                </dd>
              </div>
              <div className="flex flex-col space-y-1">
                <dt className="font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Asunto
                </dt>
                <dd>{estudio.Asunto}</dd>
              </div>
              <div className="flex flex-col space-y-1">
                <dt className="font-medium text-muted-foreground flex items-center gap-2">
                  <Microscope className="h-4 w-4" />
                  Tipo de Estudio
                </dt>
                <dd>{tipoEstudio}</dd>
              </div>
              <div className="flex flex-col space-y-1 sm:col-span-3">
                <dt className="font-medium text-muted-foreground flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Factura
                </dt>
                <dd>
                  {estudio.Factura ? (
                    <Badge variant="secondary" className="text-base py-1 px-2">
                      {estudio.Factura}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No aplica</span>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Observación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-md leading-relaxed">
              {estudio.Observacion}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Archivos</CardTitle>
          </CardHeader>
          <CardContent>
            <ArchivoSelect archivos={archivosEstudio} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
