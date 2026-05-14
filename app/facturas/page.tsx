'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ListadoFacturas() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los Filtros (Sección 5.2 del PRD)
  const [busqueda, setBusqueda] = useState(''); // Cliente, Proveedor o Factura
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
      f.numero_factura.includes(busqueda);

    const cumpleFecha = 
      (!fechaInicio || f.fecha_compra >= fechaInicio) &&
      (!fechaFin || f.fecha_compra <= fechaFin);

    return cumpleBusqueda && cumpleFecha;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-black">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/dashboard" className="text-blue-600 flex items-center gap-1 text-sm mb-2 hover:underline">
            <ArrowLeft size={16} /> Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Historial de Facturas</h1>
        </div>
        <Link href="/facturas/nueva" className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-bold shadow-lg shadow-blue-100 transition w-full md:w-auto justify-center">
          <Plus size={20} /> Registrar Nueva
        </Link>
      </div>

      {/* Barra de Filtros Avanzada (Sección 5.2) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Filtros de Búsqueda</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Cliente, Proveedor o Nro Factura..." 
              className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="date" title="Desde"
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <span className="text-gray-400">al</span>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="date" title="Hasta"
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Completa (Sección 5.2 / 7.1) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold border-b">
              <tr>
                <th className="px-6 py-4">F. Compra</th>
                <th className="px-6 py-4">Nro Factura</th>
                <th className="px-6 py-4">Proveedor</th>
                <th className="px-6 py-4">Monto</th>
                <th className="px-6 py-4">Cliente (Venta)</th>
                <th className="px-6 py-4">F. Venta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-10 text-gray-400 italic">Cargando facturas...</td></tr>
              ) : facturasFiltradas.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-10 text-gray-400">No se encontraron facturas con esos filtros.</td></tr>
              ) : (
                facturasFiltradas.map((f) => (
                  <tr key={f.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(f.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{f.numero_factura}</td>
                    <td className="px-6 py-4 text-gray-700">{f.proveedor}</td>
                    <td className="px-6 py-4 font-black text-blue-600">${Number(f.monto).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-700 bg-blue-50/50 group-hover:bg-transparent">{f.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                      {new Date(f.fecha_venta).toLocaleDateString()}
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