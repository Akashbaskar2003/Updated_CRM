import React, { useState, useEffect } from 'react';
import { useCRMStore } from './store/crmStore';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DevControlPanel } from './components/DevControlPanel';

import { Dashboard } from './components/Dashboard';
import { DirectPlacement } from './components/DirectPlacement';
import { Reports } from './components/Reports';
import { BackupCenter } from './components/BackupCenter';
import { PublicForms } from './components/PublicForms';
import { Eye, Shield, Globe } from 'lucide-react';

const App: React.FC = () => {
  const { activeTab, currentTheme } = useCRMStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'ADMIN' | 'PUBLIC'>('ADMIN');

  // Initialize theme classes on load
  useEffect(() => {
    // Set theme on html tag
    const htmlElement = document.documentElement;
    if (currentTheme === 'command') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const renderActiveView = () => {
    if (viewMode === 'PUBLIC') {
      return <PublicForms />;
    }

    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'DIRECT_PLACEMENT':
        return <DirectPlacement />;
      case 'REPORTS':
        return <Reports />;
      case 'BACKUP':
        return <BackupCenter />;
      default:
        return <Dashboard />;
    }
  };

  const sidebarShown = viewMode === 'ADMIN' && isSidebarOpen;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-all">

      {/* Left Sidebar Navigation (Admin only) */}
      {viewMode === 'ADMIN' && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Right Column: Banner + Topbar + Content — shifts right on desktop when sidebar is open */}
      <div
        className={`flex min-h-screen min-w-0 flex-col gap-3 p-3 pb-24 transition-[margin] duration-300 ease-in-out ${
          sidebarShown ? 'lg:ml-[17rem]' : 'lg:ml-0'
        }`}
      >

        {/* 1. Presentation Mode Quick Switcher Header Banner */}
        <div className="w-full rounded-2xl glass-shell text-text-primary py-2.5 px-5 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold gap-2">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-400 animate-pulse" />
            <span>Live Preview</span>
            <span className="text-text-muted font-normal">— switch interfaces to simulate the full candidate lifecycle.</span>
          </div>

          <div className="flex bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-border-primary">
            <button
              onClick={() => setViewMode('ADMIN')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all uppercase tracking-wider text-[10px] font-bold ${
                viewMode === 'ADMIN'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-glow shadow-glow-hover'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Shield className="h-3 w-3" />
              Admin Console
            </button>

            <button
              onClick={() => setViewMode('PUBLIC')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all uppercase tracking-wider text-[10px] font-bold ${
                viewMode === 'PUBLIC'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-glow shadow-glow-hover'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Globe className="h-3 w-3" />
              Student Portal
            </button>
          </div>
        </div>

        {/* 2. Admin Topbar */}
        {viewMode === 'ADMIN' && (
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* 3. Main Interface Viewport */}
        <main className="w-full max-w-7xl mx-auto">
          {renderActiveView()}
        </main>
      </div>



      {/* 5. Floating Dev Toggle Settings Widget */}
      <DevControlPanel />

    </div>
  );
};

export default App;
