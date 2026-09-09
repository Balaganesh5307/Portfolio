import React from 'react';
import { Icon } from './Icon';

interface PlatformStat {
  _id: string;
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

interface PlatformsProps {
  platforms: PlatformItem[];
}

export const Platforms: React.FC<PlatformsProps> = ({ platforms }) => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Coding Platforms</h2>
          <p className="section-subtitle">Where I practice and showcase my skills</p>
        </div>
        <div className="platforms-grid">
          {platforms.map((platform) => (
            <a key={platform._id} href={platform.url} className="platform-card" target="_blank" rel="noopener noreferrer">
              <div className="platform-icon">
                <Icon name={platform.iconName} />
              </div>
              <h4 className="platform-name">{platform.name}</h4>
              <p className="platform-handle">{platform.handle}</p>
              <div className="platform-stats">
                {platform.stats.map((stat) => (
                  <div key={stat._id} className="platform-stat">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
