import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = { 'X-Admin-Key': ADMIN_KEY, 'Content-Type': 'application/json' };

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  likes: number;
  createdAt: string;
  publishedAt: string | null;
}

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs/admin/all', { headers });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const togglePublish = async (id: string) => {
    await fetch(`/api/blogs/admin/${id}/publish`, { method: 'PUT', headers });
    fetchBlogs();
  };

  const deleteBlog = async () => {
    if (!deleteId) return;
    await fetch(`/api/blogs/admin/${deleteId}`, { method: 'DELETE', headers });
    setDeleteId(null);
    fetchBlogs();
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📝 Blog Posts</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/blogs/new')}>
          <Plus size={18} /> New Post
        </button>
      </div>
      <div className="admin-content">
        <div className="admin-search-bar">
          <Search size={18} />
          <input placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Likes</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(blog => (
                <tr key={blog._id}>
                  <td style={{ fontWeight: 500, color: 'var(--admin-text)' }}>{blog.title}</td>
                  <td>
                    <span className={`admin-badge ${blog.status}`}>
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{blog.likes}</td>
                  <td>{formatDate(blog.status === 'published' ? blog.publishedAt : blog.createdAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" title="Edit" onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="admin-btn-icon" title={blog.status === 'published' ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(blog._id)}>
                        {blog.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => setDeleteId(blog._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>
                    {blogs.length === 0 ? 'No blog posts yet. Create your first one!' : 'No results found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Blog Post?</h3>
            <p>This action cannot be undone. The post will be permanently removed.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={deleteBlog}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
