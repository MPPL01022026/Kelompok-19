import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useStore } from '../context/StoreContext';
import { formatRupiah, formatTanggal, toISODate, exportToCSV } from '../utils/formatters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const RekapUsahaPage = () => {
  const { pesanan, pemasukan, pengeluaran } = useStore();

  // Presets: 'today' | '7days' | '30days' | 'thisMonth' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState('7days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Compute active date range based on preset
  const dateRange = useMemo(() => {
    const today = new Date();
    const todayStr = toISODate(today);

    if (selectedPreset === 'today') {
      return { start: todayStr, end: todayStr };
    }

    if (selectedPreset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return { start: toISODate(d), end: todayStr };
    }

    if (selectedPreset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      return { start: toISODate(d), end: todayStr };
    }

    if (selectedPreset === 'thisMonth') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: toISODate(firstDay), end: todayStr };
    }

    // Custom
    return {
      start: customStart || '2026-01-01',
      end: customEnd || todayStr,
    };
  }, [selectedPreset, customStart, customEnd]);

  // Aggregate daily recap
  const dailyRecap = useMemo(() => {
    const map = {};

    // Generate list of dates between start and end
    const curr = new Date(dateRange.start);
    const end = new Date(dateRange.end);

    // Limit safe iteration to 180 days max
    let count = 0;
    while (curr <= end && count < 180) {
      const iso = toISODate(curr);
      map[iso] = {
        tanggal: iso,
        pesananCount: 0,
        pemasukan: 0,
        pengeluaran: 0,
        laba: 0,
      };
      curr.setDate(curr.getDate() + 1);
      count++;
    }

    // Accumulate pesanan
    pesanan.forEach((p) => {
      const iso = toISODate(p.created_at);
      if (map[iso]) {
        map[iso].pesananCount += 1;
      }
    });

    // Accumulate pemasukan
    pemasukan.forEach((m) => {
      const iso = m.tanggal || toISODate(m.created_at);
      if (map[iso]) {
        map[iso].pemasukan += Number(m.jumlah || 0);
      }
    });

    // Accumulate pengeluaran
    pengeluaran.forEach((exp) => {
      const iso = exp.tanggal || toISODate(exp.created_at);
      if (map[iso]) {
        map[iso].pengeluaran += Number(exp.jumlah || 0);
      }
    });

    // Calculate laba and convert to sorted array (descending)
    return Object.values(map)
      .map((item) => ({
        ...item,
        laba: item.pemasukan - item.pengeluaran,
      }))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [dateRange, pesanan, pemasukan, pengeluaran]);

  // Chart data (sorted ascending by date)
  const chartData = useMemo(() => {
    return [...dailyRecap]
      .reverse()
      .map((item) => ({
        ...item,
        name: formatTanggal(item.tanggal).slice(0, 6), // e.g. "14 Nov"
      }));
  }, [dailyRecap]);

  // Totals for the entire selected period
  const periodSummary = useMemo(() => {
    let totalPesanan = 0;
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    dailyRecap.forEach((day) => {
      totalPesanan += day.pesananCount;
      totalPemasukan += day.pemasukan;
      totalPengeluaran += day.pengeluaran;
    });

    const totalLaba = totalPemasukan - totalPengeluaran;

    return {
      totalPesanan,
      totalPemasukan,
      totalPengeluaran,
      totalLaba,
    };
  }, [dailyRecap]);

  // Pagination
  const pageSize = 10;
  const paginatedDaily = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return dailyRecap.slice(start, start + pageSize);
  }, [dailyRecap, currentPage]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (!dailyRecap.length) {
      toast.error('Tidak ada data rekap untuk diekspor!');
      return;
    }

    const exportRows = dailyRecap.map((row) => ({
      'Tanggal': row.tanggal,
      'Jumlah Pesanan': row.pesananCount,
      'Pemasukan (Rp)': row.pemasukan,
      'Pengeluaran (Rp)': row.pengeluaran,
      'Laba / Rugi (Rp)': row.laba,
    }));

    const filename = `rekap_family_kupi_${dateRange.start}_sd_${dateRange.end}.csv`;
    const success = exportToCSV(exportRows, filename);
    if (success) {
      toast.success(`Data rekap berhasil diekspor ke ${filename}!`);
    } else {
      toast.error('Gagal mengekspor data.');
    }
  };

  const presetButtons = [
    { id: 'today', label: 'Hari Ini' },
    { id: '7days', label: '7 Hari Terakhir' },
    { id: '30days', label: '30 Hari Terakhir' },
    { id: 'thisMonth', label: 'Bulan Ini' },
    { id: 'custom', label: 'Pilih Rentang Sendiri' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#4A2C0A] tracking-tight">
            Modul Rekap Usaha & Laba Rugi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Laporan agregat harian performa finansial Warung Bu Maya ({formatTanggal(dateRange.start)} - {formatTanggal(dateRange.end)})
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-[#4A2C0A] hover:bg-[#694115] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4 text-[#E8913A]" />
          <span>Export Data ke CSV (Excel)</span>
        </button>
      </div>

      {/* Preset Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm space-y-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {presetButtons.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPreset === preset.id
                  ? 'bg-[#E8913A] text-white shadow-sm'
                  : 'bg-amber-50/60 text-gray-600 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Date Inputs if Custom is selected */}
        {selectedPreset === 'custom' && (
          <div className="pt-2 border-t border-amber-100 flex items-center space-x-3 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500">Mulai:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => {
                  setCustomStart(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-[#4A2C0A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500">Sampai:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => {
                  setCustomEnd(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-3 bg-amber-50/40 border border-amber-200 rounded-xl text-xs text-[#4A2C0A] focus:outline-none focus:ring-2 focus:ring-[#E8913A]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Pesanan</span>
            <p className="text-xl sm:text-2xl font-black text-[#4A2C0A] mt-1">
              {periodSummary.totalPesanan}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Transaksi periode ini</p>
          </div>
          <div className="p-3 bg-orange-50 text-[#E8913A] rounded-2xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Pemasukan</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {formatRupiah(periodSummary.totalPemasukan)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Kas masuk warung</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Pengeluaran</span>
            <p className="text-xl sm:text-2xl font-black text-red-600 mt-1">
              {formatRupiah(periodSummary.totalPengeluaran)}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Biaya operasional & bahan</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Laba Bersih</span>
            <p className={`text-xl sm:text-2xl font-black mt-1 ${periodSummary.totalLaba >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatRupiah(periodSummary.totalLaba)}
            </p>
            <p className={`text-[11px] font-semibold mt-0.5 ${periodSummary.totalLaba >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {periodSummary.totalLaba >= 0 ? 'Surplus Keuntungan' : 'Defisit Kerugian'}
            </p>
          </div>
          <div className={`p-3 rounded-2xl ${periodSummary.totalLaba >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {periodSummary.totalLaba >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#4A2C0A]">
            Tren Finansial Harian (Pemasukan, Pengeluaran & Laba)
          </h3>
          <p className="text-xs text-gray-500">Grafik pergerakan kas Warung Bu Maya dalam rentang terpilih</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="pengeluaran" 
                name="Pengeluaran" 
                stroke="#EF4444" 
                strokeWidth={2.5} 
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="laba" 
                name="Laba / Rugi" 
                stroke="#E8913A" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Recap Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-amber-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#4A2C0A]">Rincian Buku Kas Harian</h3>
          <span className="text-xs text-gray-400">Total {dailyRecap.length} hari terdata</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FFF5E6] border-b border-amber-200/80 text-[#4A2C0A] font-bold">
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-center">Jml Pesanan</th>
                <th className="py-3.5 px-4">Pemasukan</th>
                <th className="py-3.5 px-4">Pengeluaran</th>
                <th className="py-3.5 px-4">Laba / Rugi</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {paginatedDaily.length > 0 ? (
                paginatedDaily.map((row) => {
                  const isProfit = row.laba >= 0;

                  return (
                    <tr key={row.tanggal} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#4A2C0A] whitespace-nowrap">
                        {formatTanggal(row.tanggal)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700 whitespace-nowrap">
                        {row.pesananCount} transaksi
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 whitespace-nowrap">
                        {formatRupiah(row.pemasukan)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-red-600 whitespace-nowrap">
                        {formatRupiah(row.pengeluaran)}
                      </td>
                      <td className={`py-3.5 px-4 font-black whitespace-nowrap ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatRupiah(row.laba)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                            isProfit
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          {isProfit ? '🟢 Untung' : '🔴 Rugi'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8">
                    <EmptyState
                      icon={FileSpreadsheet}
                      title="Tidak Ada Rekap Data"
                      description="Tidak ada data rekapan untuk rentang tanggal yang dipilih."
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
          totalItems={dailyRecap.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default RekapUsahaPage;
