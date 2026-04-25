import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, ArrowUpRight } from 'lucide-react';
import type { Provider } from '../lib/supabase';
import StarRating from './StarRating';

export default function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      to={`/provider/${provider.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-sand-200/60 hover:border-brand-300/60 transition-all duration-500 hover:shadow-xl hover:shadow-brand-900/5"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-brand-50 to-sand-100">
        {provider.image_url ? (
          <img src={provider.image_url} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/40">
              <span className="text-4xl font-black text-brand-700">{provider.name.charAt(0)}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {provider.available && (
            <span className="flex items-center gap-1.5 bg-brand-700/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Disponible
            </span>
          )}
        </div>
        {provider.rating >= 4.5 && (
          <div className="absolute top-3 right-3 bg-gold-400/90 backdrop-blur-sm text-brand-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <BadgeCheck size={12} />
            Top
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
          <span className="text-lg font-extrabold text-brand-800">{provider.price}</span>
          <span className="text-xs font-medium text-gray-500 ml-0.5">MAD</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-brand-900 group-hover:text-brand-700 transition-colors duration-300 line-clamp-1 text-[15px]">{provider.name}</h3>
          <ArrowUpRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin size={12} />
          <span>{provider.city}</span>
          {provider.category && (
            <>
              <span className="text-gray-200 mx-1">|</span>
              <span className="text-brand-600 font-semibold">{provider.category.name}</span>
            </>
          )}
        </div>
        <StarRating rating={provider.rating} count={provider.review_count} size={13} />
        <p className="text-sm text-gray-400 mt-3 line-clamp-2 leading-relaxed">{provider.description}</p>
      </div>
    </Link>
  );
}
