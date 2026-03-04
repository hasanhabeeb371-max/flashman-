
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      if (!email || !password) {
        setError('Please enter your email and password');
        return;
      }
    } else {
      if (!email || !password || !phone) {
        setError('Please fill in all details to join');
        return;
      }
    }

    const role = email.toLowerCase().endsWith('@flashman.com') ? 'admin' : 'user';
    
    onLogin({
      email,
      role,
      phone: mode === 'signup' ? phone : undefined,
      name: email.split('@')[0]
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white rounded-[50px] border border-gray-100 p-2">
        <div className="bg-white rounded-[48px] p-8 lg:p-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-black italic tracking-tighter">FLASH <span className="text-red-600">MAN</span></h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-50">
               <span className="text-black text-2xl font-black italic">F</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest ml-4">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600/20 rounded-[24px] transition-all outline-none font-bold text-black"
                placeholder="your@email.com"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest ml-4">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600/20 rounded-[24px] transition-all outline-none font-bold text-black"
                  placeholder="000 000 0000"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-300 uppercase tracking-widest ml-4">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600/20 rounded-[24px] transition-all outline-none font-bold text-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-black py-5 rounded-[24px] transition-all shadow-xl shadow-red-50 uppercase tracking-widest text-[12px] transform active:scale-95 italic"
            >
              {mode === 'signin' ? "Let's Go" : 'Sign Up'}
            </button>
            
            <div className="pt-6 text-center">
              <button 
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError('');
                }}
                className="text-[9px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors"
              >
                {mode === 'signin' ? "New here? Create Account" : "Have an account? Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
