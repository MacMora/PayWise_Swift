import React from 'react';

const LogoWelcome: React.FC = () => (
  <div className="flex flex-col justify-center h-full w-full p-12 text-white gradient-bg min-h-[350px]">
    <img src="/logo_swift.png" alt="PayWise Swift" style={{ width: 120, marginBottom: 32 }} />
    <h1 style={{ fontSize: 56, fontWeight: 400, marginBottom: 0 }}>Hello,</h1>
    <h2 style={{ fontSize: 56, fontWeight: 700, margin: 0, marginBottom: 24 }}>Welcome!</h2>
    <p style={{ maxWidth: 400, fontSize: 16, lineHeight: 1.5 }}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
);

export default LogoWelcome; 