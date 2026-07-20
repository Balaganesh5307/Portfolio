import React, { useEffect, useState } from 'react';
import { Users, Eye, Globe, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const ADMIN_KEY = 'bg-portfolio-admin-2024-secret';
const headers = { 'X-Admin-Key': ADMIN_KEY };

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [browsers, setBrowsers] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ov, tl, dv, br, cn, rf] = await Promise.all([
          fetch('/api/admin/analytics/overview', { headers }).then(r => r.json()),
          fetch('/api/admin/analytics/timeline', { headers }).then(r => r.json()),
          fetch('/api/admin/analytics/devices', { headers }).then(r => r.json()),
          fetch('/api/admin/analytics/browsers', { headers }).then(r => r.json()),
          fetch('/api/admin/analytics/countries', { headers }).then(r => r.json()),
          fetch('/api/admin/analytics/referrals', { headers }).then(r => r.json()),
        ]);
        setOverview(ov);
        setTimeline(Array.isArray(tl) ? tl : []);
        setDevices(Array.isArray(dv) ? dv : []);
        setBrowsers(Array.isArray(br) ? br : []);
        setCountries(Array.isArray(cn) ? cn : []);
        setReferrals(Array.isArray(rf) ? rf : []);
      } catch (err) {
        console.error('Error loading analytics:', err);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-topbar-title">📊 Dashboard</h1>
      </div>
      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon blue"><Eye size={22} /></div>
            <span className="admin-stat-label">Total Visits</span>
            <span className="admin-stat-value">{overview?.totalVisits ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon green"><Users size={22} /></div>
            <span className="admin-stat-label">Unique Visitors</span>
            <span className="admin-stat-value">{overview?.uniqueVisitors ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon amber"><TrendingUp size={22} /></div>
            <span className="admin-stat-label">Today</span>
            <span className="admin-stat-value">{overview?.todayVisits ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon purple"><Globe size={22} /></div>
            <span className="admin-stat-label">Top Country</span>
            <span className="admin-stat-value">{overview?.topCountry ?? '—'}</span>
          </div>
        </div>

        {/* Charts */}
        <div className="admin-charts-grid">
          {/* Timeline */}
          <div className="admin-chart-card full-width">
            <h3 className="admin-chart-title">Visits — Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#e4e6f0' }} />
                <Line type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Devices Pie */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">Devices</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(entry: any) => `${entry.name || ''} ${((entry.percent ?? 0) * 100).toFixed(0)}%`}>
                  {devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#e4e6f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Browsers Bar */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">Browsers</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3a', borderRadius: 8, color: '#e4e6f0' }} />
                <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables */}
        <div className="admin-charts-grid">
          {/* Countries */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Top Countries</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Country</th><th>Visits</th></tr>
              </thead>
              <tbody>
                {countries.slice(0, 8).map((c, i) => (
                  <tr key={i}><td>{c.name}</td><td>{c.value}</td></tr>
                ))}
                {countries.length === 0 && (
                  <tr><td colSpan={2} style={{ textAlign: 'center', color: '#6b7280' }}>No data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Referrals */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Top Referrals</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Source</th><th>Visits</th></tr>
              </thead>
              <tbody>
                {referrals.slice(0, 8).map((r, i) => (
                  <tr key={i}><td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.source}</td><td>{r.visits}</td></tr>
                ))}
                {referrals.length === 0 && (
                  <tr><td colSpan={2} style={{ textAlign: 'center', color: '#6b7280' }}>No data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
