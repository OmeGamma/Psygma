import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Award,
  Calendar,
  Check,
  Info,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { RecoveryPlan } from '../../types/wellness';
import { ActivityReflectionModal } from '../../components/wellness/ActivityReflectionModal';

export const PlannerPage: React.FC = () => {
  const [timeBudget, setTimeBudget] = useState<number>(30);
  const [energyLevel, setEnergyLevel] = useState<string>('Moderate');
  const [budget, setBudget] = useState<string>('Free');
  const [locationPref, setLocationPref] = useState<string>('Nearby nature');
  const [socialPref, setSocialPref] = useState<string>('Quiet solo');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [dismissedPrimary, setDismissedPrimary] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [generatedPlan, setGeneratedPlan] = useState<RecoveryPlan | null>(null);

  // Reflection modal state
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{
    title: string;
    category: string;
    duration: number;
  }>({
    title: 'Box Breathing',
    category: 'Breathing Routine',
    duration: 10
  });

  const generatePlan = async () => {
    setLoading(true);
    setDismissedPrimary(false);
    try {
      const plan = await psygmaApi.generateRecoveryPlan({
        timeMinutes: timeBudget,
        energy: energyLevel,
        budget,
        location: locationPref,
        preference: socialPref
      });
      setGeneratedPlan(plan);
      setSavedSuccess(false);
    } catch (err) {
      console.error('Plan generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePlan();
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlan();
  };

  const handleSaveToRoutine = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenReflection = (title: string, category: string, duration?: number) => {
    setSelectedActivity({
      title,
      category,
      duration: duration || Math.min(timeBudget, 20)
    });
    setReflectionModalOpen(true);
  };

  // Primary recommendation is the first activity
  const primaryActivity = generatedPlan?.activities && generatedPlan.activities.length > 0
    ? generatedPlan.activities[0]
    : null;

  // Alternatives are remaining activities
  const alternativeActivities = generatedPlan?.activities && generatedPlan.activities.length > 1
    ? generatedPlan.activities.slice(1)
    : [];

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
          Personalized Routine
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
          Recovery Planner
        </h1>
        <p className="text-sm text-[#77766D] mt-1 font-light">
          Find wellness activities tailored to your available time, current energy, and environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
          <h3 className="font-serif text-xl text-[#292B26] mb-5">Your Current Context</h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#77766D] mb-1.5">
                Available Time
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[15, 30, 45, 60, 120, 240].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeBudget(mins)}
                    className={`py-2 px-1 rounded-xl font-semibold border transition-all text-center ${
                      timeBudget === mins
                        ? 'bg-[#34483A] text-white border-[#34483A]'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins} min`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#77766D] mb-1.5">
                Energy Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Low (Tired)', 'Moderate', 'High & Ready'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setEnergyLevel(opt.split(' ')[0])}
                    className={`py-2 px-1 rounded-xl font-semibold border transition-all text-center ${
                      energyLevel === opt.split(' ')[0]
                        ? 'bg-[#34483A] text-white border-[#34483A]'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#77766D] mb-1.5">
                Activity Budget
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Free', 'Budget ($)', 'Flexible'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudget(opt.split(' ')[0])}
                    className={`py-2 px-1 rounded-xl font-semibold border transition-all text-center ${
                      budget === opt.split(' ')[0]
                        ? 'bg-[#34483A] text-white border-[#34483A]'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#77766D] mb-1.5">
                Setting / Location
              </label>
              <select
                value={locationPref}
                onChange={(e) => setLocationPref(e.target.value)}
                className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-3 py-2 text-[#292B26] focus:outline-none"
              >
                <option value="At home / indoor">At home / indoor</option>
                <option value="Nearby nature">Nearby nature (park, trails)</option>
                <option value="Retreat sanctuary">Retreat sanctuary</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#77766D] mb-1.5">
                Social Environment
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Quiet solo', 'Social & active'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSocialPref(opt)}
                    className={`py-2 px-1 rounded-xl font-semibold border transition-all text-center ${
                      socialPref === opt
                        ? 'bg-[#34483A] text-white border-[#34483A]'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="pill-button-primary w-full py-3 mt-4 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Finding activities...' : 'Find Recovery Activities'}</span>
            </button>
          </form>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 space-y-6">
          {generatedPlan && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm space-y-6 bg-[#FBF9F4]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4DED2]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block mb-0.5">
                    Tailored Plan • {timeBudget} min window
                  </span>
                  <h3 className="font-serif text-2xl text-[#292B26]">
                    Recommended Activities
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-[#E9E5D9] px-3.5 py-1.5 rounded-full border border-[#D7C5AC] self-start sm:self-auto">
                  <Award className="w-4 h-4 text-[#34483A]" />
                  <span className="text-xs font-bold text-[#34483A]">
                    +{generatedPlan.totalRecoveryScore} Recovery Pts
                  </span>
                </div>
              </div>

              {/* Explainable AI Rationale */}
              {generatedPlan.explanation && (
                <div className="p-3.5 rounded-2xl bg-[#E9E5D9]/60 border border-[#D7C5AC] text-xs flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#34483A] block mb-0.5">Why this was recommended:</strong>
                    <span className="text-stone-700 leading-relaxed font-medium">
                      "{generatedPlan.explanation}"
                    </span>
                  </div>
                </div>
              )}

              {/* 1. Primary Recommendation Card */}
              {primaryActivity && !dismissedPrimary && (
                <div className="p-5 rounded-3xl bg-[#F4F0E8] border-2 border-[#34483A]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#34483A] text-white">
                      Primary Recommendation
                    </span>
                    <button
                      onClick={() => setDismissedPrimary(true)}
                      className="text-[#77766D] hover:text-[#292B26] p-1 rounded-full text-xs flex items-center gap-1"
                      title="Dismiss primary recommendation"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-xl font-semibold text-[#292B26]">{primaryActivity.title}</h4>
                      <p className="text-xs text-[#77766D] mt-1">{primaryActivity.description}</p>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#34483A] bg-[#A6B59A]/30 px-3 py-1 rounded-full self-start sm:self-auto">
                      {primaryActivity.timeBlock} • +{primaryActivity.recoveryPoints} pts
                    </div>
                  </div>

                  {/* Constraints summary */}
                  <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-[#77766D]">
                    <span className="px-2 py-0.5 rounded-lg bg-[#E9E5D9]">Setting: {locationPref}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#E9E5D9]">Energy: {energyLevel}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#E9E5D9]">Budget: {budget}</span>
                  </div>

                  {/* Actions: Start, Complete, Skip */}
                  <div className="pt-3 border-t border-[#E4DED2] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/app/wellness"
                        className="pill-button-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start in Studio</span>
                      </Link>

                      <button
                        onClick={() => handleOpenReflection(primaryActivity.title, primaryActivity.category)}
                        className="pill-button-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A]" />
                        <span>Complete & Reflect</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setDismissedPrimary(true)}
                      className="text-xs text-[#77766D] hover:underline"
                    >
                      Skip this
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Alternative Recommendations */}
              {alternativeActivities.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#777B51]">
                    Alternative Activities
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {alternativeActivities.map((act, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[#77766D] mb-1">
                            <span className="font-mono text-[11px]">{act.timeBlock}</span>
                            <span className="font-semibold text-[#34483A] bg-[#A6B59A]/20 px-2 py-0.5 rounded-full text-[10px]">
                              +{act.recoveryPoints} pts
                            </span>
                          </div>
                          <h5 className="font-serif text-base font-semibold text-[#292B26]">{act.title}</h5>
                          <p className="text-[#77766D] mt-1 line-clamp-2">{act.description}</p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-[#E4DED2]/60">
                          <button
                            onClick={() => handleOpenReflection(act.title, act.category)}
                            className="text-[11px] font-semibold text-[#34483A] hover:underline flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Log Completed</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection prompt */}
              <div className="p-3.5 rounded-2xl bg-[#E9E5D9]/70 border border-[#D7C5AC] text-xs text-[#77766D] italic">
                "{generatedPlan.reflectionPrompt}"
              </div>

              {/* Bottom Routine Save */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  onClick={handleSaveToRoutine}
                  className="pill-button-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Save Plan to Today's Routine</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs font-medium text-green-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to Routine!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Reflection Modal */}
      <ActivityReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        activityTitle={selectedActivity.title}
        category={selectedActivity.category}
        durationMinutes={selectedActivity.duration}
      />
    </div>
  );
};
