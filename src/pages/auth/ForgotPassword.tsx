import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] flex items-center justify-center p-6 text-[#292B26] relative">
      {/* Soft nature blurred backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600"
          alt="Serene misty green trees"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#F4F0E8]/70 backdrop-blur-md" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#34483A] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
              Ψ
            </div>
            <span className="font-serif text-xl tracking-[0.16em] font-semibold">PSYGMA</span>
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-3xl border-[#E4DED2] shadow-2xl text-left bg-[#FBF9F4]/90">
          {sent ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#A6B59A]/30 text-[#34483A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl text-[#292B26]">Reset Link Dispatched</h2>
              <p className="text-xs text-[#77766D] leading-relaxed">
                We sent a secure recovery link and 6-digit code to <strong className="text-[#292B26]">{email}</strong>.
              </p>
              <div className="pt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => navigate('/verify-email')}
                  className="pill-button-primary w-full text-xs py-3"
                >
                  Enter Verification Code
                </button>
                <Link to="/login" className="text-xs text-[#34483A] hover:underline">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl text-[#292B26] mb-2">Password Recovery</h1>
              <p className="text-xs text-[#77766D] mb-6 leading-relaxed">
                Enter your account email. We will send a secure password reset link and verification code.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sameer@omegamma.wellness"
                    className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-4 py-3 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                  />
                </div>

                <button
                  type="submit"
                  className="pill-button-primary w-full py-3.5 text-sm shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  <span>Send Recovery Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-8 pt-4 border-t border-[#E4DED2] text-center">
                <Link to="/login" className="text-xs text-[#77766D] hover:text-[#34483A] inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
