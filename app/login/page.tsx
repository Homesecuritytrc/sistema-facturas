'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message); // Esto nos dirá el error real
    else router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded-lg w-96 text-black">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Facturas</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input 
          type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="password" placeholder="Contraseña" className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Ingresar
        </button>
      </form>
    </div>
  );
}