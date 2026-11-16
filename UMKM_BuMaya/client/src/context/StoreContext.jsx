import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { 
  initialMenu, 
  initialBahan, 
  initialPesanan, 
  initialPengeluaran, 
  initialPemasukanManual 
} from '../data/initialSeed';
import { toISODate } from '../utils/formatters';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_menu');
      return saved ? JSON.parse(saved) : initialMenu;
    } catch {
      return initialMenu;
    }
  });

  const [bahan, setBahan] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_bahan');
      return saved ? JSON.parse(saved) : initialBahan;
    } catch {
      return initialBahan;
    }
  });

  const [pesanan, setPesanan] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_pesanan');
      return saved ? JSON.parse(saved) : initialPesanan;
    } catch {
      return initialPesanan;
    }
  });

  const [pengeluaran, setPengeluaran] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_pengeluaran');
      return saved ? JSON.parse(saved) : initialPengeluaran;
    } catch {
      return initialPengeluaran;
    }
  });

  const [pemasukanManual, setPemasukanManual] = useState(() => {
    try {
      const saved = localStorage.getItem('family_kupi_pemasukan_manual');
      return saved ? JSON.parse(saved) : initialPemasukanManual;
    } catch {
      return initialPemasukanManual;
    }
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from Backend API
  const refreshFromBackend = useCallback(async () => {
    try {
      const [menuData, bahanData, pesananData, pengeluaranData, pemasukanData] = await Promise.all([
        api.menu.getAll().catch(() => null),
        api.bahan.getAll().catch(() => null),
        api.pesanan.getAll().catch(() => null),
        api.pengeluaran.getAll().catch(() => null),
        api.pemasukan.getAll().catch(() => null),
      ]);

      if (menuData && Array.isArray(menuData)) {
        setMenu(menuData);
        setIsBackendConnected(true);
      }
      if (bahanData && Array.isArray(bahanData)) {
        setBahan(bahanData);
      }
      if (pesananData && Array.isArray(pesananData)) {
        setPesanan(pesananData);
      }
      if (pengeluaranData && Array.isArray(pengeluaranData)) {
        setPengeluaran(pengeluaranData);
      }
      if (pemasukanData && Array.isArray(pemasukanData)) {
        // filter manual only
        const manualOnly = pemasukanData.filter((p) => !p.pesanan_id && p.sumber !== 'Penjualan');
        setPemasukanManual(manualOnly);
      }
    } catch (err) {
      console.warn('Could not connect to live backend, using local store:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem('family_kupi_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('family_kupi_bahan', JSON.stringify(bahan));
  }, [bahan]);

  useEffect(() => {
    localStorage.setItem('family_kupi_pesanan', JSON.stringify(pesanan));
  }, [pesanan]);

  useEffect(() => {
    localStorage.setItem('family_kupi_pengeluaran', JSON.stringify(pengeluaran));
  }, [pengeluaran]);

  useEffect(() => {
    localStorage.setItem('family_kupi_pemasukan_manual', JSON.stringify(pemasukanManual));
  }, [pemasukanManual]);

  // Combined Pemasukan (from Pesanan Selesai + Manual)
  const pemasukan = useMemo(() => {
    const listOtomatis = pesanan
      .filter((p) => p.status === 'Selesai')
      .map((p) => ({
        id: `penjualan-${p.id}`,
        tanggal: toISODate(p.created_at),
        sumber: 'Penjualan',
        keterangan: `Pesanan #${p.id} - ${p.nama_pelanggan || 'Pelanggan Walk-in'}`,
        jumlah: p.total_harga,
        pesanan_id: p.id,
        created_at: p.created_at,
        isAuto: true,
      }));

    const listManual = pemasukanManual.map((m) => ({
      ...m,
      isAuto: false,
    }));

    return [...listOtomatis, ...listManual].sort((a, b) => {
      const dateA = new Date(a.created_at || a.tanggal).getTime();
      const dateB = new Date(b.created_at || b.tanggal).getTime();
      return dateB - dateA;
    });
  }, [pesanan, pemasukanManual]);

  // Low stock counter
  const stokAlertCount = useMemo(() => {
    return bahan.filter((b) => Number(b.jumlah) <= Number(b.batas_minimum)).length;
  }, [bahan]);

  // CRUD Menu
  const addMenu = async (item) => {
    try {
      const saved = await api.menu.create(item);
      setMenu((prev) => [saved, ...prev]);
      return saved;
    } catch {
      const newId = menu.length > 0 ? Math.max(...menu.map((m) => m.id)) + 1 : 1;
      const newItem = {
        id: newId,
        ...item,
        harga: Number(item.harga),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setMenu((prev) => [newItem, ...prev]);
      return newItem;
    }
  };

  const updateMenu = async (id, updatedData) => {
    try {
      const updated = await api.menu.update(id, updatedData);
      setMenu((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch {
      setMenu((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, ...updatedData, harga: Number(updatedData.harga ?? m.harga), updated_at: new Date().toISOString() }
            : m
        )
      );
    }
  };

  const deleteMenu = async (id) => {
    try {
      await api.menu.delete(id);
    } catch (err) {
      console.warn('API deleteMenu failed, deleting locally:', err);
    }
    setMenu((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleMenuStatus = async (id) => {
    const item = menu.find((m) => m.id === id);
    if (!item) return;
    const newStatus = item.status === 'Tersedia' ? 'Habis' : 'Tersedia';
    await updateMenu(id, { status: newStatus });
  };

  // CRUD Bahan
  const addBahan = async (item) => {
    try {
      const saved = await api.bahan.create(item);
      setBahan((prev) => [saved, ...prev]);
      return saved;
    } catch {
      const newId = bahan.length > 0 ? Math.max(...bahan.map((b) => b.id)) + 1 : 1;
      const newItem = {
        id: newId,
        ...item,
        jumlah: Number(item.jumlah),
        batas_minimum: Number(item.batas_minimum),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setBahan((prev) => [newItem, ...prev]);
      return newItem;
    }
  };

  const updateBahan = async (id, updatedData) => {
    try {
      const updated = await api.bahan.update(id, updatedData);
      setBahan((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch {
      setBahan((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                ...updatedData,
                jumlah: Number(updatedData.jumlah ?? b.jumlah),
                batas_minimum: Number(updatedData.batas_minimum ?? b.batas_minimum),
                updated_at: new Date().toISOString(),
              }
            : b
        )
      );
    }
  };

  const adjustBahanStok = async (id, delta) => {
    const isAdding = delta > 0;
    const amount = Math.abs(delta);
    try {
      if (isAdding) {
        const res = await api.bahan.tambah(id, amount);
        if (res?.data) {
          setBahan((prev) => prev.map((b) => (b.id === id ? res.data : b)));
          return;
        }
      } else {
        const res = await api.bahan.kurangi(id, amount);
        if (res?.data) {
          setBahan((prev) => prev.map((b) => (b.id === id ? res.data : b)));
          return;
        }
      }
    } catch (err) {
      console.warn('API adjustBahanStok failed, adjusting locally:', err);
    }

    setBahan((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newQty = Math.max(0, Number((Number(b.jumlah) + Number(delta)).toFixed(2)));
          return {
            ...b,
            jumlah: newQty,
            updated_at: new Date().toISOString(),
          };
        }
        return b;
      })
    );
  };

  const deleteBahan = async (id) => {
    try {
      await api.bahan.delete(id);
    } catch (err) {
      console.warn('API deleteBahan failed, deleting locally:', err);
    }
    setBahan((prev) => prev.filter((b) => b.id !== id));
  };

  // CRUD Pesanan
  const addPesanan = async (orderData) => {
    try {
      const saved = await api.pesanan.create(orderData);
      setPesanan((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.warn('API addPesanan failed, adding locally:', err);
      const newId = pesanan.length > 0 ? Math.max(...pesanan.map((p) => p.id)) + 1 : 101;
      const newOrder = {
        id: newId,
        nama_pelanggan: orderData.nama_pelanggan?.trim() || 'Pelanggan Walk-in',
        total_harga: Number(orderData.total_harga),
        status: orderData.status || 'Diproses',
        items: orderData.items || [],
        created_at: new Date().toISOString(),
      };
      setPesanan((prev) => [newOrder, ...prev]);
      return newOrder;
    }
  };

  const updatePesananStatus = async (id, newStatus) => {
    try {
      const updated = await api.pesanan.update(id, { status: newStatus });
      setPesanan((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.warn('API updatePesananStatus failed, updating locally:', err);
      setPesanan((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    }
  };

  const deletePesanan = async (id) => {
    try {
      await api.pesanan.delete(id);
    } catch (err) {
      console.warn('API deletePesanan failed, deleting locally:', err);
    }
    setPesanan((prev) => prev.filter((p) => p.id !== id));
  };

  // CRUD Pemasukan Manual
  const addPemasukanManual = async (data) => {
    try {
      const saved = await api.pemasukan.create(data);
      setPemasukanManual((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.warn('API addPemasukanManual failed, adding locally:', err);
      const newId = pemasukanManual.length > 0 ? Math.max(...pemasukanManual.map((m) => m.id)) + 1 : 901;
      const newItem = {
        id: newId,
        tanggal: data.tanggal || toISODate(new Date()),
        sumber: 'Lainnya',
        keterangan: data.keterangan || 'Pemasukan Lainnya',
        jumlah: Number(data.jumlah),
        pesanan_id: null,
        created_at: new Date().toISOString(),
      };
      setPemasukanManual((prev) => [newItem, ...prev]);
      return newItem;
    }
  };

  const deletePemasukan = async (id) => {
    try {
      await api.pemasukan.delete(id);
    } catch (err) {
      console.warn('API deletePemasukan failed, deleting locally:', err);
    }
    setPemasukanManual((prev) => prev.filter((m) => m.id !== id && `penjualan-${m.id}` !== id));
  };

  // CRUD Pengeluaran
  const addPengeluaran = async (data) => {
    try {
      const saved = await api.pengeluaran.create(data);
      setPengeluaran((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.warn('API addPengeluaran failed, adding locally:', err);
      const newId = pengeluaran.length > 0 ? Math.max(...pengeluaran.map((p) => p.id)) + 1 : 1;
      const newItem = {
        id: newId,
        tanggal: data.tanggal || toISODate(new Date()),
        kategori: data.kategori || 'Bahan Baku',
        keterangan: data.keterangan || '',
        jumlah: Number(data.jumlah),
        created_at: new Date().toISOString(),
      };
      setPengeluaran((prev) => [newItem, ...prev]);
      return newItem;
    }
  };

  const updatePengeluaran = async (id, updatedData) => {
    try {
      const updated = await api.pengeluaran.update(id, updatedData);
      setPengeluaran((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.warn('API updatePengeluaran failed, updating locally:', err);
      setPengeluaran((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updatedData, jumlah: Number(updatedData.jumlah ?? p.jumlah) }
            : p
        )
      );
    }
  };

  const deletePengeluaran = async (id) => {
    try {
      await api.pengeluaran.delete(id);
    } catch (err) {
      console.warn('API deletePengeluaran failed, deleting locally:', err);
    }
    setPengeluaran((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        menu,
        bahan,
        pesanan,
        pengeluaran,
        pemasukanManual,
        pemasukan,
        stokAlertCount,
        isBackendConnected,
        isLoading,
        refreshFromBackend,
        // Methods
        addMenu,
        updateMenu,
        deleteMenu,
        toggleMenuStatus,
        addBahan,
        updateBahan,
        adjustBahanStok,
        deleteBahan,
        addPesanan,
        updatePesananStatus,
        deletePesanan,
        addPemasukanManual,
        deletePemasukan,
        addPengeluaran,
        updatePengeluaran,
        deletePengeluaran,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
