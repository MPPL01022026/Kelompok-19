import React, { useState, useEffect } from 'react';
import { User, Lock, KeyRound, X, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AccountModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNama(user.nama || 'Bu Maya');
      setUsername(user.username || 'bumaya');
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Username tidak boleh kosong!');
      return;
    }

    if (!currentPassword) {
      toast.error('Kata sandi saat ini wajib diisi untuk verifikasi keamanan!');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      toast.error('Kata sandi baru minimal 4 karakter!');
      return;
    }

    setLoading(true);
    try {
      const res = await updateProfile({
        nama,
        username,
        currentPassword,
        newPassword: newPassword || undefined,
      });

      setLoading(false);
      if (res.success) {
        toast.success(res.message || 'Username & sandi berhasil diperbarui!');
        onClose();
      } else {
        toast.error(res.message || 'Gagal memperbarui akun.');
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#E8913A] text-white rounded-xl shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#4A2C0A]">
                Ganti Username & Kata Sandi
              </h3>
              <p className="text-xs text-gray-500">Kelola akun pemilik warung Family Kupi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Nama Pemilik */}
          <div>
            <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
              Nama Lengkap Pemilik
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4 text-amber-700/60" />
              </div>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Bu Maya"
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
                required
              />
            </div>
          </div>

          {/* Username Baru */}
          <div>
            <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
              Username Baru
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ShieldCheck className="w-4 h-4 text-amber-700/60" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Contoh: bumaya"
                className="w-full pl-10 pr-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
                required
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Username digunakan saat login (huruf kecil, tanpa spasi).</p>
          </div>

          <div className="border-t border-amber-100 pt-3">
            {/* Kata Sandi Lama */}
            <div>
              <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                Kata Sandi Saat Ini (Lama) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 text-amber-700/60" />
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan sandi lama untuk konfirmasi"
                  className="w-full pl-10 pr-10 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru (Opsional) */}
            <div className="mt-3">
              <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                Kata Sandi Baru (Kosongkan jika tidak ingin ganti sandi)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4 text-amber-700/60" />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru (minimal 4 karakter)"
                  className="w-full pl-10 pr-10 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            {newPassword && (
              <div className="mt-3">
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Ulangi Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full pl-10 pr-4 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
                    required={!!newPassword}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] hover:to-[#B4631A] rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kredensial Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
