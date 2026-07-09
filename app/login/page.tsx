'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Hii inahakikisha tunaunganishwa na Supabase yako

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hapa ndipo tunatuma taarifa kule Supabase kuangalia kama ni sahihi
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError('Email au Password siyo sahihi, jaribu tena!');
      setLoading(false);
    } else {
      // Kama kila kitu kiko sawa, tunakupeleka kwenye dashibodi
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 text-white">
      <form onSubmit={handleLogin} className="bg-[#0c1322] p-8 rounded-2xl w-full max-w-sm border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-center text-yellow-500">ADMIN LOGIN</h2>
        {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
        
        <label className="text-xs text-gray-400 uppercase font-bold">Email</label>
        <input type="email" className="w-full p-3 mb-4 bg-gray-900 rounded border border-gray-700 mt-1" onChange={(e) => setEmail(e.target.value)} required />
        
        <label className="text-xs text-gray-400 uppercase font-bold">Password</label>
        <input type="password" className="w-full p-3 mb-4 bg-gray-900 rounded border border-gray-700 mt-1" onChange={(e) => setPassword(e.target.value)} required />
        
        <button className="w-full py-3 bg-yellow-600 rounded font-bold hover:bg-yellow-500 transition" disabled={loading}>
          {loading ? 'Inaingia...' : 'INGIA KWENYE MFUMO'}
        </button>
      </form>
    </div>
  );
}