import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Coffee, 
  Utensils, 
  Boxes 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const MenuPage = () => {
  const { menu, addMenu, updateMenu, toggleMenuStatus, deleteMenu } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_menu: '',
    kategori: 'Makanan',
    harga: '',
    status: 'Tersedia',
  });

  // Filtered Menu List
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (kategoriFilter !== 'Semua' && item.kategori !== kategoriFilter) return false;
      if (statusFilter !== 'Semua' && item.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = item.nama_menu.toLowerCase().includes(term);
        const matchKat = item.kategori.toLowerCase().includes(term);
        if (!matchName && !matchKat) return false;
      }
      return true;
    });
  }, [menu, kategoriFilter, statusFilter, searchTerm]);

  // Pagination
  const pageSize = 10;
  const paginatedMenu = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMenu.slice(start, start + pageSize);
  }, [filteredMenu, currentPage]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama_menu: '',
      kategori: 'Makanan',
      harga: '',
      status: 'Tersedia',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nama_menu: item.nama_menu,
      kategori: item.kategori,
      harga: item.harga,
      status: item.status,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.nama_menu.trim() || !formData.harga) {
      toast.error('Nama menu dan harga tidak boleh kosong!');
      return;
    }

    if (editingItem) {
      updateMenu(editingItem.id, {
        ...formData,
        harga: Number(formData.harga),
      });
      toast.success(`Menu "${formData.nama_menu}" berhasil diperbarui!`);
    } else {
      addMenu({
        ...formData,
        harga: Number(formData.harga),
      });
      toast.success(`Menu "${formData.nama_menu}" berhasil ditambahkan!`);
    }
    setIsFormModalOpen(false);
  };

  const handleToggleStatus = (item) => {
    toggleMenuStatus(item.id);
    const newStatus = item.status === 'Tersedia' ? 'Habis' : 'Tersedia';
    toast.success(`Status "${item.nama_menu}" diubah menjadi ${newStatus}`);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMenu(itemToDelete.id);
      toast.success(`Menu "${itemToDelete.nama_menu}" berhasil dihapus.`);
      setItemToDelete(null);
    }
  };

  const getCategoryIcon = (kategori) => {
    if (kategori === 'Minuman') return <Coffee className="w-4 h-4 text-blue-500" />;
    if (kategori === 'Paket') return <Boxes className="w-4 h-4 text-purple-500" />;
    return <Utensils className="w-4 h-4 text-[#E8913A]" />;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Manajemen Menu Warung
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Daftar hidangan makanan, minuman khas kopi, dan paket hemat Warung Bu Maya
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Menu Baru</span>
        </button>
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
            placeholder="Cari nama menu..."
            className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] text-[#4A2C0A]"
          />
        </div>

        {/* Kategori Filters */}
        <div className="flex items-center space-x-1">
          {['Semua', 'Makanan', 'Minuman', 'Paket'].map((kat) => (
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

        {/* Status Filters */}
        <div className="flex items-center space-x-1">
          {['Semua', 'Tersedia', 'Habis'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#E8913A] text-white'
                  : 'bg-amber-50 text-gray-600 hover:bg-amber-100 border border-amber-200/60'
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
                <th className="py-3.5 px-4">Nama Menu</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Status Ketersediaan</th>
                <th className="py-3.5 px-4 text-center">Toggle Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedMenu.length > 0 ? (
                paginatedMenu.map((item, idx) => {
                  const no = (currentPage - 1) * pageSize + idx + 1;
                  const isAvailable = item.status === 'Tersedia';

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 text-center text-gray-400 font-semibold">{no}</td>
                      <td className="py-3.5 px-4 font-bold text-[#4A2C0A] whitespace-nowrap">
                        {item.nama_menu}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-[#8C5A2B]">
                          {getCategoryIcon(item.kategori)}
                          <span>{item.kategori}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-[#E8913A] text-sm">
                        {formatRupiah(item.harga)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          {isAvailable ? '🟢 Tersedia' : '🔴 Habis'}
                        </span>
                      </td>
                      {/* Toggle Quick Button */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                            isAvailable
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          {isAvailable ? 'Tandai Habis' : 'Tandai Tersedia'}
                        </button>
                      </td>
                      {/* Aksi Edit/Delete */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Menu"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Menu"
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
                  <td colSpan="7" className="p-8">
                    <EmptyState
                      icon={UtensilsCrossed}
                      title="Tidak Ada Menu Ditemukan"
                      description="Tidak ada item menu yang cocok dengan filter pencarian."
                      actionLabel="+ Tambah Menu Baru"
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
          totalItems={filteredMenu.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Add / Edit Menu */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#E8913A] text-white rounded-xl">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#4A2C0A]">
                    {editingItem ? 'Edit Menu Warung' : 'Tambah Menu Baru'}
                  </h3>
                  <p className="text-xs text-gray-500">Atur rincian makanan, minuman, atau paket</p>
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
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formData.nama_menu}
                  onChange={(e) => setFormData({ ...formData, nama_menu: e.target.value })}
                  placeholder="Contoh: Nasi Ayam Bakar Spesial"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Paket">Paket Hemat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                  >
                    <option value="Tersedia">Tersedia 🟢</option>
                    <option value="Habis">Habis 🔴</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                  Harga Satuan (Rupiah)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  placeholder="Contoh: 18000"
                  className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#E8913A] hover:bg-[#D57C26] rounded-xl shadow-md transition-all"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        title={`Hapus Menu "${itemToDelete?.nama_menu}"`}
        message={`Apakah Anda yakin ingin menghapus "${itemToDelete?.nama_menu}" dari daftar menu warung?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default MenuPage;
