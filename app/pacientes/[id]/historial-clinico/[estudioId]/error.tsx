"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Algo salió mal</CardTitle>
          <CardDescription>
            Ocurrió un error al cargar los detalles del estudio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Por favor, intente nuevamente. Si el problema persiste, contacte al
            soporte técnico.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={reset}>Intentar nuevamente</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
