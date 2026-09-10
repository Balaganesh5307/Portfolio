import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ExternalLink, Globe2 } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = {
  'X-Admin-Key': ADMIN_KEY,
  'Content-Type': 'application/json'
};

interface PlatformStat {
  label: string;
  value: string;
}

interface PlatformItem {
  _id: string;
  name: string;
  url: string;
  handle: string;
  iconName: string;
  stats: PlatformStat[];
}

export const PlatformsManager: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [iconName, setIconName] = useState('Code');
  const [stats, setStats] = useState<PlatformStat[]>([{ label: '', value: '' }]);

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    try {
      const res = await fetch('/api/platforms');
      const data = await res.json();
      setPlatforms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const resetForm = () => {
    setName('');
    setUrl('');
    setHandle('');
    setIconName('Code');
    setStats([{ label: '', value: '' }]);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const startNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const startEdit = (p: PlatformItem) => {
    setEditingId(p._id);
    setName(p.name);
    setUrl(p.url);
    setHandle(p.handle);
    setIconName(p.iconName || 'Code');
    setStats(p.stats && p.stats.length > 0 ? p.stats : [{ label: '', value: '' }]);
    setIsFormOpen(true);
  };

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...stats];
    updated[index][field] = val;
    setStats(updated);
  };

  const addStat = () => {
    setStats([...stats, { label: '', value: '' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !handle) return;

    try {
      const payload = {
        name,
        url,
        handle,
        iconName,
        stats: stats.filter(s => s.label && s.value)
      };

      if (editingId) {
        await fetch('/api/admin/platforms/' + editingId, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/platforms', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      resetForm();
      fetchPlatforms();
    } catch (err) {
      console.error('Error saving platform:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch('/api/admin/platforms/' + deleteId, {
        method: 'DELETE',
        headers
      });

      setDeleteId(null);
      fetchPlatforms();
    } catch (err) {
      console.error('Error deleting platform profile:', err);
    }
  };

  if (loading) {
    return <div className="admin-content" style={{ color: '#9ca3af' }}>Loading Platforms...</div>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Coding & Social Platforms</h1>
        <button className="admin-btn admin-btn-primary" onClick={startNew}>
          <Plus size={18} /> {isFormOpen ? 'Close Form' : 'Add Platform'}
        </button>
      </div>

      <div className="admin-content">
        {/* Form */}
        {isFormOpen && (
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 16 }}>
              {editingId ? 'Edit Platform Profile' : 'Add Coding Platform'}
            </h3>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Platform Name *</label>
                  <input className="admin-form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. LeetCode" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Profile Handle / Username *</label>
                  <input className="admin-form-input" value={handle} onChange={e => setHandle(e.target.value)} placeholder="e.g. @balaganesh" required />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group" style={{ flex: 2 }}>
                  <label className="admin-form-label">Profile URL *</label>
                  <input className="admin-form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://leetcode.com/u/balaganesh" required />
                </div>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label className="admin-form-label">Icon Name</label>
                  <input className="admin-form-input" value={iconName} onChange={e => setIconName(e.target.value)} placeholder="Code, Github, Terminal" />
                </div>
              </div>

              {/* Stats */}
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="admin-form-label" style={{ margin: 0 }}>Platform Stats (e.g. Problems Solved: 350+)</label>
                  <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addStat}>
                    <Plus size={14} /> Add Stat Metric
                  </button>
                </div>

                {stats.map((s, idx) => (
                  <div key={idx} className="admin-form-row" style={{ alignItems: 'center', marginBottom: 8 }}>
                    <input className="admin-form-input" value={s.label} onChange={e => handleStatChange(idx, 'label', e.target.value)} placeholder="Metric Name (e.g. Rating)" />
                    <input className="admin-form-input" value={s.value} onChange={e => handleStatChange(idx, 'value', e.target.value)} placeholder="Value (e.g. 1850)" />
                    <button type="button" className="admin-btn-icon danger" onClick={() => removeStat(idx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Check size={16} /> {editingId ? 'Save Changes' : 'Create Platform'}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Platform Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {platforms.map(p => (
            <div key={p._id} className="admin-table-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe2 size={20} color="#6366f1" /> {p.name}
                  </h3>
                  <div style={{ fontSize: 13, color: '#818cf8', marginTop: 2 }}>{p.handle}</div>
                </div>

                <div className="admin-actions">
                  <a href={p.url} target="_blank" rel="noreferrer" className="admin-btn-icon" title="Visit Profile">
                    <ExternalLink size={16} />
                  </a>
                  <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(p._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {p.stats && p.stats.length > 0 && (
                <div style={{ borderTop: '1px solid #2a2d3a', paddingTop: 12, marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {p.stats.map((s, idx) => (
                    <div key={idx} style={{ background: '#1e2130', padding: '8px 12px', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginTop: 2 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {platforms.length === 0 && !isFormOpen && (
          <div className="admin-empty">
            <Globe2 size={48} />
            <p>No coding platforms added yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Platform Profile?</h3>
            <p>This platform entry will be removed from your portfolio.</p>
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
