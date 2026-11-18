import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  X, 
  BadgePercent,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggal, toISODate } from '../utils/formatters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const PemasukanPage = () => {
  const { pemasukan, addPemasukanManual, deletePemasukan } = useStore();

  // Filters
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [sumberFilter, setSumberFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: toISODate(new Date()),
    keterangan: '',
    jumlah: '',
  });

  // Filtered List
  const filteredPemasukan = useMemo(() => {
    return pemasukan.filter((item) => {
      const itemDate = item.tanggal || toISODate(item.created_at);
      if (dariTanggal && itemDate < dariTanggal) return false;
      if (sampaiTanggal && itemDate > sampaiTanggal) return false;
      if (sumberFilter !== 'Semua' && item.sumber !== sumberFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchKet = item.keterangan?.toLowerCase().includes(term);
        const matchSum = item.sumber?.toLowerCase().includes(term);
        if (!matchKet && !matchSum) return false;
      }
      return true;
    });
  }, [pemasukan, dariTanggal, sampaiTanggal, sumberFilter, searchTerm]);

  // Total Pemasukan Periode Ini
  const totalFilteredPemasukan = useMemo(() => {
    return filteredPemasukan.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
  }, [filteredPemasukan]);

  // Total Penjualan vs Total Lainnya
  const breakdown = useMemo(() => {
    let penjualan = 0;
    let lainnya = 0;
    filteredPemasukan.forEach((it) => {
      if (it.sumber === 'Penjualan') penjualan += Number(it.jumlah || 0);
      else lainnya += Number(it.jumlah || 0);
    });
    return { penjualan, lainnya };
  }, [filteredPemasukan]);

  // Pagination
  const pageSize = 10;
  const paginatedPemasukan = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPemasukan.slice(start, start + pageSize);
  }, [filteredPemasukan, currentPage]);

  const handleOpenAdd = () => {
    setFormData({
      tanggal: toISODate(new Date()),
      keterangan: '',
      jumlah: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.keterangan.trim() || !formData.jumlah) {
      toast.error('Keterangan dan jumlah tidak boleh kosong!');
      return;
    }

    addPemasukanManual({
      tanggal: formData.tanggal,
      keterangan: formData.keterangan,
      jumlah: Number(formData.jumlah),
    });

    toast.success('Pemasukan manual berhasil dicatat!');
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deletePemasukan(itemToDelete.id);
      toast.success('Pemasukan manual berhasil dihapus.');
      setItemToDelete(null);
    }
  };

  const resetFilter = () => {
    setDariTanggal('');
    setSampaiTanggal('');
    setSumberFilter('Semua');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Modul Pemasukan Kas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Pencatatan arus kas masuk warung dari pesanan selesai & pendapatan lainnya
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pemasukan Manual</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Pemasukan (Filter)</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {formatRupiah(totalFilteredPemasukan)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">{filteredPemasukan.length} transaksi</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Dari Penjualan Menu</span>
            <p className="text-xl font-black text-[#4A2C0A] mt-1">
              {formatRupiah(breakdown.penjualan)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Otomatis saat pesanan selesai</p>
          </div>
          <div className="p-3 bg-amber-50 text-[#E8913A] rounded-2xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Dari Pemasukan Lainnya</span>
            <p className="text-xl font-black text-blue-600 mt-1">
              {formatRupiah(breakdown.lainnya)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Katering, tips, dll</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BadgePercent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari keterangan atau sumber..."
            className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] text-[#4A2C0A]"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-500">Dari:</label>
          <input
            type="date"
            value={dariTanggal}
            onChange={(e) => {
              setDariTanggal(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1.5 px-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-[#4A2C0A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
          />
          <label className="text-xs font-semibold text-gray-500">Sampai:</label>
          <input
            type="date"
            value={sampaiTanggal}
            onChange={(e) => {
              setSampaiTanggal(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1.5 px-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-[#4A2C0A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
          />
        </div>

        {/* Filter Sumber */}
        <div className="flex items-center space-x-1">
          {['Semua', 'Penjualan', 'Lainnya'].map((sb) => (
            <button
              key={sb}
              onClick={() => {
                setSumberFilter(sb);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                sumberFilter === sb
                  ? 'bg-[#4A2C0A] text-white'
                  : 'bg-amber-50 text-gray-600 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              {sb}
            </button>
          ))}
        </div>

        {(dariTanggal || sampaiTanggal || sumberFilter !== 'Semua' || searchTerm) && (
          <button
            onClick={resetFilter}
            className="px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-xl font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFF5E6] border-b border-amber-200/80 text-[#4A2C0A] font-bold">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Sumber</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4">Jumlah (Rp)</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedPemasukan.length > 0 ? (
                paginatedPemasukan.map((item, idx) => {
                  const no = (currentPage - 1) * pageSize + idx + 1;
                  const isAuto = item.sumber === 'Penjualan';

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{no}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#4A2C0A]">
                        {formatTanggal(item.tanggal || item.created_at)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isAuto
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {isAuto ? '🧾 Penjualan' : '💼 Lainnya'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#4A2C0A] font-semibold">
                        {item.keterangan}
                        {isAuto && (
                          <span className="block text-[11px] text-gray-400 font-normal">
                            Otomatis tercatat dari pesanan
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-emerald-600 text-sm">
                        +{formatRupiah(item.jumlah)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {!isAuto ? (
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Pemasukan Manual"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Terkunci (Sistem)</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8">
                    <EmptyState
                      icon={ArrowDownLeft}
                      title="Tidak Ada Catatan Pemasukan"
                      description="Belum ada transaksi pemasukan yang tercatat untuk periode ini."
                      actionLabel="+ Tambah Pemasukan Manual"
                      onAction={handleOpenAdd}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredPemasukan.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Tambah Pemasukan Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#4A2C0A]">
                    Tambah Pemasukan Manual
                  </h3>
                  <p className="text-xs text-gray-500">Catat pendapatan di luar pesanan menu warung</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Keterangan Pemasukan
                </label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Pesanan katering arisan, tips pelanggan, dll"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Jumlah Pemasukan (Rp)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                  placeholder="Contoh: 150000"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
                >
                  Simpan Pemasukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        title="Hapus Pemasukan Manual"
        message={`Apakah Anda yakin ingin menghapus pemasukan "${itemToDelete?.keterangan}" senilai ${formatRupiah(itemToDelete?.jumlah)}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default PemasukanPage;
