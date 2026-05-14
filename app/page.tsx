'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard'); // Si ya tiene sesión, va al panel
      } else {
        router.push('/login'); // Si no, va al login
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="font-medium text-gray-500">Iniciando sistema...</p>
      </div>
    </div>
  );
}