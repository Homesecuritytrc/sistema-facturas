'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        window.location.replace('/dashboard');
      } else {
        window.location.replace('/login');
      }
    };
    checkUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black font-sans">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Cargando sistema...</p>
      </div>
    </div>
  );
}