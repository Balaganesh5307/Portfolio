import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Award, FolderDown, ArrowLeft, Briefcase } from 'lucide-react';
import './admin.css';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">BG</div>
          <div>
            <div className="admin-sidebar-title">Admin Panel</div>
            <div className="admin-sidebar-subtitle">Portfolio Manager</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/blogs" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <FileText size={20} />
            Blog
          </NavLink>
          <NavLink to="/admin/experience" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Briefcase size={20} />
            Experience
          </NavLink>
          <NavLink to="/admin/certifications" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <Award size={20} />
            Certifications
          </NavLink>
          <NavLink to="/admin/resume" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <FolderDown size={20} />
            Resume
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-back-link" onClick={() => navigate('/')}>
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
