
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center transform rotate-12 animate-splash shadow-2xl">
          <span className="text-white text-4xl font-black italic -rotate-12">F</span>
        </div>
        <div className="absolute -bottom-12 -right-12 w-8 h-8 bg-black rounded-full animate-bounce"></div>
      </div>
      <h1 className="mt-8 text-4xl font-black tracking-tighter text-black">
        FLASH <span className="text-red-600">MAN</span>
      </h1>
      <p className="mt-2 text-gray-500 font-medium tracking-widest uppercase text-xs">Speed meets Taste</p>
      
      <div className="mt-12 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
