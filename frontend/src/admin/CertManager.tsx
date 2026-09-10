import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Edit2, FileText, X, Check, Award, Eye } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';

interface Cert {
  _id: string;
  title: string;
  provider: string;
  image: string;
  fileType?: string;
}

export const CertManager: React.FC = () => {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [isManual, setIsManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualProvider, setManualProvider] = useState('');
  const [manualPath, setManualPath] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editProvider, setEditProvider] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<Cert | null>(null);
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualPath) return;

    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 
          'X-Admin-Key': ADMIN_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: manualTitle,
          provider: manualProvider || 'Unknown',
          image: manualPath
        }),
      });
      if (res.ok) {
        setManualTitle('');
        setManualProvider('');
        setManualPath('');
        setIsManual(false);
        fetchCerts();
      }
    } catch (err) {
      console.error('Error adding manual certificate:', err);
    }
  };

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
        <h1 className="admin-topbar-title">
          <Award size={22} color="#6366f1" /> Certifications
        </h1>
        <button 
          className="admin-btn admin-btn-secondary" 
          onClick={() => setIsManual(!isManual)}
        >
          {isManual ? 'Upload File' : 'Enter Path Manually'}
        </button>
      </div>

      <div className="admin-content">
        {isManual ? (
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 32 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 16 }}>Add Certificate Manually</h3>
            <form onSubmit={handleManualSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Certificate Title *</label>
                <input className="admin-form-input" value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="e.g. Artificial Intelligence Essentials" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Provider</label>
                <input className="admin-form-input" value={manualProvider} onChange={e => setManualProvider(e.target.value)} placeholder="e.g. University of Pennsylvania / Coursera" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Image or PDF Path * (e.g. /Images/my-cert.png)</label>
                <input className="admin-form-input" value={manualPath} onChange={e => setManualPath(e.target.value)} placeholder="/Images/my-cert.png" required />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary"><Check size={16} /> Add Certificate</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsManual(false)}><X size={16} /> Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="admin-upload-area" onClick={() => fileRef.current?.click()} style={{ marginBottom: 28 }}>
              <div className="admin-upload-icon"><Upload size={32} /></div>
              <p className="admin-upload-text">Click to upload a certificate</p>
              <p className="admin-upload-hint">Supports PNG, JPG, WebP, PDF (max 15MB)</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleUpload} />
          </>
        )}

        {/* Cert Grid */}
        <div className="admin-cert-grid">
          {certs.map(cert => (
            <div key={cert._id} className="admin-cert-card">
              <div className="admin-cert-thumb" onClick={() => setPreviewCert(cert)}>
                {cert.fileType === 'pdf' ? (
                  <div className="admin-cert-pdf-icon">
                    <FileText size={40} color="#818cf8" />
                    <span>PDF Certificate</span>
                  </div>
                ) : (
                  <img src={cert.image} alt={cert.title} />
                )}
                <div className="admin-cert-overlay">
                  <Eye size={20} color="#ffffff" />
                  <span>Preview</span>
                </div>
              </div>

              <div className="admin-cert-body">
                {editId === cert._id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input className="admin-form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
                    <input className="admin-form-input" value={editProvider} onChange={e => setEditProvider(e.target.value)} placeholder="Provider" />
                    <div className="admin-actions" style={{ marginTop: 4 }}>
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveEdit}><Check size={14} /> Save</button>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditId(null)}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="admin-cert-title">{cert.title}</h4>
                    <p className="admin-cert-provider">{cert.provider}</p>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit Details" onClick={() => startEdit(cert)}>
                        <Edit2 size={15} />
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(cert._id)}>
                        <Trash2 size={15} />
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
            <Award size={48} />
            <p>No certifications uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Full Image Preview Modal */}
      {previewCert && (
        <div className="admin-modal-overlay" onClick={() => setPreviewCert(null)}>
          <div className="admin-modal" style={{ maxWidth: 800, padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{previewCert.title}</h3>
              <button className="admin-btn-icon" onClick={() => setPreviewCert(null)}><X size={18} /></button>
            </div>
            <div style={{ background: '#0a0c10', borderRadius: 8, overflow: 'hidden', textAlign: 'center', maxHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={previewCert.image} alt={previewCert.title} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Certificate?</h3>
            <p>This will remove the certificate permanently from your portfolio website.</p>
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
