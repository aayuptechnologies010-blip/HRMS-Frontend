import { useState, useEffect } from 'react';
import { MdPayments, MdDownload, MdCheckCircle, MdAutorenew, MdOutlineReceiptLong } from 'react-icons/md';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Payroll() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('My Payslips');
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // For HR / Admin only
  const [payrollDrafts, setPayrollDrafts] = useState([]);
  
  useEffect(() => {
    if (activeTab === 'My Payslips') {
      fetchMyPayslips();
    }
  }, [activeTab]);

  const fetchMyPayslips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payroll/my-payslips');
      setPayslips(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load payslips');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      setLoading(true);
      const d = new Date();
      await api.post('/payroll/generate', { month: d.getMonth() + 1, year: d.getFullYear() });
      alert('Payroll Draft Generated!');
      // In a real app we would refresh the drafts list here
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Error generating payroll');
    } finally {
      setLoading(false);
    }
  };

  const isAdminOrHR = user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Accounts';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Payroll & Expenses</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage salary, payslips, and reimbursements</p>
        </div>
        {isAdminOrHR && (
          <button 
            onClick={handleGeneratePayroll}
            className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[var(--color-brand-dark)] transition-colors flex items-center"
          >
            <MdAutorenew size={20} className="mr-2" />
            Generate Payroll Draft
          </button>
        )}
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="border-b border-[var(--color-border)] p-4 flex gap-4">
          <button 
            onClick={() => setActiveTab('My Payslips')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'My Payslips' ? 'bg-[var(--color-brand-blue)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
          >
            My Payslips
          </button>
          {isAdminOrHR && (
            <button 
              onClick={() => setActiveTab('Payroll Runs')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Payroll Runs' ? 'bg-[var(--color-brand-blue)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
            >
              Company Payroll Runs
            </button>
          )}
          <button 
            onClick={() => setActiveTab('Expenses')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Expenses' ? 'bg-[var(--color-brand-blue)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
          >
            Expenses
          </button>
        </div>

        <div className="p-6">
          {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-blue)]"></div>
            </div>
          ) : activeTab === 'My Payslips' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payslips.length === 0 ? (
                <div className="col-span-full py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)]">
                  <MdOutlineReceiptLong size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No payslips found for your account.</p>
                </div>
              ) : (
                payslips.map(payslip => (
                  <div key={payslip._id} className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-light)] rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10 flex justify-between items-start mb-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-[var(--color-border)]">
                        <MdPayments size={24} className="text-[var(--color-brand-blue)]" />
                      </div>
                      <span className="bg-[var(--color-success-bg)] text-[var(--color-success)] text-xs font-bold px-2 py-1 rounded-md flex items-center">
                        <MdCheckCircle size={14} className="mr-1" /> Published
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-black text-[var(--color-text-primary)] mb-1">
                      {new Date(payslip.year, payslip.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">Gross: ₹{payslip.grossSalary.toLocaleString()}</p>
                    
                    <div className="flex items-end justify-between mt-6">
                      <div>
                        <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Net Pay</p>
                        <p className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">₹{payslip.netPay.toLocaleString()}</p>
                      </div>
                      <button className="bg-white border border-[var(--color-border)] hover:bg-[var(--color-background)] text-[var(--color-text-primary)] p-2 rounded-xl shadow-sm transition-colors" title="Download PDF">
                        <MdDownload size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'Expenses' ? (
            <div className="py-12 text-center text-[var(--color-text-muted)] bg-[var(--color-background)] rounded-xl border border-dashed border-[var(--color-border)]">
              <MdOutlineReceiptLong size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-4">Expense tracking module is active.</p>
              <button 
                className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[var(--color-brand-dark)] transition-colors"
                onClick={() => alert('Expense creation form would open here')}
              >
                Submit New Expense
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-[var(--color-text-muted)]">
              Payroll run management interface goes here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
