import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!agreed) {
      setError('Please acknowledge the privacy & non-clinical disclaimer.');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full bg-[#F4F0E8] flex flex-col md:flex-row text-[#292B26] overflow-y-auto md:overflow-hidden">
      {/* Left Column: Nature Visual Backdrop & Curated Sanctuary Messages */}
      <div className="hidden md:flex md:w-1/2 lg:w-7/12 relative overflow-hidden bg-[#1E2922] flex-col justify-between p-8 lg:p-12 text-white">
        {/* Serene high-resolution nature backdrop */}
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=85&w=1600"
          alt="Peaceful sunlit forest canopy"
          className="absolute inset-0 w-full h-full object-cover scale-100 brightness-[0.80] contrast-[1.05]"
        />

        {/* Ambient atmospheric overlay - rich emerald-charcoal depth with no muddy wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141E17]/90 via-[#18241C]/50 to-[#141E17]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(74,99,80,0.35),transparent_70%)]" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#A6B59A] animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-white/90 text-[11px]">
              Psygma Stress Intelligence Sanctuary
            </span>
          </div>
          <span className="text-[11px] text-white/70 font-mono tracking-wide">
            v2.4 • Private Biometrics
          </span>
        </div>

        {/* Center Philosophy & Text Messages Card: Centered and level with the form */}
        <div className="relative z-10 max-w-lg my-auto py-6">
          <div className="glass-card-dark p-7 lg:p-8 rounded-3xl text-white border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C1D2B5] text-[11px] font-semibold tracking-wider uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6B59A]" />
              Gentle Beginning
            </div>
            <p className="font-serif text-2xl lg:text-3xl leading-snug mb-3 text-[#FBF9F4]">
              "Begin a daily dialogue with your nervous system."
            </p>
            <p className="text-xs lg:text-sm text-white/80 leading-relaxed mb-6 font-light">
              Calibrate your restorative baseline through continuous cognitive modeling, gentle somatic micro-rituals, and sanctuary recommendations.
            </p>

            {/* Feature trust highlights */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs text-white/85">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A6B59A] shrink-0" />
                <span>Zero ad tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6B59A] shrink-0" />
                <span>User-owned biometrics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6B59A] shrink-0" />
                <span>Adaptive recovery plans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6B59A] shrink-0" />
                <span>Non-clinical guidance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle attribution */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60">
          <span>Crafted with intentional serenity</span>
          <span>Team OmeGamma</span>
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:px-8 md:px-10 lg:px-12 relative z-10 h-full overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Top Brand Link */}
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-[#292B26] group">
              <div className="w-8 h-8 rounded-full bg-[#34483A] text-[#FBF9F4] flex items-center justify-center font-serif text-base font-bold shadow-xs transition-transform group-hover:scale-105">
                Ψ
              </div>
              <span className="font-serif text-xl tracking-[0.16em] font-semibold">PSYGMA</span>
            </Link>
            <Link to="/" className="text-xs text-[#77766D] hover:text-[#34483A] transition-colors">
              ← Return home
            </Link>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-xl text-left bg-[#FBF9F4]/95 backdrop-blur-md">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#292B26] mb-1">Join Psygma</h1>
            <p className="text-xs sm:text-sm text-[#77766D] mb-5">
              Create your account to start personal baseline calibration.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#77766D] uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. OmeGamma"
                  className="w-full bg-[#FFFFFF] border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#77766D] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="omegamma@gmail.com"
                  className="w-full bg-[#FFFFFF] border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#77766D] uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-[#FFFFFF] border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#34483A] rounded cursor-pointer"
                />
                <label htmlFor="agree" className="text-[11px] text-[#77766D] leading-tight select-none cursor-pointer">
                  I understand Psygma is a wellness awareness tool, not a medical or psychiatric diagnostic service, and agree to the{' '}
                  <Link to="/privacy" className="text-[#34483A] underline font-medium">Privacy Manifesto</Link>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pill-button-primary w-full py-3 text-sm shadow-md flex items-center justify-center gap-2 mt-3 disabled:opacity-60 cursor-pointer"
              >
                {loading ? <span>Creating sanctuary profile...</span> : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E4DED2] text-center text-xs text-[#77766D]">
              Already registered?{' '}
              <Link to="/login" className="text-[#34483A] font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
