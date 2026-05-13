'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ListadoFacturas() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function fetchFacturas() {
      const { data } = await supabase.from('facturas').select('*').order('created_at', { ascending: false });
      if (data) setFacturas(data);
    }
    fetchFacturas();
  }, []);

  const facturasFiltradas = facturas.filter(f => 
    f.cliente.toLowerCase().includes(filtro.toLowerCase()) || 
    f.proveedor.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Historial de Facturas</h1>
        <Link href="/facturas/nueva" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-bold">
          <Plus size={20} /> Nueva
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" placeholder="Filtrar por cliente o proveedor..." 
          className="w-full pl-10 p-3 rounded-xl border border-gray-200 shadow-sm"
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Factura</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4">Monto</th>
              <th className="px-6 py-4">Cliente</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {facturasFiltradas.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{f.numero_factura}</td>
                <td className="px-6 py-4">{f.proveedor}</td>
                <td className="px-6 py-4 text-green-600 font-bold">${f.monto}</td>
                <td className="px-6 py-4">{f.cliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}