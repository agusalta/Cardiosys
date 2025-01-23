import { useState, useEffect } from "react";
import Actividad from "../types/Activity";

export function useActivity() {
  const [activities, setActivities] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("http://localhost:3000/api/activity");
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
  }, []);

  return { activities, loading };
}
