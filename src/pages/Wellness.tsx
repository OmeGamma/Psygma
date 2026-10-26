import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Battery, Brain, Sun, RefreshCw, Wind, MapPin, Phone, Music } from 'lucide-react';

const Wellness = () => {
  return (
    <div className="py-6 max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-psygma-text mb-2">Live Wellness</h1>
        <p className="text-psygma-muted">Your real-time wellness state</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Current State */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Soft breathing animation circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-64 h-64 rounded-full bg-psygma-earth/30 blur-3xl"
              />
            </div>

            <div className="relative z-10 text-center">
              <div className="text-sm font-semibold tracking-widest uppercase text-psygma-muted mb-6">Current State</div>
              
              <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-left">
                <div>
                  <div className="text-psygma-muted text-sm flex items-center gap-2 mb-1"><Activity className="w-4 h-4"/> Stress</div>
                  <div className="text-xl font-serif text-red-800/70">Elevated</div>
                </div>
                <div>
                  <div className="text-psygma-muted text-sm flex items-center gap-2 mb-1"><Battery className="w-4 h-4"/> Energy</div>
                  <div className="text-xl font-serif text-psygma-earth">Moderate</div>
                </div>
                <div>
                  <div className="text-psygma-muted text-sm flex items-center gap-2 mb-1"><Brain className="w-4 h-4"/> Recovery</div>
                  <div className="text-xl font-serif text-psygma-earth">Low</div>
                </div>
                <div>
                  <div className="text-psygma-muted text-sm flex items-center gap-2 mb-1"><Sun className="w-4 h-4"/> Mood</div>
                  <div className="text-xl font-serif text-psygma-earth">Neutral</div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-psygma-sand/30 w-full flex justify-between items-center">
              <div className="text-sm font-medium text-psygma-muted flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> AI Confidence
              </div>
              <div className="text-sm font-semibold text-psygma-text">82%</div>
            </div>
            <p className="text-xs text-psygma-muted text-center mt-3">
              Based on today's check-in, recent activity, sleep and personal baseline.
            </p>
          </motion.div>
        </div>

        {/* Immediate Recommendation */}
        <div className="flex flex-col">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-dark bg-psygma-earth p-8 text-white h-full flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-white/70 mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Current recommendation
              </div>
              <h2 className="text-3xl font-serif mb-6 leading-tight">
                Take a 15-minute reset.
              </h2>
              <p className="text-white/80 mb-8 font-light text-lg">
                Your stress is slightly elevated while your energy is moderate. A short break will help prevent mental fatigue.
              </p>

              <div className="space-y-3">
                <p className="font-medium text-sm text-white/90 mb-3">Options right now:</p>
                
                <button className="w-full flex items-center gap-4 bg-white/10 hover:bg-white/20 transition p-4 rounded-xl border border-white/10">
                  <Wind className="w-5 h-5 text-psygma-sand" />
                  <div className="text-left">
                    <div className="font-medium">Guided Breathing</div>
                    <div className="text-xs text-white/60">5 minutes • Calming</div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-4 bg-white/10 hover:bg-white/20 transition p-4 rounded-xl border border-white/10">
                  <MapPin className="w-5 h-5 text-psygma-sand" />
                  <div className="text-left">
                    <div className="font-medium">Short Walk</div>
                    <div className="text-xs text-white/60">15 minutes • Refreshing</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-4 bg-white/10 hover:bg-white/20 transition p-4 rounded-xl border border-white/10">
                  <Music className="w-5 h-5 text-psygma-sand" />
                  <div className="text-left">
                    <div className="font-medium">Relaxing Music</div>
                    <div className="text-xs text-white/60">10 minutes • Wind down</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;
