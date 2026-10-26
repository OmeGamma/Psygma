import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioSynth } from '../../services/audioSynth';

type Technique = 'box' | '478' | 'coherence';

interface Phase {
  name: string;
  duration: number; // in seconds
  scale: number;
  instruction: string;
}

const TECHNIQUES: Record<Technique, { name: string; subtitle: string; phases: Phase[] }> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    subtitle: 'Nervous system equilibrium and acute composure',
    phases: [
      { name: 'Inhale', duration: 4, scale: 1.35, instruction: 'Inhale deeply through your nose' },
      { name: 'Hold', duration: 4, scale: 1.35, instruction: 'Hold breath gently in your chest' },
      { name: 'Exhale', duration: 4, scale: 1.0, instruction: 'Exhale smoothly through your mouth' },
      { name: 'Hold Empty', duration: 4, scale: 1.0, instruction: 'Rest in the quiet stillness' },
    ]
  },
  '478': {
    name: '4-7-8 Relaxing Breath',
    subtitle: 'Pre-sleep calming and vagal nerve tone stimulation',
    phases: [
      { name: 'Inhale', duration: 4, scale: 1.35, instruction: 'Inhale quietly through your nose' },
      { name: 'Hold', duration: 7, scale: 1.35, instruction: 'Hold breath with ease' },
      { name: 'Exhale', duration: 8, scale: 1.0, instruction: 'Exhale fully with a gentle whoosh' },
    ]
  },
  coherence: {
    name: '5-5 Heart Coherence',
    subtitle: 'Balances sympathetic and parasympathetic rhythms',
    phases: [
      { name: 'Inhale', duration: 5, scale: 1.35, instruction: 'Slow continuous inhale' },
      { name: 'Exhale', duration: 5, scale: 1.0, instruction: 'Slow continuous exhale' },
    ]
  }
};

export const BreathingWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [techniqueKey, setTechniqueKey] = useState<Technique>('box');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activeTechnique = TECHNIQUES[techniqueKey];
  const currentPhase = activeTechnique.phases[currentPhaseIndex];

  // Timer loop
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Advance to next phase
          const nextIndex = (currentPhaseIndex + 1) % activeTechnique.phases.length;
          if (nextIndex === 0) {
            setCompletedCycles(c => c + 1);
          }
          setCurrentPhaseIndex(nextIndex);
          if (soundEnabled && nextIndex === 0) {
            // Soft cue
            audioSynth.playTrack('bowls', 0.2);
            setTimeout(() => audioSynth.stop(), 2500);
          }
          return activeTechnique.phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhaseIndex, activeTechnique, soundEnabled]);

  const handleStartPause = () => {
    if (!isActive) {
      setIsActive(true);
      setSecondsRemaining(currentPhase.duration);
      if (soundEnabled) {
        audioSynth.playTrack('bowls', 0.2);
        setTimeout(() => audioSynth.stop(), 2500);
      }
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(activeTechnique.phases[0].duration);
    setCompletedCycles(0);
  };

  const switchTechnique = (t: Technique) => {
    setTechniqueKey(t);
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsRemaining(TECHNIQUES[t].phases[0].duration);
    setCompletedCycles(0);
  };

  return (
    <div className={`glass-card p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden ${compact ? 'max-w-md' : 'max-w-2xl w-full'}`}>
      {/* Background breathing aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <motion.div
          animate={{
            scale: isActive ? currentPhase.scale : 1,
            opacity: isActive ? 0.35 : 0.15
          }}
          transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
          className="w-72 h-72 rounded-full bg-[#A6B59A] blur-3xl"
        />
      </div>

      {/* Header & Preset Switcher */}
      <div className="w-full relative z-10 mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77766D]">
            <Sparkles className="w-3.5 h-3.5 text-[#777B51]" /> Somatic Regulation
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-full transition-colors ${soundEnabled ? 'text-[#34483A] bg-[#E9E5D9]' : 'text-[#77766D] hover:bg-[#E9E5D9]'}`}
            title={soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-2 p-1 bg-[#E9E5D9]/70 rounded-full w-full justify-between overflow-x-auto hide-scrollbar">
          {(['box', '478', 'coherence'] as Technique[]).map(key => (
            <button
              key={key}
              onClick={() => switchTechnique(key)}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                techniqueKey === key
                  ? 'bg-[#FBF9F4] text-[#34483A] shadow-xs font-semibold'
                  : 'text-[#77766D] hover:text-[#292B26]'
              }`}
            >
              {key === 'box' ? 'Box 4-4-4-4' : key === '478' ? 'Relax 4-7-8' : 'Coherence 5-5'}
            </button>
          ))}
        </div>
      </div>

      {/* Center Animated Breathing Orb */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center min-h-[220px]">
        {/* Animated concentric rings */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isActive ? currentPhase.scale : 1,
            }}
            transition={{
              duration: isActive ? currentPhase.duration : 0.6,
              ease: 'easeInOut'
            }}
            className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#D7C5AC]/40 via-[#A6B59A]/30 to-[#34483A]/15 border-2 border-[#A6B59A]/60 flex items-center justify-center shadow-inner"
          >
            <motion.div
              animate={{
                scale: isActive ? (currentPhase.scale > 1.1 ? 1.1 : 0.9) : 1
              }}
              transition={{
                duration: isActive ? currentPhase.duration : 0.6,
                ease: 'easeInOut'
              }}
              className="w-32 h-32 rounded-full bg-[#FBF9F4] border border-[#E4DED2] flex flex-col items-center justify-center shadow-md p-2 text-center"
            >
              <span className="text-xs uppercase tracking-widest font-semibold text-[#77766D]">
                {isActive ? currentPhase.name : 'Ready'}
              </span>
              <span className="font-serif text-3xl font-bold text-[#34483A] my-0.5">
                {isActive ? secondsRemaining : activeTechnique.phases[0].duration}s
              </span>
              <span className="text-[10px] text-[#77766D]">
                {completedCycles} {completedCycles === 1 ? 'cycle' : 'cycles'}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Guidance Instruction */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase.instruction}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-medium text-[#292B26] mt-5 min-h-[20px]"
          >
            {isActive ? currentPhase.instruction : 'Press Begin to start rhythmic pacing.'}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="w-full relative z-10 mt-6 pt-4 border-t border-[#E4DED2] flex items-center justify-center gap-3">
        <button
          onClick={handleStartPause}
          className="pill-button-primary py-2.5 px-6 text-sm flex items-center gap-2 shadow-xs"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Begin Breathing</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="pill-button-secondary py-2.5 px-3.5 text-sm"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
