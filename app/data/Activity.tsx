import { useState, useEffect } from "react";
import Actividad from "../types/Activity";

export function useActivity() {
  const [activities, setActivities] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(`${backendUrl}/activity`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error al cargar las actividades:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [backendUrl]);

  return { activities, loading };
}
