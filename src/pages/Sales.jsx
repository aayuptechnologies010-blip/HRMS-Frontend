import { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdFilterList, MdTrackChanges, MdTrendingUp, MdPeople, MdErrorOutline } from 'react-icons/md';
import api from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

export default function Sales() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads');
      setLeads(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads from backend.');
    } finally {
      setLoading(false);
    }
  };

  const activeLeadsCount = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length;
  const pipelineValue = leads
    .filter(l => l.stage !== 'Won' && l.stage !== 'Lost')
    .reduce((acc, l) => acc + (l.expectedValue || 0), 0);
  const wonLeadsCount = leads.filter(l => l.stage === 'Won').length;
  const winRate = leads.length > 0 ? Math.round((wonLeadsCount / leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Sales & Leads</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Track leads, pipeline, and follow-ups</p>
        </div>
        <button className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[var(--color-brand-dark)] transition-colors flex items-center">
          <MdAdd size={20} className="mr-2" />
          New Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] flex items-center">
          <div className="p-4 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-xl mr-4">
            <MdTrackChanges size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Pipeline Value</p>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)]">${pipelineValue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] flex items-center">
          <div className="p-4 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-xl mr-4">
            <MdTrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Win Rate</p>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)]">{winRate}%</h3>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] flex items-center">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl mr-4">
            <MdPeople size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">Active Leads</p>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)]">{activeLeadsCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)]">
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
            <input 
              type="text" 
              placeholder="Search clients or owners..." 
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-brand-blue)] outline-none transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-brand-light)] hover:text-[var(--color-brand-blue)] transition-colors text-sm font-medium">
            <MdFilterList size={20} className="mr-2" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          {error && (
            <div className="bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] p-4 m-4 rounded-xl flex items-center">
              <MdErrorOutline size={20} className="mr-2" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-blue)]"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Client / Lead</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{lead.client}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Source: {lead.source}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.stage} />
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--color-text-primary)] text-sm">
                      ${lead.expectedValue?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-[var(--color-text-primary)] font-medium">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-blue)] flex items-center justify-center text-xs mr-2 font-bold">
                          {lead.ownerId?.firstName?.charAt(0) || 'U'}
                        </div>
                        {lead.ownerId?.firstName} {lead.ownerId?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      <span className={lead.nextFollowUpDate && new Date(lead.nextFollowUpDate) < new Date() ? 'text-[var(--color-danger)] font-bold' : ''}>
                        {lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toLocaleDateString() : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && leads.length === 0 && !error && (
            <div className="py-12 text-center text-[var(--color-text-muted)]">
              No leads found. Add your first lead to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
