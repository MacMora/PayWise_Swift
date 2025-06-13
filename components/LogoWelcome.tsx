import React from 'react';

const LogoWelcome: React.FC = () => (
  <div className="flex flex-col justify-center h-full w-full p-6 md:p-12 text-white gradient-bg min-h-[350px]">
    <img 
      src="/logo_swift.png" 
      alt="PayWise Swift" 
      className="w-24 md:w-32 mb-8 md:mb-12" 
    />
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-0">Hello,</h1>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">Welcome!</h2>
    <p className="max-w-[280px] md:max-w-[400px] text-sm md:text-base leading-relaxed">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
);

export default LogoWelcome; 