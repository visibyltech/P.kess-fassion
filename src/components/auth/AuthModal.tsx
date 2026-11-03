import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email) return;
      login(email);
      setIsAuthModalOpen(false);
    } else if (mode === 'register') {
      if (!email || !name) return;
      register(name, email, phone || '08000000000');
      setIsAuthModalOpen(false);
    } else if (mode === 'forgot') {
      setResetSent(true);
    }
  };

  const handleQuickDemo = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      login('pkessvariety@gmail.com', 'admin');
    } else {
      login('chioma.okonkwo@gmail.com', 'customer');
    }
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsAuthModalOpen(false)} 
      />

      <div className="relative bg-[#101016] border border-[#2D2D3E] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 text-zinc-300">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <BrandLogo size="md" className="justify-center mb-3" />
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            {mode === 'login' && 'Welcome to P-Kess World'}
            {mode === 'register' && 'Join P-Kess Fashion World'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'login' && 'Sign in to access your orders, wishlist, and Save to Buy plans.'}
            {mode === 'register' && 'Create your account for bespoke couture, retail & wholesale access.'}
            {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
          </p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="mb-6 p-3 rounded-xl bg-[#171722] border border-[#272738] text-xs">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Fast One-Click Demo Access:</span>
            <span className="text-[#D4AF37]">Instant</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 rounded-lg bg-[#222230] hover:bg-[#2C2C3E] text-zinc-200 font-medium text-xs text-center border border-zinc-700/60 transition-colors"
            >
              👤 Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#ECC260] font-medium text-xs text-center border border-[#D4AF37]/40 transition-colors"
            >
              👑 Executive Admin
            </button>
          </div>
        </div>

        {resetSent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              ✓
            </div>
            <h4 className="text-white font-medium text-sm">Reset link dispatched</h4>
            <p className="text-xs text-zinc-400">
              We've dispatched a secure reset link to <strong className="text-white">{email}</strong>. Please check your inbox.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="text-xs text-[#D4AF37] hover:underline pt-2 block mx-auto"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chioma Okonkwo"
                      className="w-full bg-[#181822] border border-[#2B2B3E] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number (Nigeria)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 09012776272"
                      className="w-full bg-[#181822] border border-[#2B2B3E] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. chioma@gmail.com"
                  className="w-full bg-[#181822] border border-[#2B2B3E] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-zinc-400">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#ECC260] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#181822] border border-[#2B2B3E] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B88B22] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/20 mt-2"
            >
              {mode === 'login' && 'Sign In to Account'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#ECC260] font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#ECC260] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
