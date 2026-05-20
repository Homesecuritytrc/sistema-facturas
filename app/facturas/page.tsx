'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, ArrowLeft, Filter, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ListadoFacturas() {
  const router = useRouter();
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los Filtros
  const [busqueda, setBusqueda] = useState(''); 
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    async function fetchFacturas() {
      setLoading(true);
      const { data } = await supabase
        .from('facturas')
        .select('*')
        .order('fecha_compra', { ascending: false });
      if (data) setFacturas(data);
      setLoading(false);
    }
    fetchFacturas();
  }, []);

  // Lógica de Filtrado Simultáneo
  const facturasFiltradas = facturas.filter(f => {
    const cumpleBusqueda = 
      f.cliente.toLowerCase().includes(busqueda.toLowerCase()) || 
      f.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.numero_factura.includes(busqueda) ||
      (f.descripcion && f.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

    const cumpleFecha = 
      (!fechaInicio || f.fecha_compra >= fechaInicio) &&
      (!fechaFin || f.fecha_compra <= fechaFin);

    return cumpleBusqueda && cumpleFecha;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-black font-sans">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-blue-600 flex items-center gap-1 text-sm mb-2 hover:underline font-medium">
            <ArrowLeft size={16} /> Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Facturas</h1>
          <p className="text-gray-400 text-sm">Haz clic en cualquier fila para editar o borrar una factura.</p>
        </div>
        <Link href="/facturas/nueva" className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-bold shadow-lg transition w-full md:w-auto justify-center">
          <Plus size={20} /> Registrar Nueva
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Buscar por Cliente, Proveedor o Descripción..." 
              className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input 
              type="date" title="Desde"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <span className="text-gray-400 font-bold">~</span>
            <input 
              type="date" title="Hasta"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla Interactiva */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold border-b">
              <tr>
                <th className="px-6 py-4">F. Compra</th>
                <th className="px-6 py-4">Factura</th>
                <th className="px-6 py-4">Proveedor</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4 text-center italic">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="text-center p-10 text-gray-400 italic">Cargando datos...</td></tr>
              ) : facturasFiltradas.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-10 text-gray-400">No hay coincidencias.</td></tr>
              ) : (
                facturasFiltradas.map((f) => (
                  <tr 
                    key={f.id} 
                    className="hover:bg-blue-50 transition-colors cursor-pointer group text-sm"
                    onClick={() => router.push(`/facturas/${f.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(f.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{f.numero_factura}</td>
                    <td className="px-6 py-4 text-gray-700">{f.proveedor}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={f.descripcion}>
                      {f.descripcion}
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600">${Number(f.monto).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{f.cliente}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-blue-400 group-hover:text-blue-600">
                        <Edit3 size={18} className="mx-auto" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}