import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/search', label: 'Rechercher', icon: Search },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-sand-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 flex items-center justify-center shadow-lg shadow-brand-900/20 group-hover:shadow-brand-900/40 transition-shadow duration-300">
              <span className="text-gold-400 font-black text-xl tracking-tighter">K</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-brand-900 tracking-tight leading-none">Khidma</span>
              <span className="text-[10px] font-semibold text-gold-600 tracking-widest uppercase leading-none mt-0.5">Services Maroc</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active ? 'bg-brand-50 text-brand-800 shadow-sm' : 'text-gray-400 hover:text-brand-800 hover:bg-brand-50/50'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden p-2 rounded-xl text-gray-400 hover:bg-brand-50 transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-sand-200/50 bg-white/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'bg-brand-50 text-brand-800' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
