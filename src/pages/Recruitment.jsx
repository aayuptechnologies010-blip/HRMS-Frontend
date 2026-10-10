import { useState, useEffect } from 'react';
import { MdWork, MdPersonAdd, MdMoreHoriz, MdEvent } from 'react-icons/md';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Recruitment() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Candidates');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'Jobs') {
        const res = await api.get('/recruitment/jobs');
        setJobs(res.data.data);
      } else {
        const res = await api.get('/recruitment/candidates');
        setCandidates(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load recruitment data');
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/recruitment/candidates/${id}/status`, { status: newStatus });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to update candidate status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'bg-slate-100 text-slate-600';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700';
      case 'Interviewing': return 'bg-purple-100 text-purple-700';
      case 'Selected': return 'bg-[var(--color-success-bg)] text-[var(--color-success)]';
      case 'Offer Sent': return 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]';
      case 'Offer Accepted': return 'bg-[var(--color-info-bg)] text-[var(--color-info)]';
      case 'Joined': return 'bg-[var(--color-brand-light)] text-[var(--color-brand-blue)]';
      case 'Rejected': return 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const isAdminOrHR = user?.role === 'Super Admin' || user?.role === 'HR Manager';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Recruitment</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage job openings and candidate pipeline</p>
        </div>
        {isAdminOrHR && (
          <div className="flex space-x-3">
            <button className="bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-[var(--color-background)] transition-colors flex items-center">
              <MdWork size={20} className="mr-2 text-[var(--color-brand-blue)]" />
              Post Job
            </button>
            <button className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[var(--color-brand-dark)] transition-colors flex items-center">
              <MdPersonAdd size={20} className="mr-2" />
              Add Candidate
            </button>
          </div>
        )}
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="border-b border-[var(--color-border)] p-4 flex gap-4">
          <button 
            onClick={() => setActiveTab('Candidates')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Candidates' ? 'bg-[var(--color-brand-blue)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
          >
            Candidates Pipeline
          </button>
          <button 
            onClick={() => setActiveTab('Jobs')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'Jobs' ? 'bg-[var(--color-brand-blue)] text-white shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)]'}`}
          >
            Job Openings
          </button>
        </div>

        <div className="p-0 overflow-x-auto">
          {error && <div className="p-4 text-red-500 font-bold">{error}</div>}
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-blue)]"></div>
            </div>
          ) : activeTab === 'Candidates' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)]">
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Applied For</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[var(--color-text-muted)] font-medium">No candidates found in the pipeline.</td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate._id} className="hover:bg-[var(--color-background)] transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{candidate.firstName} {candidate.lastName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]">{candidate.jobId?.title || 'Unknown Job'}</td>
                      <td className="px-6 py-4">
                        <select 
                          className={`text-xs font-bold py-1 px-3 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-brand-blue)] ${getStatusColor(candidate.status)}`}
                          value={candidate.status}
                          onChange={(e) => updateCandidateStatus(candidate._id, e.target.value)}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Selected">Selected</option>
                          <option value="Offer Sent">Offer Sent</option>
                          <option value="Offer Accepted">Offer Accepted</option>
                          <option value="Joined">Joined</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--color-text-primary)]">{candidate.email}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">{candidate.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--color-text-muted)]">
                        <button className="hover:text-[var(--color-text-primary)] p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors mr-1" title="Schedule Interview">
                          <MdEvent size={20} />
                        </button>
                        <button className="hover:text-[var(--color-text-primary)] p-2 rounded-lg hover:bg-[var(--color-background)] transition-colors">
                          <MdMoreHoriz size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {jobs.length === 0 ? (
                <div className="col-span-full py-8 text-center text-[var(--color-text-muted)] font-medium">No job openings found.</div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-brand-blue)] transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                        ${job.status === 'Open' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-slate-200 text-slate-600'}
                      `}>
                        {job.status}
                      </span>
                      <MdMoreHoriz className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer" />
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-1">{job.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">{job.departmentId?.name || 'General'}</p>
                    
                    <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center text-sm text-[var(--color-text-muted)]">
                      <span>{job.positions} Position(s)</span>
                      <span>Due: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
