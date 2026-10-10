import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, MdBusiness, MdPersonAdd, MdPeople, MdAccessTime, 
  MdViewKanban, MdTrendingUp, MdAssignment, MdAttachMoney, MdDescription,
  MdTimeline, MdEvent, MdSupportAgent, MdPieChart, MdSettings, 
  MdLogout, MdNotifications, MdMenu, MdSearch
} from 'react-icons/md';
import { useState } from 'react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: MdDashboard },
    { name: 'Organization', href: '/organization', icon: MdBusiness },
    { name: 'Recruitment', href: '/recruitment', icon: MdPersonAdd },
    { name: 'Employees', href: '/employees', icon: MdPeople },
    { name: 'Attendance & Leave', href: '/attendance', icon: MdAccessTime },
    { name: 'Projects & Tasks', href: '/projects', icon: MdViewKanban },
    { name: 'Sales & Leads', href: '/sales', icon: MdTrendingUp },
    { name: 'Daily Work Reports', href: '/work-reports', icon: MdAssignment },
    { name: 'Payroll & Expenses', href: '/payroll', icon: MdAttachMoney },
    { name: 'Documents', href: '/documents', icon: MdDescription },
    { name: 'Performance', href: '/performance', icon: MdTimeline },
    { name: 'Calendar & Notifications', href: '/calendar', icon: MdEvent },
    { name: 'Helpdesk', href: '/helpdesk', icon: MdSupportAgent },
    { name: 'Reports & Analytics', href: '/analytics', icon: MdPieChart },
    { name: 'Settings & Audit Logs', href: '/settings', icon: MdSettings },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col z-20 shadow-sm`}>
        <div className="h-16 flex items-center justify-center border-b border-[var(--color-border)] px-4 bg-white">
          {sidebarOpen ? (
            <div className="flex items-center">
              <img src="/logo.png" alt="AAYUP Technologies" className="h-8 w-auto mr-2" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <h2 className="font-black text-2xl text-[var(--color-brand-blue)] tracking-tight hidden">AAYUP</h2>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="AAYUP" className="h-8 w-8 object-cover object-left" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <h2 className="font-black text-2xl text-[var(--color-brand-blue)] tracking-tight hidden">A</h2>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-[var(--color-brand-blue)] text-white shadow-md' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-brand-light)] hover:text-[var(--color-brand-blue)]'}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-current'} />
                {sidebarOpen && <span className="ml-3 font-medium text-sm">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--color-border)]">
          <button 
            onClick={logout}
            className={`flex items-center w-full px-3 py-3 text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] rounded-xl transition-colors ${!sidebarOpen && 'justify-center'}`}
            title="Logout"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-light)] p-2 rounded-lg transition-colors mr-4">
              <MdMenu size={20} />
            </button>
            <div className="hidden md:flex items-center text-sm font-medium text-[var(--color-text-muted)]">
              <span className="hover:text-[var(--color-brand-blue)] cursor-pointer">AAYUP HRMS</span>
              <span className="mx-2">/</span>
              <span className="text-[var(--color-text-primary)] capitalize">
                {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).split('/')[0].replace('-', ' ')}
              </span>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input 
                type="text" 
                placeholder="Global search employees, projects, leads..." 
                className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)] text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-[var(--color-text-muted)] hover:text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-light)] rounded-lg transition-colors">
              <MdNotifications size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] rounded-full border-2 border-[var(--color-surface)]"></span>
            </button>
            
            <div className="flex items-center space-x-3 border-l border-[var(--color-border)] pl-4 cursor-pointer hover:bg-[var(--color-background)] p-1.5 rounded-xl transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-blue)] transition-colors">{user?.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{user?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[var(--color-brand-light)] border border-[var(--color-info-border)] flex items-center justify-center text-[var(--color-brand-blue)] font-bold shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--color-background)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
