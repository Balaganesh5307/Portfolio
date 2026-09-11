import React from 'react';
import { Icon } from './Icon';

interface PlatformStat {
  _id?: string;
  label: string;
  value: string;
}

interface PlatformItem {
  _id: string;
  name: string;
  url: string;
  handle?: string;
  username?: string;
  iconName?: string;
  icon?: string;
  stats?: PlatformStat[];
}

interface PlatformsProps {
  platforms: PlatformItem[];
}

export const Platforms: React.FC<PlatformsProps> = ({ platforms = [] }) => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Coding Platforms</h2>
          <p className="section-subtitle">Where I practice and showcase my skills</p>
        </div>
        <div className="platforms-grid">
          {(platforms || []).map((platform) => {
            const platformIcon = platform.iconName || platform.icon || 
              (platform.name?.toLowerCase().includes('github') ? 'github' : 
               platform.name?.toLowerCase().includes('linkedin') ? 'linkedin' : 'code');

            return (
              <a key={platform._id} href={platform.url} className="platform-card" target="_blank" rel="noopener noreferrer">
                <div className="platform-icon">
                  <Icon name={platformIcon} />
                </div>
                <h4 className="platform-name">{platform.name}</h4>
                <p className="platform-handle">{platform.handle || platform.username || ''}</p>
                <div className="platform-stats">
                  {(platform.stats || []).map((stat, sIdx) => (
                    <div key={stat._id || sIdx} className="platform-stat">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
