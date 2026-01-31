"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/app/components/Card';
import { useRouter } from 'next/navigation';

interface Image {
  id: number;
  url: string;
  reportId: number;
}

interface Report {
  id: number;
  title: string;
  description: string | null;
  locationName: string;
  latitude: number;
  longitude: number;
  images: Image[];
  createdAt: string;
}

export default function ReportesPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/avistamientos');
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
                     <button
                       onClick={() => router.push('/admin')}
                       className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                     >
                       ← Volver al Panel de Fiscalización
                     </button>          <h1 className="text-3xl font-bold text-white text-center flex-grow">Reportes</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="relative h-64 w-full bg-white/5 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-6 w-3/4 mb-2 bg-white/5 animate-pulse rounded"></div>
                  <div className="h-4 w-full mt-4 bg-white/5 animate-pulse rounded"></div>
                  <div className="h-4 w-5/6 mt-2 bg-white/5 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <h2 className="text-2xl font-bold text-white mb-2">No hay reportes</h2>
            <p>Parece que todavía no se ha registrado ningún reporte.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <Link href={`/reportes/${report.id}`} key={report.id} className="block">
                <Card
                  title={report.title}
                  description={report.description || ''}
                  imageUrl={report.images[0]?.url || '/window.svg'} 
                  locationName={report.locationName}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
