import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  User, Code2, FolderGit2, GraduationCap, Briefcase, Award, Globe2, FolderDown, FileText, ArrowLeft, Menu, X
} from 'lucide-react';
import './admin.css';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-wrapper">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-mobile-menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="admin-mobile-logo">
          <div className="admin-sidebar-logo" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>BG</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f3f4f6' }}>Admin Panel</span>
        </div>

        <button className="admin-btn-icon" onClick={() => navigate('/')} title="Back to Portfolio">
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Backdrop overlay on mobile */}
      {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">BG</div>
          <div>
            <div className="admin-sidebar-title">Admin Panel</div>
            <div className="admin-sidebar-subtitle">Portfolio Manager</div>
          </div>
          <button className="admin-mobile-close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/about" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <User size={20} />
            About & Contact
          </NavLink>
          <NavLink to="/admin/skills" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <Code2 size={20} />
            Skills
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <FolderGit2 size={20} />
            Projects
          </NavLink>
          <NavLink to="/admin/education" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <GraduationCap size={20} />
            Education
          </NavLink>
          <NavLink to="/admin/experience" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <Briefcase size={20} />
            Experience
          </NavLink>
          <NavLink to="/admin/certifications" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <Award size={20} />
            Certifications
          </NavLink>
          <NavLink to="/admin/platforms" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <Globe2 size={20} />
            Platforms
          </NavLink>
          <NavLink to="/admin/resume" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <FolderDown size={20} />
            Resume
          </NavLink>
          <NavLink to="/admin/blogs" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <FileText size={20} />
            Blog
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-back-link" onClick={() => { closeSidebar(); navigate('/'); }}>
            <ArrowLeft size={18} />
            Back to Portfolio
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};
