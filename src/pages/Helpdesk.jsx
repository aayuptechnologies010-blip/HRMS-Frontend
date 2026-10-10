import { useState, useEffect } from 'react';
import { MdAdd, MdSupportAgent, MdCheckCircle, MdPendingActions } from 'react-icons/md';
import Drawer from '../components/ui/Drawer';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Helpdesk() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'IT Support',
    isConfidential: false
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/helpdesk');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch helpdesk tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/helpdesk', formData);
      if (res.data.success) {
        toast.success('Ticket raised successfully');
        setIsDrawerOpen(false);
        setFormData({ subject: '', description: '', category: 'IT Support', isConfidential: false });
        fetchTickets();
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to raise ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Helpdesk</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Raise and track your support tickets or complaints</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[var(--color-brand-blue)] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[var(--color-brand-dark)] transition-all flex items-center"
        >
          <MdAdd size={18} className="mr-2" />
          Raise Ticket
        </button>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
              <MdSupportAgent size={32} className="text-[var(--color-brand-blue)] opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No Tickets Found</h3>
            <p className="text-sm text-[var(--color-text-muted)]">You haven't raised any support tickets yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <th className="py-3 px-6 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Ticket ID</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Subject</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Category</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-[var(--color-background)] transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-[var(--color-text-primary)]">
                      {t._id.substring(t._id.length - 6).toUpperCase()}
                      {t.isConfidential && <span className="ml-2 text-xs text-[var(--color-danger)] font-bold">(Confidential)</span>}
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-primary)]">{t.subject}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-[var(--color-brand-light)] text-[var(--color-brand-blue)] text-xs font-bold rounded-full">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5">
                        {t.status === 'Resolved' || t.status === 'Closed' ? (
                          <MdCheckCircle className="text-[var(--color-success)]" size={16} />
                        ) : (
                          <MdPendingActions className="text-[var(--color-warning)]" size={16} />
                        )}
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{t.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--color-text-muted)]">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Raise New Ticket"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex flex-col h-full">
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-1">Subject</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors"
                placeholder="Brief summary of the issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-1">Category</label>
              <select 
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="IT Support">IT Support</option>
                <option value="HR/Confidential">HR / Confidential</option>
                <option value="Payroll Issue">Payroll Issue</option>
                <option value="General">General Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-1">Description</label>
              <textarea 
                required
                rows={5}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors resize-none"
                placeholder="Please describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-[var(--color-warning-bg)] border border-[var(--color-warning)] border-opacity-30 rounded-xl">
              <input 
                type="checkbox" 
                id="confidential"
                checked={formData.isConfidential}
                onChange={(e) => setFormData({...formData, isConfidential: e.target.checked})}
                className="w-4 h-4 text-[var(--color-brand-blue)] rounded focus:ring-[var(--color-brand-blue)]"
              />
              <label htmlFor="confidential" className="text-sm font-medium text-[var(--color-text-primary)]">
                Mark as Confidential <span className="text-xs text-[var(--color-text-muted)] block">Only HR and Admins will be able to view this.</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex space-x-3 mt-auto">
            <button 
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 px-4 py-2 bg-[var(--color-background)] text-[var(--color-text-primary)] font-bold rounded-xl border border-[var(--color-border)] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-[var(--color-brand-blue)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-dark)] transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
