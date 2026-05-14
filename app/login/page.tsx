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
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas. Revisa tu correo y contraseña.");
      setLoading(false);
    } else {
      // Usamos window.location para forzar la entrada al dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md text-black border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Admin Facturas</h1>
        
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Correo electrónico" 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Contraseña" 
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)} required 
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Cargando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}