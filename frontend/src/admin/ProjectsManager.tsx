import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { Github } from '../components/Icon';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = {
  'X-Admin-Key': ADMIN_KEY,
  'Content-Type': 'application/json'
};

interface Project {
  _id: string;
  title: string;
  number: string;
  description: string;
  githubLink: string;
  liveLink?: string;
  tags: string[];
}

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setNumber('01');
    setDescription('');
    setGithubLink('');
    setLiveLink('');
    setTagsStr('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const startNew = () => {
    resetForm();
    const nextNum = projects.length + 1;
    setNumber(nextNum < 10 ? '0' + nextNum : String(nextNum));
    setIsFormOpen(true);
  };

  const startEdit = (p: Project) => {
    setEditingId(p._id);
    setTitle(p.title);
    setNumber(p.number);
    setDescription(p.description);
    setGithubLink(p.githubLink);
    setLiveLink(p.liveLink || '');
    setTagsStr((p.tags || []).join(', '));
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !githubLink) return;

    try {
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        title,
        number: number || '01',
        description,
        githubLink,
        liveLink,
        tags
      };

      if (editingId) {
        await fetch('/api/admin/projects/' + editingId, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/projects', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch('/api/admin/projects/' + deleteId, {
        method: 'DELETE',
        headers
      });

      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="admin-content" style={{ color: '#9ca3af' }}>Loading Projects...</div>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">Projects Portfolio</h1>
        <button className="admin-btn admin-btn-primary" onClick={startNew}>
          <Plus size={18} /> {isFormOpen ? 'Close Form' : 'New Project'}
        </button>
      </div>

      <div className="admin-content">
        {/* Project Form */}
        {isFormOpen && (
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 16 }}>
              {editingId ? 'Edit Project Details' : 'Add New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label className="admin-form-label">Project Code (e.g. 01)</label>
                  <input className="admin-form-input" value={number} onChange={e => setNumber(e.target.value)} placeholder="01" required />
                </div>
                <div className="admin-form-group" style={{ flex: 3 }}>
                  <label className="admin-form-label">Project Title *</label>
                  <input className="admin-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI-Powered Analytics Platform" required />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Project Description *</label>
                <textarea className="admin-form-textarea" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe tech stack, features, and key architecture..." required />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">GitHub Repository Link *</label>
                  <input className="admin-form-input" value={githubLink} onChange={e => setGithubLink(e.target.value)} placeholder="https://github.com/username/repo" required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Live Demo Link (Optional)</label>
                  <input className="admin-form-input" value={liveLink} onChange={e => setLiveLink(e.target.value)} placeholder="https://demo-site.com" />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Technology Tags (Comma-separated)</label>
                <input className="admin-form-input" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="React, Node.js, MongoDB, TailwindCSS" />
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <Check size={16} /> {editingId ? 'Save Changes' : 'Create Project'}
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={resetForm}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="admin-search-bar" style={{ marginBottom: 24 }}>
          <Search size={18} />
          <input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Projects List */}
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Project Title</th>
                <th>Tags</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 700, color: '#6366f1' }}>{p.number}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#f3f4f6' }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(p.tags || []).slice(0, 4).map((t, idx) => (
                        <span key={idx} className="admin-badge" style={{ background: '#1e2130', color: '#a5b4fc' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.githubLink && (
                        <a href={p.githubLink} target="_blank" rel="noreferrer" className="admin-btn-icon" title="GitHub">
                          <Github size={16} />
                        </a>
                      )}
                      {p.liveLink && (
                        <a href={p.liveLink} target="_blank" rel="noreferrer" className="admin-btn-icon" title="Live Demo">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit" onClick={() => startEdit(p)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(p._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                    {projects.length === 0 ? 'No projects created yet.' : 'No matching projects found.'}
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
            <h3>Delete Project?</h3>
            <p>This project will be permanently removed from your portfolio website.</p>
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
