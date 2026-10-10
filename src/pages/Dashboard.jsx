import React, { useState, useEffect } from 'react';
import { MdPeople, MdPersonOutline, MdViewKanban, MdTrendingUp, MdEvent, MdWarning, MdCake } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${colorClass}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-[var(--color-text-primary)]">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 text-[var(--color-text-primary)]`}>
        <Icon size={24} className="opacity-80" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    leads: 0,
    reports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [empRes, projRes, leadRes, reportRes] = await Promise.all([
          api.get('/employees').catch(() => ({ data: { data: [] } })),
          api.get('/projects').catch(() => ({ data: { data: [] } })),
          api.get('/leads').catch(() => ({ data: { data: [] } })),
          api.get('/work-reports').catch(() => ({ data: { data: [] } }))
        ]);

        setStats({
          employees: empRes.data.data.length,
          projects: projRes.data.data.length,
          leads: leadRes.data.data.length,
          reports: reportRes.data.data.slice(0, 5)
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Overview</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value={stats.employees} icon={MdPeople} colorClass="bg-[var(--color-brand-blue)]" />
        <StatCard title="Active Projects" value={stats.projects} icon={MdViewKanban} colorClass="bg-purple-500" />
        <StatCard title="Total CRM Leads" value={stats.leads} icon={MdTrendingUp} colorClass="bg-[var(--color-warning)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Recent Work Reports</h2>
          <div className="space-y-4">
            {stats.reports.map((report) => (
              <div key={report._id} className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-xl hover:bg-[var(--color-brand-light)] transition-colors border border-[var(--color-border)] group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-brand-blue)] transition-colors">
                    <MdViewKanban size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-blue)]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{report.summary.substring(0, 50)}{report.summary.length > 50 ? '...' : ''}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{report.employeeId?.firstName} {report.employeeId?.lastName} - {new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-lg text-xs font-bold">{report.status}</span>
              </div>
            ))}
            {stats.reports.length === 0 && (
              <p className="text-sm text-gray-500">No recent work reports found.</p>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Upcoming Reminders</h2>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl flex items-start text-left space-x-3">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div>
              <h4 className="font-semibold text-sm">Automations Pending</h4>
              <p className="text-xs mt-1">The notification scheduler (Phase 7) is under development. Live reminders will appear here soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
