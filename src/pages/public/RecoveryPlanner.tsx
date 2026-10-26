import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Clock,
  Battery,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Award
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { RecoveryPlan } from '../../types/wellness';

export const RecoveryPlanner: React.FC = () => {
  const [timeBudget, setTimeBudget] = useState<number>(30);
  const [energyLevel, setEnergyLevel] = useState<string>('Moderate');
  const [budget, setBudget] = useState<string>('Free');
  const [locationPref, setLocationPref] = useState<string>('Nearby nature');
  const [socialPref, setSocialPref] = useState<string>('Quiet solo');

  const [generatedPlan, setGeneratedPlan] = useState<RecoveryPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPlan = async (params: {
    timeMinutes: number;
    energy: string;
    budget: string;
    location: string;
    preference: string;
  }) => {
    setLoading(true);
    try {
      const plan = await psygmaApi.generateRecoveryPlan(params);
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan({
      timeMinutes: 30,
      energy: 'Moderate',
      budget: 'Free',
      location: 'Nearby nature',
      preference: 'Quiet solo'
    });
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlan({
      timeMinutes: timeBudget,
      energy: energyLevel,
      budget,
      location: locationPref,
      preference: socialPref
    });
  };

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Personalized Restoration
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Recovery Planner
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Specify your available time, current somatic energy, budget, and setting. Psygma generates a grounded, high-impact recovery protocol tailored to right now.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Planner Criteria Form */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] text-left">
          <h3 className="font-serif text-2xl text-[#292B26] mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#34483A]" /> Your Context
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* 1. Time Budget */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Available Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '15 min', val: 15 },
                  { label: '30 min', val: 30 },
                  { label: '45 min', val: 45 },
                  { label: '2 hours', val: 120 },
                  { label: 'Half Day', val: 240 },
                  { label: 'Weekend', val: 1440 },
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.val}
                    onClick={() => setTimeBudget(opt.val)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center border ${
                      timeBudget === opt.val
                        ? 'bg-[#34483A] text-white border-[#34483A] shadow-xs'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Energy Level */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Current Energy Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Depleted (Low)', 'Moderate', 'High & Agile'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setEnergyLevel(opt)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center border ${
                      energyLevel === opt
                        ? 'bg-[#34483A] text-white border-[#34483A] shadow-xs'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Budget */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Budget Tolerance
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Free', 'Budget ($)', 'Retreat ($$$)'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setBudget(opt)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center border ${
                      budget === opt
                        ? 'bg-[#34483A] text-white border-[#34483A] shadow-xs'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Location Setting */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Setting Preference
              </label>
              <select
                value={locationPref}
                onChange={(e) => setLocationPref(e.target.value)}
                className="w-full bg-[#FBF9F4] border border-[#E4DED2] rounded-xl px-3 py-2.5 text-xs text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
              >
                <option value="At home / indoor">At home / indoor</option>
                <option value="Nearby nature">Nearby nature (within 3 km)</option>
                <option value="Highland sanctuary">Highland sanctuary (travel)</option>
              </select>
            </div>

            {/* 5. Social Preference */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Interpersonal Rhythm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Quiet solo', 'Social & active'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setSocialPref(opt)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center border ${
                      socialPref === opt
                        ? 'bg-[#34483A] text-white border-[#34483A] shadow-xs'
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
              className="w-full pill-button-primary mt-6 text-sm py-3 shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Tailored Plan</span>
            </button>
          </form>
        </div>

        {/* Generated Protocol Output */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {generatedPlan ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4DED2] mb-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
                    Grounded Protocol • Generated {generatedPlan.generatedAt}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#292B26]">
                    Your {generatedPlan.timeBudgetMinutes}-Minute Restoration Arc
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-[#E9E5D9] px-3.5 py-1.5 rounded-full border border-[#D7C5AC] self-start sm:self-auto">
                  <Award className="w-4 h-4 text-[#34483A]" />
                  <span className="text-xs font-bold text-[#34483A]">
                    +{generatedPlan.totalRecoveryScore} Recovery Points
                  </span>
                </div>
              </div>

              {/* Protocol Steps */}
              <div className="space-y-4">
                {generatedPlan.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#E4DED2] hover:border-[#D7C5AC] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-[#777B51]">
                        {act.timeBlock}
                      </span>
                      <span className="text-[11px] font-semibold text-[#34483A] bg-[#A6B59A]/20 px-2 py-0.5 rounded-full">
                        +{act.recoveryPoints} pts
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-[#292B26] mb-1">
                      {act.title}
                    </h4>
                    <p className="text-xs text-[#77766D] leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Somatic Reflection Prompt */}
              <div className="mt-6 p-4 rounded-2xl bg-[#E9E5D9]/60 border border-[#D7C5AC] text-xs text-[#292B26]">
                <strong className="block text-[#34483A] mb-1">Somatic Reflection Prompt:</strong>
                <p className="text-[#77766D] italic">"{generatedPlan.reflectionPrompt}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4DED2] flex items-center justify-between gap-4">
                <Link to="/app/wellness" className="text-xs font-semibold text-[#34483A] hover:underline flex items-center gap-1">
                  <span>Open Audio & Breathing to Begin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link to="/app/check-in" className="pill-button-secondary text-xs py-2 px-4">
                  Log Result in Check-In
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-[#77766D]">
              Select your parameters on the left and tap generate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
