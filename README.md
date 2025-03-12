# Sistema Médico

## Descripción

Sistema Médico es una aplicación web diseñada para gestionar la información de pacientes y actividades en una clínica.
Proporciona un panel de control que muestra estadísticas clave, como el número total de pacientes, pacientes nuevos en el mes,
y el total recaudado. Además, permite visualizar las visitas recientes y la imagen de la clínica del día.

## Características

- **Panel de Control**: Visualiza estadísticas importantes de la clínica.
- **Resumen Mensual**: Muestra el número de pacientes nuevos, total recaudado y pacientes totales.
- **Visitas Recientes**: Lista las actividades recientes en la clínica.
- **Clínica de Hoy**: Muestra la imagen de la clínica actual.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Next.js**: Framework de React para aplicaciones web.
- **Material-UI**: Biblioteca de componentes de interfaz de usuario.
- **Axios**: Cliente HTTP para realizar solicitudes a la API.
- **Context API**: Para la gestión del estado global de la aplicación.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu_usuario/sistema-medico.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd sistema-medico
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Configura las variables de entorno. Crea un archivo `.env.local` en la raíz del proyecto y añade la siguiente línea:

   ```plaintext
   NEXT_PUBLIC_BACKEND_URL=tu_url_del_backend
   ```

5. Inicia la aplicación:

   ```bash
   npm run dev
   ```

6. Abre tu navegador y visita `http://localhost:3000`.

## Uso

Una vez que la aplicación esté en funcionamiento, podes acceder al panel de control donde se muestran las estadísticas de la clínica.
Podes interactuar con los botones para alternar la visibilidad de los totales recaudados y navegar a la sección de pacientes.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor segui estos pasos:

1. Hace un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Añadir nueva característica'`).
4. Envía tus cambios (`git push origin feature/nueva-caracteristica`).
5. Abrí un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para más información, puedes contactar a [tu_email@ejemplo.com](mailto:agustinaltamirano2024@gmail.com).
