import { useState, useEffect } from 'react';
import { MdAdminPanelSettings, MdSecurity, MdHistory } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'Super Admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/audit-logs');
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Settings & Audit Logs</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Super Admin system configuration and forensic logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
              <MdAdminPanelSettings className="mr-2 text-[var(--color-brand-blue)]" size={24}/> 
              Global Config
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">Enforce 2FA</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Require 2FA for all roles</p>
                </div>
                <div className="w-10 h-5 bg-[var(--color-success)] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">Maintenance Mode</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Block non-admin logins</p>
                </div>
                <div className="w-10 h-5 bg-[var(--color-border)] rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-background)]">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center">
                <MdSecurity className="mr-2 text-[var(--color-danger)]" size={20}/> 
                Security Audit Trail
              </h2>
              <button onClick={fetchAuditLogs} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-blue)]">
                <MdHistory size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="p-8 text-center text-[var(--color-text-muted)] font-medium">Loading forensic logs...</div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-[var(--color-text-muted)] font-medium">No audit logs recorded yet.</div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
                    <tr>
                      <th className="py-3 px-4 font-bold text-[var(--color-text-muted)] uppercase text-xs">Timestamp</th>
                      <th className="py-3 px-4 font-bold text-[var(--color-text-muted)] uppercase text-xs">User</th>
                      <th className="py-3 px-4 font-bold text-[var(--color-text-muted)] uppercase text-xs">Action</th>
                      <th className="py-3 px-4 font-bold text-[var(--color-text-muted)] uppercase text-xs">Resource</th>
                      <th className="py-3 px-4 font-bold text-[var(--color-text-muted)] uppercase text-xs">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {logs.map(log => (
                      <tr key={log._id} className="hover:bg-[var(--color-background)] transition-colors">
                        <td className="py-3 px-4 text-[var(--color-text-muted)] whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-medium text-[var(--color-text-primary)]">
                          {log.userId?.name || log.userId?.email || 'System'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            log.action === 'DELETE' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' : 
                            log.action === 'POST' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 
                            'bg-[var(--color-info-bg)] text-[var(--color-info)]'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-text-primary)] font-mono text-xs">{log.resource}</td>
                        <td className="py-3 px-4 text-[var(--color-text-muted)] text-xs">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
