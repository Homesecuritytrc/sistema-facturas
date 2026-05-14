'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Receipt, Users, Plus, List, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ total: 0, clientes: 0 });

  useEffect(() => {
    async function getStats() {
      const { count } = await supabase.from('facturas').select('*', { count: 'exact', head: true });
      const { data: clientes } = await supabase.from('facturas').select('cliente');
      const unique = new Set(clientes?.map(c => c.cliente)).size;
      setMetrics({ total: count || 0, clientes: unique });
    }
    getStats();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 font-medium">Control de Facturas</p>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 flex items-center gap-2">
          <LogOut size={20} /> Salir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg"><Receipt className="text-blue-600" /></div>
          <div><p className="text-sm text-gray-500 font-bold uppercase">Total Facturas</p><p className="text-2xl font-bold">{metrics.total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg"><Users className="text-green-600" /></div>
          <div><p className="text-sm text-gray-500 font-bold uppercase">Clientes Únicos</p><p className="text-2xl font-bold">{metrics.clientes}</p></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/facturas/nueva" className="flex-1 bg-blue-600 text-white p-6 rounded-2xl flex flex-col items-center gap-2 hover:bg-blue-700 shadow-lg transition">
          <Plus size={32} /><span className="font-bold text-lg">Nueva Factura</span>
        </Link>
        <Link href="/facturas" className="flex-1 bg-white text-gray-700 p-6 rounded-2xl border flex flex-col items-center gap-2 hover:bg-gray-50 transition shadow-sm">
          <List size={32} /><span className="font-bold text-lg">Ver Historial</span>
        </Link>
      </div>
    </div>
  );
}