import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...digits];
    updated[index] = val;
    setDigits(updated);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.every(d => d !== '')) {
      setVerified(true);
      setTimeout(() => {
        navigate('/onboarding');
      }, 1500);
    }
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => setResending(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] flex items-center justify-center p-6 text-[#292B26] relative">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600"
          alt="Meditation silence"
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
          {verified ? (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#A6B59A]/30 text-[#34483A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl text-[#292B26]">Email Verified</h2>
              <p className="text-xs text-[#77766D]">
                Account authenticated. Transitioning to personalized wellness onboarding...
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl text-[#292B26] mb-2">Verify Your Email</h1>
              <p className="text-xs text-[#77766D] mb-8 leading-relaxed">
                Enter the 6-digit confirmation code dispatched to your inbox.
              </p>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex justify-between gap-2">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 text-center font-serif text-2xl font-bold bg-[#FBF9F4] border border-[#E4DED2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34483A] text-[#34483A]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={digits.some(d => d === '')}
                  className="pill-button-primary w-full py-3.5 text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Confirm Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#E4DED2] flex items-center justify-between text-xs text-[#77766D]">
                <span>Didn't receive code?</span>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#34483A] font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Sending...' : 'Resend Code'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
