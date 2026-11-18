import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  MinusCircle, 
  PlusCircle, 
  X,
  ArrowUpDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const StokBahanPage = () => {
  const { bahan, addBahan, updateBahan, adjustBahanStok, deleteBahan } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBahan, setEditingBahan] = useState(null);
  const [quickAdjustBahan, setQuickAdjustBahan] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [adjustType, setAdjustType] = useState('kurang'); // 'tambah' | 'kurang'
  const [bahanToDelete, setBahanToDelete] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    nama_bahan: '',
    satuan: 'kg',
    jumlah: 0,
    batas_minimum: 5,
  });

  // Calculate status for each item
  const getBahanStatus = (jumlah, batas_minimum) => {
    const qty = Number(jumlah);
    const min = Number(batas_minimum);
    if (qty <= 0) return { label: 'Habis', color: 'bg-red-100 text-red-800 border-red-300' };
    if (qty <= min) return { label: 'Menipis', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Aman', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  // Filtered & Searched List
  const filteredBahan = useMemo(() => {
    return bahan.filter((item) => {
      const statusObj = getBahanStatus(item.jumlah, item.batas_minimum);
      if (filterStatus !== 'Semua' && statusObj.label !== filterStatus) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = item.nama_bahan.toLowerCase().includes(term);
        const matchSatuan = item.satuan.toLowerCase().includes(term);
        if (!matchName && !matchSatuan) return false;
      }
      return true;
    });
  }, [bahan, filterStatus, searchTerm]);

  // Pagination
  const pageSize = 10;
  const paginatedBahan = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBahan.slice(start, start + pageSize);
  }, [filteredBahan, currentPage]);

  const handleOpenAdd = () => {
    setEditingBahan(null);
    setFormData({
      nama_bahan: '',
      satuan: 'kg',
      jumlah: 10,
      batas_minimum: 5,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingBahan(item);
    setFormData({
      nama_bahan: item.nama_bahan,
      satuan: item.satuan,
      jumlah: item.jumlah,
      batas_minimum: item.batas_minimum,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.nama_bahan.trim()) {
      toast.error('Nama bahan tidak boleh kosong!');
      return;
    }

    if (editingBahan) {
      updateBahan(editingBahan.id, formData);
      toast.success(`Bahan "${formData.nama_bahan}" berhasil diperbarui!`);
    } else {
      addBahan(formData);
      toast.success(`Bahan "${formData.nama_bahan}" berhasil ditambahkan!`);
    }
    setIsFormModalOpen(false);
  };

  const handleOpenQuickAdjust = (item, type) => {
    setQuickAdjustBahan(item);
    setAdjustType(type);
    setAdjustAmount(1);
  };

  const handleSaveQuickAdjust = (e) => {
    e.preventDefault();
    if (!quickAdjustBahan) return;

    const delta = adjustType === 'tambah' ? Number(adjustAmount) : -Number(adjustAmount);
    adjustBahanStok(quickAdjustBahan.id, delta);
    toast.success(
      `Stok "${quickAdjustBahan.nama_bahan}" berhasil ${adjustType === 'tambah' ? 'ditambah' : 'dikurangi'} ${adjustAmount} ${quickAdjustBahan.satuan}!`
    );
    setQuickAdjustBahan(null);
  };

  const handleDeleteConfirm = () => {
    if (bahanToDelete) {
      deleteBahan(bahanToDelete.id);
      toast.success(`Bahan "${bahanToDelete.nama_bahan}" berhasil dihapus.`);
      setBahanToDelete(null);
    }
  };

  const statsCount = useMemo(() => {
    let aman = 0;
    let menipis = 0;
    let habis = 0;
    bahan.forEach((b) => {
      const q = Number(b.jumlah);
      const m = Number(b.batas_minimum);
      if (q <= 0) habis++;
      else if (q <= m) menipis++;
      else aman++;
    });
    return { aman, menipis, habis, total: bahan.length };
  }, [bahan]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Modul Stok Bahan Baku
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Pantau dan sesuaikan stok operasional dapur warung Family Kupi
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bahan Baru</span>
        </button>
      </div>

      {/* Stock Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-[#E8913A]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Total Bahan</span>
            <p className="text-lg sm:text-xl font-black text-[#4A2C0A]">{statsCount.total}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Aman</span>
            <p className="text-lg sm:text-xl font-black text-emerald-600">{statsCount.aman}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Menipis</span>
            <p className="text-lg sm:text-xl font-black text-amber-600">{statsCount.menipis}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <MinusCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Habis</span>
            <p className="text-lg sm:text-xl font-black text-red-600">{statsCount.habis}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama bahan atau satuan (kg, liter, pcs)..."
            className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Aman', 'Menipis', 'Habis'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setFilterStatus(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-[#4A2C0A] text-white shadow-sm'
                  : 'bg-amber-50/60 text-gray-600 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFF5E6] border-b border-amber-200/80 text-[#4A2C0A] font-bold">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Bahan</th>
                <th className="py-3.5 px-4">Satuan</th>
                <th className="py-3.5 px-4">Jumlah Stok</th>
                <th className="py-3.5 px-4">Batas Minimum</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Penyesuaian Cepat</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedBahan.length > 0 ? (
                paginatedBahan.map((item, idx) => {
                  const no = (currentPage - 1) * pageSize + idx + 1;
                  const status = getBahanStatus(item.jumlah, item.batas_minimum);

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{no}</td>
                      <td className="py-3.5 px-4 font-bold text-[#4A2C0A] whitespace-nowrap">
                        {item.nama_bahan}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {item.satuan}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-base text-[#4A2C0A]">
                        {item.jumlah} <span className="text-xs font-normal text-gray-500">{item.satuan}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">
                        {item.batas_minimum} {item.satuan}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                          {status.label === 'Aman' && '🟢 Aman'}
                          {status.label === 'Menipis' && '🟡 Menipis'}
                          {status.label === 'Habis' && '🔴 Habis'}
                        </span>
                      </td>
                      {/* Quick Adjust Buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenQuickAdjust(item, 'kurang')}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg border border-red-200 transition-colors flex items-center space-x-1"
                            title="Kurangi Stok Cepat"
                          >
                            <span>- Kurangi</span>
                          </button>
                          <button
                            onClick={() => handleOpenQuickAdjust(item, 'tambah')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center space-x-1"
                            title="Tambah Stok Cepat"
                          >
                            <span>+ Tambah</span>
                          </button>
                        </div>
                      </td>
                      {/* Action edit / delete */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Bahan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setBahanToDelete(item)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Bahan"
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
                  <td colSpan="8" className="p-8">
                    <EmptyState
                      icon={Package}
                      title="Tidak Ada Bahan Ditemukan"
                      description="Tidak ada data bahan baku yang sesuai dengan kriteria pencarian."
                      actionLabel="Tambah Bahan Baru"
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
          totalItems={filteredBahan.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Add / Edit Bahan */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#E8913A] text-white rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#4A2C0A]">
                    {editingBahan ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
                  </h3>
                  <p className="text-xs text-gray-500">Kelola informasi stok bahan dapur</p>
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
                  Nama Bahan Baku
                </label>
                <input
                  type="text"
                  value={formData.nama_bahan}
                  onChange={(e) => setFormData({ ...formData, nama_bahan: e.target.value })}
                  placeholder="Contoh: Beras, Ayam, Kopi Robusta"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Satuan
                </label>
                <select
                  value={formData.satuan}
                  onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="liter">liter</option>
                  <option value="pcs">pcs (Biji/Potong)</option>
                  <option value="bungkus">bungkus</option>
                  <option value="butir">butir</option>
                  <option value="botol">botol</option>
                  <option value="tabung">tabung</option>
                  <option value="galon">galon</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Jumlah Saat Ini
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.jumlah}
                    onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Batas Minimum
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.batas_minimum}
                    onChange={(e) => setFormData({ ...formData, batas_minimum: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#E8913A] hover:bg-[#D57C26] rounded-xl shadow-md transition-all"
                >
                  {editingBahan ? 'Simpan Perubahan' : 'Tambah Bahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Quick Adjust (Kurangi / Tambah Stok) */}
      {quickAdjustBahan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#4A2C0A]">
                  {adjustType === 'tambah' ? 'Tambah Stok' : 'Kurangi Stok'}
                </h3>
                <p className="text-xs text-gray-500">
                  {quickAdjustBahan.nama_bahan} (Stok sekarang: {quickAdjustBahan.jumlah} {quickAdjustBahan.satuan})
                </p>
              </div>
              <button
                onClick={() => setQuickAdjustBahan(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickAdjust} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-2">
                  Jumlah yang Ingin {adjustType === 'tambah' ? 'Ditambahkan' : 'Dikurangkan'} ({quickAdjustBahan.satuan})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-4 py-3 text-center text-xl font-black bg-amber-50/50 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAdjustBahan(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-colors ${
                    adjustType === 'tambah'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!bahanToDelete}
        title={`Hapus Bahan "${bahanToDelete?.nama_bahan}"`}
        message={`Apakah Anda yakin ingin menghapus "${bahanToDelete?.nama_bahan}" dari daftar stok?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBahanToDelete(null)}
      />
    </div>
  );
};

export default StokBahanPage;
