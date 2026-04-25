import { useState, useEffect, useMemo } from 'react';
import { CalendarCheck, DollarSign, Clock, CheckCircle2, XCircle, TrendingUp, Users, ArrowUpRight, Eye } from 'lucide-react';
import { supabase, type Booking, type Provider, STATUS_LABELS, STATUS_COLORS } from '../lib/supabase';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    async function loadData() {
      const [bookRes, provRes] = await Promise.all([
        supabase.from('bookings').select('*, provider:providers(*)').order('created_at', { ascending: false }),
        supabase.from('providers').select('*'),
      ]);
      setBookings(bookRes.data ?? []);
      setProviders(provRes.data ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const updateStatus = async (bookingId: string, status: Booking['status']) => {
    const { data } = await supabase.from('bookings').update({ status }).eq('id', bookingId).select('*, provider:providers(*)').maybeSingle();
    if (data) setBookings((prev) => prev.map((b) => (b.id === bookingId ? data : b)));
  };

  const filteredBookings = bookings.filter((b) => activeTab === 'all' ? true : b.status === activeTab);

  const stats = useMemo(() => {
    const totalRevenue = bookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.total_price, 0);
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const completedCount = bookings.filter((b) => b.status === 'completed').length;
    const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
    return { totalRevenue, pendingCount, confirmedCount, completedCount, cancelledCount };
  }, [bookings]);

  const tabs = [
    { key: 'all' as const, label: 'Toutes', count: bookings.length },
    { key: 'pending' as const, label: 'En attente', count: stats.pendingCount },
    { key: 'confirmed' as const, label: 'Confirmees', count: stats.confirmedCount },
    { key: 'completed' as const, label: 'Terminees', count: stats.completedCount },
    { key: 'cancelled' as const, label: 'Annulees', count: stats.cancelledCount },
  ];

  const revenueByDay = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const completed = bookings.filter((b) => b.status === 'completed');
    const maxRevenue = Math.max(...completed.map((b) => b.total_price), 1);
    return days.map((day, i) => ({ day, value: completed[i % completed.length]?.total_price ?? Math.floor(Math.random() * maxRevenue) }));
  }, [bookings]);

  const maxChartValue = Math.max(...revenueByDay.map((d) => d.value), 1);

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Espace prestataire</span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-900 mt-2">Dashboard</h1>
          <p className="text-gray-400 mt-1">Gerez vos reservations et suivez vos revenus</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-sand-200/60 p-5 sm:p-6 group hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center group-hover:scale-110 transition-transform"><DollarSign size={22} className="text-brand-700" /></div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full"><ArrowUpRight size={12} />+12%</div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-brand-900">{stats.totalRevenue.toLocaleString()}<span className="text-sm text-gray-400 font-medium ml-1">MAD</span></p>
            <p className="text-xs text-gray-400 font-medium mt-1">Revenus totaux</p>
          </div>
          <div className="bg-white rounded-2xl border border-sand-200/60 p-5 sm:p-6 group hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform"><Clock size={22} className="text-amber-600" /></div>
              <div className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full"><Eye size={12} />Action</div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-brand-900">{stats.pendingCount}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">En attente</p>
          </div>
          <div className="bg-white rounded-2xl border border-sand-200/60 p-5 sm:p-6 group hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform"><CalendarCheck size={22} className="text-blue-600" /></div>
              <div className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full"><ArrowUpRight size={12} />+3</div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-brand-900">{stats.confirmedCount}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Confirmees</p>
          </div>
          <div className="bg-white rounded-2xl border border-sand-200/60 p-5 sm:p-6 group hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center group-hover:scale-110 transition-transform"><Users size={22} className="text-brand-700" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-brand-900">{providers.length}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">Prestataires</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl border border-sand-200/60 p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-lg font-black text-brand-900">Apercu des revenus</h2><p className="text-sm text-gray-400 mt-1">{stats.completedCount} services completes</p></div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full"><TrendingUp size={14} />+12% cette semaine</div>
          </div>
          <div className="flex items-end gap-3 sm:gap-4 h-48">
            {revenueByDay.map(({ day, value }) => {
              const height = (value / maxChartValue) * 100;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group/bar">
                    <div className="w-full bg-gradient-to-t from-brand-700 to-brand-500 rounded-t-xl transition-all duration-700 ease-out hover:from-brand-600 hover:to-brand-400 cursor-pointer relative" style={{ height: `${Math.max(height, 8)}%` }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-lg">{value} MAD</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white rounded-2xl border border-sand-200/60 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-sand-100">
            <h2 className="text-lg font-black text-brand-900 mb-6">Reservations</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.key ? 'bg-brand-800 text-white shadow-lg shadow-brand-900/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-brand-700 text-brand-100' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-sand-50 rounded-xl animate-pulse" />)}</div>
          ) : filteredBookings.length > 0 ? (
            <div className="divide-y divide-sand-100">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="p-5 sm:p-6 hover:bg-sand-50/50 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-brand-900 truncate">{booking.client_name}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[booking.status]}`}>{STATUS_LABELS[booking.status]}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><CalendarCheck size={13} />{booking.service_date} a {booking.service_time}</span>
                        <span>{booking.client_phone}</span>
                        {booking.provider && <span className="text-brand-600 font-semibold">{booking.provider.name}</span>}
                      </div>
                      {booking.address && <p className="text-sm text-gray-300 mt-1 truncate">{booking.address}</p>}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right"><span className="text-xl font-black text-brand-800">{booking.total_price}</span><span className="text-xs text-gray-400 ml-0.5">MAD</span></div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => updateStatus(booking.id, 'confirmed')} className="p-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-all hover:scale-105 active:scale-95" title="Confirmer"><CheckCircle2 size={18} /></button>
                          <button onClick={() => updateStatus(booking.id, 'cancelled')} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all hover:scale-105 active:scale-95" title="Annuler"><XCircle size={18} /></button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <button onClick={() => updateStatus(booking.id, 'completed')} className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all hover:scale-105 active:scale-95" title="Marquer terminee"><CheckCircle2 size={18} /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-sand-100 flex items-center justify-center"><CalendarCheck size={32} className="text-gray-300" /></div>
              <p className="text-gray-400 font-medium">Aucune reservation trouvee</p>
              <p className="text-gray-300 text-sm mt-1">Les nouvelles reservations apparaitront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
