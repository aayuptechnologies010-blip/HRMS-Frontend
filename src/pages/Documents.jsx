import { useState, useEffect, useRef } from 'react';
import { MdInsertDriveFile, MdCloudUpload, MdDownload, MdDelete, MdMoreVert, MdFolder } from 'react-icons/md';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Resumes');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/documents');
      setDocuments(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file');
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('category', uploadCategory);
      formData.append('file', selectedFile);

      // If HR/Admin, they could optionally append an employeeId here.
      // For MVP, we upload it to their own profile / company docs.

      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadTitle('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      alert('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await api.get(`/documents/${docId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error', err);
      alert('Failed to download document. You may not be authorized.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Documents</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage private employee records and company policies</p>
        </div>
      </div>

      {error && <div className="text-red-500 font-bold">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 h-fit">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
            <MdCloudUpload className="mr-2 text-[var(--color-brand-blue)]" />
            Upload Document
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-muted)] mb-1">Document Title</label>
              <input 
                type="text" 
                required
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
                placeholder="e.g. Identity Proof"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-muted)] mb-1">Category</label>
              <select 
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]"
              >
                <option value="Resumes">Resumes</option>
                <option value="Identity">Identity</option>
                <option value="Employment">Employment</option>
                <option value="Policies">Company Policy</option>
                <option value="Certificates">Certificates</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-muted)] mb-1">Select File (PDF, JPG, PNG)</label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                required
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-brand-light)] file:text-[var(--color-brand-blue)] hover:file:bg-[var(--color-brand-blue)] hover:file:text-white transition-all cursor-pointer"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !selectedFile}
              className="w-full bg-[var(--color-brand-blue)] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[var(--color-brand-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Secure Upload'}
            </button>
          </form>
        </div>

        {/* Document Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-brand-blue)]"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-12 text-center text-[var(--color-text-muted)] flex flex-col items-center">
               <MdFolder size={48} className="mb-4 opacity-50" />
               <p className="font-bold">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map(doc => (
                <div key={doc._id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-start space-x-4 hover:shadow-md transition-shadow group">
                  <div className="p-3 bg-[var(--color-background)] rounded-xl text-[var(--color-brand-blue)] shrink-0">
                    <MdInsertDriveFile size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--color-text-primary)] truncate" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] mt-1">{doc.category}</p>
                    <p className="text-xs text-slate-400 mt-1 truncate">{(doc.sizeBytes / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDownload(doc._id, doc.fileName)}
                      className="p-2 hover:bg-[var(--color-background)] rounded-lg text-[var(--color-text-primary)] transition-colors" title="Download"
                    >
                      <MdDownload size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
