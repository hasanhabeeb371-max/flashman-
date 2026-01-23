
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
        setError('Please fill in all fields to create an account');
        return;
      }
    }

    // Role detection based on domain
    const role = email.toLowerCase().endsWith('@flashman.com') ? 'admin' : 'user';
    
    onLogin({
      email,
      role,
      phone: mode === 'signup' ? phone : undefined,
      name: email.split('@')[0]
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="bg-black py-12 px-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter">FLASH MAN</h2>
            <p className="text-red-500 font-bold text-xs uppercase tracking-widest">
              {mode === 'signin' ? 'Welcome Back' : 'Join the Speed'}
            </p>
          </div>
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-red-900/20">
             <span className="text-white text-3xl font-black italic -rotate-3">F</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl transition-all outline-none font-bold text-gray-800"
              placeholder="name@example.com"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl transition-all outline-none font-bold text-gray-800"
                placeholder="+1 234 567 890"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl transition-all outline-none font-bold text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-200 uppercase tracking-tighter italic text-lg transform active:scale-95"
          >
            {mode === 'signin' ? 'Sign In Now' : 'Create Account'}
          </button>
          
          <div className="pt-4 text-center">
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="text-xs font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
          
          <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-8">
            Admins: use <span className="text-black">@flashman.com</span> email
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
