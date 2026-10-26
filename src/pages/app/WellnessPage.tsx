import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Wind,
  Music,
  Clock,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Activity,
  Heart,
  Trees,
  BookOpen,
  ArrowRight,
  Plus
} from 'lucide-react';
import { BreathingWidget } from '../../components/wellness/BreathingWidget';
import { AudioPlayer } from '../../components/wellness/AudioPlayer';
import { ActivityReflectionModal } from '../../components/wellness/ActivityReflectionModal';
import { audioSynth } from '../../services/audioSynth';

export const WellnessPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'breathing' | 'meditation' | 'audio' | 'movement' | 'study'>('breathing');

  useEffect(() => {
    if (location.hash === '#movement') setActiveTab('movement');
    else if (location.hash === '#meditation') setActiveTab('meditation');
    else if (location.hash === '#audio') setActiveTab('audio');
    else if (location.hash === '#study') setActiveTab('study');
    else if (location.hash === '#breathing') setActiveTab('breathing');
  }, [location.hash]);

  // Meditation timer state
  const [meditationMinutes, setMeditationMinutes] = useState<number>(10);
  const [meditationSecondsLeft, setMeditationSecondsLeft] = useState<number>(600);
  const [meditationActive, setMeditationActive] = useState<boolean>(false);
  const [meditationFinished, setMeditationFinished] = useState<boolean>(false);

  // Reflection modal state
  const [reflectionModalOpen, setReflectionModalOpen] = useState<boolean>(false);
  const [reflectionActivity, setReflectionActivity] = useState<{
    title: string;
    category: string;
    duration: number;
  }>({
    title: 'Box Breathing (4-4-4-4)',
    category: 'Breathing Routine',
    duration: 10
  });

  const openReflection = (title: string, category: string, duration: number) => {
    setReflectionActivity({ title, category, duration });
    setReflectionModalOpen(true);
  };

  useEffect(() => {
    if (!meditationActive) return;

    const timer = setInterval(() => {
      setMeditationSecondsLeft(prev => {
        if (prev <= 1) {
          setMeditationActive(false);
          setMeditationFinished(true);
          // Play singing bowl chime
          audioSynth.playTrack('bowls', 0.5);
          setTimeout(() => audioSynth.stop(), 8000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [meditationActive]);

  const startMeditation = (mins: number) => {
    setMeditationMinutes(mins);
    setMeditationSecondsLeft(mins * 60);
    setMeditationActive(true);
    setMeditationFinished(false);
    audioSynth.playTrack('bowls', 0.3);
    setTimeout(() => audioSynth.stop(), 4000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Restoration & Calm
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            Wellness Studio
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Paced breathing exercises, meditation timer, acoustic soundscapes, and movement resets.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 p-1 bg-[#E9E5D9]/70 rounded-full border border-[#D7C5AC]/60 self-start sm:self-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'breathing' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breathing</span>
          </button>
          <button
            onClick={() => setActiveTab('meditation')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'meditation' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Meditation</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audio' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Mindful Audio</span>
          </button>
          <button
            onClick={() => setActiveTab('movement')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'movement' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sports & Movement</span>
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'study' ? 'bg-[#34483A] text-white shadow-xs' : 'text-[#77766D] hover:text-[#292B26]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study & Work Breaks</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Breathing */}
      {activeTab === 'breathing' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-center">
            <BreathingWidget compact={false} />
          </div>
          <div className="text-center">
            <button
              onClick={() => openReflection('Box Breathing (4-4-4-4)', 'Somatic Respiration', 10)}
              className="pill-button-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A]" />
              <span>Finished Breathing? Log Your Reflection</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: Meditation */}
      {activeTab === 'meditation' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="glass-card p-8 sm:p-12 rounded-3xl border-[#E4DED2] max-w-xl mx-auto text-center space-y-6 bg-[#FBF9F4]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51]">
              Silent Vipassana / Mindful Sitting
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
              Meditation Session Timer
            </h2>

            {/* Big Countdown */}
            <div className="font-serif text-6xl sm:text-7xl font-bold text-[#34483A] my-6">
              {formatTime(meditationSecondsLeft)}
            </div>

            {meditationFinished ? (
              <div className="p-4 bg-green-50 text-green-800 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Session completed. Harmonic singing bowl chime rang.</span>
                </div>
                <button
                  onClick={() => openReflection(`Mindful Meditation (${meditationMinutes}m)`, 'Mindfulness & Stillness', meditationMinutes)}
                  className="pill-button-primary text-xs py-1.5 px-3"
                >
                  Log Your Reflection
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#77766D] max-w-md mx-auto">
                Select your intended silence window. A gentle singing bowl chime signals the conclusion.
              </p>
            )}

            {/* Quick minute selectors */}
            <div className="flex justify-center gap-2 pt-2">
              {[5, 10, 15, 20].map(mins => (
                <button
                  key={mins}
                  onClick={() => startMeditation(mins)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    meditationMinutes === mins && !meditationFinished
                      ? 'bg-[#34483A] text-white border-[#34483A]'
                      : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 pt-4 border-t border-[#E4DED2]">
              <button
                onClick={() => setMeditationActive(!meditationActive)}
                className="pill-button-primary text-xs py-3 px-6 flex items-center gap-2 shadow-xs"
              >
                {meditationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{meditationActive ? 'Pause Sitting' : 'Start Sitting'}</span>
              </button>

              <button
                onClick={() => {
                  setMeditationActive(false);
                  setMeditationSecondsLeft(meditationMinutes * 60);
                  setMeditationFinished(false);
                }}
                className="pill-button-secondary text-xs py-3 px-4"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Audio */}
      {activeTab === 'audio' && (
        <div className="space-y-6 animate-in fade-in">
          <AudioPlayer />
          <div className="text-center">
            <button
              onClick={() => openReflection('Soulful Bansuri & Monsoon Rain Audio', 'Mindful Soundscape', 20)}
              className="pill-button-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A]" />
              <span>Finished Listening? Log Your Reflection</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 4: Sports & Movement */}
      {activeTab === 'movement' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border-[#E4DED2] space-y-4 flex flex-col justify-between bg-[#FBF9F4]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777B51] tracking-wider block mb-1">
                  Active Play & Fun
                </span>
                <h3 className="font-serif text-2xl text-[#292B26]">Casual Badminton Rallies</h3>
                <p className="text-xs text-[#77766D] leading-relaxed mt-2">
                  Playing friendly rallies with family or friends refreshes your eyes, stretches stiff muscles, and brings smiles after a long tiring day.
                </p>
                <div className="mt-4 pt-3 border-t border-[#E4DED2] text-xs text-stone-600 space-y-1">
                  <div>Duration: <strong>30-45 minutes</strong></div>
                  <div>Setting: <strong>Nearby park or open ground</strong></div>
                  <div>Benefit: <strong>Instant mood lift & energy</strong></div>
                </div>
              </div>
              <button
                onClick={() => openReflection('Badminton Session', 'Active Movement', 35)}
                className="pill-button-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5"
              >
                <span>Record Completed Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-card p-6 rounded-3xl border-[#E4DED2] space-y-4 flex flex-col justify-between bg-[#FBF9F4]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777B51] tracking-wider block mb-1">
                  Fresh Air Walk
                </span>
                <h3 className="font-serif text-2xl text-[#292B26]">Park & Garden Walk</h3>
                <p className="text-xs text-[#77766D] leading-relaxed mt-2">
                  A peaceful walk in a nearby garden or tree-shaded street without looking at phone screens. The open breeze and green trees quickly clear mind fog and ease stress.
                </p>
                <div className="mt-4 pt-3 border-t border-[#E4DED2] text-xs text-stone-600 space-y-1">
                  <div>Duration: <strong>25-30 minutes</strong></div>
                  <div>Setting: <strong>Colony park or quiet street</strong></div>
                  <div>Benefit: <strong>Clears mind fog & restores calm</strong></div>
                </div>
              </div>
              <button
                onClick={() => openReflection('Park & Garden Walk', 'Nature Movement', 25)}
                className="pill-button-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5"
              >
                <span>Record Completed Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="glass-card p-6 rounded-3xl border-[#E4DED2] space-y-4 flex flex-col justify-between bg-[#FBF9F4]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777B51] tracking-wider block mb-1">
                  Easy Body Stretching
                </span>
                <h3 className="font-serif text-2xl text-[#292B26]">Light Body Stretch & Gentle Yoga</h3>
                <p className="text-xs text-[#77766D] leading-relaxed mt-2">
                  When you feel tired or low on energy: simple neck rolls, gentle shoulder rotations, and resting comfortably on a mat or bed to release stiff back muscles.
                </p>
                <div className="mt-4 pt-3 border-t border-[#E4DED2] text-xs text-stone-600 space-y-1">
                  <div>Duration: <strong>15-20 minutes</strong></div>
                  <div>Setting: <strong>Home room or yoga mat</strong></div>
                  <div>Benefit: <strong>Releases neck & back tension</strong></div>
                </div>
              </div>
              <button
                onClick={() => openReflection('Light Body Stretch & Gentle Yoga', 'Somatic Rest', 15)}
                className="pill-button-primary text-xs py-2 px-4 w-full flex items-center justify-center gap-1.5"
              >
                <span>Record Completed Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Study & Work Breaks */}
      {activeTab === 'study' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4 bg-[#FBF9F4]">
              <span className="text-[10px] uppercase font-bold text-[#777B51] tracking-wider block">
                Study & Exam Refresh
              </span>
              <h3 className="font-serif text-2xl text-[#292B26]">Study-Break 10-Minute Reset</h3>
              <p className="text-xs text-[#77766D] leading-relaxed">
                Long hours of continuous reading or computer work tires your eyes and brain. This easy 10-minute pause helps you regain fresh focus:
              </p>
              <ul className="text-xs text-[#292B26] space-y-2 list-disc pl-4">
                <li><strong>Minutes 0-3:</strong> Close eyes gently and take 10 slow, deep belly breaths.</li>
                <li><strong>Minutes 3-7:</strong> Stand up, look out the window or balcony at green trees and open sky.</li>
                <li><strong>Minutes 7-10:</strong> Drink a glass of fresh water, wash eyes with cool water, and stretch hands and neck.</li>
              </ul>
              <button
                onClick={() => openReflection('Study-Break 10-Minute Reset', 'Cognitive Reset', 10)}
                className="pill-button-primary text-xs py-2 px-4 w-full mt-2"
              >
                Record Completed Study Pause
              </button>
            </div>

            <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4 bg-[#FBF9F4]">
              <span className="text-[10px] uppercase font-bold text-[#777B51] tracking-wider block">
                Office & Work-Break Reset
              </span>
              <h3 className="font-serif text-2xl text-[#292B26]">Work Break & Meeting Buffer</h3>
              <p className="text-xs text-[#77766D] leading-relaxed">
                Sitting through back-to-back video calls or computer tasks creates mental fatigue. Take this quick 8-minute pause:
              </p>
              <ul className="text-xs text-[#292B26] space-y-2 list-disc pl-4">
                <li><strong>Step 1:</strong> Mute all notifications and step away from your chair or desk.</li>
                <li><strong>Step 2:</strong> Take 4 slow cycles of deep relaxing breathing to drop shoulder tension.</li>
                <li><strong>Step 3:</strong> Sip warm water or tea, and write down just one main task to focus on next.</li>
              </ul>
              <button
                onClick={() => openReflection('Work Break & Meeting Buffer', 'Workplace Reset', 8)}
                className="pill-button-primary text-xs py-2 px-4 w-full mt-2"
              >
                Record Completed Meeting Buffer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Closed-Loop Activity Reflection Modal */}
      <ActivityReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        activityTitle={reflectionActivity.title}
        category={reflectionActivity.category}
        durationMinutes={reflectionActivity.duration}
      />
    </div>
  );
};
