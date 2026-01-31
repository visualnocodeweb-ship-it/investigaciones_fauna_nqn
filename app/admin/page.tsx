"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const InteractiveCsvMap = dynamic(() => import('../components/InteractiveCsvMap'), {
  ssr: false
});

export default function AdminPage() {
  const router = useRouter();
  const [showPoliciaNqnMap, setShowPoliciaNqnMap] = useState(false);
  const [showComisariasNqnMap, setShowComisariasNqnMap] = useState(false);

  // Protección básica cliente (idealmente usar Middleware)
  useEffect(() => {
    const role = Cookies.get('auth_role');
    if (role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('auth_role');
    router.push('/login');
  };

  return (
    <main className="min-h-screen p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Fiscalización</h1>
          <p className="text-slate-400">Solo personal autorizado</p>
        </div>
        <div className="flex gap-4">
                    {/* Enlace "Ver Reportes" temporalmente eliminado */}
                    {/* Enlace "Registrar Reporte" temporalmente eliminado */}
                    <a href="https://dashboard-caza-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      Datos Caza 2025
                    </a>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                      Cerrar Sesión
                    </button>        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Sidebar: Acciones Rápidas */}
        <div className="space-y-6 mb-8">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Estado del Sistema</h3>
              <div className="flex items-center gap-3 text-green-400 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Servidores Operativos
              </div>
              <div className="flex items-center gap-3 text-blue-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Base de Datos Sincronizada
              </div>
            </div>
        </div>
        
        {/* Nuevo Tablero de Animales Sueltos */}
        <InteractiveCsvMap />

        {/* Sección Principal: Mapa de Control */}
        <div className="mt-8">
            <div className="glass-card p-1 rounded-2xl overflow-hidden h-[600px] relative">
                <iframe
                src="https://www.google.com/maps/d/embed?mid=1BS9hSxj63YZE8j4Z6PbMiyO6guxZliE&ehbc=2E312F"
                width="100%"
                height="100%"
                className="border-0 w-full h-full rounded-xl"
                allowFullScreen
                ></iframe>
            </div>
        </div>

        {/* Sección Policia Neuquén Maps */}
        <div className="mt-8">
          <button 
            onClick={() => setShowPoliciaNqnMap(!showPoliciaNqnMap)}
            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold py-4 px-4 rounded-lg hover:bg-blue-500/20 transition-all w-full sm:w-auto"
          >
            Policia Neuquén Maps
          </button>
          <button 
            onClick={() => setShowComisariasNqnMap(!showComisariasNqnMap)}
            className="bg-green-500/10 text-green-400 border border-green-500/20 font-bold py-4 px-4 rounded-lg hover:bg-green-500/20 transition-all w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4"
          >
            Comisarias NQN
          </button>
          {showPoliciaNqnMap && (
            <div className="mt-4">
              <div className="glass-card p-1 rounded-2xl overflow-hidden h-[600px] relative">
                <iframe 
                  src="https://www.google.com/maps/d/embed?mid=1WUYfyxf3toKH8LvIqU3IR-mphPo&ehbc=2E312F" 
                  width="100%" 
                  height="100%"
                  className="border-0 w-full h-full rounded-xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {showComisariasNqnMap && (
            <div className="mt-4">
              <div className="glass-card p-1 rounded-2xl overflow-hidden h-[600px] relative">
                <iframe 
                  src="https://www.google.com/maps/d/embed?mid=1ODHsLAbA5r3cG8_oM-A1og6jqC8MIOeJ&hl=es&ehbc=2E312F" 
                  width="100%" 
                  height="100%"
                  className="border-0 w-full h-full rounded-xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
