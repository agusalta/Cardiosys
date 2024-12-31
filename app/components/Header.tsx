import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CardioSys
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/pacientes" className="hover:underline">
                Pacientes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
