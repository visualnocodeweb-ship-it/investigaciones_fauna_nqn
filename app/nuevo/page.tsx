"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/app/components/LocationPicker'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl flex items-center justify-center">Cargando mapa...</div>
});

export default function NuevoReporte() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    images: File[];
    locationName: string;
    latitude: number;
    longitude: number;
  }>({
    title: '',
    description: '',
    images: [],
    locationName: '',
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Por favor, adjunta al menos una imagen.');
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('locationName', formData.locationName);
    data.append('latitude', formData.latitude.toString());
    data.append('longitude', formData.longitude.toString());
    formData.images.forEach((image) => {
      data.append('images', image);
    });

    try {
      const res = await fetch('/api/avistamientos', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        router.push('/');
      } else {
        const errorData = await res.json();
        alert(`Error al crear el reporte: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error completo:', error);
      let errorMessage = 'Ocurrió un error al enviar el formulario.';
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          errorMessage = `Error: ${errorData.error}. Detalles: ${errorData.details || 'No hay detalles adicionales.'}`;
        } catch (jsonError) {
          errorMessage = 'Error al procesar la respuesta del servidor.';
        }
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-white">Reporte</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-form p-6 rounded-2xl space-y-6">
        <div>
          <label className="block text-slate-300 mb-2">Título</label>
          <input
            required
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ej: Procedimiento Alicura"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Descripción</label>
          <textarea
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 h-32"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe lo que viste..."
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Adjuntar Imágenes</label>
          <input
            required
            type="file"
            multiple
            accept="image/*"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => {
              if (e.target.files) {
                setFormData({ ...formData, images: Array.from(e.target.files) });
              }
            }}
          />
           {formData.images.length > 0 && (
            <div className="mt-2 text-slate-400 text-sm">
              {formData.images.length} archivo(s) seleccionado(s).
            </div>
          )}
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Nombre de la Ubicación</label>
          <input
            required
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            value={formData.locationName}
            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
            placeholder="Ej: Parque Nacional Nahuel Huapi"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">Selecciona en el mapa</label>
          <LocationPicker 
            onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Publicar Reporte'}
        </button>
      </form>
    </main>
  );
}
