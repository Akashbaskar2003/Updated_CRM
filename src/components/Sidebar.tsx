import React from 'react';
import { useCRMStore } from '../store/crmStore';
import {
  LayoutDashboard,
  UserCheck,
  BarChart3,
  DatabaseBackup,
  X,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'DIRECT_PLACEMENT', label: 'Direct Placement', icon: UserCheck },
  { key: 'REPORTS', label: 'Reports', icon: BarChart3 },
  { key: 'BACKUP', label: 'Backup', icon: DatabaseBackup },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentTheme, setTheme, currentUser, setUserRole } = useCRMStore();

  const handleNavClick = (tab: typeof NAV_ITEMS[number]['key']) => {
    setActiveTab(tab);
    // Auto-close on small screens after picking a page, keep it open on desktop
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // No backend auth exists in this demo — "logout" resets back to the
  // default Super Admin presenter identity, same as a fresh page load.
  const handleLogout = () => {
    const confirmed = window.confirm('Log out and return to the default demo identity?');
    if (confirmed) {
      setUserRole('SUPER_ADMIN', null);
      setActiveTab('DASHBOARD');
    }
  };

  return (
    <>
      {/* Mobile-only backdrop so tapping outside closes the drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel — floating glass shell */}
      <aside
        className={`fixed inset-y-3 left-3 z-40 flex w-64 flex-col rounded-2xl glass-shell text-text-primary transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 border-b border-border-primary px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-sm font-extrabold shadow-glow">
              UP
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold tracking-tight text-text-primary">
                UNIQ Pulse
              </p>
              <p className="text-[10px] text-text-muted">Placement Command Deck</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            title="Hide sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-glow shadow-glow-hover'
                    : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {label}
              </button>
            );
          })}

          <div className="my-3 border-t border-border-primary" />


          <button
            onClick={() => setTheme(currentTheme === 'sunny' ? 'command' : 'sunny')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-bg-hover hover:text-text-primary"
          >
            {currentTheme === 'sunny' ? (
              <Moon className="h-4.5 w-4.5 shrink-0" />
            ) : (
              <Sun className="h-4.5 w-4.5 shrink-0" />
            )}
            {currentTheme === 'sunny' ? 'Night Mode' : 'Day Mode'}
          </button>
        </nav>

        {/* Footer: current user + logout */}
        <div className="border-t border-border-primary px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-xs font-bold text-white shadow-glow"
              title={currentUser.role}
            >
              {getInitials(currentUser.full_name)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-text-primary">
                {currentUser.full_name}
              </p>
              <p className="truncate text-[10px] uppercase tracking-wide text-text-muted">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign Out
          </button>

          <p className="mt-2 px-2 text-[10px] text-text-muted">
            © 2026 UNIQ Pulse
          </p>
        </div>
      </aside>
    </>
  );
};
