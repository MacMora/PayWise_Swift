import React from 'react';
import Image from 'next/image';

interface NotRegisteredModalProps {
  phone: string;
  onChange: () => void;
  onSignup: () => void;
}

const NotRegisteredModal: React.FC<NotRegisteredModalProps> = ({ phone, onChange, onSignup }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFF] bg-opacity-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 md:p-8 flex flex-col items-center">
      <Image src="/images/warning-circle.png" alt="Warning" width={75} height={75} />
      <h2 className="text-lg md:text-xl font-bold my-4 text-center">
        This Phone Number does not belong to any PayWise wallet.
      </h2>
      <p className="text-sm md:text-base mb-6 text-center text-gray-600">
        Remember that if it is not correct, you will not be able to complete your registration successfully.
      </p>
      <div className="text-base md:text-lg font-semibold mb-6">{phone}</div>
      <div className="flex flex-col sm:flex-row w-full">
        <button 
          className="flex-1 px-4 py-2 bg-transparent underline text-[#1E64A7] font-bold"
          onClick={onChange}
        >
          Change
        </button>
        <button 
          className="flex-1 px-4 py-2 bg-[#1E64A7] font-bold text-white rounded-full hover:bg-blue-700 transition-colors"
          onClick={onSignup}
        >
          Sign Up to PayWise
        </button>
      </div>
    </div>
  </div>
);

export default NotRegisteredModal; 