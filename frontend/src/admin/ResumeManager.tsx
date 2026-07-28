import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, FileDown, ExternalLink, Star, FileText } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';

interface ResumeItem {
  _id: string;
  version: string;
  filePath: string;
  fileName: string;
  isActive: boolean;
  createdAt: string;
}

export const ResumeManager: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [version, setVersion] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [manualPath, setManualPath] = useState('');

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resume/admin/all', { headers: { 'X-Admin-Key': ADMIN_KEY } });
      const data = await res.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleManualSubmit = async () => {
    if (!version || !manualPath) return;

    try {
      await fetch('/api/resume/admin/upload', {
        method: 'POST',
        headers: { 
          'X-Admin-Key': ADMIN_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version,
          filePath: manualPath,
          fileName: manualPath.split('/').pop() || 'resume.pdf'
        }),
      });
      setVersion('');
      setManualPath('');
      fetchResumes();
    } catch (err) {
      console.error('Error adding manual resume:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('version', version || `v${new Date().toISOString().slice(0, 10)}`);

    try {
      await fetch('/api/resume/admin/upload', {
        method: 'POST',
        headers: { 'X-Admin-Key': ADMIN_KEY },
        body: formData,
      });
      setVersion('');
      fetchResumes();
    } catch (err) {
      console.error('Error uploading resume:', err);
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const activate = async (id: string) => {
    await fetch(`/api/resume/admin/${id}/activate`, {
      method: 'PUT',
      headers: { 'X-Admin-Key': ADMIN_KEY },
    });
    fetchResumes();
  };

  const deleteResume = async () => {
    if (!deleteId) return;
    await fetch(`/api/resume/admin/${deleteId}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Key': ADMIN_KEY },
    });
    setDeleteId(null);
    fetchResumes();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📂 Resume Manager</h1>
      </div>
      <div className="admin-content">
        {/* Upload */}
        <div className="admin-form" style={{ marginBottom: 32 }}>
          <div className="admin-form-row" style={{ alignItems: 'flex-end' }}>
            <div className="admin-form-group" style={{ flex: 2 }}>
              <label className="admin-form-label">Version Label</label>
              <input className="admin-form-input" value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. v2.1 — July 2026" />
            </div>
            <div className="admin-form-group" style={{ flex: 3 }}>
              <label className="admin-form-label">Manual File Path (e.g., /Images/my-resume.pdf)</label>
              <input className="admin-form-input" value={manualPath} onChange={e => setManualPath(e.target.value)} placeholder="/Images/my-resume.pdf (or leave blank to upload file)" />
            </div>
            <div className="admin-form-group" style={{ flex: 1, paddingBottom: 4, display: 'flex', justifyContent: 'flex-end' }}>
              {manualPath ? (
                <button className="admin-btn admin-btn-primary" onClick={handleManualSubmit}>
                  <Upload size={16} /> Save Path
                </button>
              ) : (
                <button className="admin-btn admin-btn-primary" onClick={() => fileRef.current?.click()}>
                  <Upload size={16} /> Upload PDF
                </button>
              )}
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleUpload} />
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="admin-resume-list">
          {resumes.map(r => (
            <div key={r._id} className={`admin-resume-item ${r.isActive ? 'is-active' : ''}`}>
              <div className="admin-resume-info">
                <div className="admin-resume-icon">
                  <FileText size={22} />
                </div>
                <div className="admin-resume-details">
                  <h4>{r.version} {r.isActive && <span className="admin-badge active">Active</span>}</h4>
                  <p>{r.fileName} • {formatDate(r.createdAt)}</p>
                </div>
              </div>
              <div className="admin-actions">
                <a href={r.filePath} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" title="Preview">
                  <ExternalLink size={16} />
                </a>
                <a href={r.filePath} download className="admin-btn-icon" title="Download">
                  <FileDown size={16} />
                </a>
                {!r.isActive && (
                  <button className="admin-btn-icon" title="Set as Active" onClick={() => activate(r._id)}>
                    <Star size={16} />
                  </button>
                )}
                <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(r._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="admin-empty">
            <FileText size={48} />
            <p>No resume versions uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Resume?</h3>
            <p>This will permanently remove this resume version.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={deleteResume}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
