import { useState, useEffect } from 'react';
import { MdInsertChartOutlined, MdPeople, MdTrendingUp, MdAttachMoney } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    leads: 0,
    openTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const [empRes, projRes, leadRes, ticketRes] = await Promise.all([
          api.get('/employees').catch(() => ({ data: { data: [] } })),
          api.get('/projects').catch(() => ({ data: { data: [] } })),
          api.get('/leads').catch(() => ({ data: { data: [] } })),
          api.get('/helpdesk').catch(() => ({ data: { data: [] } }))
        ]);

        const tickets = ticketRes.data.data;
        const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

        setStats({
          employees: empRes.data.data.length,
          projects: projRes.data.data.length,
          leads: leadRes.data.data.length,
          openTickets: openTickets
        });
      } catch (err) {
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return <div className="p-12 text-center">Generating analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Key metrics and operational insights</p>
        </div>
        <button 
          className="bg-white border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] px-4 py-2 rounded-xl shadow-sm transition-colors font-semibold flex items-center"
        >
          <MdInsertChartOutlined size={20} className="mr-2" />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <MdPeople size={24} className="text-[var(--color-brand-blue)]" />
            <span className="font-bold text-[var(--color-text-muted)]">Headcount</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)]">{stats.employees}</h2>
        </div>
        
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <MdTrendingUp size={24} className="text-[var(--color-success)]" />
            <span className="font-bold text-[var(--color-text-muted)]">Sales Leads</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)]">{stats.leads}</h2>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <MdInsertChartOutlined size={24} className="text-purple-500" />
            <span className="font-bold text-[var(--color-text-muted)]">Active Projects</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)]">{stats.projects}</h2>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <MdAttachMoney size={24} className="text-[var(--color-warning)]" />
            <span className="font-bold text-[var(--color-text-muted)]">Open Tickets</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)]">{stats.openTickets}</h2>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] p-12 rounded-2xl border border-[var(--color-border)] shadow-sm text-center">
        <MdInsertChartOutlined size={48} className="mx-auto text-[var(--color-text-muted)] opacity-50 mb-4" />
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Advanced Charting</h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Detailed graphs will be populated here once historical data is generated.</p>
      </div>
    </div>
  );
}
