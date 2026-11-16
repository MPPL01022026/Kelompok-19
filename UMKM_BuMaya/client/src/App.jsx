import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccountModal from './components/AccountModal';
import DashboardPage from './pages/DashboardPage';
import PesananPage from './pages/PesananPage';
import StokBahanPage from './pages/StokBahanPage';
import PemasukanPage from './pages/PemasukanPage';
import PengeluaranPage from './pages/PengeluaranPage';
import RekapUsahaPage from './pages/RekapUsahaPage';
import MenuPage from './pages/MenuPage';

const App = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // If not logged in, show login page
  if (!isAuthenticated) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#4A2C0A',
              color: '#FFF5E6',
              fontSize: '13px',
              borderRadius: '12px',
              border: '1px solid #E8913A',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <LoginPage />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFDF9]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#4A2C0A',
            color: '#FFF5E6',
            fontSize: '13px',
            borderRadius: '12px',
            border: '1px solid #E8913A',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header 
          setIsMobileOpen={setIsMobileOpen} 
          onOpenStokTab={() => setCurrentTab('stok')} 
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
            {currentTab === 'pesanan' && <PesananPage />}
            {currentTab === 'stok' && <StokBahanPage />}
            {currentTab === 'pemasukan' && <PemasukanPage />}
            {currentTab === 'pengeluaran' && <PengeluaranPage />}
            {currentTab === 'rekap' && <RekapUsahaPage />}
            {currentTab === 'menu' && <MenuPage />}
          </div>
        </main>
      </div>

      {/* Modal Ganti Username & Sandi */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default App;
