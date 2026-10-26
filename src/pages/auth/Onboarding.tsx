import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Heart,
  Wind,
  Trees,
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Smile,
  Moon,
  Sun,
  Shield,
  Clock,
  DollarSign,
  User,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';

export const Onboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { submitCheckIn } = useWellness();
  const navigate = useNavigate();

  // Redirect returning users who already finished onboarding
  useEffect(() => {
    if (user?.preferences?.hasCompletedOnboarding) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- Step 1: Basic Profile ---
  const [ageBand, setAgeBand] = useState<string>('25-34');
  const [occupationCategory, setOccupationCategory] = useState<string>('working professional');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [region, setRegion] = useState<string>('');

  // --- Step 2: Lifestyle and Preferences ---
  const [typicalSleepGoalHours, setTypicalSleepGoalHours] = useState<number>(7.5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Box breathing',
    'Forest walking',
    'Acoustic soundscapes'
  ]);
  const [dislikedActivities, setDislikedActivities] = useState<string[]>([]);
  const [indoorOutdoorPreference, setIndoorOutdoorPreference] = useState<string>('Balanced');
  const [availableFreeTimeMinutes, setAvailableFreeTimeMinutes] = useState<number>(30);
  const [budgetPreference, setBudgetPreference] = useState<string>('Free');
  const [wellnessGoal, setWellnessGoal] = useState<string>('Lower evening cognitive fatigue');
  const [accessibilityNotes, setAccessibilityNotes] = useState<string>('');

  // --- Step 3: Initial Wellness Information ---
  const [recentStress, setRecentStress] = useState<number>(5);
  const [recentSleepQuality, setRecentSleepQuality] = useState<'poor' | 'fair' | 'good' | 'deep'>('good');
  const [recentEnergy, setRecentEnergy] = useState<number>(65);
  const [helpFocus, setHelpFocus] = useState<string>('Evening wind-down & restorative sleep');

  const occupationOptions = [
    'student',
    'working professional',
    'government or administrative employee',
    'business owner',
    'farmer',
    'caregiver',
    'job seeker',
    'retired person',
    'other'
  ];

  const interestOptions = [
    { name: 'Box breathing', icon: Wind },
    { name: 'Forest walking', icon: Trees },
    { name: 'Acoustic soundscapes', icon: Sparkles },
    { name: 'Casual badminton', icon: Activity },
    { name: 'Quiet reading pause', icon: Compass },
    { name: 'Mindful meditation', icon: Heart }
  ];

  const dislikeOptions = [
    'Strenuous cardio',
    'Crowded gym environments',
    'Long seated meditation',
    'High-intensity sports',
    'Screen-based wellness tasks'
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleDislike = (item: string) => {
    setDislikedActivities(prev =>
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Save user preferences to backend profile
      await updateUser({
        wellnessGoals: [wellnessGoal],
        preferences: {
          ...user.preferences,
          occupationCategory,
          ageBand,
          preferredLanguage,
          region: region.trim() || undefined,
          typicalSleepGoalHours,
          interests: selectedInterests,
          dislikedActivities,
          indoorOutdoorPreference,
          availableFreeTimeMinutes,
          budgetPreference,
          accessibilityNotes: accessibilityNotes.trim() || undefined,
          hasCompletedOnboarding: true
        }
      });

      // 2. Record initial baseline reference point so dashboard is immediately grounded
      const today = new Date().toISOString().split('T')[0];
      await submitCheckIn({
        date: today,
        mood: recentStress > 6 ? 'overwhelmed' : recentStress > 4 ? 'balanced' : 'peaceful',
        reportedStress: recentStress,
        sleepHours: typicalSleepGoalHours,
        sleepQuality: recentSleepQuality,
        workloadHours: 6.0,
        energyLevel: recentEnergy,
        contextTags: [
          indoorOutdoorPreference.toLowerCase().includes('outdoor') ? 'outdoor' : 'indoor-focus',
          'initial-calibration'
        ],
        notes: `Initial baseline reference. Primary focus: ${helpFocus}.`
      });

      // 3. Open Dashboard
      navigate('/app', { replace: true });
    } catch (err) {
      console.error('Error completing profile setup:', err);
      // Fallback navigate to app even if offline
      navigate('/app', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] flex flex-col justify-center items-center p-4 sm:p-6 text-[#292B26] relative">
      {/* Background landscape ambient wash */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600"
          alt="Sunlight in serene forest canopy"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#F4F0E8]/85 backdrop-blur-xs" />
      </div>

      <div className="relative z-10 w-full max-w-2xl py-6">
        {/* Top Header & Visible Progress Bar */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#77766D]">
            <span className="uppercase tracking-wider">
              Profile Setup • Step {step} of 4
            </span>
            <span className="text-[#34483A] font-bold">
              {step === 1 && 'Basic Profile'}
              {step === 2 && 'Lifestyle & Preferences'}
              {step === 3 && 'Initial Wellness Check'}
              {step === 4 && 'Ready to Begin'}
            </span>
          </div>

          <div className="w-full h-2 bg-[#E4DED2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#34483A] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Setup Card */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border-[#E4DED2] shadow-xl text-left bg-[#FBF9F4]/95">
          {/* ---------------- STEP 1: BASIC PROFILE ---------------- */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
                  Step 1 • Basic Profile
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#292B26]">
                  A few basic details to personalize your experience.
                </h1>
                <p className="text-xs text-[#77766D] mt-1">
                  We use these details solely to adapt pacing and discovery suggestions. We never infer stress from occupation.
                </p>
              </div>

              <div className="space-y-4">
                {/* Occupation Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-1.5">
                    Occupation or Life-Stage Category
                  </label>
                  <select
                    value={occupationCategory}
                    onChange={(e) => setOccupationCategory(e.target.value)}
                    className="w-full bg-white border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A] capitalize"
                  >
                    {occupationOptions.map((opt) => (
                      <option key={opt} value={opt} className="capitalize">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Age Band */}
                  <div>
                    <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-1.5">
                      Age Band (Optional)
                    </label>
                    <select
                      value={ageBand}
                      onChange={(e) => setAgeBand(e.target.value)}
                      className="w-full bg-white border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    >
                      <option value="18-24">18 – 24</option>
                      <option value="25-34">25 – 34</option>
                      <option value="35-49">35 – 49</option>
                      <option value="50-64">50 – 64</option>
                      <option value="65+">65+</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-1.5">
                      Preferred Language
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full bg-white border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Español</option>
                      <option value="French">Français</option>
                      <option value="German">Deutsch</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* City / Approximate Region */}
                <div>
                  <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-1.5">
                    City or Approximate Region (Optional)
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Seattle, Pacific Northwest or Denver, CO"
                    className="w-full bg-white border border-[#E4DED2] rounded-xl px-3.5 py-2.5 text-sm text-[#292B26] focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                  />
                  <p className="text-[11px] text-[#77766D] mt-1">
                    Used to suggest regional nature trails and nearby retreats. We do not require precise GPS coordinates.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="pill-button-primary text-xs py-3 px-6 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Lifestyle & Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2: LIFESTYLE & PREFERENCES ---------------- */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
                  Step 2 • Lifestyle & Preferences
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#292B26]">
                  How do you prefer to rest and recharge?
                </h2>
                <p className="text-xs text-[#77766D] mt-1">
                  Psygma will suggest activities you enjoy and strictly avoid what you dislike.
                </p>
              </div>

              <div className="space-y-5">
                {/* Sleep Window Slider */}
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#34483A]">
                      Typical Sleep Goal / Duration
                    </span>
                    <span className="text-base font-serif font-bold text-[#34483A]">
                      {typicalSleepGoalHours} hrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5.5"
                    max="9.5"
                    step="0.5"
                    value={typicalSleepGoalHours}
                    onChange={(e) => setTypicalSleepGoalHours(parseFloat(e.target.value))}
                    className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#77766D] mt-1.5">
                    <span>6.0h (Shorter)</span>
                    <span>7.5h (Standard)</span>
                    <span>9.0h (Extended)</span>
                  </div>
                </div>

                {/* Preferred Activities */}
                <div>
                  <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-2">
                    Preferred Activities (Select all that fit)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {interestOptions.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedInterests.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleInterest(item.name)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A] font-semibold'
                              : 'bg-white border-[#E4DED2] text-[#77766D] hover:bg-[#F4F0E8]'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-xs">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Disliked Activities */}
                <div>
                  <label className="block text-xs font-semibold text-rose-800 uppercase tracking-wider mb-2">
                    Activities You Dislike (We will not recommend these)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dislikeOptions.map((dis) => {
                      const isDisliked = dislikedActivities.includes(dis);
                      return (
                        <button
                          key={dis}
                          type="button"
                          onClick={() => toggleDislike(dis)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                            isDisliked
                              ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                              : 'bg-white text-[#77766D] border-[#E4DED2] hover:bg-stone-50'
                          }`}
                        >
                          {isDisliked ? '✕ ' : '+ '}{dis}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Indoor vs Outdoor & Time Constraints */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#34483A] uppercase mb-1">
                      Setting
                    </label>
                    <select
                      value={indoorOutdoorPreference}
                      onChange={(e) => setIndoorOutdoorPreference(e.target.value)}
                      className="w-full bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Balanced">Balanced mix</option>
                      <option value="Outdoor">Mostly outdoor</option>
                      <option value="Indoor">Mostly indoor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#34483A] uppercase mb-1">
                      Available Free Time
                    </label>
                    <select
                      value={availableFreeTimeMinutes}
                      onChange={(e) => setAvailableFreeTimeMinutes(parseInt(e.target.value))}
                      className="w-full bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value={15}>15 minutes (Quick)</option>
                      <option value={30}>30 minutes (Moderate)</option>
                      <option value={45}>45+ minutes (Deep)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#34483A] uppercase mb-1">
                      Activity Budget
                    </label>
                    <select
                      value={budgetPreference}
                      onChange={(e) => setBudgetPreference(e.target.value)}
                      className="w-full bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Free">Free only</option>
                      <option value="Low cost">Under $20</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Optional Accessibility */}
                <div>
                  <label className="block text-xs font-semibold text-[#77766D] uppercase tracking-wider mb-1">
                    Accessibility Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    value={accessibilityNotes}
                    onChange={(e) => setAccessibilityNotes(e.target.value)}
                    placeholder="e.g. Wheelchair accessible trails, seated-only movement, no flashing visuals"
                    className="w-full bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs text-[#292B26]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#E4DED2]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#77766D] hover:underline flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="pill-button-primary text-xs py-3 px-6 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Wellness Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3: INITIAL WELLNESS INFORMATION ---------------- */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
                  Step 3 • Initial Wellness Information
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#292B26]">
                  How have you been feeling recently?
                </h2>
                <p className="text-xs text-[#77766D] mt-1">
                  These 4 questions establish an initial reference point. Your baseline will continuously refine through subsequent daily check-ins.
                </p>
              </div>

              <div className="space-y-5">
                {/* Question 1: How stressed have you been feeling recently? */}
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#34483A]">
                      Recent Stress Level
                    </span>
                    <span className="text-sm font-bold text-[#34483A]">
                      {recentStress} / 10 •{' '}
                      {recentStress <= 3 ? 'Low tension' : recentStress <= 6 ? 'Moderate' : 'Elevated'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={recentStress}
                    onChange={(e) => setRecentStress(parseInt(e.target.value))}
                    className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                    <span>1 (Very calm)</span>
                    <span>5 (Average)</span>
                    <span>10 (Overwhelmed)</span>
                  </div>
                </div>

                {/* Question 2: How has your sleep been? */}
                <div>
                  <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-2">
                    How has your sleep quality been?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { key: 'poor' as const, label: 'Poor', desc: 'Broken / restless' },
                      { key: 'fair' as const, label: 'Fair', desc: 'Somewhat tired' },
                      { key: 'good' as const, label: 'Good', desc: 'Restful & steady' },
                      { key: 'deep' as const, label: 'Deep', desc: 'Fully restorative' }
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setRecentSleepQuality(s.key)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          recentSleepQuality === s.key
                            ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A] font-semibold'
                            : 'bg-white border-[#E4DED2] text-[#77766D] hover:bg-[#F4F0E8]'
                        }`}
                      >
                        <div className="text-xs font-semibold">{s.label}</div>
                        <div className="text-[10px] text-[#77766D] mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: How is your energy? */}
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#34483A]">
                      Recent Energy Level
                    </span>
                    <span className="text-sm font-bold text-[#34483A]">{recentEnergy}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={recentEnergy}
                    onChange={(e) => setRecentEnergy(parseInt(e.target.value))}
                    className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                    <span>Drained (10%)</span>
                    <span>Steady (50%)</span>
                    <span>Vibrant (100%)</span>
                  </div>
                </div>

                {/* Question 4: What would you most like help with? */}
                <div>
                  <label className="block text-xs font-semibold text-[#34483A] uppercase tracking-wider mb-2">
                    What would you most like help with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { title: 'Lower evening cognitive fatigue', desc: 'Release screen tension & calm evening thoughts' },
                      { title: 'Deepen restorative sleep', desc: 'Reduce nighttime restlessness and maintain rhythm' },
                      { title: 'Outdoor & nature balance', desc: 'Frequent green-space resets and active mobility' },
                      { title: 'Mid-day focus & breathing pauses', desc: 'Gentle resets to prevent afternoon slumps' }
                    ].map((opt) => (
                      <button
                        key={opt.title}
                        type="button"
                        onClick={() => {
                          setHelpFocus(opt.title);
                          setWellnessGoal(opt.title);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          helpFocus === opt.title
                            ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A] shadow-xs'
                            : 'bg-white border-[#E4DED2] text-[#77766D] hover:bg-[#F4F0E8]'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#292B26]">{opt.title}</div>
                        <div className="text-[11px] text-[#77766D] mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#E4DED2]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#77766D] hover:underline flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="pill-button-primary text-xs py-3 px-6 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Review & Complete</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4: SAVE AND CONTINUE ---------------- */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
                  Step 4 • Save & Open Dashboard
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#292B26]">
                  Your personal space is ready.
                </h2>
                <p className="text-xs text-[#77766D] mt-1">
                  We've initialized your reference baseline. You can edit any preferences later from your Profile.
                </p>
              </div>

              {/* Summary Review Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs space-y-1">
                  <div className="text-[#77766D] uppercase text-[10px] font-semibold">Profile Category</div>
                  <div className="font-semibold text-[#292B26] capitalize">{occupationCategory}</div>
                  <div className="text-[#77766D] text-[11px]">{ageBand} • {preferredLanguage}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs space-y-1">
                  <div className="text-[#77766D] uppercase text-[10px] font-semibold">Primary Goal</div>
                  <div className="font-semibold text-[#292B26]">{wellnessGoal}</div>
                  <div className="text-[#77766D] text-[11px]">{typicalSleepGoalHours}h sleep window</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs space-y-1">
                  <div className="text-[#77766D] uppercase text-[10px] font-semibold">Activity Likes ({selectedInterests.length})</div>
                  <div className="font-semibold text-[#292B26] truncate">
                    {selectedInterests.slice(0, 3).join(', ')}
                  </div>
                  <div className="text-[#77766D] text-[11px]">{availableFreeTimeMinutes}m • {budgetPreference}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs space-y-1">
                  <div className="text-[#77766D] uppercase text-[10px] font-semibold">Initial Reference</div>
                  <div className="font-semibold text-[#292B26]">
                    Stress {recentStress}/10 • Energy {recentEnergy}%
                  </div>
                  <div className="text-[#77766D] text-[11px]">Sleep quality: {recentSleepQuality}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E9E5D9]/70 border border-[#D7C5AC] text-xs text-[#34483A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34483A] shrink-0" />
                <span>Preferences and initial reference point will be securely stored to your account.</span>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#E4DED2]">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="text-xs text-[#77766D] hover:underline flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="pill-button-primary text-xs py-3.5 px-8 flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Opening Dashboard...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Save & Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
