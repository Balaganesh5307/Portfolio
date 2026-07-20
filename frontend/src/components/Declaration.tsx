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
  return (
    <section className="section declaration-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Declaration</h2>
        </div>
        <div className="declaration-card">
          <p className="declaration-text">{declarationText}</p>
          <div className="declaration-signature">
            <div className="signature-avatar">{signatureAvatar}</div>
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
