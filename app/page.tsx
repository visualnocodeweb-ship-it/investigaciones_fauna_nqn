import AdminLoginCard from './components/AdminLoginCard';

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center text-center">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight">Control Fauna</h1>
        <p className="text-slate-400 mt-2 max-w-lg">Plataforma de control y fiscalización de Fauna Silvestre Neuquén.</p>
      </div>

      <div className="w-full max-w-xs">
        <AdminLoginCard />
      </div>
    </main>
  );
}