import React, { useEffect, useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, Upload, ExternalLink, Paperclip } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const authHeaders: Record<string, string> = { 'X-Admin-Key': ADMIN_KEY };

interface ExperienceItem {
  _id: string;
  startDate: string;
  endDate: string | null;
  role: string;
  company: string;
  description: string;
  certificatePath: string;
  certificateName: string;
}

const toInputDate = (iso: string | null | undefined) => {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
};

const formatDisplayDate = (iso: string | null | undefined) => {
  if (!iso) return 'Present';
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

export const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPresent, setIsPresent] = useState(false);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [existingCertPath, setExistingCertPath] = useState('');
  const [existingCertName, setExistingCertName] = useState('');
  const [deleteCert, setDeleteCert] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewCert, setViewCert] = useState<ExperienceItem | null>(null);
  const certFileRef = useRef<HTMLInputElement>(null);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience/admin/all', { headers: authHeaders });
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching experiences:', err);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const openNewForm = () => {
    setEditingId(null);
    setStartDate('');
    setEndDate('');
    setIsPresent(false);
    setRole('');
    setCompany('');
    setDescription('');
    setCertFile(null);
    setExistingCertPath('');
    setExistingCertName('');
    setDeleteCert(false);
    setIsFormOpen(true);
  };

  const startEdit = (exp: ExperienceItem) => {
    setEditingId(exp._id);
    setStartDate(toInputDate(exp.startDate));
    setEndDate(exp.endDate ? toInputDate(exp.endDate) : '');
    setIsPresent(!exp.endDate);
    setRole(exp.role);
    setCompany(exp.company);
    setDescription(exp.description);
    setCertFile(null);
    setExistingCertPath(exp.certificatePath || '');
    setExistingCertName(exp.certificateName || '');
    setDeleteCert(false);
    setIsFormOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !role || !company || !description) return;

    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', isPresent ? '' : endDate);
    formData.append('role', role);
    formData.append('company', company);
    formData.append('description', description);
    if (deleteCert) formData.append('deleteCertificate', 'true');
    if (certFile) formData.append('certificate', certFile);

    try {
      if (editingId) {
        await fetch(`/api/experience/admin/${editingId}`, {
          method: 'PUT',
          headers: authHeaders,
          body: formData
        });
      } else {
        await fetch('/api/experience/admin/create', {
          method: 'POST',
          headers: authHeaders,
          body: formData
        });
      }
      setIsFormOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error('Error saving experience:', err);
    }
  };

  const deleteExperience = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/experience/admin/${deleteId}`, { method: 'DELETE', headers: authHeaders });
      setDeleteId(null);
      fetchExperiences();
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  const filtered = experiences.filter(exp =>
    exp.role.toLowerCase().includes(search.toLowerCase()) ||
    exp.company.toLowerCase().includes(search.toLowerCase())
  );

  const isPdf = (path: string) => path?.toLowerCase().endsWith('.pdf');

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">💼 Experience Manager</h1>
        {!isFormOpen && (
          <button className="admin-btn admin-btn-primary" onClick={openNewForm}>
            <Plus size={18} /> Add Experience
          </button>
        )}
      </div>

      <div className="admin-content">
        {isFormOpen ? (
          <div className="admin-table-card" style={{ padding: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 24 }}>
              {editingId ? '✏️ Edit Experience' : '➕ New Experience'}
            </h3>
            <form onSubmit={save} className="admin-form">
              {/* Role + Company */}
              <div className="admin-form-group">
                <label className="admin-form-label">Role / Job Title *</label>
                <input className="admin-form-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Full Stack Developer Intern" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Company / Organisation *</label>
                <input className="admin-form-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Tech Solutions Ltd" required />
              </div>

              {/* Date range with calendar pickers */}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Start Date *</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">
                    End Date
                    <label style={{ marginLeft: 12, fontWeight: 400, fontSize: 13, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isPresent}
                        onChange={e => setIsPresent(e.target.checked)}
                        style={{ marginRight: 5 }}
                      />
                      Currently working here
                    </label>
                  </label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={isPresent ? '' : endDate}
                    onChange={e => setEndDate(e.target.value)}
                    disabled={isPresent}
                    style={{ opacity: isPresent ? 0.45 : 1 }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-form-label">Job Description *</label>
                <textarea
                  className="admin-form-textarea"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe roles, responsibilities, and key achievements…"
                  required
                />
              </div>

              {/* Certificate Upload */}
              <div className="admin-form-group">
                <label className="admin-form-label">Experience Certificate (optional)</label>

                {/* Show existing certificate */}
                {existingCertPath && !deleteCert && (
                  <div className="admin-resume-item is-active" style={{ marginBottom: 12 }}>
                    <div className="admin-resume-info">
                      <div className="admin-resume-icon"><Paperclip size={18} /></div>
                      <div className="admin-resume-details">
                        <h4>{existingCertName || 'Certificate'}</h4>
                        <p>Existing file</p>
                      </div>
                    </div>
                    <div className="admin-actions">
                      <a
                        href={existingCertPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn-icon"
                        title="View"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        type="button"
                        className="admin-btn-icon danger"
                        title="Remove certificate"
                        onClick={() => setDeleteCert(true)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {deleteCert && (
                  <div style={{ marginBottom: 12, color: '#ef4444', fontSize: 13 }}>
                    Existing certificate will be removed on save.{' '}
                    <button type="button" style={{ color: 'var(--admin-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }} onClick={() => setDeleteCert(false)}>
                      Undo
                    </button>
                  </div>
                )}

                <div
                  className="admin-upload-area"
                  onClick={() => certFileRef.current?.click()}
                  style={{ height: 100 }}
                >
                  <Upload size={22} className="admin-upload-icon" />
                  <p className="admin-upload-text" style={{ fontSize: 13, margin: '4px 0 0' }}>
                    {certFile ? certFile.name : 'Click to upload certificate'}
                  </p>
                  <p className="admin-upload-hint">PNG, JPG, WebP or PDF (max 10MB)</p>
                </div>
                <input
                  ref={certFileRef}
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={e => { setCertFile(e.target.files?.[0] || null); }}
                />
              </div>

              {/* Form Actions */}
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Check size={16} /> Save
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsFormOpen(false)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="admin-search-bar">
              <Search size={18} />
              <input
                placeholder="Search by role or company…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Certificate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(exp => (
                    <tr key={exp._id}>
                      <td style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{exp.role}</td>
                      <td>{exp.company}</td>
                      <td>{formatDisplayDate(exp.startDate)}</td>
                      <td>{formatDisplayDate(exp.endDate)}</td>
                      <td>
                        {exp.certificatePath ? (
                          <button className="admin-btn-icon" title="View Certificate" onClick={() => setViewCert(exp)}>
                            <Paperclip size={15} />
                          </button>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(exp)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(exp._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                        {experiences.length === 0
                          ? 'No work experience listed yet. Add your first entry!'
                          : 'No matching results.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {viewCert && (
        <div className="admin-modal-overlay" onClick={() => setViewCert(null)}>
          <div className="admin-modal" style={{ maxWidth: 640, width: '90%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>📄 {viewCert.certificateName || 'Certificate'}</h3>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
              {viewCert.role} at {viewCert.company}
            </p>
            {isPdf(viewCert.certificatePath) ? (
              <iframe
                src={viewCert.certificatePath}
                style={{ width: '100%', height: 400, border: 'none', borderRadius: 8 }}
                title="Certificate PDF"
              />
            ) : (
              <img
                src={viewCert.certificatePath}
                alt={viewCert.certificateName}
                style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }}
              />
            )}
            <div className="admin-modal-actions" style={{ marginTop: 16 }}>
              <a
                href={viewCert.certificatePath}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-primary"
              >
                <ExternalLink size={15} /> Open in New Tab
              </a>
              <button className="admin-btn admin-btn-secondary" onClick={() => setViewCert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Experience?</h3>
            <p>This will permanently remove this entry and any uploaded certificate.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={deleteExperience}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
