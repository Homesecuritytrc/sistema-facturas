'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function EditarFactura() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({
    numero_factura: '',
    proveedor: '',
    monto: 0,
    cliente: '',
    fecha_venta: '',
    descripcion: ''
  });

  useEffect(() => {
    async function fetchFactura() {
      if (!id) return;
      const { data, error } = await supabase
        .from('facturas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error cargando factura:", error);
        router.push('/facturas');
      } else {
        setFormData(data);
      }
      setLoading(false);
    }
    fetchFactura();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('facturas')
      .update({
        numero_factura: formData.numero_factura,
        proveedor: formData.proveedor,
        monto: parseFloat(formData.monto),
        cliente: formData.cliente,
        fecha_venta: formData.fecha_venta,
        descripcion: formData.descripcion,
        notas: formData.notas
      })
      .eq('id', id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      router.push('/facturas');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de borrar esta factura permanentemente?")) {
      const { error } = await supabase.from('facturas').delete().eq('id', id);
      if (error) alert("Error al borrar");
      else router.push('/facturas');
    }
  };

  if (loading) return <div className="p-10 text-center text-black font-sans">Cargando datos de la factura...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 text-black font-sans">
      <button 
        onClick={() => router.push('/facturas')} 
        className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black transition"
      >
        <ArrowLeft size={20}/> Volver al listado
      </button>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Editar Factura</h1>
        <button 
          type="button"
          onClick={handleDelete} 
          className="text-red-500 flex items-center gap-1 hover:bg-red-50 p-2 rounded-lg transition text-sm font-bold"
        >
          <Trash2 size={18}/> Borrar Registro
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nro Factura</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border-gray-200" 
              value={formData.numero_factura || ''} 
              onChange={e => setFormData({...formData, numero_factura: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Proveedor</label>
            <input 
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border-gray-200" 
              value={formData.proveedor || ''} 
              onChange={e => setFormData({...formData, proveedor: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Monto Total ($)</label>
          <input 
            type="number" 
            step="0.01" 
            className="w-full border p-3 rounded-xl font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-400 border-gray-200" 
            value={formData.monto || ''} 
            onChange={e => setFormData({...formData, monto: e.target.value})} 
            required 
          />
        </div>

        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <p className="text-blue-700 font-bold text-xs mb-4 uppercase tracking-wider">Trazabilidad de Venta</p>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">Nombre del Cliente</label>
              <input 
                className="w-full border p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 border-blue-100" 
                value={formData.cliente || ''} 
                onChange={e => setFormData({...formData, cliente: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">Fecha de Venta</label>
              <input 
                type="date" 
                className="w-full border p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-400 border-blue-100" 
                value={formData.fecha_venta || ''} 
                onChange={e => setFormData({...formData, fecha_venta: e.target.value})} 
                required 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción del Servicio/Producto</label>
          <textarea 
            className="w-full border p-3 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-400 border-gray-200" 
            value={formData.descripcion || ''} 
            onChange={e => setFormData({...formData, descripcion: e.target.value})} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg transition disabled:bg-gray-300 mt-4"
        >
          <Save size={20}/> {loading ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}