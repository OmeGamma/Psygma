import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Sun,
  Moon,
  Activity,
  Battery,
  Coffee,
  Trees,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { MoodType } from '../../types/wellness';

export const CheckInPage: React.FC = () => {
  const { user } = useAuth();
  const { submitCheckIn, checkins } = useWellness();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = checkins.find(c => c.date === todayStr);

  const [mood, setMood] = useState<MoodType>(existingToday?.mood || 'balanced');
  const [reportedStress, setReportedStress] = useState<number>(existingToday?.reportedStress || 4);
  const [energyLevel, setEnergyLevel] = useState<number>(existingToday?.energyLevel || 70);
  const [sleepHours, setSleepHours] = useState<number>(existingToday?.sleepHours || user.preferences.typicalSleepGoalHours || 7.5);
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'fair' | 'good' | 'deep'>(existingToday?.sleepQuality || 'good');
  const [workloadHours, setWorkloadHours] = useState<number>(existingToday?.workloadHours || 6.5);
  const [selectedTags, setSelectedTags] = useState<string[]>(existingToday?.contextTags || []);
  const [notes, setNotes] = useState<string>(existingToday?.notes || '');
  const [showOptionalContext, setShowOptionalContext] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successSaved, setSuccessSaved] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const contextOptions = [
    { tag: 'outdoor', label: 'Outdoor walk / fresh air' },
    { tag: 'screen-time', label: 'Extended screen time' },
    { tag: 'meetings', label: 'Back-to-back meetings' },
    { tag: 'nature', label: 'Nature park or green space' },
    { tag: 'coffee-heavy', label: 'Heavy caffeine intake' },
    { tag: 'badminton', label: 'Sports or active play' },
    { tag: 'quiet-reading', label: 'Quiet reading / offline pause' }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent accidental duplicate submissions

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await submitCheckIn({
        date: todayStr,
        mood,
        reportedStress,
        sleepHours,
        sleepQuality,
        workloadHours,
        energyLevel,
        contextTags: selectedTags,
        notes: notes.trim() ? notes.trim() : undefined
      });
      setSuccessSaved(true);
      setTimeout(() => {
        navigate('/app');
      }, 900);
    } catch (err: unknown) {
      console.error('Check-in error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Unable to record check-in. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-[#292B26] text-left pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4DED2]/60">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-0.5">
            Daily Continuous Monitoring
          </span>
          <h1 className="font-serif text-3xl text-[#292B26]">
            Daily Wellness Check-in
          </h1>
          <p className="text-xs text-[#77766D] mt-1">
            Takes approximately 30–60 seconds. Updates your rolling baseline and recovery recommendations.
          </p>
        </div>

        {existingToday && (
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Checked in today
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successSaved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">Check-in saved successfully! Updating your dashboard...</span>
        </div>
      )}

      <form onSubmit={handleFinish} className="space-y-6">
        {/* ---------------- SECTION 1: STRESS & MOOD ---------------- */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4] space-y-6">
          {/* Question 1: Stress Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#34483A] uppercase tracking-wider">
                1. How stressed have you felt today?
              </label>
              <span className="font-serif text-base font-bold text-[#34483A]">
                {reportedStress} / 10 •{' '}
                <span className="font-sans text-xs font-semibold">
                  {reportedStress <= 3 ? 'Low / Calm' : reportedStress <= 6 ? 'Balanced' : reportedStress <= 8 ? 'Elevated' : 'High Tension'}
                </span>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={reportedStress}
              onChange={(e) => setReportedStress(parseInt(e.target.value))}
              className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#77766D] mt-1.5 font-medium">
              <span>1 (Calm & centered)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe pressure)</span>
            </div>
          </div>

          {/* Question 2: Mood */}
          <div>
            <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-2.5">
              2. What best describes your primary mood?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { type: 'peaceful' as MoodType, label: 'Peaceful', icon: Heart },
                { type: 'balanced' as MoodType, label: 'Balanced', icon: Smile },
                { type: 'energized' as MoodType, label: 'Energized', icon: Sun },
                { type: 'tired' as MoodType, label: 'Tired', icon: Moon },
                { type: 'restless' as MoodType, label: 'Restless', icon: Meh },
                { type: 'overwhelmed' as MoodType, label: 'Overwhelmed', icon: Frown },
              ].map(item => {
                const Icon = item.icon;
                const isSelected = mood === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setMood(item.type)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A] font-semibold shadow-xs'
                        : 'bg-white border-[#E4DED2] text-[#77766D] hover:bg-[#F4F0E8]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Energy Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#34483A] uppercase tracking-wider">
                3. Physical & Mental Energy Level
              </label>
              <span className="text-xs font-bold text-[#34483A]">{energyLevel}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#77766D] mt-1.5 font-medium">
              <span>Depleted (10%)</span>
              <span>Moderate (50%)</span>
              <span>Vibrant (100%)</span>
            </div>
          </div>
        </div>

        {/* ---------------- SECTION 2: SLEEP & WORKLOAD ---------------- */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4] space-y-6">
          {/* Question 4: Sleep Quality & Hours */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#34483A] uppercase tracking-wider">
                4. Last Night's Sleep
              </label>
              <span className="font-serif text-base font-bold text-[#34483A]">
                {sleepHours} hrs
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#77766D] mt-1.5 font-medium">
              <span>4.0h</span>
              <span>7.5h (Target)</span>
              <span>11.0h</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3.5">
              {[
                { key: 'poor' as const, label: 'Poor' },
                { key: 'fair' as const, label: 'Fair' },
                { key: 'good' as const, label: 'Good' },
                { key: 'deep' as const, label: 'Deep' }
              ].map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSleepQuality(s.key)}
                  className={`py-2 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                    sleepQuality === s.key
                      ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A] font-semibold'
                      : 'bg-white border-[#E4DED2] text-[#77766D] hover:bg-[#F4F0E8]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Workload or Daily Pressure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#34483A] uppercase tracking-wider">
                5. Workload / Cognitive Pressure Today
              </label>
              <span className="font-serif text-base font-bold text-[#34483A]">
                {workloadHours} hrs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={workloadHours}
              onChange={(e) => setWorkloadHours(parseFloat(e.target.value))}
              className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#77766D] mt-1.5 font-medium">
              <span>0h (Rest / off)</span>
              <span>6.5h (Moderate)</span>
              <span>12h+ (Intense)</span>
            </div>
          </div>
        </div>

        {/* ---------------- SECTION 3: OPTIONAL CONTEXT (SKIPPABLE) ---------------- */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
          <button
            type="button"
            onClick={() => setShowOptionalContext(!showOptionalContext)}
            className="w-full flex items-center justify-between text-xs font-semibold text-[#34483A] uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>6. Contextual Factors & Note (Optional)</span>
              {selectedTags.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#E9E5D9] text-[#34483A] text-[10px] font-bold">
                  {selectedTags.length} active
                </span>
              )}
            </span>
            {showOptionalContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOptionalContext && (
            <div className="mt-4 pt-4 border-t border-[#E4DED2] space-y-4 animate-in fade-in">
              <div>
                <span className="text-[11px] text-[#77766D] block mb-2">
                  Select any factors that influenced your day:
                </span>
                <div className="flex flex-wrap gap-2">
                  {contextOptions.map(opt => {
                    const active = selectedTags.includes(opt.tag);
                    return (
                      <button
                        key={opt.tag}
                        type="button"
                        onClick={() => toggleTag(opt.tag)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all border cursor-pointer ${
                          active
                            ? 'bg-[#34483A] text-white border-[#34483A] font-semibold'
                            : 'bg-white text-[#77766D] border-[#E4DED2] hover:bg-[#F4F0E8]'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#77766D] uppercase mb-1">
                  Personal Reflection Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Afternoon stroll eased headache; productive morning"
                  className="w-full bg-white border border-[#E4DED2] rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="text-xs text-[#77766D] hover:underline cursor-pointer"
          >
            Cancel and return to dashboard
          </button>

          <button
            type="submit"
            disabled={submitting || successSaved}
            className="pill-button-primary w-full sm:w-auto py-3.5 px-8 text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <span>Saving & calibrating...</span>
            ) : successSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Check-in Recorded!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Complete Daily Check-in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
