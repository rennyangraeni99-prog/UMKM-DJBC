import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  ArrowRight,
  Building2,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const { login } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[0].id);
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');

  // Form state
  const [customEmail, setCustomEmail] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleQuickLogin = (userId: string) => {
    login(userId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match by email or fallback to selected user
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === customEmail.trim().toLowerCase()
    );
    if (matched) {
      login(matched.id);
    } else {
      login(selectedUserId);
    }
  };

  const handleFillDemo = (user: typeof MOCK_USERS[0]) => {
    setSelectedUserId(user.id);
    setCustomEmail(user.email);
    setPassword('Customs@2026');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 border border-blue-500/30 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
              BC
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-400">
                Kementerian Keuangan RI · Ditjen Bea dan Cukai
              </span>
              <span className="block text-sm font-bold text-slate-100 tracking-tight">
                SIM-ASISTENSI EKSPOR UMKM
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/60 border border-slate-700/60 rounded-full text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Single Sign-On (SSO) Kemenkeu Satu Aktif</span>
          </div>
        </div>
      </header>

      {/* Center Main Login Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding, Mission & Scope Info */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 border border-blue-800/60 rounded-full text-xs text-blue-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Portal Akses Resmi DJBC</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Portal Masuk & Manajemen Hak Akses
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Penatausahaan dan pemantauan asistensi ekspor UMKM binaan Direktorat Jenderal Bea dan Cukai di seluruh Kantor Wilayah.
              </p>
            </div>

            {/* Highlights of roles */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-900/60 text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  SA
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Superadmin Pusat</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Akses penuh kelola Database UMKM Binaan DJBC, verifikasi laporan Kanwil, dan konfigurasi sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  OP
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Operator Kanwil / Satker</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Pencatatan data kegiatan asistensi ekspor dan pelaporan berkala di wilayah kerja masing-masing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-purple-950 text-purple-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  VW
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Viewer / Pimpinan Eksekutif</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Pemantauan Executive Dashboard, sebaran komoditas ekspor, dan unduh laporan kinerja.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7">
            {/* Tab switch between Quick SSO Selection & Form Login */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('quick')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    activeTab === 'quick'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pilihan Akun Cepat (SSO)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    activeTab === 'form'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Form Login NIP / Sandi
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                SIM-UMKM v2.4
              </span>
            </div>

            {/* TAB 1: Pilihan Akun Cepat (Quick SSO) */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pilih profil pengguna untuk langsung masuk:</span>
                  <span className="text-[11px] text-blue-400 font-medium">1-Click Login</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_USERS.map((user) => {
                    const isSelected = selectedUserId === user.id;
                    const roleBadgeColor =
                      user.role === 'superadmin'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : user.role === 'operator_kanwil'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20';

                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        onDoubleClick={() => handleQuickLogin(user.id)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-600 ring-2 ring-blue-600/30'
                            : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                            {user.avatarText}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${roleBadgeColor}`}>
                            {user.role === 'superadmin'
                              ? 'Superadmin'
                              : user.role === 'operator_kanwil'
                              ? 'Operator'
                              : 'Viewer'}
                          </span>
                        </div>

                        <h5 className="font-bold text-xs text-slate-100 truncate" title={user.name}>
                          {user.name.split(',')[0]}
                        </h5>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-1">
                          {user.kanwilAssignment || 'Kantor Pusat DJBC'}
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickLogin(user.id);
                          }}
                          className={`w-full mt-3 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                            isSelected
                              ? 'bg-blue-700 hover:bg-blue-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <span>Masuk Sebagai Ini</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tip: Anda juga dapat beralih profil (Switch User) kapan saja di dalam aplikasi.</span>
                </div>
              </div>
            )}

            {/* TAB 2: Form Login Tradisional */}
            {activeTab === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    NIP / Email Kedinasan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="nama.pegawai@kemenkeu.go.id / 19850101..."
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Kata Sandi Kemenkeu Satu *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi akun"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-600"
                    />
                    <span>Ingat sesi masuk pada perangkat ini</span>
                  </label>
                  <span className="text-[11px] text-blue-400 hover:underline cursor-pointer">
                    Bantuan Akun DJBC
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Autentikasi & Masuk</span>
                </button>

                {/* Quick Auto-fill buttons */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Isi cepat data akun simulasi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_USERS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleFillDemo(u)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-medium transition-colors"
                      >
                        {u.name.split(',')[0]} ({u.role === 'superadmin' ? 'Superadmin' : u.role === 'operator_kanwil' ? 'Operator' : 'Viewer'})
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-3.5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Direktorat Jenderal Bea dan Cukai · Kementerian Keuangan Republik Indonesia</span>
          <span className="text-[11px] text-slate-500">Sistem Informasi Manajemen Asistensi & Pembinaan Ekspor UMKM</span>
        </div>
      </footer>
    </div>
  );
};
