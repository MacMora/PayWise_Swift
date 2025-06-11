import React from 'react';

interface NotRegisteredModalProps {
  phone: string;
  onChange: () => void;
  onSignup: () => void;
}

const NotRegisteredModal: React.FC<NotRegisteredModalProps> = ({ phone, onChange, onSignup }) => (
  <div className="modal-bg">
    <div className="modal-content">
      <div style={{ fontSize: 48, marginBottom: 8 }}>
        <span role="img" aria-label="warning">⚠️</span>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
        This Phone Number does not belong to any PayWise wallet.
      </h2>
      <p style={{ fontSize: 14, marginBottom: 16 }}>
        Remember that if it is not correct, you will not be able to complete your registration successfully.
      </p>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>{phone}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button className="button-outline" onClick={onChange}>Change</button>
        <button className="button-primary" onClick={onSignup}>Sign Up to PayWise</button>
      </div>
    </div>
  </div>
);

export default NotRegisteredModal; 