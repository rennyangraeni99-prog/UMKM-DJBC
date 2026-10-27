import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { UmkmMasterModule } from './components/umkm/UmkmMasterModule';
import { AsistensiModule } from './components/asistensi/AsistensiModule';
import { PelaporanKanwilModule } from './components/pelaporan/PelaporanKanwilModule';
import { UserManagementModule } from './components/rbac/UserManagementModule';
import { GoogleDriveModule } from './components/drive/GoogleDriveModule';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPortal } from './components/auth/LoginPortal';
import { SwitchUserModal } from './components/auth/SwitchUserModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex-1 min-w-0 bg-[#12163b] p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {activeTab === 'dashboard' && <ExecutiveDashboard />}
        {activeTab === 'umkm' && <UmkmMasterModule />}
        {activeTab === 'asistensi' && <AsistensiModule />}
        {activeTab === 'pelaporan' && <PelaporanKanwilModule />}
        {activeTab === 'drive' && <GoogleDriveModule />}
        {activeTab === 'rbac' && <UserManagementModule />}
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPortal />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#12163b] flex flex-col text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      <Navbar />
      <div className="flex flex-1 min-h-[calc(100vh-61px)]">
        <Sidebar />
        <MainContent />
      </div>
      <SwitchUserModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
