'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Calendar, ArrowLeft, Filter, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ListadoFacturas() {
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

  // Lógica de Filtrado Simultáneo (Incluyendo Descripción)
  const facturasFiltradas = facturas.filter(f => {
    const cumpleBusqueda = 
      f.cliente.toLowerCase().includes(busqueda.toLowerCase()) || 
      f.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      f.numero_factura.includes(busqueda) ||
      (f.descripcion && f.descripcion.toLowerCase().includes(busqueda.toLowerCase())); // BUSQUEDA POR DESCRIPCIÓN

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
        </div>
        <Link href="/facturas/nueva" className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-bold shadow-lg transition w-full md:w-auto justify-center">
          <Plus size={20} /> Registrar Nueva
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">Búsqueda y Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Buscar por Cliente, Proveedor, Factura o Descripción..." 
              className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="date" title="Desde"
                className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none transition"
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <span className="text-gray-400 font-bold">~</span>
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

      {/* Tabla con Columna de Descripción */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-10 text-gray-400 italic">Cargando datos...</td></tr>
              ) : facturasFiltradas.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-10 text-gray-400">No hay coincidencias.</td></tr>
              ) : (
                facturasFiltradas.map((f) => (
                  <tr key={f.id} className="hover:bg-blue-50 transition-colors group text-sm">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {new Date(f.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{f.numero_factura}</td>
                    <td className="px-6 py-4 text-gray-700">{f.proveedor}</td>
                    
                    {/* COLUMNA DE DESCRIPCIÓN CON TRUNCADO */}
                    <td className="px-6 py-4 text-gray-500 max-w-xs" title={f.descripcion}>
                      <div className="truncate">{f.descripcion}</div>
                    </td>

                    <td className="px-6 py-4 font-black text-blue-600">${Number(f.monto).toLocaleString()}</td>
                    <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold text-xs uppercase">
                            {f.cliente}
                        </span>
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