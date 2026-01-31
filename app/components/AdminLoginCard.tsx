"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminLoginCard() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pequeño delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === 'admin1234') {
      Cookies.set('auth_role', 'admin', { expires: 1 });
      router.push('/admin');
    } else {
      setError('Clave incorrecta');
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 rounded-3xl text-center hover:bg-white/5 transition-all relative overflow-hidden max-w-md w-full border border-red-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
      
      <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Administrador</h2>
      <p className="text-slate-400 mb-6 relative z-10">Ingrese su clave de acceso</p>

      <form onSubmit={handleLogin} className="relative z-10 space-y-4">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 transition-colors text-center placeholder-slate-500"
            placeholder="Contraseña"
          />
        </div>

        {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}

        <button 
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          {loading ? 'Verificando...' : 'Ingresar al Panel'}
        </button>
      </form>
    </div>
  );
}
