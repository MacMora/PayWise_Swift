"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const VerifyRegister: React.FC = () => {
  const [seconds, setSeconds] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (seconds === 1) {
      router.push("/register/multistep");
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <img src="/logo_swift.png" alt="PayWise Swift" style={{ width: 120, marginBottom: 24 }} />
        <h2 className="text-2xl font-bold mb-2 text-[#22314f]">Check your phone</h2>
        <p className="mb-4 text-[#22314f]">We sent a push notification to your phone, please accept the request to continue sign up.</p>
        <div className="text-lg font-semibold text-[#1e5fa6] mb-2">Redirecting in {seconds}...</div>
        <p className="mt-4 text-sm text-[#22314f]">Not receiving the notification?{' '}
          <a href="https://paywise.co/" className="text-[#1e5fa6] underline" style={{background:'none',border:'none'}}>Contact PayWise</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyRegister; 