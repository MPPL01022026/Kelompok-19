import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShoppingBag,
  Calendar,
  X,
  Printer
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggal, formatWaktu, toISODate } from '../utils/formatters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const PesananPage = () => {
  const { pesanan, menu, addPesanan, updatePesananStatus, deletePesanan } = useStore();

  // Filters
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewDetailOrder, setViewDetailOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Form state for new order
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState([
    { menu_id: '', qty: 1, harga: 0, subtotal: 0, nama_menu: '' }
  ]);
  const [orderStatus, setOrderStatus] = useState('Diproses');

  // Filtered & Searched Orders
  const filteredOrders = useMemo(() => {
    return pesanan.filter((ord) => {
      // Date filter
      if (filterTanggal && toISODate(ord.created_at) !== filterTanggal) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'Semua' && ord.status !== filterStatus) {
        return false;
      }
      // Search term (customer name or order ID)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = ord.nama_pelanggan?.toLowerCase().includes(term);
        const matchId = String(ord.id).includes(term);
        const matchMenu = ord.items?.some((i) => i.nama_menu.toLowerCase().includes(term));
        if (!matchName && !matchId && !matchMenu) return false;
      }
      return true;
    });
  }, [pesanan, filterTanggal, filterStatus, searchTerm]);

  // Pagination
  const pageSize = 10;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  // Order item line handlers
  const handleItemMenuChange = (index, menuId) => {
    const selected = menu.find((m) => m.id === Number(menuId));
    const newItems = [...orderItems];
    if (selected) {
      newItems[index] = {
        ...newItems[index],
        menu_id: selected.id,
        nama_menu: selected.nama_menu,
        harga: selected.harga,
        subtotal: selected.harga * (newItems[index].qty || 1),
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        menu_id: '',
        nama_menu: '',
        harga: 0,
        subtotal: 0,
      };
    }
    setOrderItems(newItems);
  };

  const handleItemQtyChange = (index, qtyVal) => {
    const qty = Math.max(1, Number(qtyVal) || 1);
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      qty,
      subtotal: (newItems[index].harga || 0) * qty,
    };
    setOrderItems(newItems);
  };

  const addItemLine = () => {
    setOrderItems((prev) => [
      ...prev,
      { menu_id: '', qty: 1, harga: 0, subtotal: 0, nama_menu: '' }
    ]);
  };

  const removeItemLine = (index) => {
    if (orderItems.length === 1) {
      toast.error('Pesanan minimal harus memiliki 1 menu!');
      return;
    }
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatedTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }, [orderItems]);

  const handleOpenAddModal = () => {
    setCustomerName('');
    setOrderStatus('Diproses');
    // Pre-populate with first available menu if possible
    const available = menu.filter((m) => m.status === 'Tersedia');
    const defaultMenu = available[0] || menu[0];
    if (defaultMenu) {
      setOrderItems([
        {
          menu_id: defaultMenu.id,
          qty: 1,
          harga: defaultMenu.harga,
          subtotal: defaultMenu.harga,
          nama_menu: defaultMenu.nama_menu,
        }
      ]);
    } else {
      setOrderItems([{ menu_id: '', qty: 1, harga: 0, subtotal: 0, nama_menu: '' }]);
    }
    setIsAddModalOpen(true);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const validItems = orderItems.filter((i) => i.menu_id && i.qty > 0);
    if (!validItems.length) {
      toast.error('Pilih minimal 1 menu yang valid!');
      return;
    }

    const newOrder = addPesanan({
      nama_pelanggan: customerName,
      total_harga: calculatedTotal,
      status: orderStatus,
      items: validItems,
    });

    toast.success(`Pesanan #${newOrder.id} berhasil disimpan!`);
    if (orderStatus === 'Selesai') {
      toast.success('Pemasukan penjualan otomatis tercatat di kas!');
    }
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updatePesananStatus(orderId, newStatus);
    toast.success(`Status pesanan #${orderId} diubah menjadi ${newStatus}`);
    if (newStatus === 'Selesai') {
      toast.success('Pemasukan otomatis tercatat!');
    }
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deletePesanan(orderToDelete.id);
      toast.success(`Pesanan #${orderToDelete.id} berhasil dihapus.`);
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Modul Pesanan Warung
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Kelola transaksi pesanan pelanggan Family Kupi secara realtime
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] hover:to-[#B4631A] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari ID pesanan, nama pelanggan, atau menu..."
            className="w-full pl-10 pr-4 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white text-[#4A2C0A]"
          />
        </div>

        {/* Filter Tanggal */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => {
                setFilterTanggal(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs sm:text-sm text-[#4A2C0A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
            />
          </div>
          {filterTanggal && (
            <button
              onClick={() => {
                setFilterTanggal('');
                setCurrentPage(1);
              }}
              className="p-2 text-xs text-red-500 hover:bg-red-50 rounded-lg"
              title="Reset Filter Tanggal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Status */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Diproses', 'Selesai', 'Dibatalkan'].map((st) => (
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

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFF5E6] border-b border-amber-200/80 text-[#4A2C0A] font-bold">
                <th className="py-3.5 px-4 w-16">No</th>
                <th className="py-3.5 px-4">Tanggal & Waktu</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Daftar Menu & Qty</th>
                <th className="py-3.5 px-4">Total Harga</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((ord, idx) => {
                  const no = (currentPage - 1) * pageSize + idx + 1;
                  const statusBadgeClass =
                    ord.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : ord.status === 'Diproses'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-red-100 text-red-800 border-red-300';

                  return (
                    <tr key={ord.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-400">#{ord.id}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-[#4A2C0A]">{formatTanggal(ord.created_at)}</p>
                        <p className="text-[11px] text-gray-400">{formatWaktu(ord.created_at)}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#4A2C0A] block">
                          {ord.nama_pelanggan || 'Pelanggan Walk-in'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {ord.items?.map((it, i) => (
                            <span key={i} className="inline-block bg-amber-50 text-[#8C5A2B] px-2 py-0.5 rounded text-[11px] font-medium mr-1.5 mb-1 border border-amber-200/60">
                              {it.qty}x {it.nama_menu}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-[#E8913A]">
                        {formatRupiah(ord.total_harga)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusBadgeClass}`}
                        >
                          <option value="Diproses">Diproses 🟡</option>
                          <option value="Selesai">Selesai 🟢</option>
                          <option value="Dibatalkan">Dibatalkan 🔴</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setViewDetailOrder(ord)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail Pesanan"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(ord)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Pesanan"
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
                      icon={Receipt}
                      title="Tidak Ada Pesanan Ditemukan"
                      description="Tidak ada pesanan yang sesuai dengan filter atau belum ada pesanan yang dicatat."
                      actionLabel="Buat Pesanan Baru"
                      onAction={handleOpenAddModal}
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
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal Buat Pesanan Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#E8913A] text-white rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#4A2C0A]">Buat Pesanan Baru</h3>
                  <p className="text-xs text-gray-500">Isi data pesanan meja / walk-in Family Kupi</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Nama Pelanggan / No. Meja (Opsional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Pak Budi / Meja 4"
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2C0A] uppercase tracking-wider mb-1.5">
                    Status Awal Pesanan
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8913A] focus:bg-white font-semibold"
                  >
                    <option value="Diproses">Diproses 🟡</option>
                    <option value="Selesai">Langsung Selesai & Bayar 🟢</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#4A2C0A] uppercase tracking-wider">
                    Daftar Menu yang Dipesan
                  </h4>
                  <button
                    type="button"
                    onClick={addItemLine}
                    className="text-xs font-bold text-[#E8913A] hover:text-[#D57C26] flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Menu Lain</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {orderItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                    >
                      {/* Menu Select */}
                      <div className="flex-1">
                        <select
                          value={item.menu_id}
                          onChange={(e) => handleItemMenuChange(idx, e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
                          required
                        >
                          <option value="">-- Pilih Menu --</option>
                          {menu.map((m) => (
                            <option 
                              key={m.id} 
                              value={m.id}
                              disabled={m.status === 'Habis'}
                            >
                              [{m.kategori}] {m.nama_menu} — {formatRupiah(m.harga)} {m.status === 'Habis' ? '(HABIS)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Qty Input */}
                      <div className="w-24 flex items-center space-x-1.5">
                        <label className="text-[11px] font-bold text-gray-500 sm:hidden">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
                          required
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="w-28 text-right font-black text-xs sm:text-sm text-[#4A2C0A] self-center">
                        {formatRupiah(item.subtotal)}
                      </div>

                      {/* Delete Line */}
                      <button
                        type="button"
                        onClick={() => removeItemLine(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors self-end sm:self-center"
                        title="Hapus baris menu ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 bg-[#FFF5E6] rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Pembayaran</span>
                  <p className="text-xs text-amber-800">Termasuk semua menu pilihan</p>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#E8913A]">
                  {formatRupiah(calculatedTotal)}
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#E8913A] to-[#D57C26] hover:from-[#D57C26] hover:to-[#B4631A] rounded-xl shadow-md shadow-orange-500/20 transition-all"
                >
                  Simpan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail / Struk Pesanan */}
      {viewDetailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-amber-100 bg-[#FFF5E6] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#4A2C0A]">
                  Detail Pesanan #{viewDetailOrder.id}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatTanggal(viewDetailOrder.created_at)} • {formatWaktu(viewDetailOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setViewDetailOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Struk Content */}
            <div className="p-6 space-y-4">
              <div className="text-center pb-3 border-b border-dashed border-amber-200">
                <h4 className="font-black text-lg text-[#4A2C0A]">Family Kupi</h4>
                <p className="text-xs text-[#E8913A] font-semibold">Ngopi • Makan • Santai</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Pemilik: Bu Maya</p>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama Pelanggan:</span>
                  <span className="font-bold text-[#4A2C0A]">
                    {viewDetailOrder.nama_pelanggan || 'Pelanggan Walk-in'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status Pesanan:</span>
                  <span className="font-bold text-[#E8913A]">{viewDetailOrder.status}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-b border-dashed border-amber-200 py-3 space-y-2">
                {viewDetailOrder.items?.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#4A2C0A]">{it.nama_menu}</p>
                      <p className="text-[11px] text-gray-400">{it.qty} x {formatRupiah(it.harga || (it.subtotal / it.qty))}</p>
                    </div>
                    <span className="font-bold text-[#4A2C0A]">{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-sm font-bold pt-1">
                <span className="text-[#4A2C0A]">Total Bayar:</span>
                <span className="text-lg font-black text-[#E8913A]">{formatRupiah(viewDetailOrder.total_harga)}</span>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Mencetak struk pesanan...');
                    window.print();
                  }}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#4A2C0A] font-bold text-xs rounded-xl border border-amber-200 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Struk</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewDetailOrder(null)}
                  className="flex-1 py-2.5 bg-[#E8913A] hover:bg-[#D57C26] text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!orderToDelete}
        title={`Hapus Pesanan #${orderToDelete?.id}`}
        message={`Apakah Anda yakin ingin menghapus pesanan dari "${orderToDelete?.nama_pelanggan || 'Pelanggan Walk-in'}" senilai ${formatRupiah(orderToDelete?.total_harga)}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};

export default PesananPage;
