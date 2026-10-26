import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Brain, Leaf, Heart, Wind, Compass, Users, User, MapPin, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <div className="min-h-screen bg-psygma-bg flex flex-col font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="p-3 md:p-6 lg:p-8 flex flex-col max-w-[1600px] mx-auto w-full relative min-h-[95vh]">
        <div className="flex-1 rounded-[32px] md:rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col justify-center items-center text-center p-6 md:p-8">
          
          {/* Improved Image Treatment: Warmer, less saturated green, crisp */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80)' }}
          />
          {/* Subtle warm overlay to reduce green saturation */}
          <div className="absolute inset-0 z-0 bg-[#3A2D23]/30 mix-blend-multiply" />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-psygma-earth/60 via-transparent to-transparent opacity-80" />
          
          {/* Header & Logo Lockup */}
          <nav className="absolute top-0 w-full z-50 p-6 md:p-8 flex items-center justify-between left-0">
            {/* Logo Lockup */}
            <div className="flex flex-col text-left ml-2 md:ml-8">
              <span className="text-white text-2xl md:text-3xl font-serif tracking-widest leading-none drop-shadow-md">PSYGMA</span>
            </div>

            {/* Middle Links */}
            <div className="hidden lg:flex items-center gap-8 text-white/90 text-sm font-medium">
              <a href="#explore" className="hover:text-white transition drop-shadow-md">How It Works</a>
              <a href="#explore" className="hover:text-white transition drop-shadow-md">Explore</a>
              <a href="#about" className="hover:text-white transition drop-shadow-md">About</a>
            </div>

            <div className="flex items-center gap-2 md:gap-4 mr-2 md:mr-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-white hover:text-white/80 text-sm font-medium mr-2 drop-shadow-md transition">Dashboard</Link>
                  <Link to="/profile" className="hidden md:block text-white hover:text-white/80 text-sm font-medium mr-2 drop-shadow-md transition">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/sign-in" className="text-white hover:text-white/80 text-sm font-medium mr-2 md:mr-4 drop-shadow-md transition">Sign In</Link>
                  <Link to="/sign-up" className="pill-button bg-white text-psygma-earth shadow-lg px-6 py-2.5 text-sm md:text-base hover:bg-white/90 transition">Sign Up</Link>
                </>
              )}
            </div>
          </nav>

          {/* Floating Content */}
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 mt-24 md:mt-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-white drop-shadow-xl leading-tight"
            >
              Understand Your Mind. <br />
              <span className="text-white/90 italic font-light">Improve Your Life.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-2xl text-white/90 max-w-2xl drop-shadow-md font-light px-4"
            >
              PSYGMA uses AI to understand your wellness patterns and turn them into personalized actions for your mind, body and everyday life.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full sm:w-auto px-4"
            >
              <Link to="/check-in" className="pill-button bg-white text-psygma-text hover:bg-white/90 shadow-2xl px-8 py-4 text-lg w-full sm:w-auto">
                Start Your Wellness Check
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <a href="#explore" className="pill-button glass-card-dark text-white hover:bg-white/20 px-8 py-4 text-lg border border-white/30 w-full sm:w-auto">
                Explore PSYGMA
              </a>
            </motion.div>
          </div>

          {/* Mobile Stacking / Desktop Floating Cards */}
          <div className="w-full relative z-10 mt-16 md:mt-0 md:absolute md:inset-0 pointer-events-none flex flex-col md:block gap-4 px-4 md:px-0 pb-8 md:pb-0">
            {/* Left Insight Card */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="md:absolute md:left-12 md:bottom-24 lg:left-20 lg:bottom-32 glass-card-dark p-5 flex flex-col gap-3 w-full md:max-w-[260px] border border-white/20 text-left text-white pointer-events-auto backdrop-blur-xl"
            >
              <div className="text-xs font-semibold tracking-wider uppercase text-white/70">Your Wellness Insight</div>
              <p className="text-sm font-medium leading-relaxed">Your recovery is lower than usual today.</p>
              <div className="text-xs text-white/80 space-y-1">
                <p>Possible factors:</p>
                <p>• Less sleep</p>
                <p>• High workload</p>
              </div>
            </motion.div>

            {/* Right Action Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="md:absolute md:right-12 md:top-1/3 lg:right-20 lg:top-[40%] glass-card-dark p-5 flex flex-col gap-3 w-full md:max-w-[260px] border border-white/20 text-left text-white pointer-events-auto backdrop-blur-xl"
            >
              <div className="text-xs font-semibold tracking-wider uppercase text-white/70 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Recommended
              </div>
              <p className="text-sm font-medium leading-relaxed">30 min outdoor walk</p>
              <div className="text-xs text-white/80 flex justify-between">
                <span>Good weather</span>
                <span>1.2 km away</span>
              </div>
              <div className="text-xs font-medium mt-2 flex items-center cursor-pointer hover:text-white/80 group">
                View activity <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* --- WHAT IS PSYGMA? --- */}
      <section id="explore" className="py-24 px-6 max-w-6xl mx-auto w-full text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-psygma-text mb-6">Wellness is more than a stress score.</h2>
        <p className="text-lg text-psygma-muted max-w-3xl mx-auto mb-16 leading-relaxed">
          PSYGMA brings together your everyday experiences, habits, mood, activity and personal context to understand how you're doing — and helps you discover what could make today better.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-card p-8 border border-psygma-sand/30 hover:-translate-y-2 transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-psygma-earth/10 flex items-center justify-center text-psygma-earth mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-medium text-psygma-text mb-3">Understand</h3>
            <p className="text-psygma-muted">Know your current wellness state deeply, beyond just feeling "tired" or "okay".</p>
          </div>
          <div className="glass-card p-8 border border-psygma-sand/30 hover:-translate-y-2 transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-psygma-olive/10 flex items-center justify-center text-psygma-olive mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-medium text-psygma-text mb-3">Discover</h3>
            <p className="text-psygma-muted">Understand your personal patterns. See how sleep affects your focus, or how social time impacts your energy.</p>
          </div>
          <div className="glass-card p-8 border border-psygma-sand/30 hover:-translate-y-2 transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-psygma-sand/30 flex items-center justify-center text-psygma-earth mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-medium text-psygma-text mb-3">Act</h3>
            <p className="text-psygma-muted">Take practical steps that fit your life. From 5-minute breathing to weekend retreats.</p>
          </div>
        </div>
      </section>

      {/* --- HOW PSYGMA WORKS (FLOW) --- */}
      <section className="py-24 bg-white/40 border-y border-psygma-sand/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-psygma-text mb-16">How PSYGMA works</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative gap-6 md:gap-0">
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-px bg-psygma-sand -z-10" />
            
            {[
              { num: '01', title: 'CHECK IN', icon: Heart },
              { num: '02', title: 'UNDERSTAND', icon: Brain },
              { num: '03', title: 'PERSONALIZE', icon: Zap },
              { num: '04', title: 'ACT', icon: ArrowRight },
              { num: '05', title: 'LEARN', icon: Activity }
            ].map((step, i) => (
              <div key={step.num} className="glass-card p-6 flex flex-col items-center gap-4 bg-white/80 w-full md:w-40 relative group hover:shadow-xl transition-all duration-300">
                <div className="text-xs font-bold text-psygma-muted/50 mb-1">{step.num}</div>
                <div className="w-12 h-12 rounded-full bg-psygma-bg flex items-center justify-center text-psygma-olive shadow-sm group-hover:scale-110 transition-transform">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-psygma-text text-sm tracking-wider">{step.title}</h3>
              </div>
            ))}
          </div>
          
          <p className="text-psygma-muted max-w-2xl mx-auto mt-16 text-lg">
            Your wellness journey becomes more intelligent over time because PSYGMA learns from your feedback.
          </p>
        </div>
      </section>

      {/* --- MULTIDIMENSIONAL WELLNESS --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-psygma-text mb-4">Your Wellness, Your Way</h2>
          <p className="text-psygma-muted text-lg">PSYGMA is much broader than a stress detector.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Mind', desc: 'Stress • Mood • Mental Load', icon: Brain },
            { title: 'Body', desc: 'Energy • Activity • Recovery', icon: Activity },
            { title: 'Sleep', desc: 'Duration • Quality • Recovery', icon: Wind },
            { title: 'Social', desc: 'Family • Friends • Connection', icon: Users },
            { title: 'Nature', desc: 'Outdoor time • Parks • Travel', icon: Leaf },
            { title: 'Joy', desc: 'Hobbies • Creativity • Recreation', icon: Heart },
            { title: 'Growth', desc: 'Learning • Goals • Development', icon: Compass },
            { title: 'Balance', desc: 'Work • Breaks • Personal Time', icon: Zap },
          ].map(cat => (
            <div key={cat.title} className="glass-card p-6 bg-white/50 border border-psygma-sand/30 flex flex-col items-start gap-4">
              <cat.icon className="w-6 h-6 text-psygma-olive" />
              <div>
                <h3 className="font-serif font-medium text-lg mb-1 text-psygma-text">{cat.title}</h3>
                <p className="text-xs text-psygma-muted leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FROM INSIGHT TO ACTION (Cinematic Split) --- */}
      <section className="relative py-32 px-6">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80)' }}
        />
        <div className="absolute inset-0 bg-[#25251F]/70 z-0 mix-blend-multiply" />
        
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">From Insight <br/><span className="italic text-white/80">to Action.</span></h2>
            <div className="glass-card-dark p-8 border border-white/20 mb-8 backdrop-blur-2xl">
              <div className="text-xs font-semibold tracking-wider uppercase text-white/70 mb-4">Your AI wellness insight</div>
              <p className="text-lg font-medium leading-relaxed mb-4">Your recovery appears lower than your usual baseline today.</p>
              <div className="text-sm text-white/80 space-y-2">
                <p className="font-semibold">Possible factors:</p>
                <p>• Less sleep</p>
                <p>• Higher workload</p>
                <p>• Lower activity</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-serif text-white mb-2">What could help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card-dark p-5 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                <div className="text-psygma-sand text-sm font-semibold mb-1">15 min</div>
                <div className="text-white font-medium">Breathing reset</div>
              </div>
              <div className="glass-card-dark p-5 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                <div className="text-psygma-sand text-sm font-semibold mb-1">30 min</div>
                <div className="text-white font-medium">Outdoor walk</div>
              </div>
              <div className="glass-card-dark p-5 border border-white/10 hover:bg-white/10 transition cursor-pointer">
                <div className="text-psygma-sand text-sm font-semibold mb-1">45 min</div>
                <div className="text-white font-medium">Play badminton</div>
              </div>
              <div className="glass-card-dark p-5 border border-white/10 hover:bg-white/10 transition cursor-pointer bg-white/5">
                <div className="text-psygma-sand text-sm font-semibold mb-1">Weekend</div>
                <div className="text-white font-medium flex items-center justify-between">
                  Nature escape <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <Link to="/check-in" className="pill-button bg-white text-psygma-earth mt-4 self-start">
              Explore My Options
            </Link>
          </div>
        </div>
      </section>

      {/* --- AI COACH PREVIEW --- */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <Sparkles className="w-8 h-8 text-psygma-olive mx-auto mb-6" />
        <h2 className="text-4xl font-serif text-psygma-text mb-6">Meet Your AI Coach</h2>
        <p className="text-lg text-psygma-muted mb-12 max-w-2xl mx-auto">
          A calm, intelligent companion that understands your context and suggests exactly what you need.
        </p>
        
        <div className="glass-card p-6 md:p-8 text-left bg-white/60 border border-psygma-sand/50 shadow-xl max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex gap-4 justify-end">
            <div className="bg-psygma-earth text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-md">
              I've been studying all day and feel mentally exhausted.
            </div>
            <div className="w-8 h-8 rounded-full bg-psygma-olive flex items-center justify-center text-white shrink-0">
              <User className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-psygma-sand flex items-center justify-center text-psygma-earth shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-psygma-sand/30 text-sm max-w-[85%] shadow-sm leading-relaxed text-psygma-text">
              <p className="mb-4">Your mental load appears higher than usual today.</p>
              <p className="mb-4">You have about 45 minutes available. Based on your preferences, here are three options:</p>
              
              <div className="space-y-2">
                <div className="p-3 border border-psygma-sand/40 rounded-xl hover:bg-psygma-bg transition cursor-pointer">
                  <div className="font-medium text-psygma-earth">🏸 Badminton</div>
                  <div className="text-xs text-psygma-muted mt-1">30–45 min</div>
                </div>
                <div className="p-3 border border-psygma-sand/40 rounded-xl hover:bg-psygma-bg transition cursor-pointer">
                  <div className="font-medium text-psygma-earth">🌿 Outdoor Walk</div>
                  <div className="text-xs text-psygma-muted mt-1">25–30 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PERSONAL BASELINE --- */}
      <section className="py-24 px-6 bg-psygma-earth text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif mb-12">PSYGMA learns what's normal for you.</h2>
          
          <div className="flex flex-col items-center gap-6 max-w-sm mx-auto mb-16 text-lg font-medium text-white/80">
            <div>Your usual sleep</div>
            <ArrowRight className="w-5 h-5 rotate-90 text-psygma-sand/50" />
            <div>Your usual activity</div>
            <ArrowRight className="w-5 h-5 rotate-90 text-psygma-sand/50" />
            <div>Your usual mood</div>
            <ArrowRight className="w-5 h-5 rotate-90 text-psygma-sand/50" />
            <div className="text-2xl font-serif text-psygma-sand my-2">Your personal baseline</div>
            <ArrowRight className="w-5 h-5 rotate-90 text-psygma-sand/50" />
            <div className="text-white">Detect meaningful changes</div>
          </div>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            Instead of treating everyone the same, PSYGMA learns your personal patterns over time. What's stressful for one person might be a normal day for you.
          </p>
        </div>
      </section>

      {/* --- PRIVACY SECTION --- */}
      <section className="py-24 px-6 bg-[#25251F] text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Shield className="w-12 h-12 text-psygma-sand mb-6" />
            <h2 className="text-4xl font-serif mb-6">Your wellbeing data belongs to you.</h2>
            <p className="text-white/70 text-lg mb-8 font-light">
              We believe wellness requires trust. PSYGMA is built from the ground up to protect your most personal insights.
            </p>
            <Link to="/sign-in" className="pill-button bg-white/10 hover:bg-white/20 text-white border border-white/20 inline-flex">
              Learn About Privacy
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="glass-card-dark p-8 border border-white/10 space-y-4 text-sm font-medium text-white/90">
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> Consent-based data collection</div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> Secure storage</div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> User-controlled permissions</div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> Optional measurements</div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> Data deletion</div>
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-psygma-olive" /> Transparent AI explanations</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80)' }}
        />
        <div className="absolute inset-0 bg-[#F5F0E8]/90 z-0 backdrop-blur-sm" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-psygma-text mb-6">Start understanding yourself better.</h2>
          <p className="text-xl text-psygma-muted mb-12">Your first wellness check takes only a few minutes.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-in" className="pill-button-primary px-10 py-4 text-lg">
              Start Your Wellness Check
            </Link>
            <a href="#explore" className="pill-button-secondary px-10 py-4 text-lg">
              Explore PSYGMA
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-psygma-muted text-sm border-t border-psygma-sand/30">
        <div className="flex justify-center items-center gap-2 mb-2 font-serif">
          <Leaf className="w-4 h-4 text-psygma-olive" /> PSYGMA
        </div>
        <p>© 2026 PSYGMA. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
