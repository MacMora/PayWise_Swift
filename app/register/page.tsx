"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NotRegisteredModal from '../../components/NotRegisteredModal';

const RegisterPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <img src="/logo_swift.png" alt="PayWise Swift" style={{ width: 120, marginBottom: 24 }} />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Let&apos;s Begin!</h2>
        <p className="mb-4 text-[#22314f]">Enter your PayWise phone number</p>
        <form className="w-full" onSubmit={handleContinue}>
          <input
            className="input"
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="button-primary w-full">Continue</button>
        </form>
        <p className="mt-4 text-sm text-[#22314f]">Already have an account?{' '}
          <button className="text-[#1e5fa6] underline" style={{background:'none',border:'none'}} onClick={() => router.push('/login')}>Log In</button>
        </p>
      </div>
      {showModal && (
        <NotRegisteredModal
          phone={phone}
          onChange={() => setShowModal(false)}
          onSignup={() => router.push('/register/verify')}
        />
      )}
    </div>
  );
};

export default RegisterPage; 