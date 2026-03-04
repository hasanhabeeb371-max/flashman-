
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-24 h-24 bg-red-600 rounded-[32px] flex items-center justify-center transform rotate-6 animate-splash shadow-xl shadow-red-100">
          <span className="text-black text-4xl font-black italic -rotate-6">F</span>
        </div>
        <div className="absolute -bottom-8 -right-8 w-6 h-6 bg-black rounded-full animate-bounce"></div>
      </div>
      
      <h1 className="mt-12 text-4xl font-black tracking-tighter text-black">
        FLASH <span className="text-red-600">MAN</span>
      </h1>
      <p className="mt-2 text-gray-400 font-bold tracking-widest uppercase text-[10px]">Fast and Tasty</p>
      
      <div className="mt-16 w-40 h-1 bg-gray-50 rounded-full overflow-hidden">
        <div className="h-full bg-red-600 animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
