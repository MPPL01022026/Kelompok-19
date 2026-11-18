import React, { useState, useEffect } from 'react';
import { Menu, AlertTriangle, Clock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatTanggalLengkap } from '../utils/formatters';

const Header = ({ setIsMobileOpen, onOpenStokTab, onOpenAccountModal }) => {
  const { user } = useAuth();
  const { stokAlertCount } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = formatTanggalLengkap(time);
  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const initials = (user?.nama || 'Bu Maya')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      {/* Left: Mobile Toggle & Greeting */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#4A2C0A] hover:bg-amber-50 focus:outline-none transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-6 h-6 text-[#4A2C0A]" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-[#4A2C0A] leading-tight">
              Halo, {user?.nama || 'Bu Maya'} 👋
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
              Warung Buka
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center mt-0.5">
            <span className="font-medium text-amber-900/70">{todayStr}</span>
            <span className="mx-1.5 text-gray-300">•</span>
            <Clock className="w-3.5 h-3.5 mr-1 text-gray-400 inline" />
            <span>{timeStr}</span>
          </p>
        </div>
      </div>

      {/* Right: Notification Alerts & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Stok Menipis Alert Button */}
        {stokAlertCount > 0 && (
          <button
            onClick={onOpenStokTab}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all animate-bounce"
            title="Klik untuk melihat stok bahan yang menipis"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">{stokAlertCount} Bahan Menipis</span>
            <span className="md:hidden">{stokAlertCount}</span>
          </button>
        )}

        {/* User avatar pill - Clickable to open Account Modal */}
        <button
          onClick={onOpenAccountModal}
          className="flex items-center space-x-2.5 pl-2 py-1 pr-3 bg-[#FFF5E6] hover:bg-[#FEEAD4] rounded-full border border-amber-200 transition-all cursor-pointer group"
          title="Klik untuk ganti username & kata sandi akun"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#E8913A] to-[#F59E0B] flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <p className="text-xs font-bold text-[#4A2C0A] group-hover:text-[#E8913A] transition-colors">
              {user?.nama || 'Bu Maya'}
            </p>
            <p className="text-[10px] text-[#8C5A2B]">@{user?.username || 'bumaya'} • Ganti Sandi</p>
          </div>
          <KeyRound className="w-3.5 h-3.5 text-[#E8913A] ml-1 opacity-70 group-hover:opacity-100" />
        </button>
      </div>
    </header>
  );
};

export default Header;
