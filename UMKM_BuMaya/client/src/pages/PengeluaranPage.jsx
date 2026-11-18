import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit, 
  X, 
  ShoppingBag, 
  Zap, 
  MoreHorizontal 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggal, toISODate } from '../utils/formatters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const PengeluaranPage = () => {
  const { pengeluaran, addPengeluaran, updatePengeluaran, deletePengeluaran } = useStore();

  // Filters
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: toISODate(new Date()),
    kategori: 'Bahan Baku',
    keterangan: '',
    jumlah: '',
  });

  // Filtered List
  const filteredPengeluaran = useMemo(() => {
    return pengeluaran.filter((item) => {
      const itemDate = item.tanggal || toISODate(item.created_at);
      if (dariTanggal && itemDate < dariTanggal) return false;
      if (sampaiTanggal && itemDate > sampaiTanggal) return false;
      if (kategoriFilter !== 'Semua' && item.kategori !== kategoriFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchKet = item.keterangan?.toLowerCase().includes(term);
        const matchKat = item.kategori?.toLowerCase().includes(term);
        if (!matchKet && !matchKat) return false;
      }
      return true;
    });
  }, [pengeluaran, dariTanggal, sampaiTanggal, kategoriFilter, searchTerm]);

  // Total Summary
  const totalFilteredPengeluaran = useMemo(() => {
    return filteredPengeluaran.reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);
  }, [filteredPengeluaran]);

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    let bahanBaku = 0;
    let operasional = 0;
    let lainnya = 0;
    filteredPengeluaran.forEach((it) => {
      if (it.kategori === 'Bahan Baku') bahanBaku += Number(it.jumlah || 0);
      else if (it.kategori === 'Operasional') operasional += Number(it.jumlah || 0);
      else lainnya += Number(it.jumlah || 0);
    });
    return { bahanBaku, operasional, lainnya };
  }, [filteredPengeluaran]);

  // Pagination
  const pageSize = 10;
  const paginatedPengeluaran = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPengeluaran.slice(start, start + pageSize);
  }, [filteredPengeluaran, currentPage]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      tanggal: toISODate(new Date()),
      kategori: 'Bahan Baku',
      keterangan: '',
      jumlah: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      tanggal: item.tanggal || toISODate(item.created_at),
      kategori: item.kategori,
      keterangan: item.keterangan,
      jumlah: item.jumlah,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.keterangan.trim() || !formData.jumlah) {
      toast.error('Keterangan dan jumlah tidak boleh kosong!');
      return;
    }

    if (editingItem) {
      updatePengeluaran(editingItem.id, {
        ...formData,
        jumlah: Number(formData.jumlah),
      });
      toast.success('Pengeluaran berhasil diperbarui!');
    } else {
      addPengeluaran({
        ...formData,
        jumlah: Number(formData.jumlah),
      });
      toast.success('Pengeluaran baru berhasil dicatat!');
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deletePengeluaran(itemToDelete.id);
      toast.success('Pengeluaran berhasil dihapus.');
      setItemToDelete(null);
    }
  };

  const resetFilter = () => {
    setDariTanggal('');
    setSampaiTanggal('');
    setKategoriFilter('Semua');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Modul Pengeluaran Warung
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Pantau belanja bahan baku, biaya operasional dapur, dan kebutuhan lainnya
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Pengeluaran Baru</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Pengeluaran</span>
            <p className="text-xl sm:text-2xl font-black text-red-600 mt-1">
              {formatRupiah(totalFilteredPengeluaran)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">{filteredPengeluaran.length} transaksi</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Bahan Baku</span>
            <p className="text-lg sm:text-xl font-black text-[#4A2C0A] mt-1">
              {formatRupiah(categoryBreakdown.bahanBaku)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Ayam, beras, bumbu, sayur</p>
          </div>
          <div className="p-3 bg-amber-50 text-[#E8913A] rounded-2xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Operasional</span>
            <p className="text-lg sm:text-xl font-black text-blue-600 mt-1">
              {formatRupiah(categoryBreakdown.operasional)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Gas LPG, listrik, es batu</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Lainnya</span>
            <p className="text-lg sm:text-xl font-black text-gray-700 mt-1">
              {formatRupiah(categoryBreakdown.lainnya)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Plastik, tisu, pembersih</p>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-2xl">
            <MoreHorizontal className="w-5 h-5" />
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
            placeholder="Cari keterangan pengeluaran..."
            className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] text-[#4A2C0A]"
          />
        </div>

        {/* Date Filter */}
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

        {/* Filter Kategori */}
        <div className="flex items-center space-x-1">
          {['Semua', 'Bahan Baku', 'Operasional', 'Lainnya'].map((kat) => (
            <button
              key={kat}
              onClick={() => {
                setKategoriFilter(kat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                kategoriFilter === kat
                  ? 'bg-[#4A2C0A] text-white'
                  : 'bg-amber-50 text-gray-600 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {(dariTanggal || sampaiTanggal || kategoriFilter !== 'Semua' || searchTerm) && (
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
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4">Jumlah (Rp)</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedPengeluaran.length > 0 ? (
                paginatedPengeluaran.map((item, idx) => {
                  const no = (currentPage - 1) * pageSize + idx + 1;
                  const categoryBadgeColor =
                    item.kategori === 'Bahan Baku'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : item.kategori === 'Operasional'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-800 border-gray-300';

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{no}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#4A2C0A]">
                        {formatTanggal(item.tanggal || item.created_at)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${categoryBadgeColor}`}>
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#4A2C0A] font-semibold">
                        {item.keterangan}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-red-600 text-sm">
                        -{formatRupiah(item.jumlah)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Pengeluaran"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Pengeluaran"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8">
                    <EmptyState
                      icon={ArrowUpRight}
                      title="Tidak Ada Catatan Pengeluaran"
                      description="Belum ada transaksi pengeluaran yang sesuai dengan filter ini."
                      actionLabel="+ Catat Pengeluaran Baru"
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
          totalItems={filteredPengeluaran.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Add / Edit Pengeluaran */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-red-600 text-white rounded-xl">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#4A2C0A]">
                    {editingItem ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}
                  </h3>
                  <p className="text-xs text-gray-500">Kelola arus kas keluar operasional warung</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Tanggal Pengeluaran
                </label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Kategori Biaya
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                >
                  <option value="Bahan Baku">Bahan Baku (Ayam, Sayur, Beras, Bumbu, dll)</option>
                  <option value="Operasional">Operasional (Gas LPG, Listrik, Es Batu, dll)</option>
                  <option value="Lainnya">Lainnya (Kresek, Sedotan, Tisu, Kebersihan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Keterangan Pengeluaran
                </label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Belanja Ayam potong 10kg ke pasar"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Jumlah Pengeluaran (Rp)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                  placeholder="Contoh: 75000"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        title="Hapus Pengeluaran"
        message={`Apakah Anda yakin ingin menghapus catatan pengeluaran "${itemToDelete?.keterangan}" senilai ${formatRupiah(itemToDelete?.jumlah)}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default PengeluaranPage;
