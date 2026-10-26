import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Activity,
  Brain,
  Shield,
  Wind,
  Trees,
  Compass,
  Heart,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { BreathingWidget } from '../../components/wellness/BreathingWidget';
import { AudioPlayer } from '../../components/wellness/AudioPlayer';
import { StressChart } from '../../components/wellness/StressChart';
import { INITIAL_CHECKINS, NATURE_RETREATS } from '../../constants/demoData';
import { useAuth } from '../../context/AuthContext';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F0E8] overflow-hidden text-[#292B26]">
      {/* ----------------- 1. CINEMATIC HERO SECTION ----------------- */}
      <div className="p-3 md:p-6 lg:p-8 flex flex-col max-w-[1600px] mx-auto w-full relative pt-6 sm:pt-8 pb-4">
        <section className="relative min-h-[85vh] sm:min-h-[88vh] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {/* Background Landscape with warm film treatment */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=85&w=2000"
            alt="Scenic green nature valley landscape"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Gradients to blend into warm cream palette */}
          <div className="absolute inset-0 bg-[#292B26]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F0E8] via-[#292B26]/30 to-[#292B26]/40" />
        </div>

        {/* Hero Copy Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBF9F4]/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-6 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#A6B59A] animate-pulse"></span>
            <span>Psygma Intelligence Platform • By Team OmeGamma</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[1.08] drop-shadow-md max-w-4xl"
          >
            Understand Your Mind.{' '}
            <span className="italic font-light text-white/95 block sm:inline">Improve Your Life.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl mt-6 leading-relaxed drop-shadow-xs"
          >
            Psygma uses AI to understand your personal wellness patterns and turn them into meaningful actions for your mind, body and everyday life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-9 w-full sm:w-auto"
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/app"
                  className="pill-button bg-[#FBF9F4] text-[#34483A] hover:bg-white shadow-xl px-8 py-4 text-base font-semibold w-full sm:w-auto transition-transform hover:scale-102 flex items-center justify-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#explore"
                  className="pill-button bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 px-8 py-4 text-base font-medium w-full sm:w-auto"
                >
                  Explore Sanctuary
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="pill-button bg-[#FBF9F4] text-[#34483A] hover:bg-white shadow-xl px-8 py-4 text-base font-semibold w-full sm:w-auto transition-transform hover:scale-102 flex items-center justify-center gap-2"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="pill-button bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 px-8 py-4 text-base font-medium w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Floating Translucent Demonstration Cards */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-16 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-none">
          {/* Card 1: Wellness Insight Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="glass-card-dark p-6 rounded-3xl text-white text-left pointer-events-auto border border-white/20 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-[#A6B59A]" /> Wellness Insight
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium text-white/80">
                Demonstration Preview
              </span>
            </div>
            <p className="font-serif text-lg text-white font-medium leading-snug">
              "Your recovery score is lower than usual today following shortened REM sleep."
            </p>
            <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
              <span>Sleep: 5.2h recorded</span>
              <span>Stress Index: Elevated (68%)</span>
            </div>
          </motion.div>

          {/* Card 2: Recommended Activity Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card-dark p-6 rounded-3xl text-white text-left pointer-events-auto border border-white/20 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D7C5AC]" /> Recommended Activity
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium text-white/80">
                Demonstration Preview
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-lg text-white font-medium leading-snug">
                  25-Min Fresh Garden Walk
                </p>
                <p className="text-xs text-white/80 mt-1">
                  A refreshing walk in fresh morning air under shady green trees to loosen tight shoulders and quiet your mind.
                </p>
              </div>
              <Link
                to="/wellness"
                className="px-3 py-1.5 rounded-full bg-white text-[#34483A] text-xs font-semibold shrink-0 hover:bg-white/90 transition-colors pointer-events-auto"
              >
                View Activity
              </Link>
            </div>
            <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
              <span>Location: Nearby Park (1.2 km)</span>
              <span>Impact: +28 Recovery Points</span>
            </div>
          </motion.div>
        </div>
        </section>
      </div>

      {/* ----------------- 2. CINEMATIC NARRATIVE SECTION: "STRESS ISN'T ALWAYS VISIBLE" ----------------- */}
      <section id="explore" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
            Compassionate Awareness
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight tracking-tight">
            Stress isn't always visible.
          </h2>
          <p className="text-lg text-[#77766D] mt-4 leading-relaxed font-light">
            It hides in irregular sleep patterns, lingering late-evening screen exposure, shallow breathing during meetings, and the gradual drift from time spent outdoors.
          </p>
        </div>

        {/* 3 Editorial Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border-[#E4DED2] flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-6">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#292B26] mb-3">Quiet Compounding</h3>
              <p className="text-sm text-[#77766D] leading-relaxed">
                Micro-fatigue accumulates over days before you notice physical exhaustion. Psygma tracks gradual shifts before they become burnout.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E4DED2] text-xs font-medium text-[#777B51]">
              Sleep Elasticity Modeling
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border-[#E4DED2] flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D7C5AC]/40 text-[#777B51] flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#292B26] mb-3">Grounded Intelligence</h3>
              <p className="text-sm text-[#77766D] leading-relaxed">
                No black-box guesses. Every observation is cross-referenced with your personal inputs and clearly articulates its contributing factors.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E4DED2] text-xs font-medium text-[#777B51]">
              Transparent Factor Attribution
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border-[#E4DED2] flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#A6B59A]/30 text-[#34483A] flex items-center justify-center mb-6">
                <Trees className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#292B26] mb-3">Restorative Nature</h3>
              <p className="text-sm text-[#77766D] leading-relaxed">
                Instead of demanding more screen metrics, Psygma actively encourages physical movement, diaphragmatic breath, and real-world natural reset.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E4DED2] text-xs font-medium text-[#777B51]">
              Nature & Somatic Reconnection
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 3. HOW PSYGMA WORKS (THE 6-STAGE PIPELINE) ----------------- */}
      <section className="py-24 bg-[#E9E5D9]/40 border-y border-[#E4DED2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-3">
              The Architecture
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#292B26]">How Psygma Works</h2>
            <p className="text-[#77766D] mt-3 leading-relaxed">
              From continuous daily self-reflection to grounded insight and measurable recovery.
            </p>
          </div>

          {/* 6 Stage Horizontal Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: '01', title: 'Input', desc: 'Mood, sleep, workload & context' },
              { num: '02', title: 'Personal Baseline', desc: 'Calibrated historical bounds' },
              { num: '03', title: 'Analysis', desc: 'Multi-factor stress correlation' },
              { num: '04', title: 'Insight', desc: 'Grounded plain-language findings' },
              { num: '05', title: 'Action', desc: 'Tailored recovery & soundscapes' },
              { num: '06', title: 'Feedback', desc: 'Continuous model refinement' },
            ].map((step, idx) => (
              <div
                key={step.num}
                className="glass-card p-5 rounded-2xl border-[#E4DED2] text-left relative group hover:border-[#34483A] transition-colors"
              >
                <div className="text-xs font-mono font-semibold text-[#777B51] mb-2">{step.num}</div>
                <h4 className="font-serif text-lg font-semibold text-[#292B26] mb-1">{step.title}</h4>
                <p className="text-xs text-[#77766D] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-[#34483A] hover:underline">
              <span>Read the detailed scientific methodology</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- 4. STRESS-MONITOR & AI INTELLIGENCE SHOWCASE ----------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
              Live Biometrics
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#292B26] leading-tight">
              Biometric intelligence without invasive trackers.
            </h2>
            <p className="text-sm text-[#77766D] mt-4 leading-relaxed">
              Psygma cross-analyzes self-reported scores with continuous lifestyle parameters to project an estimated stress trajectory. We explicitly differentiate what you felt from what the model computed.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#34483A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#292B26]">Dual-Trajectory Tracking:</strong>
                  <span className="text-[#77766D] block">Separate curves for subjective sensation and algorithmic estimation.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#34483A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#292B26]">Confidence Bound Shading:</strong>
                  <span className="text-[#77766D] block">Communicates certainty intervals based on historical check-in density.</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to={isAuthenticated ? "/app/stress-monitor" : "/signup"} className="pill-button-primary text-sm flex items-center gap-2">
                <span>{isAuthenticated ? 'Open Stress Monitor' : 'Sign Up to Monitor Stress'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-xl">
              <StressChart checkins={INITIAL_CHECKINS} showControls={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 5. INTERACTIVE BREATHING & AUDIO EXPERIENCES ----------------- */}
      <section className="py-24 bg-[#E9E5D9]/40 border-y border-[#E4DED2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-3">
              Wellness Studio
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#292B26]">
              Immediate resets for mind and body.
            </h2>
            <p className="text-sm text-[#77766D] mt-3 leading-relaxed">
              Experience our functional Box Breathing pacing and soothing synthesized nature soundscapes directly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Interactive Breathing Widget */}
            <div className="w-full flex justify-center">
              <BreathingWidget compact={false} />
            </div>

            {/* Mindful Audio Player */}
            <div className="w-full">
              <AudioPlayer />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 6. NATURE ESCAPES & RETREATS SHOWCASE ----------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-3">
              Mindful Travel
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#292B26] leading-tight">
              Curated nature escapes & retreats.
            </h2>
            <p className="text-sm text-[#77766D] mt-2">
              Integrated with the verified TinyFish Discovery API to surface authentic high-serenity sanctuaries.
            </p>
          </div>

          <Link to="/travel" className="pill-button-secondary text-sm shrink-0 self-start md:self-auto">
            <span>Explore All Sanctuaries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Retreat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NATURE_RETREATS.slice(0, 3).map(retreat => (
            <div
              key={retreat.id}
              className="glass-card rounded-3xl overflow-hidden border-[#E4DED2] group hover:border-[#34483A] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src={retreat.imageUrl}
                    alt={retreat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#FBF9F4]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#34483A]">
                    {retreat.biome}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#34483A]/90 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                    ★ {retreat.serenityRating}% Serenity
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[11px] font-semibold text-[#777B51] uppercase tracking-wider mb-1">
                    {retreat.region}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#292B26] mb-2">{retreat.name}</h3>
                  <p className="text-xs text-[#77766D] leading-relaxed line-clamp-2">{retreat.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#E4DED2]/60 mt-4 flex items-center justify-between text-xs text-[#77766D]">
                <span>{retreat.durationText}</span>
                <span className="font-semibold text-[#34483A]">{retreat.estimatedCost}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- 7. PRIVACY & RESPONSIBLE AI PLEDGE ----------------- */}
      <section className="py-20 bg-[#34483A] text-[#FBF9F4] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 mx-auto flex items-center justify-center text-white mb-6 border border-white/20">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium mb-4">
            Compassionate AI grounded in strict privacy ethics.
          </h2>
          <p className="text-base sm:text-lg text-[#FBF9F4]/80 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Psygma operates on zero advertising, client-side encryption options, and clear non-diagnostic boundaries. Your emotional and biometric experiences will never be sold or brokered.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left mb-10">
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15">
              <Lock className="w-5 h-5 text-[#A6B59A] mb-2" />
              <div className="font-semibold text-sm mb-1">User Data Ownership</div>
              <p className="text-xs text-[#FBF9F4]/70">Export all records to JSON or purge permanently with one click.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15">
              <Brain className="w-5 h-5 text-[#A6B59A] mb-2" />
              <div className="font-semibold text-sm mb-1">Explainable Reasoning</div>
              <p className="text-xs text-[#FBF9F4]/70">Every insight cites underlying factors and acknowledges confidence bounds.</p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15">
              <Heart className="w-5 h-5 text-[#A6B59A] mb-2" />
              <div className="font-semibold text-sm mb-1">Non-Diagnostic Charter</div>
              <p className="text-xs text-[#FBF9F4]/70">Positioned as an everyday wellness companion, never clinical psychiatry.</p>
            </div>
          </div>

          <Link to="/privacy" className="pill-button bg-[#FBF9F4] text-[#34483A] hover:bg-white text-sm font-semibold shadow-lg">
            <span>Read our Privacy & Responsible AI Framework</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ----------------- 8. FINAL CALL TO ACTION ----------------- */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl text-[#292B26] mb-6">
          Ready to cultivate personal resilience?
        </h2>
        <p className="text-base sm:text-lg text-[#77766D] max-w-xl mx-auto leading-relaxed mb-8">
          Begin with a 2-minute daily check-in. Experience how small, compassionate actions transform your stress into calm.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/app" className="pill-button-primary px-8 py-3.5 text-base shadow-lg w-full sm:w-auto flex items-center justify-center gap-2">
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <>
              <Link to="/signup" className="pill-button-primary px-8 py-3.5 text-base shadow-lg w-full sm:w-auto flex items-center justify-center gap-2">
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/login" className="pill-button-secondary px-8 py-3.5 text-base w-full sm:w-auto flex items-center justify-center gap-2">
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
