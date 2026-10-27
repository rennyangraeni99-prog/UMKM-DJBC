import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ChevronDown, Check, RefreshCw, Printer, Search, Building2, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUser,
    usersList,
    activeTab,
    setActiveTab,
    resetDemoData,
    logout,
    setIsSwitchUserModalOpen
  } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-[#1e255a] border-b border-[#2b3577] text-white shadow-md">
      <div className="flex items-center justify-between gap-4 px-5 py-3 max-w-[1600px] mx-auto">
        {/* Zone 1: Brand Wordmark (WEBLOGO in mockup -> DJBC UMKM with Gold Bea Cukai Badge) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm tracking-wider shadow-md ring-2 ring-amber-300/30">
            BC
          </div>
          <div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-base font-black tracking-wider text-white whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
            >
              <span>DJBC</span>
              <span className="text-amber-400">UMKM</span>
            </button>
            <div className="text-[10px] text-blue-200 tracking-wide font-medium hidden sm:block">
              Kementerian Keuangan RI
            </div>
          </div>
        </div>

        {/* Zone 2: Horizontal Navigation Links (HOME, ABOUT, ROAD MAP in mockup) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-blue-100">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('umkm')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'umkm'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            Database UMKM
          </button>
          <button
            onClick={() => setActiveTab('asistensi')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'asistensi'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            Asistensi UMKM
          </button>
          <button
            onClick={() => setActiveTab('pelaporan')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'pelaporan'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            Kepatuhan Kanwil
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            <span>Google Drive</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              activeTab === 'rbac'
                ? 'text-amber-400 border-amber-400 font-bold drop-shadow-sm'
                : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300'
            }`}
          >
            Hak Akses RBAC
          </button>
        </nav>

        {/* Zone 3: Search bar & User Profile (Right side of mockup) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Pill Search Input like in reference mockup */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari UMKM, komoditas..."
              className="bg-[#12173d] text-white placeholder-blue-300 text-xs rounded-full pl-3.5 pr-8 py-1.5 w-44 lg:w-56 border border-[#2d3882] focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-blue-300 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Quick Switch User Trigger */}
          <button
            onClick={() => setIsSwitchUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full transition-all shadow-md active:scale-95 shrink-0"
            title="Buka panel Switch User"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch User</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#151b47] hover:bg-[#202966] border border-[#2f3984] rounded-full transition-colors whitespace-nowrap shrink-0 shadow-inner"
              aria-expanded={isDropdownOpen}
            >
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
                {currentUser.avatarText}
              </span>
              <div className="text-left hidden xl:block">
                <span className="block font-bold text-white truncate max-w-[130px] text-xs">
                  {currentUser.name.split(',')[0]}
                </span>
                <span className="block text-[10px] text-amber-300 truncate max-w-[130px]">
                  {currentUser.role === 'superadmin' ? 'Superadmin Pusat' : currentUser.role === 'operator_kanwil' ? 'Operator Kanwil' : 'Viewer Pimpinan'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-1 text-[11px] font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-full inline-block">
                      {currentUser.roleTitle}
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1">
                      Pilihan Akun Cepat:
                    </p>
                    {usersList.map((user) => {
                      const isActive = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                            isActive ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5 ${
                            isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {user.avatarText}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{user.name.split(',')[0]}</span>
                              {isActive && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 ml-1" />}
                            </div>
                            <span className="block text-[10px] text-slate-400 font-normal truncate">
                              {user.roleTitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 px-3 pt-2 pb-1 space-y-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsSwitchUserModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-50 rounded-xl transition-colors font-semibold"
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      Kelola Hak Akses Lengkap...
                    </button>

                    <button
                      onClick={() => {
                        resetDemoData();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      Reset Data Simulasi
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      Keluar (Logout Portal)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
