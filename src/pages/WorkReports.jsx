import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const WorkReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState('');
  const [hoursWorked, setHoursWorked] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [feedbackMap, setFeedbackMap] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/work-reports');
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/work-reports', {
        date: new Date(),
        summary,
        hoursWorked
      });
      setSummary('');
      setHoursWorked(8);
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId) => {
    const managerFeedback = feedbackMap[reportId];
    if (!managerFeedback) return;

    try {
      await api.put(`/work-reports/${reportId}/review`, { managerFeedback });
      setFeedbackMap({ ...feedbackMap, [reportId]: '' });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Work Reports</h1>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Submit Form */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Submit Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hours Worked</label>
              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="24"
                step="0.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Summary of Work</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="What did you work on today?"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* History / Review List */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {report.employeeId?.firstName} {report.employeeId?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString()} &middot; {report.hoursWorked} hours
                  </p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  report.status === 'Reviewed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {report.summary}
              </div>

              {report.managerFeedback && (
                <div className="mt-2 text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-100">
                  <strong>Manager Feedback:</strong> {report.managerFeedback}
                </div>
              )}

              {report.status === 'Submitted' && user?.role !== 'Employee' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add feedback..."
                    value={feedbackMap[report._id] || ''}
                    onChange={(e) => setFeedbackMap({ ...feedbackMap, [report._id]: e.target.value })}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleReview(report._id)}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                  >
                    Mark Reviewed
                  </button>
                </div>
              )}
            </div>
          ))}

          {reports.length === 0 && (
            <p className="text-gray-500">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkReports;
