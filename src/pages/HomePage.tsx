import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Droplets, Zap, Sparkles, Scissors, TreePine, ArrowRight, Shield, Clock, Star, ChevronRight, Phone } from 'lucide-react';
import { supabase, type Category, type Provider, CITIES } from '../lib/supabase';
import ProviderCard from '../components/ProviderCard';

const ICON_MAP: Record<string, React.ElementType> = { Droplets, Zap, Sparkles, Scissors, TreePine };

const CATEGORY_STYLES: Record<string, { gradient: string; border: string }> = {
  plomberie: { gradient: 'from-sky-500 to-blue-600', border: 'hover:border-sky-200' },
  electricite: { gradient: 'from-amber-500 to-orange-500', border: 'hover:border-amber-200' },
  menage: { gradient: 'from-rose-400 to-pink-500', border: 'hover:border-rose-200' },
  coiffure: { gradient: 'from-fuchsia-400 to-pink-500', border: 'hover:border-fuchsia-200' },
  jardinage: { gradient: 'from-emerald-500 to-teal-600', border: 'hover:border-emerald-200' },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProviders, setTopProviders] = useState<Provider[]>([]);
  const [searchService, setSearchService] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, provRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('providers').select('*, category:categories(*)').eq('available', true).gte('rating', 4).order('rating', { ascending: false }).limit(6),
      ]);
      setCategories(catRes.data ?? []);
      setTopProviders(provRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchService) params.set('service', searchService);
    if (searchCity) params.set('city', searchCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a017' fill-opacity='1'%3E%3Cpath d='M40 0l10 10-10 10L30 10zm20 20l10 10-10 10-10-10zm-40 0l10 10-10 10L10 30zm20 20l10 10-10 10-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold-400/15 text-gold-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 border border-gold-400/20 backdrop-blur-sm">
              <Star size={14} className="fill-gold-400 text-gold-400" />
              La marketplace n1 des services au Maroc
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Trouvez les meilleurs <span className="relative"><span className="text-gold-400">artisans</span><span className="absolute -bottom-1 left-0 right-0 h-1 bg-gold-400/30 rounded-full" /></span> pres de chez vous
            </h1>
            <p className="text-lg sm:text-xl text-brand-100/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Plombiers, electriciens, coiffeurs et plus encore. Reservez en quelques clics un service de qualite dans votre ville.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-gray-50/80 border border-gray-100 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <Search size={18} className="text-gray-300 shrink-0" />
                <input type="text" placeholder="Quel service cherchez-vous ?" value={searchService} onChange={(e) => setSearchService(e.target.value)} className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none" />
              </div>
              <div className="flex-1 flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-gray-50/80 border border-gray-100 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                <Search size={18} className="text-gray-300 shrink-0" />
                <input type="text" placeholder="Ville..." value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none" />
              </div>
              <button type="submit" className="bg-gradient-to-r from-brand-700 to-brand-800 text-white font-bold px-8 py-3.5 rounded-xl hover:from-brand-800 hover:to-brand-900 transition-all duration-300 shadow-lg shadow-brand-900/30 hover:shadow-brand-900/50 hover:scale-[1.02] active:scale-[0.98] text-sm">
                Rechercher
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-brand-200/50 font-medium">Populaire :</span>
              {CITIES.slice(0, 5).map((city) => (
                <button key={city} onClick={() => { setSearchCity(city); navigate(`/search?city=${city}`); }} className="text-xs text-brand-100/70 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full transition-all hover:text-white">
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sand-50 to-transparent" />
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Explorer</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-900 mt-2">Nos Categories</h2>
            <p className="text-gray-400 mt-2 max-w-md">Trouvez le professionnel qu'il vous faut parmi nos categories de services</p>
          </div>
          <Link to="/search" className="hidden sm:flex items-center gap-1.5 text-brand-700 font-semibold text-sm hover:text-brand-900 transition-colors group">
            Voir tout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || Droplets;
            const style = CATEGORY_STYLES[cat.slug] || CATEGORY_STYLES.plomberie;
            return (
              <Link key={cat.id} to={`/search?service=${cat.slug}`} className={`group relative bg-white rounded-2xl p-6 text-center border border-sand-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/5 animate-slide-up ${style.border}`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Icon size={28} className="text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-brand-900 text-sm group-hover:text-brand-700 transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                <ChevronRight size={14} className="mx-auto mt-3 text-gray-200 group-hover:text-brand-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* TOP PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Top notes</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-900 mt-2">Prestataires Top</h2>
            <p className="text-gray-400 mt-2">Les mieux notes par nos clients</p>
          </div>
          <Link to="/search" className="hidden sm:flex items-center gap-1.5 text-brand-700 font-semibold text-sm hover:text-brand-900 transition-colors group">
            Voir tout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-sand-200/60 animate-pulse">
                <div className="h-52 bg-sand-100 rounded-t-2xl" />
                <div className="p-5 space-y-3"><div className="h-5 bg-sand-100 rounded-lg w-3/4" /><div className="h-4 bg-sand-100 rounded-lg w-1/2" /><div className="h-4 bg-sand-100 rounded-lg w-full" /></div>
              </div>
            ))}
          </div>
        ) : topProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-sand-200/60">
            <Search size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-lg">Aucun prestataire pour le moment</p>
            <Link to="/search" className="mt-4 inline-flex items-center gap-2 text-brand-700 font-semibold hover:text-brand-900 transition-colors">Explorer les services <ArrowRight size={16} /></Link>
          </div>
        )}
      </section>

      {/* TRUST */}
      <section className="bg-white border-t border-sand-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Confiance</span>
            <h2 className="text-3xl font-black text-brand-900 mt-2">Pourquoi Khidma ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: Shield, title: 'Prestataires verifies', desc: 'Tous nos artisans sont selectionnes et verifies pour garantir la qualite de chaque intervention.', bg: 'bg-brand-50', color: 'text-brand-700' },
              { icon: Clock, title: 'Reservation rapide', desc: 'Reservez en quelques clics, recevez une confirmation instantanement. Simple et efficace.', bg: 'bg-gold-50', color: 'text-gold-600' },
              { icon: Phone, title: 'Support local', desc: 'Une equipe disponible pour vous accompagner a chaque etape de votre reservation.', bg: 'bg-brand-50', color: 'text-brand-700' },
            ].map(({ icon: Icon, title, desc, bg, color }) => (
              <div key={title} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${bg} ${color}`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-brand-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-400/10 rounded-full blur-3xl" />
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Pret a trouver votre artisan ?</h2>
            <p className="text-brand-100/60 mb-8 text-lg font-light">Rejoignez des milliers de Marocains qui font confiance a Khidma chaque jour.</p>
            <Link to="/search" className="inline-flex items-center gap-2 bg-gold-400 text-brand-900 font-bold px-8 py-4 rounded-xl hover:bg-gold-300 transition-all duration-300 shadow-lg shadow-gold-400/20 hover:shadow-gold-400/40 hover:scale-[1.02] active:scale-[0.98]">
              Commencer maintenant <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-950 border-t border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
                <span className="text-gold-400 font-black text-lg">K</span>
              </div>
              <div><span className="font-extrabold text-white">Khidma</span><span className="text-xs text-brand-400 ml-2">Services Maroc</span></div>
            </div>
            <div className="flex items-center gap-6 text-sm text-brand-400">
              <Link to="/search" className="hover:text-white transition-colors">Services</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
            <p className="text-xs text-brand-600">2026 Khidma. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
