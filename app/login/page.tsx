'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Intento de conexión con Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        // Si todo sale bien, mandamos al dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al intentar conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md text-black border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600 tracking-tight">Admin Facturas</h1>
        <p className="text-center text-gray-500 mb-8 text-sm uppercase font-semibold tracking-widest">Panel de Acceso</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:bg-blue-300"
          >
            {loading ? 'Cargando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}