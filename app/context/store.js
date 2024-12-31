import { create } from "zustand";

const useStore = create((set) => ({
  clinicToday: "", // Estado para la clínica
  clinicImage: "", // Estado para la imagen de la clínica
  setClinicToday: (clinic, image) =>
    set({ clinicToday: clinic, clinicImage: image }), // Función para actualizar el estado
  updateClinicForToday: () => {
    const dayOfWeek = new Date().getDay(); // Obtiene el día de la semana (0=domingo, 1=lunes, etc.)
    let clinic = "";
    let image = "";

    // Determinamos la clínica según el día de la semana
    switch (dayOfWeek) {
      case 1: // Lunes
      case 2: // Martes
      case 5: // Viernes
        clinic = "Pinamed";
        image = "/Pinamed.png";
        // La imagen correspondiente
        break;
      case 3: // Miércoles
      case 4: // Jueves
      case 6: // Sábado
        clinic = "Clínica del Sol";
        image = "/CDS.png"; // La imagen correspondiente
        break;
      default:
        clinic = "";
        image = "";
        break;
    }

    // Actualizamos el estado global
    set({ clinicToday: clinic, clinicImage: image });
  },
}));

export default useStore;
