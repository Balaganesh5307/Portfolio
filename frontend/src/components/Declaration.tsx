import React from 'react';

interface DeclarationProps {
  declarationText: string;
  signatureName: string;
  signatureLocation: string;
  signatureAvatar: string;
}

export const Declaration: React.FC<DeclarationProps> = ({
  declarationText,
  signatureName,
  signatureLocation,
  signatureAvatar
}) => {
  const isImageAvatar = Boolean(
    signatureAvatar && 
    (signatureAvatar.startsWith('http://') || 
     signatureAvatar.startsWith('https://') || 
     signatureAvatar.startsWith('/') || 
     signatureAvatar.startsWith('data:'))
  );

  return (
    <section className="section declaration-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Declaration</h2>
        </div>
        <div className="declaration-card">
          <div className="declaration-quote-icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <p className="declaration-text">{declarationText}</p>
          <div className="declaration-signature">
            <div className="signature-avatar">
              {isImageAvatar ? (
                <img src={signatureAvatar} alt={signatureName} className="signature-avatar-img" />
              ) : (
                signatureAvatar || 'BG'
              )}
            </div>
            <div className="signature-info">
              <p className="signature-name">{signatureName}</p>
              <p className="signature-location">{signatureLocation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
