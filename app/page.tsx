'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Si ya inició sesión, va al dashboard
        router.replace('/dashboard');
      } else {
        // Si no, va al login
        router.replace('/login');
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Cargando sistema...</p>
      </div>
    </div>
  );
}