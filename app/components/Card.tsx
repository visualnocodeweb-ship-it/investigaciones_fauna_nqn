import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  locationName: string;
}

export default function Card({ title, description, imageUrl, locationName }: CardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
      <div className="relative h-64 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10">
          📍 {locationName}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
        <p className="text-slate-400 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
