"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoWelcome from '../../../components/LogoWelcome';

const VerifyPage: React.FC = () => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    router.push('/login');
  };

  return (
    <div className="responsive-container min-h-screen">
      <div className="flex-1 hidden md:flex">
        <LogoWelcome />
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        <form className="w-full max-w-sm" onSubmit={handleContinue}>
          <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Login</h2>
          <p className="mb-4 text-sm text-[#22314f]">In your Authenticator app on your phone, enter the number to sign in</p>
          <input
            className="input"
            type="text"
            placeholder="Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <button type="submit" className="button-primary mb-2">Continue</button>
          <button type="button" className="text-xs text-[#1e5fa6] underline" onClick={handleGoBack} style={{background:'none',border:'none',marginTop:8}}>Go Back</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage; 