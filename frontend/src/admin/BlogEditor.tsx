import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Save, Send } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers: Record<string, string> = { 'X-Admin-Key': ADMIN_KEY, 'Content-Type': 'application/json' };

export const BlogEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`/api/blogs/admin/all`, { headers });
          const blogs = await res.json();
          const blog = blogs.find((b: any) => b._id === id);
          if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
            setExcerpt(blog.excerpt || '');
            setCoverImage(blog.coverImage || '');
            setTagsStr((blog.tags || []).join(', '));
          }
        } catch (err) {
          console.error('Error fetching blog:', err);
        }
      };
      fetchBlog();
    }
  }, [id, isEditing]);

  const save = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const body = {
        title,
        content,
        excerpt,
        coverImage,
        tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        status
      };

      if (isEditing) {
        await fetch(`/api/blogs/admin/${id}`, { method: 'PUT', headers, body: JSON.stringify(body) });
      } else {
        await fetch('/api/blogs/admin/create', { method: 'POST', headers, body: JSON.stringify(body) });
      }

      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error saving blog:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="admin-btn-icon" onClick={() => navigate('/admin/blogs')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="admin-topbar-title">{isEditing ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-secondary" onClick={() => save('draft')} disabled={saving || !title || !content}>
            <Save size={16} /> Save Draft
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => save('published')} disabled={saving || !title || !content}>
            <Send size={16} /> Publish
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Title</label>
            <input className="admin-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter blog title…" />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Excerpt</label>
              <input className="admin-form-input" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary…" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Tags (comma-separated)</label>
              <input className="admin-form-input" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="react, javascript, web dev" />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Cover Image URL</label>
            <input className="admin-form-input" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          {/* Split Editor + Preview */}
          <div className="admin-editor-split">
            <div className="admin-editor-pane">
              <span className="admin-editor-pane-label">Markdown</span>
              <textarea
                className="admin-form-textarea"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your blog content in Markdown…"
                style={{ flex: 1 }}
              />
            </div>
            <div className="admin-editor-pane">
              <span className="admin-editor-pane-label">Preview</span>
              <div className="admin-preview">
                {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p style={{ color: '#6b7280' }}>Preview will appear here…</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
