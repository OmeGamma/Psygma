import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Sparkles, ArrowRight, Globe, Compass, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#E9E5D9]/70 text-[#292B26] border-t border-[#E4DED2] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Banner */}
        <div className="glass-card bg-[#FBF9F4] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border-[#E4DED2]">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Mindful Living
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-[#292B26] leading-tight">
              Begin your personal wellness intelligence check today.
            </h3>
            <p className="text-sm text-[#77766D] mt-2 leading-relaxed">
              Join thousands discovering grounded daily clarity through compassionate AI and restorative nature actions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/signup" className="pill-button-primary text-sm shadow-md flex items-center justify-center gap-1.5">
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="pill-button-secondary text-sm flex items-center justify-center">
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Multi-column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-14">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#34483A] text-[#FBF9F4] flex items-center justify-center font-serif text-base font-bold">
                Ψ
              </div>
              <span className="font-serif text-xl tracking-[0.16em] font-semibold text-[#292B26]">
                PSYGMA
              </span>
            </Link>
            <p className="text-sm text-[#77766D] leading-relaxed max-w-sm mb-6">
              AI-powered personal stress intelligence and wellness platform. Developed by <strong className="text-[#34483A] font-semibold">Team OmeGamma</strong> for holistic cognitive and somatic balance.
            </p>
            <div className="flex items-center gap-3 text-[#77766D]">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FBF9F4] border border-[#E4DED2] flex items-center justify-center hover:text-[#34483A] hover:border-[#34483A] transition-colors" aria-label="Open Web">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FBF9F4] border border-[#E4DED2] flex items-center justify-center hover:text-[#34483A] hover:border-[#34483A] transition-colors" aria-label="Discover">
                <Compass className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#FBF9F4] border border-[#E4DED2] flex items-center justify-center hover:text-[#34483A] hover:border-[#34483A] transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Discover & Platform */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#292B26] mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm text-[#77766D]">
              <li><Link to="/how-it-works" className="hover:text-[#34483A] transition-colors">How It Works</Link></li>
              <li><Link to="/intelligence" className="hover:text-[#34483A] transition-colors">AI Intelligence</Link></li>
              <li><Link to="/recovery-planner" className="hover:text-[#34483A] transition-colors">Recovery Planner</Link></li>
              <li><Link to="/travel" className="hover:text-[#34483A] transition-colors">Nature Escapes</Link></li>
              <li><Link to="/how-it-works#faq" className="hover:text-[#34483A] transition-colors">Frequently Asked</Link></li>
            </ul>
          </div>

          {/* Col 2: Studio & Intelligence */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#292B26] mb-4">Wellness & App</h4>
            <ul className="space-y-2.5 text-sm text-[#77766D]">
              <li><Link to="/wellness" className="hover:text-[#34483A] transition-colors">Wellness Studio</Link></li>
              <li><Link to="/app/check-in" className="hover:text-[#34483A] transition-colors">Daily Check-In</Link></li>
              <li><Link to="/app/stress-monitor" className="hover:text-[#34483A] transition-colors">Stress Monitor</Link></li>
              <li><Link to="/app/insights" className="hover:text-[#34483A] transition-colors">AI Insights</Link></li>
              <li><Link to="/app/reports" className="hover:text-[#34483A] transition-colors">Summary Reports</Link></li>
            </ul>
          </div>

          {/* Col 3: About & Ethics */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#292B26] mb-4">Company & Ethics</h4>
            <ul className="space-y-2.5 text-sm text-[#77766D]">
              <li><Link to="/about" className="hover:text-[#34483A] transition-colors">Our Mission</Link></li>
              <li><Link to="/about#technology" className="hover:text-[#34483A] transition-colors">Technology Architecture</Link></li>
              <li><Link to="/privacy" className="hover:text-[#34483A] transition-colors">Privacy & Security</Link></li>
              <li><Link to="/about#responsible-ai" className="hover:text-[#34483A] transition-colors">Responsible AI</Link></li>
              <li><Link to="/contact" className="hover:text-[#34483A] transition-colors">Contact Team OmeGamma</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Credits */}
        <div className="pt-8 border-t border-[#E4DED2] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#77766D]">
          <div className="flex items-center gap-2 text-center md:text-left">
            <Shield className="w-4 h-4 text-[#777B51] shrink-0" />
            <p>
              Psygma is a personal wellness awareness system, not a medical device or healthcare provider. Estimates are calculated for lifestyle guidance only.
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <span>© 2026 Psygma by Team OmeGamma</span>
            <Link to="/privacy" className="hover:text-[#34483A]">Privacy</Link>
            <Link to="/about" className="hover:text-[#34483A]">Ethics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
