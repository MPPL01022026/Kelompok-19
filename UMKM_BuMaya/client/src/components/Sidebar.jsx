import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileSpreadsheet, 
  UtensilsCrossed, 
  LogOut, 
  Coffee,
  ChevronLeft,
  ChevronRight,
  KeyRound
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ 
  currentTab, 
  setCurrentTab, 
  isMobileOpen, 
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  onOpenAccountModal
}) => {
  const { stokAlertCount } = useStore();
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pesanan', label: 'Pesanan', icon: Receipt },
    { 
      id: 'stok', 
      label: 'Stok Bahan', 
      icon: Package, 
      badge: stokAlertCount > 0 ? stokAlertCount : null,
      badgeColor: 'bg-red-500 text-white animate-pulse'
    },
    { id: 'pemasukan', label: 'Pemasukan', icon: ArrowDownLeft },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: ArrowUpRight },
    { id: 'rekap', label: 'Rekap Usaha', icon: FileSpreadsheet },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#FFF5E6] border-r border-[#E8913A]/20 transition-all duration-300 ease-in-out lg:static ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'w-64 lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8913A]/20 bg-white/70">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8913A] to-[#D57C26] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <h1 className="font-extrabold text-base text-[#4A2C0A] tracking-tight truncate">
                  Warung Bu Maya
                </h1>
                <p className="text-[11px] font-medium text-[#E8913A] tracking-wide truncate">
                  Ngopi • Makan • Santai
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#8C5A2B] hover:text-[#4A2C0A] hover:bg-[#FFF5E6] transition-colors"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                  isActive
                    ? 'bg-[#E8913A] text-white shadow-sm font-semibold'
                    : 'text-[#4A2C0A] hover:bg-white/80 hover:text-[#E8913A]'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#8C5A2B]'}`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.label}</span>
                )}

                {/* Badge alert */}
                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] font-bold rounded-full h-5 min-w-5 px-1 ml-auto ${
                      isActive ? 'bg-white text-[#E8913A]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Account Settings & Logout */}
        <div className="p-3 border-t border-[#E8913A]/20 bg-white/40 space-y-1">
          {/* Account Settings */}
          <button
            onClick={onOpenAccountModal}
            title={isCollapsed ? 'Ganti Username & Sandi' : undefined}
            className="w-full flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-[#8C5A2B] hover:text-[#4A2C0A] hover:bg-amber-100/60 transition-colors"
          >
            <KeyRound className="w-4 h-4 flex-shrink-0 text-[#E8913A]" />
            {!isCollapsed && (
              <span className="ml-3 truncate">Ganti Akun & Sandi</span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              if (window.confirm('Yakin ingin keluar dari sistem Warung Bu Maya?')) {
                logout();
                toast.success('Sampai jumpa Bu Maya!');
              }
            }}
            title={isCollapsed ? 'Logout' : undefined}
            className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 truncate">Keluar (Logout)</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
