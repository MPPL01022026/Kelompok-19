import React, { useState } from 'react';
import { Coffee, Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('bumaya');
  const [password, setPassword] = useState('familykupi123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      const msg = 'Harap isi username dan password!';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      setLoading(false);
      if (res && res.success) {
        toast.success(res.message || 'Selamat Datang, Bu Maya! Selamat bertransaksi.');
      } else {
        const errorText = res?.message || 'Username atau password salah! Silakan coba lagi.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (err) {
      setLoading(false);
      const errorText = err?.message || 'Terjadi kesalahan pada server saat login.';
      setErrorMessage(errorText);
      toast.error(errorText);
    }
  };

  const setDemoCredentials = () => {
    setUsername('bumaya');
    setPassword('familykupi123');
    setErrorMessage('');
    toast.success('Kredensial demo Bu Maya terisi!');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFDF9]">
      {/* Left Banner / Hero */}
      <div className="relative md:w-1/2 bg-gradient-to-br from-[#4A2C0A] via-[#694115] to-[#E8913A] text-white p-8 md:p-14 flex flex-col justify-between overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E8913A]/20 blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E8913A] flex items-center justify-center text-white shadow-lg">
            <Coffee className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#FFF5E6]">Family Kupi</h1>
            <p className="text-xs font-semibold text-amber-200 tracking-wider">NGOPI • MAKAN • SANTAI</p>
          </div>
        </div>

        {/* Center Hero card with Warung preview */}
        <div className="relative z-10 my-8 bg-black/25 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden mb-4 border border-white/20">
            <img 
              src="/warung_hero.webp" 
              alt="Warung Family Kupi" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-medium text-amber-100 bg-[#E8913A]/80 px-2.5 py-1 rounded-full backdrop-blur-sm">
                📍 UMKM Warung Makan Bu Maya
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">
            Sistem Informasi & Digital Twin Operasional
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-2 leading-relaxed">
            Pantau arus pesanan, ketersediaan stok bahan baku, pemasukan harian, dan ringkasan laba usaha Family Kupi dalam satu dashboard modern dan terintegrasi.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-amber-200/70">
          <p>© 2026 Digital Twin Family Kupi — Tim Pengembang Kelompok 19</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-amber-100">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 mb-3">
              <Sparkles className="w-4 h-4 text-[#E8913A]" />
              <span className="text-xs font-semibold text-[#8C5A2B]">Portal Pemilik Warung</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A2C0A] tracking-tight">
              Masuk Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Silakan masukkan akun Anda untuk mengelola warung Family Kupi.
            </p>
          </div>

          {/* Quick Credential Helper Pill */}
          <div 
            onClick={setDemoCredentials}
            className="cursor-pointer bg-[#FFF5E6] hover:bg-[#FEEAD4] border border-amber-200 rounded-2xl p-3.5 transition-colors text-left"
          >
            <p className="text-xs font-semibold text-[#8C5A2B] flex items-center justify-between">
              <span>Akun Default Bu Maya (Klik untuk isi cepat):</span>
              <span className="text-[11px] underline text-[#E8913A]">Auto-fill</span>
            </p>
            <div className="mt-1.5 flex items-center justify-between text-xs text-[#4A2C0A] font-mono bg-white/70 px-2.5 py-1 rounded-lg">
              <span>User: <strong className="font-bold">bumaya</strong></span>
              <span>Pass: <strong className="font-bold">familykupi123</strong></span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold shadow-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5 text-amber-700/60" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white transition-all text-[#4A2C0A]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5 text-amber-700/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Masukkan password"
                  className="w-full pl-11 pr-4 py-3 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white transition-all text-[#4A2C0A]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] hover:to-[#B4631A] text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            Family Kupi • Warung Makan & Kopi Bu Maya
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
