export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto py-4 px-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} CardioSys. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
