"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatosPaciente, EtapaEjercicio } from "../helpers/Protocolos";

export default function InformeMedico() {
  const [datosPaciente, setDatosPaciente] = useState<DatosPaciente>({
    nombre: "",
    edad: 0,
    sexo: "",
    peso: 0,
    fecha: "",
    solicitadoPor: "",
    modalidad: "",
    diagnostico: "",
  });

  const [etapasEjercicio, setEtapasEjercicio] = useState<EtapaEjercicio[]>([
    {
      etapa: "BASAL",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "78",
      ta: "120/70",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "I",
      min: "4",
      mets: "4.5",
      pendiente: "2.7",
      km: "-",
      fc: "126",
      ta: "140/90",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "II",
      min: "7",
      mets: "7",
      pendiente: "4",
      km: "-",
      fc: "170",
      ta: "180/110",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "III",
      min: "10",
      mets: "14",
      pendiente: "5.4",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "IV",
      min: "13",
      mets: "16",
      pendiente: "6.7",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "V",
      min: "16",
      mets: "18",
      pendiente: "8",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "VI",
      min: "18",
      mets: "20",
      pendiente: "8.8",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "VII",
      min: "20",
      mets: "20",
      pendiente: "10.4",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "VIII",
      min: "23",
      mets: "20",
      pendiente: "11.2",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "IX",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "X",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "/",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "RECUPERACIÓN",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "-",
      ta: "-",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "Inmediata",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "147",
      ta: "160/100",
      ecg: "",
      arrit: "",
      sint: "",
    },
    {
      etapa: "Precoz",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "115",
      ta: "120/60",
      ecg: "",
      arrit: "EVA",
      sint: "",
    },
    {
      etapa: "Tardía",
      min: "-",
      mets: "-",
      pendiente: "-",
      km: "-",
      fc: "100",
      ta: "120/70",
      ecg: "",
      arrit: "",
      sint: "",
    },
  ]);

  const [observaciones, setObservaciones] = useState({
    inmediata: "",
    precoz: "",
    tardia: "",
  });

  const calcularFCMaxima = (edad: number) => {
    return 220 - edad;
  };

  const handleEtapaChange = (
    index: number,
    field: keyof EtapaEjercicio,
    value: string
  ) => {
    const newEtapas = [...etapasEjercicio];
    newEtapas[index] = { ...newEtapas[index], [field]: value };
    setEtapasEjercicio(newEtapas);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={datosPaciente.nombre}
                onChange={(e) =>
                  setDatosPaciente({ ...datosPaciente, nombre: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={datosPaciente.edad}
                onChange={(e) =>
                  setDatosPaciente({
                    ...datosPaciente,
                    edad: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Input
                id="sexo"
                value={datosPaciente.sexo}
                onChange={(e) =>
                  setDatosPaciente({ ...datosPaciente, sexo: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                value={datosPaciente.peso}
                onChange={(e) =>
                  setDatosPaciente({
                    ...datosPaciente,
                    peso: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={datosPaciente.fecha}
                onChange={(e) =>
                  setDatosPaciente({ ...datosPaciente, fecha: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="solicitadoPor">Solicitado Por</Label>
              <Input
                id="solicitadoPor"
                value={datosPaciente.solicitadoPor}
                onChange={(e) =>
                  setDatosPaciente({
                    ...datosPaciente,
                    solicitadoPor: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="modalidad">Modalidad</Label>
              <Input
                id="modalidad"
                value={datosPaciente.modalidad}
                onChange={(e) =>
                  setDatosPaciente({
                    ...datosPaciente,
                    modalidad: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Input
                id="diagnostico"
                value={datosPaciente.diagnostico}
                onChange={(e) =>
                  setDatosPaciente({
                    ...datosPaciente,
                    diagnostico: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sistemas Utilizados</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Para la realización de este estudio se utilizó:</p>
          <ul className="list-disc list-inside">
            <li>
              El estudio Ultrasonográfico fue realizado con un Ecocardiógrafo
              General, con trasductor Duplex Multifrecuencia equipado con imagen
              armónica, inversión de pulsos y power imaging.
            </li>
            <li>Protocolo Pico y Post Ejercicio Ergométrico</li>
            <li>
              La prueba de esfuerzo se efectuó en cinta con sistema de registro
              de 12 canales.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocolo de Procedimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-semibold">
            Protocolo Pico y PostEjercicio Ergometrico
          </h3>
          <p>
            La prueba de esfuerzo se efectuó en cinta con sistema de registro de
            12 canales.
          </p>
          <p>
            El procedimiento consistió en la captación en condiciones basales de
            imágenes correspondientes a las vistas ecocardiográficas
            paraesternal izquierda en eje mayor y menor y apical en 4 y 2
            cámaras, así como en la obtención de un registro
            electrocardiográfico completo.
          </p>
          <p>
            Se realizó luego una prueba ergométrica graduada convencional.
            Inmediatamente de concluido el ejercicio, el paciente se instaló
            nuevamente en la camilla de ecocardiografia, registrándose las
            mismas vistas, previamente captadas en condiciones basales. Todas la
            imágenes fueron digitalizadas y analizadas por 2 operadores,
            utilizando la siguiente jerarquía numérica a los efectos de obtener
            un score de motilidad parietal:
          </p>
          <ul className="list-none space-y-1 pl-4">
            <li>1.- Normal</li>
            <li>2.- Hipoquinético</li>
            <li>3.- Aquinético</li>
            <li>4.- Aneurisma</li>
            <li>0.- No apto para interpretacion</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocolo de Ejercicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-hidden border-none">
            <Table className="[&_td]:p-1 [&_th]:p-1 [&_input]:h-7 [&_input]:text-sm">
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="font-bold">Etapa</TableHead>
                  <TableHead className="font-bold">MIN.</TableHead>
                  <TableHead className="font-bold">METS</TableHead>
                  <TableHead className="font-bold">PEND</TableHead>
                  <TableHead className="font-bold">K/H</TableHead>
                  <TableHead className="font-bold">F.C.</TableHead>
                  <TableHead className="font-bold">T.A.</TableHead>
                  <TableHead className="font-bold">ECG.</TableHead>
                  <TableHead className="font-bold">ARRIT.</TableHead>
                  <TableHead className="font-bold">SINT.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {etapasEjercicio.slice(0, 10).map((etapa, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{etapa.etapa}</TableCell>
                    <TableCell>
                      <Input
                        value={etapa.min}
                        onChange={(e) =>
                          handleEtapaChange(index, "min", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.mets}
                        onChange={(e) =>
                          handleEtapaChange(index, "mets", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.pendiente}
                        onChange={(e) =>
                          handleEtapaChange(index, "pendiente", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.km}
                        onChange={(e) =>
                          handleEtapaChange(index, "km", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.fc}
                        onChange={(e) =>
                          handleEtapaChange(index, "fc", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.ta}
                        onChange={(e) =>
                          handleEtapaChange(index, "ta", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.ecg}
                        onChange={(e) =>
                          handleEtapaChange(index, "ecg", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.arrit}
                        onChange={(e) =>
                          handleEtapaChange(index, "arrit", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={etapa.sint}
                        onChange={(e) =>
                          handleEtapaChange(index, "sint", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etapas de Recuperación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Inmediata", "Precoz", "Tardía"].map((etapa, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">{etapa}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">F.C.</Label>
                    <Input
                      value={etapasEjercicio[11 + index].fc}
                      onChange={(e) =>
                        handleEtapaChange(11 + index, "fc", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">T.A.</Label>
                    <Input
                      value={etapasEjercicio[11 + index].ta}
                      onChange={(e) =>
                        handleEtapaChange(11 + index, "ta", e.target.value)
                      }
                      className="h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Observaciones</Label>
                  <Input
                    value={
                      observaciones[
                        etapa.toLowerCase() as keyof typeof observaciones
                      ]
                    }
                    onChange={(e) =>
                      setObservaciones({
                        ...observaciones,
                        [etapa.toLowerCase()]: e.target.value,
                      })
                    }
                    className="h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cálculos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Máxima F.C. prevista:</p>
              <p className="text-2xl font-bold">
                {calcularFCMaxima(datosPaciente.edad)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Máxima F.C. Obtenida:</p>
              <p className="text-2xl font-bold">
                {etapasEjercicio.reduce(
                  (max, etapa) => Math.max(max, parseInt(etapa.fc) || 0),
                  0
                )}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Máxima T.A. Obtenida:</p>
              <p className="text-2xl font-bold">
                {etapasEjercicio.reduce((max, etapa) => {
                  const systolic = parseInt(etapa.ta.split("/")[0]) || 0;
                  return Math.max(max, systolic);
                }, 0)}
                /
                {etapasEjercicio.reduce((max, etapa) => {
                  const diastolic = parseInt(etapa.ta.split("/")[1]) || 0;
                  return Math.max(max, diastolic);
                }, 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Máxima METS Obtenidos:</p>
              <p className="text-2xl font-bold">
                {etapasEjercicio.reduce(
                  (max, etapa) => Math.max(max, parseFloat(etapa.mets) || 0),
                  0
                )}
              </p>
            </div>
            <div className="space-y-2 col-span-2">
              <p className="text-sm font-medium">ITTM (T.A. sist. x F.C.):</p>
              <p className="text-2xl font-bold">
                {etapasEjercicio.reduce((max, etapa) => {
                  const systolic = parseInt(etapa.ta.split("/")[0]) || 0;
                  const fc = parseInt(etapa.fc) || 0;
                  return Math.max(max, systolic * fc);
                }, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluación Final</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="w-full h-20 p-2 border rounded-md"
            placeholder="Escribí tu evaluación acá..."
          ></Textarea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análisis de la Motilidad Segmentaria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted/20 p-2 text-sm">
              1=NORMAL 2=HIPOQUINESIA 3=AQUINESIA 4=ANEURISMA 0=NO INTERPRETABLE
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Basal Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Basal</h3>
                <div className="aspect-square relative">
                  {/* Números 1 superpuestos - se implementarían con posicionamiento absoluto */}
                </div>
              </div>

              {/* Post Exercise Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center">POSTEJERCICIO</h3>
                <div className="aspect-square relative">
                  {/* Números 1 superpuestos - se implementarían con posicionamiento absoluto */}
                </div>
              </div>
            </div>

            {/* Score Index */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-2 text-center font-semibold">
                Indice de Score de Motilidad
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="p-4 text-center">
                  <span className="font-medium">Indice Basal: </span>
                  <span className="text-lg">1</span>
                </div>
                <div className="p-4 text-center">
                  <span className="font-medium">Indice Post: </span>
                  <span className="text-lg">1</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusiones</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            className="w-full h-20 p-2 border rounded-md"
            placeholder="Escribí tus conclusiones acá..."
          ></Textarea>
        </CardContent>
      </Card>

      <Button>Generar Informe</Button>
    </div>
  );
}
