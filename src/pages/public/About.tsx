import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Brain, Sparkles, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Team OmeGamma • Our Origin
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Crafting Compassionate Intelligence for the Modern Mind
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Psygma was born from a fundamental conviction: human wellness cannot be reduced to stressful red metrics or generic chatbots. It demands calm, explainable intelligence grounded in real human rhythms.
        </p>
      </div>

      {/* Narrative Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-6 text-left space-y-4">
          <span className="text-xs font-mono font-semibold uppercase text-[#777B51]">Our Philosophy</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26] leading-tight">
            From clinical dashboards to mindful sanctuaries.
          </h2>
          <p className="text-sm text-[#77766D] leading-relaxed">
            Most health platforms overwhelm users with cold telemetry—graphs of heart rates and steep stress spikes that paradoxically increase acute anxiety.
          </p>
          <p className="text-sm text-[#77766D] leading-relaxed">
            Team OmeGamma envisioned Psygma as a warm digital refuge: soft cream tones, tactile nature photography, respectful typography, and actionable micro-steps that encourage people to look up from screens rather than stare at them.
          </p>
          <div className="pt-4 flex items-center gap-6">
            <div>
              <div className="font-serif text-3xl font-bold text-[#34483A]">100%</div>
              <div className="text-xs text-[#77766D]">Zero-Ad Commitment</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#34483A]">v2.4</div>
              <div className="text-xs text-[#77766D]">Grounded Engine</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#34483A]">Edge</div>
              <div className="text-xs text-[#77766D]">Privacy-First Arch</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#E4DED2] relative h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1506744626753-1fa30fd22541?auto=format&fit=crop&q=80&w=1000"
              alt="Mountain nature reflection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292B26]/60 via-transparent to-transparent flex items-end p-8">
              <div className="text-white text-left">
                <p className="font-serif text-xl italic font-light">
                  "Understanding your mind is the first step to improving your life."
                </p>
                <span className="text-xs text-white/70 uppercase tracking-widest mt-1 block">
                  Psygma Core Creed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Architecture Section */}
      <section id="technology" className="mb-24 pt-12 border-t border-[#E4DED2]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase text-[#777B51]">System Architecture</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26] mt-1">
            Engineered for Grounded Truth
          </h2>
          <p className="text-sm text-[#77766D] mt-2">
            Our multi-tiered architecture decouples qualitative perception from quantitative predictive modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">FastAPI Core Backend</h3>
            <p className="text-xs text-[#77766D] leading-relaxed">
              Python 3.11 asynchronous API services with Pydantic schema validation, secure JWT sessions, and deterministic stress correlation calculations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Resilient Local Fallback</h3>
            <p className="text-xs text-[#77766D] leading-relaxed">
              Full offline continuity. If cloud communication pauses, the local TypeScript inference model continues calculating stress assessments without interruption.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
            <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">TinyFish Discovery Proxy</h3>
            <p className="text-xs text-[#77766D] leading-relaxed">
              Dedicated server-side adapter connecting to external sanctuary and retreat providers, guaranteeing live verification and zero fabricated booking claims.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible AI Framework Section */}
      <section id="responsible-ai" className="mb-24 pt-12 border-t border-[#E4DED2] text-left">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
          <span className="text-xs font-semibold uppercase text-[#777B51] block mb-1">
            Ethics Charter
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26] mb-4">
            Responsible AI & Non-Diagnostic Limits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#77766D] leading-relaxed">
            <div className="space-y-3">
              <p>
                <strong className="text-[#292B26]">No Clinical Diagnosis:</strong> Psygma explicitly disclaims clinical psychiatric or medical diagnostic capabilities. The platform does not diagnose depression, anxiety disorders, or acute somatic conditions.
              </p>
              <p>
                <strong className="text-[#292B26]">Explicit Uncertainty:</strong> Whenever check-in data is partial or ambiguous, the system renders a wide confidence interval rather than projecting false precision.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <strong className="text-[#292B26]">Zero Dark Patterns:</strong> We never employ manipulative streaks or guilt-inducing notifications. If you step away from the app for weeks, Psygma welcomes you back without penalties.
              </p>
              <p>
                <strong className="text-[#292B26]">User-First Attribution:</strong> When you read an insight, the contributing check-in entries are listed clearly, ensuring complete explainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team OmeGamma Attribution */}
      <div className="text-center">
        <h3 className="font-serif text-2xl text-[#292B26] mb-2">Developed by Team OmeGamma</h3>
        <p className="text-xs text-[#77766D] max-w-md mx-auto mb-6">
          Dedicated engineers, designers, and mindfulness practitioners shaping ethical AI for human well-being.
        </p>
        <Link to="/contact" className="pill-button-secondary text-xs">
          Get in Touch with Team OmeGamma
        </Link>
      </div>
    </div>
  );
};
