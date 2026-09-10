import React, { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Check, User, FileText, Upload, Image as ImageIcon } from 'lucide-react';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers = {
  'X-Admin-Key': ADMIN_KEY,
  'Content-Type': 'application/json'
};

export const AboutManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [highlightedName, setHighlightedName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Logo state
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [profileImage, setProfileImage] = useState('');
  const [profileUploading, setProfileUploading] = useState(false);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  // Bio Paragraphs
  const [aboutDesktopText, setAboutDesktopText] = useState('');
  const [aboutMobileText, setAboutMobileText] = useState('');

  // Quick Info list
  const [quickInfo, setQuickInfo] = useState<{ label: string; value: string }[]>([]);

  // Declaration
  const [declarationText, setDeclarationText] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureLocation, setSignatureLocation] = useState('');
  const [signatureAvatar, setSignatureAvatar] = useState('');

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setHighlightedName(data.highlightedName || '');
        setTitle(data.title || '');
        setSummary(data.summary || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        setResumeUrl(data.resumeUrl || '');

        setLogoUrl(data.logoUrl || data.signatureAvatar || '/logo.png');
        setProfileImage(data.profileImage || '');

        setAboutDesktopText((data.aboutTextDesktop || []).join('\n\n'));
        setAboutMobileText((data.aboutTextMobile || []).join('\n\n'));
        setQuickInfo(data.quickInfo || []);

        setDeclarationText(data.declarationText || '');
        setSignatureName(data.signatureName || '');
        setSignatureLocation(data.signatureLocation || '');
        setSignatureAvatar(data.signatureAvatar || data.logoUrl || '/logo.png');
      }
    } catch (err) {
      console.error('Error loading about data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/admin/logo', {
        method: 'POST',
        headers: { 'X-Admin-Key': ADMIN_KEY },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.logoUrl);
        setSignatureAvatar(data.logoUrl);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error uploading logo file:', err);
    } finally {
      setLogoUploading(false);
      if (logoFileRef.current) logoFileRef.current.value = '';
    }
  };

  
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await fetch('/api/admin/profile-image', {
        method: 'POST',
        headers: { 'X-Admin-Key': ADMIN_KEY },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfileImage(data.profileImage);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error uploading profile photo:', err);
    } finally {
      setProfileUploading(false);
      if (profileFileRef.current) profileFileRef.current.value = '';
    }
  };

  
  const handleRemoveProfilePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    try {
      const res = await fetch('/api/admin/profile-image', {
        method: 'DELETE',
        headers: { 'X-Admin-Key': ADMIN_KEY }
      });
      if (res.ok) {
        setProfileImage('');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error removing profile photo:', err);
    }
  };

  const handleQuickInfoChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...quickInfo];
    updated[index][field] = val;
    setQuickInfo(updated);
  };

  const addQuickInfo = () => {
    setQuickInfo([...quickInfo, { label: '', value: '' }]);
  };

  const removeQuickInfo = (index: number) => {
    setQuickInfo(quickInfo.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        name,
        highlightedName,
        title,
        summary,
        email,
        phone,
        location,
        resumeUrl,
        logoUrl,
        aboutTextDesktop: aboutDesktopText.split('\n\n').map(p => p.trim()).filter(Boolean),
        aboutTextMobile: aboutMobileText.split('\n\n').map(p => p.trim()).filter(Boolean),
        quickInfo: quickInfo.filter(q => q.label && q.value),
        declarationText,
        signatureName,
        signatureLocation,
        signatureAvatar: logoUrl || signatureAvatar
      };

      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving about data:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-content" style={{ color: '#9ca3af' }}>Loading About & Profile Settings...</div>;
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">About & Profile Settings</h1>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Save size={16} /> : savedSuccess ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : savedSuccess ? 'Saved Live!' : 'Save All Changes'}
        </button>
      </div>

      <div className="admin-content">
        <form onSubmit={handleSave} className="admin-form">

          {/* Website Logo Manager Section */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ImageIcon size={20} color="#6366f1" /> Website Logo & Branding Manager
            </h3>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Preview */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Active Logo Preview</div>
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#0a0c10', border: '2px solid #353849', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 8, margin: '0 auto' }}>
                  <img src={logoUrl} alt="Website Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.src = '/logo.png')} />
                </div>
              </div>

              {/* Upload Controls */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div className="admin-form-group" style={{ marginBottom: 14 }}>
                  <label className="admin-form-label">Upload New Logo Image (PNG, JPG, WebP, SVG)</label>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn admin-btn-primary" onClick={() => logoFileRef.current?.click()} disabled={logoUploading}>
                      <Upload size={16} /> {logoUploading ? 'Uploading Image...' : 'Choose Logo File'}
                    </button>
                    <input ref={logoFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Or Enter Relative Image Path / URL</label>
                  <input className="admin-form-input" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="/logo.png or /uploads/logo/logo-123.png" />
                </div>
              </div>
            </div>
          </div>

          
          {/* Hero Profile Photo Manager Section */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={20} color="#818cf8" /> Hero Profile Photo (Right Side Circle)
            </h3>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Preview */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 8, fontWeight: 600 }}>Circle Profile Preview</div>
                <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: 3, margin: '0 auto', boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} onError={(e) => (e.currentTarget.src = '/logo.png')} />
                    ) : (
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8' }}>BG</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Controls */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div className="admin-form-group" style={{ marginBottom: 14 }}>
                  <label className="admin-form-label">Upload Profile Photo (PNG, JPG, WebP)</label>
                  <div className="admin-actions">
                    <button type="button" className="admin-btn admin-btn-primary" onClick={() => profileFileRef.current?.click()} disabled={profileUploading}>
                      <Upload size={16} /> {profileUploading ? 'Uploading Photo...' : 'Choose Profile Photo'}
                    </button>
                    {profileImage && (
                      <button type="button" className="admin-btn admin-btn-danger" onClick={handleRemoveProfilePhoto}>
                        <Trash2 size={16} /> Remove Photo
                      </button>
                    )}
                    <input ref={profileFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileUpload} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Or Enter Image Path / URL</label>
                  <input className="admin-form-input" value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="/uploads/profile/my-photo.jpg" />
                </div>
              </div>
            </div>
          </div>

          {/* Hero & Contact Settings */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={20} color="#6366f1" /> Hero Header & Contact Info
            </h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">First / Prefix Name</label>
                <input className="admin-form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Balaganesh" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Highlighted Last Name</label>
                <input className="admin-form-input" value={highlightedName} onChange={e => setHighlightedName(e.target.value)} placeholder="P" required />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Professional Role / Title</label>
              <input className="admin-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="AI & Data Science Student | Full-Stack Developer" required />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Hero Summary Subtitle</label>
              <textarea className="admin-form-textarea" value={summary} onChange={e => setSummary(e.target.value)} rows={3} placeholder="Brief intro tagline..." required />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Email Address</label>
                <input className="admin-form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@domain.com" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Phone Number</label>
                <input className="admin-form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Location / City</label>
                <input className="admin-form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Coimbatore, India" required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Active Resume URL</label>
                <input className="admin-form-input" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} placeholder="/Images/my-resume.pdf" required />
              </div>
            </div>
          </div>

          {/* About Bio Text */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} color="#a855f7" /> Detailed About Bio Text
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Desktop Bio Paragraphs (Separate paragraphs with double newlines)</label>
              <textarea className="admin-form-textarea" value={aboutDesktopText} onChange={e => setAboutDesktopText(e.target.value)} rows={6} placeholder="Paragraph 1...\n\nParagraph 2..." />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Mobile Bio Paragraphs (Separate paragraphs with double newlines)</label>
              <textarea className="admin-form-textarea" value={aboutMobileText} onChange={e => setAboutMobileText(e.target.value)} rows={4} placeholder="Concise paragraph 1..." />
            </div>
          </div>

          {/* Quick Info Key-Values */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="admin-chart-title" style={{ margin: 0 }}>Quick Info Fields</h3>
              <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addQuickInfo}>
                <Plus size={14} /> Add Quick Info Item
              </button>
            </div>

            {quickInfo.map((info, idx) => (
              <div key={idx} className="admin-form-row" style={{ alignItems: 'center', marginBottom: 12 }}>
                <input className="admin-form-input" value={info.label} onChange={e => handleQuickInfoChange(idx, 'label', e.target.value)} placeholder="Label (e.g. Education)" style={{ flex: 1 }} />
                <input className="admin-form-input" value={info.value} onChange={e => handleQuickInfoChange(idx, 'value', e.target.value)} placeholder="Value (e.g. B.Tech AI & DS)" style={{ flex: 2 }} />
                <button type="button" className="admin-btn-icon danger" onClick={() => removeQuickInfo(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Declaration Section */}
          <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 className="admin-chart-title" style={{ marginBottom: 18 }}>Declaration & Footer Signature</h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Declaration Statement Text</label>
              <textarea className="admin-form-textarea" value={declarationText} onChange={e => setDeclarationText(e.target.value)} rows={3} />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Signature Full Name</label>
                <input className="admin-form-input" value={signatureName} onChange={e => setSignatureName(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Signature Location</label>
                <input className="admin-form-input" value={signatureLocation} onChange={e => setSignatureLocation(e.target.value)} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
