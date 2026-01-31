"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === 'admin1234') {
      Cookies.set('auth_role', 'admin', { expires: 1 });
      router.push('/admin');
    } else {
      setError('Contraseña incorrecta.');
    }
  };

  return (
    <div className="glass-card p-8 rounded-2xl w-full max-w-md">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Acceso Administrador
      </h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Ingrese contraseña"
            autoComplete="off"
            autoFocus
          />
        </div>

        {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}

        <button
          type="submit"
          className="w-full font-bold py-3 rounded-xl transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
