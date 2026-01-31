"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReportMap = dynamic(() => import('@/app/components/ReportMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl flex items-center justify-center">Cargando mapa...</div>
});

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

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        try {
          const res = await fetch(`/api/avistamientos/${id}`);
          if (res.ok) {
            const data = await res.json();
            setReport(data);
          } else {
             console.error('Report not found');
          }
        } catch (error) {
          console.error('Error fetching report:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="h-10 w-3/4 bg-white/5 animate-pulse rounded"></div>
          <div className="h-6 w-1/2 bg-white/5 animate-pulse rounded"></div>
          <div className="h-96 w-full bg-white/5 animate-pulse rounded-xl"></div>
          <div className="h-24 w-full bg-white/5 animate-pulse rounded"></div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
         <h1 className="text-3xl font-bold text-white mb-4">Reporte no encontrado</h1>
         <button onClick={() => router.push('/reportes')} className="text-blue-400 hover:text-blue-300">
            Volver a la lista de reportes
          </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.push('/admin')} 
            className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            ← Volver al Panel de Fiscalización
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{report.title}</h1>

            {report.description && <p className="text-slate-300 text-lg">{report.description}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {report.images.map(image => (
                <div key={image.id} className="rounded-xl overflow-hidden aspect-square shadow-lg">
                  <a href={image.url} target="_blank" rel="noopener noreferrer">
                    <img src={image.url} alt={report.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-form p-4 rounded-2xl">
               <h2 className="text-xl font-bold text-white mb-2">Ubicación</h2>
               <p className="text-slate-300 mb-4">{report.locationName}</p>
               <div className="h-[300px] w-full rounded-xl overflow-hidden border border-white/10">
                <ReportMap lat={report.latitude} lng={report.longitude} />
               </div>
            </div>
            <div className="text-xs text-slate-500 text-center">
              Reportado: {new Date(report.createdAt).toLocaleString('es-AR')}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
