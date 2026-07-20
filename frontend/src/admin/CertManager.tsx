import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Edit2, FileText, X, Check } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';

interface Cert {
  _id: string;
  title: string;
  provider: string;
  image: string;
  iconName: string;
  fileType: string;
  filePath: string;
}

export const CertManager: React.FC = () => {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editProvider, setEditProvider] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certifications');
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching certifications:', err);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('provider', 'Unknown');

    try {
      await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'X-Admin-Key': ADMIN_KEY },
        body: formData,
      });
      fetchCerts();
    } catch (err) {
      console.error('Error uploading certificate:', err);
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (cert: Cert) => {
    setEditId(cert._id);
    setEditTitle(cert.title);
    setEditProvider(cert.provider);
  };

  const saveEdit = async () => {
    if (!editId) return;
    await fetch(`/api/admin/certifications/${editId}`, {
      method: 'PUT',
      headers: { 'X-Admin-Key': ADMIN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, provider: editProvider }),
    });
    setEditId(null);
    fetchCerts();
  };

  const deleteCert = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/certifications/${deleteId}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Key': ADMIN_KEY },
    });
    setDeleteId(null);
    fetchCerts();
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📜 Certifications</h1>
      </div>
      <div className="admin-content">
        {/* Upload Area */}
        <div className="admin-upload-area" onClick={() => fileRef.current?.click()}>
          <div className="admin-upload-icon"><Upload size={32} /></div>
          <p className="admin-upload-text">Click to upload a certificate</p>
          <p className="admin-upload-hint">Supports PNG, JPG, WebP, PDF (max 15MB)</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleUpload} />

        {/* Cert Grid */}
        <div className="admin-cert-grid">
          {certs.map(cert => (
            <div key={cert._id} className="admin-cert-card">
              <div className="admin-cert-thumb">
                {cert.fileType === 'pdf' ? (
                  <div className="admin-cert-pdf-icon">
                    <FileText size={40} />
                    <span>PDF Certificate</span>
                  </div>
                ) : (
                  <img src={cert.image} alt={cert.title} />
                )}
              </div>
              <div className="admin-cert-body">
                {editId === cert._id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input className="admin-form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
                    <input className="admin-form-input" value={editProvider} onChange={e => setEditProvider(e.target.value)} placeholder="Provider" />
                    <div className="admin-actions">
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveEdit}><Check size={14} /> Save</button>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditId(null)}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="admin-cert-title">{cert.title}</h4>
                    <p className="admin-cert-provider">{cert.provider}</p>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(cert)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(cert._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {certs.length === 0 && (
          <div className="admin-empty">
            <FileText size={48} />
            <p>No certifications uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Certificate?</h3>
            <p>This will remove the certificate permanently.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={deleteCert}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
