import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black p-10 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Admin Facturas</h1>
      <p className="text-gray-600 mb-8 text-lg">Sistema de Gestión de Proveedores y Clientes</p>
      <Link 
        href="/login" 
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg"
      >
        Ir al Panel de Acceso
      </Link>
    </div>
  );
}