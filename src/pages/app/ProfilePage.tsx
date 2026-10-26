import React, { useState } from 'react';
import {
  User,
  Shield,
  Heart,
  Moon,
  Compass,
  CheckCircle2,
  Edit2,
  Save,
  Plus,
  X,
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '/avatars/male.png');
  const [sleepGoal, setSleepGoal] = useState(user.preferences.typicalSleepGoalHours);
  const [socialPref, setSocialPref] = useState(user.preferences.socialPreference);
  const [sessionMins, setSessionMins] = useState(user.preferences.preferredSessionMinutes || 30);
  const [budgetPref, setBudgetPref] = useState(user.preferences.budgetPreference || 'Free');
  const [settingPref, setSettingPref] = useState(user.preferences.settingPreference || 'Any');
  const [occupation, setOccupation] = useState(user.preferences.occupationCategory || 'working professional');
  const [ageBand, setAgeBand] = useState(user.preferences.ageBand || '25-34');
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferences.preferredLanguage || 'English');
  const [region, setRegion] = useState(user.preferences.region || '');
  const [accessibilityNotes, setAccessibilityNotes] = useState(user.preferences.accessibilityNotes || '');

  // Interests / Likes & Dislikes
  const [interests, setInterests] = useState<string[]>(user.preferences.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [dislikes, setDislikes] = useState<string[]>(user.preferences.dislikedActivities || []);
  const [newDislikeInput, setNewDislikeInput] = useState('');

  // Goals
  const [goals, setGoals] = useState<string[]>(user.wellnessGoals || []);
  const [newGoalInput, setNewGoalInput] = useState('');

  const [savedToast, setSavedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleAddDislike = () => {
    if (newDislikeInput.trim() && !dislikes.includes(newDislikeInput.trim())) {
      setDislikes([...dislikes, newDislikeInput.trim()]);
      setNewDislikeInput('');
    }
  };

  const handleRemoveDislike = (item: string) => {
    setDislikes(dislikes.filter(d => d !== item));
  };

  const handleAddGoal = () => {
    if (newGoalInput.trim() && !goals.includes(newGoalInput.trim())) {
      setGoals([...goals, newGoalInput.trim()]);
      setNewGoalInput('');
    }
  };

  const handleRemoveGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      setErrorMsg(null);
      await updateUser({
        name,
        avatarUrl,
        wellnessGoals: goals,
        preferences: {
          ...user.preferences,
          typicalSleepGoalHours: sleepGoal,
          socialPreference: socialPref,
          preferredSessionMinutes: sessionMins,
          budgetPreference: budgetPref,
          settingPreference: settingPref,
          occupationCategory: occupation,
          ageBand,
          preferredLanguage,
          region: region.trim() || undefined,
          accessibilityNotes: accessibilityNotes.trim() || undefined,
          interests,
          dislikedActivities: dislikes
        }
      });
      setEditing(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Database error: unable to persist profile updates.');
    }
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2 animate-in fade-in">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-rose-600 hover:text-rose-800 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Profile preferences successfully updated in MongoDB!</span>
        </div>
      )}

      {/* Header Lockup */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#FBF9F4]">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#D7C5AC]/50 border-2 border-[#E4DED2] flex items-center justify-center text-[#34483A] font-serif text-3xl font-bold shrink-0 overflow-hidden shadow-inner">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-0.5">
              Personal Wellness Profile
            </span>
            <h1 className="font-serif text-3xl text-[#292B26]">{user.name}</h1>
            <p className="text-xs text-[#77766D] mt-0.5">
              {user.email} • Member since {user.joinedDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (editing) handleSave();
            else setEditing(true);
          }}
          className="pill-button-primary text-xs py-2.5 px-5 flex items-center gap-1.5 self-start sm:self-auto"
        >
          {editing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
          <span>{editing ? 'Save Preferences' : 'Edit Profile & Preferences'}</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-[#A6B59A]/30 text-[#34483A] border border-[#A6B59A]/50 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#34483A]" />
          <span>Profile and recommendation preferences successfully updated.</span>
        </div>
      )}

      {/* Avatar & Visual Identity Selector */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
        <div className="border-b border-[#E4DED2] pb-3 mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
            Visual Identity
          </span>
          <h2 className="font-serif text-2xl text-[#292B26]">Choose Your Mindful Character</h2>
          <p className="text-xs text-[#77766D] mt-1">
            Select your personal boho minimalist line art profile avatar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Female Avatar Option */}
          <button
            type="button"
            onClick={() => {
              setAvatarUrl('/avatars/female.png');
              if (!editing) setEditing(true);
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
              avatarUrl === '/avatars/female.png'
                ? 'bg-[#E9E5D9] border-[#34483A] ring-2 ring-[#34483A] shadow-sm'
                : 'bg-[#F4F0E8] border-[#E4DED2] hover:bg-[#EFEAE0]'
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
              <img src="/avatars/female.png" alt="Female Mindful Character" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#292B26]">Serene Mind</span>
                {avatarUrl === '/avatars/female.png' && (
                  <span className="text-[10px] bg-[#34483A] text-white px-2 py-0.5 rounded-full font-medium">Selected</span>
                )}
              </div>
              <p className="text-xs text-[#77766D] mt-0.5">Female Boho Minimalist Line Art</p>
            </div>
          </button>

          {/* Male Avatar Option */}
          <button
            type="button"
            onClick={() => {
              setAvatarUrl('/avatars/male.png');
              if (!editing) setEditing(true);
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${
              avatarUrl === '/avatars/male.png'
                ? 'bg-[#E9E5D9] border-[#34483A] ring-2 ring-[#34483A] shadow-sm'
                : 'bg-[#F4F0E8] border-[#E4DED2] hover:bg-[#EFEAE0]'
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
              <img src="/avatars/male.png" alt="Male Meditating Character" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#292B26]">Mindful Meditation</span>
                {avatarUrl === '/avatars/male.png' && (
                  <span className="text-[10px] bg-[#34483A] text-white px-2 py-0.5 rounded-full font-medium">Selected</span>
                )}
              </div>
              <p className="text-xs text-[#77766D] mt-0.5">Male Boho Meditating Character</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calibration & Baseline Rhythms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-6 bg-[#FBF9F4]">
            <div className="border-b border-[#E4DED2] pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
                Algorithmic Calibration
              </span>
              <h2 className="font-serif text-2xl text-[#292B26]">Personal Baseline & Lifestyle Context</h2>
              <p className="text-xs text-[#77766D] mt-1">
                Psygma calibrates baseline models to your stated rhythms to prevent population-wide bias.
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] block">Full Name</span>
                  <span className="text-[11px] text-[#77766D]">Display identity on reports and summaries</span>
                </div>
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                  />
                ) : (
                  <span className="text-xs font-medium text-[#292B26]">{user.name}</span>
                )}
              </div>

              {/* Occupation / Life Stage Category */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#34483A]" />
                    Life Stage & Routine Rhythm
                  </span>
                  <span className="text-[11px] text-[#77766D]">
                    Adapts recovery options to your typical schedule; we never infer stress solely from occupation.
                  </span>
                </div>
                {editing ? (
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs capitalize"
                  >
                    {[
                      'student',
                      'working professional',
                      'government or administrative employee',
                      'business owner',
                      'farmer',
                      'caregiver',
                      'job seeker',
                      'retired person',
                      'other'
                    ].map(opt => (
                      <option key={opt} value={opt} className="capitalize">{opt}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs font-medium text-[#34483A] bg-[#E9E5D9] px-2.5 py-1 rounded-full capitalize">
                    {occupation}
                  </span>
                )}
              </div>

              {/* Age Band & Preferred Language */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#34483A]" />
                    Age Band & Language
                  </span>
                  <span className="text-[11px] text-[#77766D]">Demographic context for pacing</span>
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={ageBand}
                      onChange={(e) => setAgeBand(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                    >
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-49">35-49</option>
                      <option value="50-64">50-64</option>
                      <option value="65+">65+</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Español</option>
                      <option value="French">Français</option>
                      <option value="German">Deutsch</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[#34483A] bg-[#E9E5D9] px-2.5 py-1 rounded-full">
                    {ageBand} • {preferredLanguage}
                  </span>
                )}
              </div>

              {/* City or Approximate Region */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#34483A]" />
                    Approximate Region
                  </span>
                  <span className="text-[11px] text-[#77766D]">Used to surface regional trails & retreats without GPS</span>
                </div>
                {editing ? (
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Pacific Northwest"
                    className="w-48 px-2.5 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                  />
                ) : (
                  <span className="text-xs font-semibold text-[#34483A] bg-[#E9E5D9] px-2.5 py-1 rounded-full">
                    {region || 'Not configured'}
                  </span>
                )}
              </div>

              {/* Target Sleep Baseline */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#777B51]" />
                    Target Sleep Duration
                  </span>
                  <span className="text-[11px] text-[#77766D]">Used to compute physiological sleep debt</span>
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="5"
                      max="10"
                      value={sleepGoal}
                      onChange={(e) => setSleepGoal(parseFloat(e.target.value))}
                      className="w-20 px-2.5 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs font-semibold"
                    />
                    <span className="text-xs text-[#77766D]">hrs</span>
                  </div>
                ) : (
                  <span className="font-serif text-lg font-bold text-[#34483A]">
                    {sleepGoal} hrs
                  </span>
                )}
              </div>

              {/* Preferred Session Length */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#34483A]" />
                    Usual Time Allocated per Recovery Reset
                  </span>
                  <span className="text-[11px] text-[#77766D]">Filters candidates to fit your available pauses</span>
                </div>
                {editing ? (
                  <select
                    value={sessionMins}
                    onChange={(e) => setSessionMins(parseInt(e.target.value))}
                    className="px-3 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                  >
                    <option value={15}>15 minutes (Quick micro-pause)</option>
                    <option value={30}>30 minutes (Standard restorative)</option>
                    <option value={45}>45 minutes (Deep session)</option>
                    <option value={60}>60+ minutes (Extended immersion)</option>
                  </select>
                ) : (
                  <span className="text-xs font-semibold text-[#34483A] bg-[#E9E5D9] px-2.5 py-1 rounded-full">
                    {sessionMins} min
                  </span>
                )}
              </div>

              {/* Setting Preference */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#34483A]" />
                    Setting & Environment
                  </span>
                  <span className="text-[11px] text-[#77766D]">Indoor relaxation vs outdoor green-space</span>
                </div>
                {editing ? (
                  <select
                    value={settingPref}
                    onChange={(e) => setSettingPref(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                  >
                    <option value="Any">Balanced (Indoor & Outdoor)</option>
                    <option value="Outdoor">Outdoor Parks & Nature Preferred</option>
                    <option value="Indoor">Indoor & Quiet Spaces Preferred</option>
                  </select>
                ) : (
                  <span className="text-xs font-medium text-[#292B26]">{settingPref}</span>
                )}
              </div>

              {/* Budget Preference */}
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#292B26] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#777B51]" />
                    Budget Preference
                  </span>
                  <span className="text-[11px] text-[#77766D]">Guarantees no expensive activities recommended as primary</span>
                </div>
                {editing ? (
                  <select
                    value={budgetPref}
                    onChange={(e) => setBudgetPref(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-[#E4DED2] rounded-lg text-xs"
                  >
                    <option value="Free">Free Only (Breathing, Parks, Walks)</option>
                    <option value="Budget-friendly">Budget-friendly ($)</option>
                    <option value="Flexible">Flexible ($$ - $$$ Retreats)</option>
                  </select>
                ) : (
                  <span className="text-xs font-medium text-[#292B26]">{budgetPref}</span>
                )}
              </div>
            </div>
          </div>

          {/* Interests & Disliked Activities */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-6 bg-[#FBF9F4]">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
                Recommendation Personalization
              </span>
              <h2 className="font-serif text-2xl text-[#292B26]">Activity Likes & Filtered Dislikes</h2>
              <p className="text-xs text-[#77766D] mt-1">
                The engine prioritizes what nourishes you and explicitly filters out unwanted activities.
              </p>
            </div>

            {/* Preferred Activities / Interests */}
            <div>
              <span className="text-xs font-semibold text-[#34483A] block mb-2">
                Preferred Restorative Activities (Likes)
              </span>
              <div className="flex flex-wrap gap-2 mb-3">
                {interests.map((int, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E5D9] text-[#34483A] text-xs font-semibold"
                  >
                    <span>{int}</span>
                    {editing && (
                      <button
                        onClick={() => handleRemoveInterest(int)}
                        className="text-stone-500 hover:text-red-700 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {editing && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    placeholder="Add an interest (e.g. Badminton, Sauna, Reading)"
                    className="flex-1 bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="pill-button-secondary text-xs py-2 px-3 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            {/* Disliked Activities */}
            <div className="pt-4 border-t border-[#E4DED2]">
              <span className="text-xs font-semibold text-rose-800 block mb-1">
                Explicitly Disliked Activities (Filtered Out)
              </span>
              <p className="text-[11px] text-[#77766D] mb-2">
                Psygma will never recommend activities listed here unless you remove them.
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {dislikes.length === 0 ? (
                  <span className="text-xs text-[#77766D] italic">No filtered dislikes currently set.</span>
                ) : (
                  dislikes.map((dis, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold"
                    >
                      <span>{dis}</span>
                      {editing && (
                        <button
                          onClick={() => handleRemoveDislike(dis)}
                          className="text-rose-500 hover:text-rose-900 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {editing && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDislikeInput}
                    onChange={(e) => setNewDislikeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDislike())}
                    placeholder="Add an activity you dislike (e.g. Running, Public sports)"
                    className="flex-1 bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddDislike}
                    className="pill-button-secondary text-xs py-2 px-3 flex items-center gap-1 text-rose-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Filter Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Wellness Intentions */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4 bg-[#FBF9F4]">
          <div className="border-b border-[#E4DED2] pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
              Continuous Direction
            </span>
            <h3 className="font-serif text-xl text-[#292B26]">Active Wellness Intentions</h3>
            <p className="text-xs text-[#77766D] mt-1">
              Personal goals weighted by the planner when synthesizing weekly routines.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {goals.map((g, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-start justify-between gap-2.5 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
                  <span className="text-[#292B26] font-medium leading-relaxed">{g}</span>
                </div>
                {editing && (
                  <button
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-[#77766D] hover:text-rose-700 p-1 shrink-0"
                    title="Remove Goal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="pt-3 border-t border-[#E4DED2] flex items-center gap-2">
              <input
                type="text"
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                placeholder="Add a new intention (e.g. 10m outdoor morning breath)"
                className="flex-1 bg-white border border-[#E4DED2] rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="pill-button-secondary text-xs py-2 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          )}

          {/* Clinical Transparency Card */}
          <div className="p-4 rounded-2xl bg-[#E9E5D9]/50 border border-[#D7C5AC] mt-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#34483A] block mb-1">
              Ethical Data Guarantee
            </span>
            <p className="text-[11px] text-[#77766D] leading-relaxed">
              Your profile is strictly utilized for client-side and authenticated server inference. We do not sell health metrics or track you across external ad networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
