import { create } from "zustand";

const useStore = create((set) => ({
  clinicToday: "", // Estado para la clínica
  clinicImage: "", // Estado para la imagen de la clínica
  setClinicToday: (clinic, image) =>
    set({ clinicToday: clinic, clinicImage: image }), // Función para actualizar el estado
  updateClinicForToday: () => {
    const dayOfWeek = new Date().getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
    const currentDate = new Date().getDate(); // Día del mes para control de semanas alternas
    let clinic = "";
    let image = "";

    switch (dayOfWeek) {
      case 1: // Lunes
      case 5: // Viernes
      case 6: // Sábado (cada 15 días)
        if (dayOfWeek === 6 && currentDate % 14 > 7) {
          clinic = "Pinamed";
          image = "/Pinamed.png";
        } else if (dayOfWeek !== 6) {
          clinic = "Pinamed";
          image = "/Pinamed.png";
        }
        break;
      case 2: // Martes
      case 3: // Miércoles
        clinic = "Clínica del Sol";
        image = "/CDS.png";
        break;
      case 4: // Jueves
        clinic = "CEM";
        image = "/CEM.png";
        break;
      default:
        clinic = "";
        image = "";
        break;
    }

    set({ clinicToday: clinic, clinicImage: image });
  },
}));

export default useStore;
