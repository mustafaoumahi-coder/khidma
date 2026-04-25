import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, ArrowDownUp } from 'lucide-react';
import { supabase, type Category, type Provider, CITIES } from '../lib/supabase';
import ProviderCard from '../components/ProviderCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [sort, setSort] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then((res) => setCategories(res.data ?? []));
  }, []);

  useEffect(() => {
    async function search() {
      setLoading(true);
      let query = supabase.from('providers').select('*, category:categories(*)').eq('available', true);
      if (serviceFilter) {
        const cat = categories.find((c) => c.slug === serviceFilter || c.name.toLowerCase().includes(serviceFilter.toLowerCase()));
        if (cat) query = query.eq('category_id', cat.id);
      }
      if (cityFilter) query = query.ilike('city', `%${cityFilter}%`);
      if (sort === 'rating') query = query.order('rating', { ascending: false });
      else if (sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (sort === 'price_desc') query = query.order('price', { ascending: false });
      else query = query.order('rating', { ascending: false });
      const { data } = await query;
      setProviders(data ?? []);
      setLoading(false);
    }
    search();
  }, [serviceFilter, cityFilter, sort, categories]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
    if (key === 'service') setServiceFilter(value);
    if (key === 'city') setCityFilter(value);
  };

  const clearFilters = () => { setServiceFilter(''); setCityFilter(''); setSort('rating'); setSearchParams({}); };
  const hasFilters = !!(serviceFilter || cityFilter);

  const activeCategoryName = useMemo(() => {
    if (!serviceFilter) return null;
    return categories.find((c) => c.slug === serviceFilter || c.name.toLowerCase() === serviceFilter.toLowerCase())?.name;
  }, [serviceFilter, categories]);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-900 mb-2">{activeCategoryName || 'Rechercher un service'}</h1>
          <p className="text-gray-400">{cityFilter ? `Prestataires a ${cityFilter}` : 'Trouvez le prestataire ideal dans votre ville'}</p>
        </div>

        <div className="bg-white rounded-2xl border border-sand-200/60 p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <Search size={18} className="text-gray-300 shrink-0" />
              <input type="text" placeholder="Service ou mot-cle..." value={serviceFilter} onChange={(e) => updateFilter('service', e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
              {serviceFilter && <button onClick={() => updateFilter('service', '')} className="text-gray-300 hover:text-gray-500 transition-colors"><X size={16} /></button>}
            </div>
            <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
              <MapPin size={18} className="text-gray-300 shrink-0" />
              <input type="text" placeholder="Ville..." value={cityFilter} onChange={(e) => updateFilter('city', e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
              {cityFilter && <button onClick={() => updateFilter('city', '')} className="text-gray-300 hover:text-gray-500 transition-colors"><X size={16} /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${showFilters ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-gray-50/80 border-gray-100 text-gray-500 hover:bg-gray-100'}`}>
              <SlidersHorizontal size={16} /><span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Categorie</label>
                <select value={serviceFilter} onChange={(e) => updateFilter('service', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 transition-all">
                  <option value="">Toutes les categories</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Ville</label>
                <select value={cityFilter} onChange={(e) => updateFilter('city', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 transition-all">
                  <option value="">Toutes les villes</option>
                  {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Trier par</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 transition-all">
                  <option value="rating">Meilleure note</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix decroissant</option>
                </select>
              </div>
            </div>
          )}

          {hasFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <ArrowDownUp size={14} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">Filtres :</span>
              {serviceFilter && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-brand-50 text-brand-700 font-semibold px-3 py-1.5 rounded-full border border-brand-100">
                  {activeCategoryName || serviceFilter}
                  <button onClick={() => updateFilter('service', '')}><X size={12} /></button>
                </span>
              )}
              {cityFilter && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-gold-50 text-gold-700 font-semibold px-3 py-1.5 rounded-full border border-gold-100">
                  {cityFilter}
                  <button onClick={() => updateFilter('city', '')}><X size={12} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 ml-auto font-medium transition-colors">Effacer tout</button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-400 font-medium">
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />Recherche en cours...</span>
            ) : `${providers.length} prestataire${providers.length !== 1 ? 's' : ''} trouve${providers.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-sand-200/60 animate-pulse">
                <div className="h-52 bg-sand-100 rounded-t-2xl" />
                <div className="p-5 space-y-3"><div className="h-5 bg-sand-100 rounded-lg w-3/4" /><div className="h-4 bg-sand-100 rounded-lg w-1/2" /><div className="h-4 bg-sand-100 rounded-lg w-full" /></div>
              </div>
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-sand-200/60">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-sand-100 flex items-center justify-center"><Search size={32} className="text-gray-300" /></div>
            <p className="text-gray-400 text-lg font-medium mb-2">Aucun prestataire trouve</p>
            <p className="text-gray-300 text-sm mb-6">Essayez de modifier vos criteres de recherche</p>
            <button onClick={clearFilters} className="text-brand-700 font-semibold text-sm hover:text-brand-900 transition-colors">Reinitialiser les filtres</button>
          </div>
        )}
      </div>
    </div>
  );
}
