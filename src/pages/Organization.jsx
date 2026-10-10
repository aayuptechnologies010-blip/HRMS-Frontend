import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MdBusiness, MdPeople } from 'react-icons/md';

const Organization = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load departments');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading organization data...</div>;
  if (error) return <div className="p-6 text-red-500 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Organization Hierarchy</h1>
        <p className="text-gray-500 mt-2">View company departments and structural hierarchy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MdBusiness size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{dept.name}</h3>
                <p className="text-xs text-gray-500 font-medium">Department</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <MdPeople className="mr-2 text-gray-400" size={18} />
                <span>Head: <span className="font-semibold text-gray-900">{dept.head?.name || 'Unassigned'}</span></span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {dept.description || 'No description available for this department.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <MdBusiness className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No departments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new department.</p>
        </div>
      )}
    </div>
  );
};

export default Organization;
