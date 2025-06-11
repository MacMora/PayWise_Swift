"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import LogoWelcome from '../../components/LogoWelcome';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await login(phone);
    if (user) {
      router.push('/login/verify');
    } else {
      setError('This phone number is not registered in the system');
    }
  };


  const handleSignup = () => {
    router.push('/register');
  };

  return (
    <div className="responsive-container min-h-screen">
      <div className="flex-1 hidden md:flex">
        <LogoWelcome />
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-6 text-[#22314f]">Login</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          <input
            className="input"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="button-primary">Login</button>
            <button type="button" className="button-outline" onClick={handleSignup}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 