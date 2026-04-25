import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Calendar, Clock, CheckCircle2, AlertCircle, Shield, Star, MessageSquare } from 'lucide-react';
import { supabase, type Provider } from '../lib/supabase';
import StarRating from '../components/StarRating';

export default function ProviderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ client_name: '', client_phone: '', client_email: '', service_date: '', service_time: '09:00', address: '', notes: '' });

  useEffect(() => {
    if (!id) return;
    supabase.from('providers').select('*, category:categories(*)').eq('id', id).maybeSingle().then((res) => { setProvider(res.data); setLoading(false); });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    setSubmitting(true);
    setError('');
    const { error: insertError } = await supabase.from('bookings').insert({
      provider_id: provider.id, client_name: form.client_name, client_phone: form.client_phone, client_email: form.client_email,
      service_date: form.service_date, service_time: form.service_time, address: form.address, notes: form.notes, status: 'pending', total_price: provider.price,
    });
    if (insertError) { setError('Erreur lors de la reservation. Veuillez reessayer.'); setSubmitting(false); return; }
    setBookingSubmitted(true); setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-sand-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (!provider) return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center">
      <div className="text-center"><p className="text-gray-400 text-lg mb-4">Prestataire non trouve</p><Link to="/search" className="text-brand-700 font-semibold hover:text-brand-900 transition-colors">Retour a la recherche</Link></div>
    </div>
  );

  if (bookingSubmitted) return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-10 max-w-md mx-4 text-center border border-sand-200/60 shadow-xl animate-scale-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-50 flex items-center justify-center"><CheckCircle2 size={40} className="text-brand-600" /></div>
        <h2 className="text-2xl font-black text-brand-900 mb-3">Reservation envoyee !</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">Votre demande de reservation a ete envoyee a <strong className="text-brand-800">{provider.name}</strong>. Vous recevrez une confirmation sous peu.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/search')} className="w-full bg-gradient-to-r from-brand-700 to-brand-800 text-white font-bold py-3.5 rounded-xl hover:from-brand-800 hover:to-brand-900 transition-all shadow-lg shadow-brand-900/20">Continuer la recherche</button>
          <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-50 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-colors">Voir le dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-brand-700 mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span className="text-sm font-semibold">Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-sand-200/60 overflow-hidden">
              <div className="h-64 sm:h-80 bg-gradient-to-br from-brand-50 to-sand-100 relative overflow-hidden">
                {provider.image_url ? <img src={provider.image_url} alt={provider.name} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center"><div className="w-28 h-28 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/40"><span className="text-5xl font-black text-brand-700">{provider.name.charAt(0)}</span></div></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {provider.available && <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-brand-700/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />Disponible</div>}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg"><span className="text-2xl font-black text-brand-800">{provider.price}</span><span className="text-sm text-gray-500 ml-1 font-medium">MAD</span></div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-900">{provider.name}</h1>
                  {provider.category && <p className="text-sm text-brand-600 font-semibold mt-1">{provider.category.name}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <StarRating rating={provider.rating} count={provider.review_count} size={16} />
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm"><MapPin size={14} />{provider.city}</div>
                </div>
                <p className="text-gray-500 leading-relaxed text-[15px]">{provider.description}</p>
                <div className="mt-6 pt-6 border-t border-sand-100 flex items-center gap-2 text-gray-400"><Phone size={16} /><span className="text-sm font-medium">{provider.phone}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, label: 'Prestataire verifie', bg: 'bg-brand-50', color: 'text-brand-600' },
                { icon: Star, label: 'Note excellente', bg: 'bg-gold-50', color: 'text-gold-600' },
                { icon: MessageSquare, label: 'Support disponible', bg: 'bg-brand-50', color: 'text-brand-600' },
              ].map(({ icon: Icon, label, bg, color }) => (
                <div key={label} className="flex items-center gap-3 bg-white rounded-xl border border-sand-200/60 p-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg} ${color}`}><Icon size={18} /></div>
                  <span className="text-sm font-semibold text-brand-900">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-sand-200/60 p-6 sm:p-8 sticky top-24 shadow-sm">
              <div className="mb-6"><h2 className="text-xl font-black text-brand-900 mb-1">Reserver ce service</h2><p className="text-sm text-gray-400">Remplissez le formulaire pour effectuer une reservation</p></div>
              {error && <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100"><AlertCircle size={16} />{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nom complet</label><input type="text" required value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all" placeholder="Votre nom complet" /></div>
                <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Telephone</label><input type="tel" required value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all" placeholder="06 XX XX XX XX" /></div>
                <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Email (optionnel)</label><input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all" placeholder="votre@email.com" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Calendar size={10} />Date</label><input type="date" required value={form.service_date} onChange={(e) => setForm({ ...form, service_date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all" /></div>
                  <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Clock size={10} />Heure</label><select value={form.service_time} onChange={(e) => setForm({ ...form, service_time: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all">{['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Adresse</label><input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all" placeholder="Votre adresse complete" /></div>
                <div><label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Notes (optionnel)</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50/80 border border-gray-100 text-sm focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all resize-none" placeholder="Details supplementaires sur votre demande..." /></div>
                <div className="pt-5 border-t border-sand-100">
                  <div className="flex items-center justify-between mb-5"><span className="text-sm text-gray-400 font-medium">Total</span><div className="flex items-baseline gap-1"><span className="text-3xl font-black text-brand-800">{provider.price}</span><span className="text-sm text-gray-400 font-medium">MAD</span></div></div>
                  <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-brand-700 to-brand-800 text-white font-bold py-4 rounded-xl hover:from-brand-800 hover:to-brand-900 transition-all duration-300 shadow-lg shadow-brand-900/20 hover:shadow-brand-900/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    {submitting ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Envoi en cours...</span> : 'Confirmer la reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
