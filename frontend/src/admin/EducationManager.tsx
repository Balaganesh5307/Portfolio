import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = {
  'X-Admin-Key': ADMIN_KEY,
  'Content-Type': 'application/json'
};

interface EducationItem {
  _id: string;
  date: string;
  degree: string;
  institution: string;
  details: string;
}

export const EducationManager: React.FC = () => {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState('');
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [details, setDetails] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/education');
      const data = await res.json();
      setEducationList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const resetForm = () => {
    setDate('');
    setDegree('');
    setInstitution('');
    setDetails('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const startNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const startEdit = (eItem: EducationItem) => {
    setEditingId(eItem._id);
    setDate(eItem.date);
    setDegree(eItem.degree);
    setInstitution(eItem.institution);
    setDetails(eItem.details);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !degree || !institution) return;

    try {
      const payload = { date, degree, institution, details };

      if (editingId) {
        await fetch('/api/admin/education/' + editingId, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/education', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      resetForm();
      fetchEducation();
    } catch (err) {
      console.error('Error saving education:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch('/api/admin/education/' + deleteId, {
        method: 'DELETE',
        headers
      });

      setDeleteId(null);
      fetchEducation();
    } catch (err) {
      console.error('Error deleting education entry:', err);
    }
  };

  const filtered = educationList.filter(eItem =>
    eItem.degree.toLowerCase().includes(search.toLowerCase()) ||
    eItem.institution.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="admin-content" style={{ color: '#9ca3af' }}>Loading Education...</div>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Education Background</h1>
        <button className="admin-btn admin-btn-primary" onClick={startNew}>
          <Plus size={18} /> {isFormOpen ? 'Close Form' : 'Add Education'}
        </button>
      </div>

      <div className="admin-content">
        {/* Education Form */}
        {isFormOpen && (
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 16 }}>
              {editingId ? 'Edit Education Entry' : 'Add Education Record'}
            </h3>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label className="admin-form-label">Duration / Years *</label>
                  <input className="admin-form-input" value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. 2023 - 2027" required />
                </div>
                <div className="admin-form-group" style={{ flex: 2 }}>
                  <label className="admin-form-label">Degree / Course Title *</label>
                  <input className="admin-form-input" value={degree} onChange={e => setDegree(e.target.value)} placeholder="e.g. B.Tech in Artificial Intelligence & Data Science" required />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Institution / University Name *</label>
                <input className="admin-form-input" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. Sri Ramakrishna Engineering College, Coimbatore" required />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Details / Score / Highlights *</label>
                <textarea className="admin-form-textarea" value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="CGPA: 8.5 / 10 | Relevant coursework: Machine Learning, Data Structures, Web Dev..." required />
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Check size={16} /> {editingId ? 'Save Changes' : 'Add Education Record'}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="admin-search-bar" style={{ marginBottom: 24 }}>
          <Search size={18} />
          <input placeholder="Search education..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Education List */}
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Duration</th>
                <th>Degree & Institution</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(eItem => (
                <tr key={eItem._id}>
                  <td style={{ fontWeight: 600, color: '#818cf8', whiteSpace: 'nowrap' }}>{eItem.date}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f3f4f6' }}>{eItem.degree}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{eItem.institution}</div>
                  </td>
                  <td style={{ color: '#d1d5db', fontSize: 13 }}>{eItem.details}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(eItem)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(eItem._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                    {educationList.length === 0 ? 'No education records added yet.' : 'No matching records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Education Record?</h3>
            <p>This entry will be permanently removed from your portfolio website.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
