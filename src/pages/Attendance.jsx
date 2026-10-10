import { useState, useEffect } from 'react';
import { MdAccessTime, MdCalendarToday, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import Drawer from '../components/ui/Drawer';
import LeaveRequestForm from '../components/LeaveRequestForm';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLeaveDrawerOpen, setIsLeaveDrawerOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance/my');
      if (res.data.success) {
        setAttendanceRecords(res.data.data);
        
        // Determine check-in status
        const todayStr = new Date().toDateString();
        const todayRecord = res.data.data.find(r => new Date(r.date).toDateString() === todayStr);
        if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
          setIsCheckedIn(true);
        } else {
          setIsCheckedIn(false);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handlePunch = async () => {
    try {
      if (isCheckedIn) {
        const res = await api.post('/attendance/check-out');
        if (res.data.success) {
          toast.success('Successfully checked out');
          fetchAttendance();
        }
      } else {
        const res = await api.post('/attendance/check-in');
        if (res.data.success) {
          toast.success('Successfully checked in');
          fetchAttendance();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Action failed');
    }
  };

  const handleLeaveAdded = () => {
    setIsLeaveDrawerOpen(false);
    toast.success('Leave requested successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Attendance & Leave</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Track your daily hours and request time off</p>
        </div>
        <button 
          onClick={handlePunch}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center ${
            isCheckedIn 
              ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] hover:bg-red-100 border border-[var(--color-danger-border)]' 
              : 'bg-[var(--color-brand-blue)] text-white hover:bg-[var(--color-brand-dark)]'
          }`}
        >
          <MdAccessTime size={18} className="mr-2" />
          {isCheckedIn ? 'Check Out' : 'Check In Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)] col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Recent Punches</h2>
            <select className="px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-xs font-medium text-[var(--color-text-primary)] outline-none">
              <option>This Month</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
            ) : attendanceRecords.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No attendance records found.</p>
            ) : (
              attendanceRecords.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)]">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-success-bg)] text-[var(--color-success)]">
                       <MdCheckCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{new Date(record.date).toLocaleDateString()}</h4>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ' Ongoing'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {record.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '-'}
                    </span>
                    <p className="text-[10px] font-bold uppercase mt-0.5 text-[var(--color-success)]">
                      {record.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">Leave Balances</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-[var(--color-text-primary)]">Casual Leave (CL)</span>
                  <span className="font-bold text-[var(--color-info)]">8/12</span>
                </div>
                <div className="w-full bg-[var(--color-background)] rounded-full h-2 border border-[var(--color-border)]">
                  <div className="bg-[var(--color-info)] h-2 rounded-full" style={{ width: '66%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-[var(--color-text-primary)]">Sick Leave (SL)</span>
                  <span className="font-bold text-[var(--color-success)]">5/7</span>
                </div>
                <div className="w-full bg-[var(--color-background)] rounded-full h-2 border border-[var(--color-border)]">
                  <div className="bg-[var(--color-success)] h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsLeaveDrawerOpen(true)}
              className="w-full mt-6 bg-[var(--color-background)] hover:bg-[var(--color-brand-light)] text-[var(--color-text-primary)] hover:text-[var(--color-brand-blue)] font-semibold py-2.5 rounded-xl border border-[var(--color-border)] transition-colors flex justify-center items-center"
            >
              <MdCalendarToday size={16} className="mr-2" />
              Request Leave
            </button>
          </div>
        </div>
      </div>

      <Drawer 
        isOpen={isLeaveDrawerOpen} 
        onClose={() => setIsLeaveDrawerOpen(false)} 
        title="Request Time Off"
      >
        <LeaveRequestForm 
          onSuccess={handleLeaveAdded} 
          onCancel={() => setIsLeaveDrawerOpen(false)} 
        />
      </Drawer>
    </div>
  );
}
