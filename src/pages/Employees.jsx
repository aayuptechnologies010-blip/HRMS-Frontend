import { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdMoreVert, MdMailOutline, MdPhone, MdErrorOutline } from 'react-icons/md';
import api from '../services/api';
import Drawer from '../components/ui/Drawer';
import AddEmployeeForm from '../components/AddEmployeeForm';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = () => {
    setIsDrawerOpen(false);
    fetchEmployees(); // Refresh the list
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Employee Directory</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage team members and their roles</p>
        </div>
        <Button onClick={() => setIsDrawerOpen(true)} icon={MdAdd}>
          Add Employee
        </Button>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
          <input 
            type="text" 
            placeholder="Search employees by name, role, or department..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-brand-blue)] outline-none transition-all text-sm"
          />
        </div>
        <select className="px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]">
          <option value="">All Departments</option>
          <option value="development">Development</option>
          <option value="sales">Sales</option>
          <option value="hr">HR & Admin</option>
        </select>
      </div>

      {error && (
        <div className="bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] p-4 rounded-xl flex items-center">
          <MdErrorOutline size={20} className="mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-blue)]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div key={emp._id} className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center text-[var(--color-brand-blue)] font-bold text-lg">
                  {emp.firstName?.charAt(0)}
                </div>
                <button className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-blue)] p-1 rounded-lg hover:bg-[var(--color-brand-light)] transition-colors">
                  <MdMoreVert size={20} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{emp.firstName} {emp.lastName}</h3>
              <p className="text-sm font-medium text-[var(--color-brand-blue)] mb-1">{emp.designation}</p>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">{emp.departmentId?.name || 'No Department'}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-[var(--color-text-muted)]">
                  <MdMailOutline size={16} className="mr-2" />
                  {emp.email}
                </div>
                <div className="flex items-center text-xs text-[var(--color-text-muted)]">
                  <MdPhone size={16} className="mr-2" />
                  {emp.phone || 'N/A'}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                <StatusBadge status={emp.status} />
                <button className="text-xs font-semibold text-[var(--color-brand-blue)] hover:text-[var(--color-brand-dark)] transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
          
          {!loading && employees.length === 0 && !error && (
            <div className="col-span-full py-12 text-center text-[var(--color-text-muted)]">
              No employees found. Add your first employee to get started.
            </div>
          )}
        </div>
      )}

      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Add New Employee"
      >
        <AddEmployeeForm 
          onSuccess={handleEmployeeAdded} 
          onCancel={() => setIsDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}
