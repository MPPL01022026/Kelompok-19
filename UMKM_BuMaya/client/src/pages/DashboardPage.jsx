import React, { useMemo } from 'react';
import { 
  Receipt, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  Coffee, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggal, toISODate } from '../utils/formatters';

const DashboardPage = ({ onNavigate }) => {
  const { pesanan, pemasukan, pengeluaran, bahan, menu } = useStore();

  const todayStr = toISODate(new Date());

  // 1. Ringkasan Hari Ini
  const todaySummary = useMemo(() => {
    // Total pesanan hari ini
    const todayOrders = pesanan.filter((p) => toISODate(p.created_at) === todayStr);
    const totalPesanan = todayOrders.length;

    // Total pemasukan hari ini
    const todayPemasukan = pemasukan
      .filter((p) => (p.tanggal === todayStr || toISODate(p.created_at) === todayStr))
      .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

    // Total pengeluaran hari ini
    const todayPengeluaran = pengeluaran
      .filter((p) => (p.tanggal === todayStr || toISODate(p.created_at) === todayStr))
      .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

    // Laba rugi
    const labaRugi = todayPemasukan - todayPengeluaran;

    // Stok menipis
    const stokMenipisCount = bahan.filter((b) => Number(b.jumlah) <= Number(b.batas_minimum)).length;

    return {
      totalPesanan,
      todayPemasukan,
      todayPengeluaran,
      labaRugi,
      stokMenipisCount,
    };
  }, [pesanan, pemasukan, pengeluaran, bahan, todayStr]);

  // 2. Data 7 Hari Terakhir untuk Line Chart (Pemasukan vs Pengeluaran) & Bar Chart (Jumlah Pesanan)
  const last7DaysData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = toISODate(d);
      
      const dayOrders = pesanan.filter((p) => toISODate(p.created_at) === iso);
      const dayPemasukan = pemasukan
        .filter((p) => (p.tanggal === iso || toISODate(p.created_at) === iso))
        .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);
      const dayPengeluaran = pengeluaran
        .filter((p) => (p.tanggal === iso || toISODate(p.created_at) === iso))
        .reduce((sum, item) => sum + Number(item.jumlah || 0), 0);

      const dayLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

      days.push({
        date: iso,
        name: dayLabel,
        pemasukan: dayPemasukan,
        pengeluaran: dayPengeluaran,
        pesanan: dayOrders.length,
        laba: dayPemasukan - dayPengeluaran,
      });
    }
    return days;
  }, [pesanan, pemasukan, pengeluaran]);

  // 3. Top 5 Menu Terlaris (Pie Chart)
  const topMenusData = useMemo(() => {
    const counts = {};
    pesanan.forEach((order) => {
      if (order.status !== 'Dibatalkan' && order.items) {
        order.items.forEach((item) => {
          counts[item.nama_menu] = (counts[item.nama_menu] || 0) + Number(item.qty || 1);
        });
      }
    });

    const sorted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return sorted;
  }, [pesanan]);

  const PIE_COLORS = ['#E8913A', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];

  // Low stock items list
  const lowStockItems = useMemo(() => {
    return bahan
      .filter((b) => Number(b.jumlah) <= Number(b.batas_minimum))
      .slice(0, 4);
  }, [bahan]);

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return [...pesanan].slice(0, 5);
  }, [pesanan]);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Dashboard Operasional Warung
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Ringkasan performa digital twin warung Family Kupi hari ini ({formatTanggal(todayStr)})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('pesanan')}
            className="px-4 py-2 bg-[#E8913A] hover:bg-[#D57C26] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <span>+ Buat Pesanan Baru</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Pesanan Hari Ini */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pesanan Hari Ini</span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#E8913A]">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#4A2C0A]">{todaySummary.totalPesanan}</span>
            <span className="text-xs text-gray-400">transaksi</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Status aktif & selesai</p>
        </div>

        {/* Total Pemasukan Hari Ini */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pemasukan Hari Ini</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">
              {formatRupiah(todaySummary.todayPemasukan)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Penjualan & manual</p>
        </div>

        {/* Total Pengeluaran Hari Ini */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pengeluaran Hari Ini</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black text-red-600">
              {formatRupiah(todaySummary.todayPengeluaran)}
            </span>
          </div>
          <p className="text-[11px] text-red-700/80 mt-1">Bahan baku & operasional</p>
        </div>

        {/* Laba/Rugi Hari Ini */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Laba / Rugi Hari Ini</span>
            <div className={`p-2 rounded-xl ${todaySummary.labaRugi >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {todaySummary.labaRugi >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-xl sm:text-2xl font-black ${todaySummary.labaRugi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatRupiah(todaySummary.labaRugi)}
            </span>
          </div>
          <p className={`text-[11px] font-medium mt-1 ${todaySummary.labaRugi >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {todaySummary.labaRugi >= 0 ? 'Surplus (Untung)' : 'Defisit (Rugi)'}
          </p>
        </div>

        {/* Stok Menipis */}
        <div 
          onClick={() => onNavigate('stok')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stok Menipis</span>
            <div className={`p-2 rounded-xl ${todaySummary.stokMenipisCount > 0 ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-black ${todaySummary.stokMenipisCount > 0 ? 'text-amber-600' : 'text-[#4A2C0A]'}`}>
              {todaySummary.stokMenipisCount}
            </span>
            <span className="text-xs text-amber-700 group-hover:underline">Bahan &rarr;</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1">Perlu restock segera</p>
        </div>
      </div>

      {/* Warning Alert Banner jika ada stok menipis */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Peringatan Stok Warung: {lowStockItems.length} Bahan Mendekati Batas Minimum!
              </h4>
              <p className="text-xs text-amber-800/80 mt-0.5">
                {lowStockItems.map((b) => `${b.nama_bahan} (${b.jumlah} ${b.satuan})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('stok')}
            className="self-end md:self-center px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            Lihat Modul Stok &rarr;
          </button>
        </div>
      )}

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Pemasukan vs Pengeluaran 7 Hari */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#4A2C0A]">
                Pemasukan vs Pengeluaran (7 Hari Terakhir)
              </h3>
              <p className="text-xs text-gray-500">Perbandingan arus kas harian Family Kupi</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7DaysData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFF5E6" />
                <XAxis dataKey="name" stroke="#8C5A2B" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#8C5A2B" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(val) => [formatRupiah(val)]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#FEEAD4' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pemasukan" 
                  name="Pemasukan" 
                  stroke="#22C55E" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#22C55E' }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pengeluaran" 
                  name="Pengeluaran" 
                  stroke="#EF4444" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#EF4444' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: 5 Menu Terlaris */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#4A2C0A]">
              5 Menu Terlaris
            </h3>
            <p className="text-xs text-gray-500">Menu paling diminati pelanggan</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topMenusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {topMenusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val, name) => [`${val} porsi/gelas`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#FEEAD4' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            {topMenusData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} 
                  />
                  <span className="text-[#4A2C0A] font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-gray-700">{item.value} porsi</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Bar Chart (Volume Pesanan 7 Hari) + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Jumlah Pesanan 7 Hari Terakhir */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#4A2C0A]">
                Volume Pesanan (7 Hari Terakhir)
              </h3>
              <p className="text-xs text-gray-500">Jumlah transaksi pesanan per hari</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FFF5E6" />
                <XAxis dataKey="name" stroke="#8C5A2B" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C5A2B" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  formatter={(val) => [`${val} pesanan`, 'Total']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#FEEAD4' }}
                />
                <Bar 
                  dataKey="pesanan" 
                  name="Jumlah Pesanan" 
                  fill="#E8913A" 
                  radius={[6, 6, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pesanan Terbaru Feed */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-[#4A2C0A]">Pesanan Terkini</h3>
              <p className="text-xs text-gray-500">Aktivitas pesanan warung terbaru</p>
            </div>
            <button
              onClick={() => onNavigate('pesanan')}
              className="text-xs font-semibold text-[#E8913A] hover:underline"
            >
              Semua &rarr;
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentOrders.map((ord) => {
              const statusColor =
                ord.status === 'Selesai'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : ord.status === 'Diproses'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200';

              return (
                <div 
                  key={ord.id} 
                  className="p-3 rounded-xl bg-amber-50/40 border border-amber-100/60 flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-[#4A2C0A] truncate">
                      #{ord.id} • {ord.nama_pelanggan || 'Pelanggan Walk-in'}
                    </p>
                    <p className="text-gray-500 text-[11px] truncate">
                      {ord.items?.map((it) => `${it.qty}x ${it.nama_menu}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#4A2C0A]">{formatRupiah(ord.total_harga)}</p>
                    <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-md text-[10px] font-semibold border ${statusColor}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('pesanan')}
            className="mt-4 w-full py-2 bg-[#FFF5E6] hover:bg-[#FEEAD4] text-[#E8913A] font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Buka Modul Pesanan Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
