'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NuevaFactura() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero_factura: '', proveedor: '', fecha_compra: '', descripcion: '', monto: '', cliente: '', fecha_venta: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('facturas').insert([
      { ...formData, monto: parseFloat(formData.monto), user_id: user?.id }
    ]);

    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-black bg-white min-h-screen">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
        <ArrowLeft size={20} /> Volver
      </button>

      <h1 className="text-3xl font-bold mb-8">Registrar Compra</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Número de Factura" className="border p-3 rounded-lg w-full" onChange={e => setFormData({...formData, numero_factura: e.target.value})} required />
          <input placeholder="Nombre del Proveedor" className="border p-3 rounded-lg w-full" onChange={e => setFormData({...formData, proveedor: e.target.value})} required />
        </div>
        
        <input type="date" title="Fecha de compra" className="border p-3 rounded-lg w-full" onChange={e => setFormData({...formData, fecha_compra: e.target.value})} required />
        <textarea placeholder="Descripción del producto o servicio" className="border p-3 rounded-lg w-full h-24" onChange={e => setFormData({...formData, descripcion: e.target.value})} required />
        <input type="number" step="0.01" placeholder="Monto Total ($)" className="border p-3 rounded-lg w-full font-bold" onChange={e => setFormData({...formData, monto: e.target.value})} required />

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-blue-700 font-bold text-sm mb-4 uppercase tracking-wider">Trazabilidad (Venta al Cliente)</h2>
          <input placeholder="¿A qué cliente se le vendió?" className="border p-3 rounded-lg w-full mb-3" onChange={e => setFormData({...formData, cliente: e.target.value})} required />
          <input type="date" title="Fecha de venta al cliente" className="border p-3 rounded-lg w-full" onChange={e => setFormData({...formData, fecha_venta: e.target.value})} required />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg">
          <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Factura'}
        </button>
      </form>
    </div>
  );
}