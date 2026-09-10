import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Code2 } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = {
  'X-Admin-Key': ADMIN_KEY,
  'Content-Type': 'application/json'
};

interface SkillCategory {
  _id: string;
  category: string;
  tags: string[];
}

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for new category
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editTagsStr, setEditTagsStr] = useState('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !newTagsStr.trim()) return;

    try {
      const tags = newTagsStr.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers,
        body: JSON.stringify({ category: newCategory, tags })
      });

      if (res.ok) {
        setNewCategory('');
        setNewTagsStr('');
        setIsAdding(false);
        fetchSkills();
      }
    } catch (err) {
      console.error('Error adding skill category:', err);
    }
  };

  const startEdit = (item: SkillCategory) => {
    setEditingId(item._id);
    setEditCategory(item.category);
    setEditTagsStr(item.tags.join(', '));
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editCategory.trim()) return;

    try {
      const tags = editTagsStr.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch(`/api/admin/skills/${editingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ category: editCategory, tags })
      });

      if (res.ok) {
        setEditingId(null);
        fetchSkills();
      }
    } catch (err) {
      console.error('Error editing skill category:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/skills/${deleteId}`, {
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        setDeleteId(null);
        fetchSkills();
      }
    } catch (err) {
      console.error('Error deleting skill category:', err);
    }
  };

  if (loading) {
    return <div className="admin-content" style={{ color: '#9ca3af' }}>Loading Skills...</div>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Skills & Technologies</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={18} /> {isAdding ? 'Close Form' : 'Add Skill Group'}
        </button>
      </div>

      <div className="admin-content">
        {/* Add Skill Form */}
        {isAdding && (
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 16 }}>Add New Skill Category</h3>
            <form onSubmit={handleAddSkill} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Category Name *</label>
                <input
                  className="admin-form-input"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="e.g. Languages & Frameworks"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Skill Tags (Comma-separated) *</label>
                <input
                  className="admin-form-input"
                  value={newTagsStr}
                  onChange={e => setNewTagsStr(e.target.value)}
                  placeholder="Python, React, TypeScript, Node.js, Express"
                  required
                />
              </div>
              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Check size={16} /> Create Skill Group
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsAdding(false)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Skill Groups Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {skills.map(group => (
            <div key={group._id} className="admin-table-card" style={{ padding: 20 }}>
              {editingId === group._id ? (
                <div className="admin-form">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category Name</label>
                    <input className="admin-form-input" value={editCategory} onChange={e => setEditCategory(e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Tags (Comma-separated)</label>
                    <input className="admin-form-input" value={editTagsStr} onChange={e => setEditTagsStr(e.target.value)} />
                  </div>
                  <div className="admin-actions">
                    <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSaveEdit}>
                      <Check size={14} /> Save
                    </button>
                    <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setEditingId(null)}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Code2 size={18} color="#6366f1" /> {group.category}
                    </h3>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(group)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(group._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {group.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(99, 102, 241, 0.12)',
                          color: '#818cf8',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {skills.length === 0 && !isAdding && (
          <div className="admin-empty">
            <Code2 size={48} />
            <p>No skill categories created yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Skill Category?</h3>
            <p>This action cannot be undone. All tags in this category will be removed.</p>
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
