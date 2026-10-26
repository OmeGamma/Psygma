import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wind,
  Music,
  Activity,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  MapPin
} from 'lucide-react';
import { BreathingWidget } from '../../components/wellness/BreathingWidget';
import { AudioPlayer } from '../../components/wellness/AudioPlayer';
import { WELLNESS_ACTIVITIES } from '../../constants/demoData';

export const WellnessStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'audio' | 'movement' | 'routines'>('breathing');

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          The Psygma Sanctuary
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Wellness Studio
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          A tranquil digital space offering guided autonomic breathing, binaural synthesized soundscapes, mindful sports, and daily restorative rituals.
        </p>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1.5 bg-[#E9E5D9]/70 rounded-full max-w-md mx-auto mt-8 border border-[#D7C5AC]/60 justify-between overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'breathing' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breathing</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'audio' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Mindful Audio</span>
          </button>
          <button
            onClick={() => setActiveTab('movement')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'movement' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Movement</span>
          </button>
          <button
            onClick={() => setActiveTab('routines')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'routines' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Routines</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Breathing */}
      {activeTab === 'breathing' && (
        <div id="breathing" className="space-y-12 animate-in fade-in duration-300">
          <div className="flex justify-center">
            <BreathingWidget compact={false} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
              <h4 className="font-serif text-lg font-semibold text-[#292B26] mb-2">Box Breathing (4-4-4-4)</h4>
              <p className="text-xs text-[#77766D] leading-relaxed">
                Utilized by elite performers and researchers to stabilize autonomic nervous tone during acute cognitive stress.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
              <h4 className="font-serif text-lg font-semibold text-[#292B26] mb-2">4-7-8 Relaxing Breath</h4>
              <p className="text-xs text-[#77766D] leading-relaxed">
                Extended exhalation activates parasympathetic vagal stimulation, triggering a natural pre-sleep calm state.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
              <h4 className="font-serif text-lg font-semibold text-[#292B26] mb-2">5-5 Heart Coherence</h4>
              <p className="text-xs text-[#77766D] leading-relaxed">
                Paces respiration to roughly 6 breaths per minute, maximizing Heart Rate Variability (HRV) resonance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Audio */}
      {activeTab === 'audio' && (
        <div id="audio" className="space-y-12 animate-in fade-in duration-300">
          <AudioPlayer />
        </div>
      )}

      {/* Tab 3: Sports & Movement */}
      {activeTab === 'movement' && (
        <div id="movement" className="space-y-8 animate-in fade-in duration-300 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WELLNESS_ACTIVITIES.filter(a => a.category === 'movement').map(act => (
              <div key={act.id} className="glass-card rounded-3xl overflow-hidden border-[#E4DED2] flex flex-col justify-between">
                <div>
                  <div className="h-56 overflow-hidden">
                    <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase text-[#777B51]">{act.subtitle}</span>
                      <span className="text-xs font-medium text-[#77766D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {act.durationMinutes} min
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{act.title}</h3>
                    <p className="text-sm text-[#77766D] leading-relaxed mb-4">{act.description}</p>

                    <div className="space-y-1.5 pt-4 border-t border-[#E4DED2]">
                      <div className="text-xs font-semibold text-[#292B26]">Physiological Benefits:</div>
                      {act.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#77766D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A]" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link to="/app/recovery-planner" className="pill-button-primary w-full text-center text-xs py-2.5">
                    Add to Today's Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Daily Routines */}
      {activeTab === 'routines' && (
        <div id="routines" className="space-y-6 animate-in fade-in duration-300 text-left">
          {[
            {
              time: '08:00 AM',
              title: 'Morning Circadian Alignment',
              desc: 'Step into natural morning light within 30 minutes of waking. Hydrate with warm water or herbal tea before reviewing notifications.',
              duration: '15 min',
              icon: Sparkles
            },
            {
              time: '01:30 PM',
              title: 'Midday Cognitive Reset',
              desc: 'Take 5 minutes of Box Breathing or a 15-minute screen-free walk to prevent post-lunch cognitive fatigue.',
              duration: '15 min',
              icon: Wind
            },
            {
              time: '10:00 PM',
              title: 'Evening Digital Sunset',
              desc: 'Dim ambient overhead lights. Shift screens to warm spectrum or initiate a 4-7-8 relaxing breath session.',
              duration: '20 min',
              icon: Clock
            }
          ].map((routine, idx) => {
            const Icon = routine.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border-[#E4DED2] flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold text-[#777B51]">{routine.time}</span>
                    <span className="text-xs text-[#77766D]">{routine.duration}</span>
                  </div>
                  <h4 className="font-serif text-xl font-semibold text-[#292B26] mb-1">{routine.title}</h4>
                  <p className="text-sm text-[#77766D] leading-relaxed">{routine.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
