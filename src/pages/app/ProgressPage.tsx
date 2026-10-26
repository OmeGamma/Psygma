import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  Moon,
  Activity,
  Flame,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  Heart
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useWellness } from '../../context/WellnessContext';
import { psygmaApi } from '../../services/api';
import { ActivityCompletionEntry } from '../../types/wellness';

export const ProgressPage: React.FC = () => {
  const { checkins } = useWellness();
  const [completedActivities, setCompletedActivities] = useState<ActivityCompletionEntry[]>([]);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(true);

  useEffect(() => {
    psygmaApi.getCompletedActivities().then(acts => {
      setCompletedActivities(acts);
      setLoadingActivities(false);
    });
  }, []);

  // 1. Calculate Real Consecutive Day Streak
  const calculateStreak = () => {
    if (!checkins || checkins.length === 0) return 0;
    // Sorted by date ascending
    const sortedDates = [...checkins]
      .map(c => c.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let streak = 1;
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const curr = new Date(sortedDates[i]).getTime();
      const prev = new Date(sortedDates[i - 1]).getTime();
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays === 0) {
        // same day entry
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // 2. Real Average Sleep Duration
  const avgSleep = checkins.length > 0
    ? (checkins.reduce((acc, c) => acc + c.sleepHours, 0) / checkins.length).toFixed(1)
    : '0.0';

  // 3. Real Stress Shift (compare earliest vs latest entries)
  const stressShift = checkins.length >= 2
    ? Math.round(
        (checkins[checkins.length - 1].estimatedStress || checkins[checkins.length - 1].reportedStress * 10) -
        (checkins[0].estimatedStress || checkins[0].reportedStress * 10)
      )
    : 0;

  // 4. Real Correlation Data (Sleep, Stress, Energy)
  const correlationData = checkins.map(c => ({
    date: new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
    sleep: c.sleepHours,
    stress: c.estimatedStress || c.reportedStress * 10,
    energy: c.energyLevel,
    isReportedElevated: c.reportedStress >= 7
  }));

  // 5. Activity Completion Frequency (from logged activities + check-in tags)
  const activityFrequencyMap: Record<string, number> = {};

  // Count from real logged activities
  completedActivities.forEach(a => {
    activityFrequencyMap[a.activityTitle] = (activityFrequencyMap[a.activityTitle] || 0) + 1;
  });

  // Count context tags from checkins
  checkins.forEach(c => {
    c.contextTags.forEach(t => {
      if (t === 'box-breathing') activityFrequencyMap['Box Breathing'] = (activityFrequencyMap['Box Breathing'] || 0) + 1;
      if (t === 'outdoor' || t === 'nature-hike') activityFrequencyMap['Nature Walk'] = (activityFrequencyMap['Nature Walk'] || 0) + 1;
      if (t === 'badminton') activityFrequencyMap['Badminton'] = (activityFrequencyMap['Badminton'] || 0) + 1;
      if (t === 'reading') activityFrequencyMap['Mindful Reading'] = (activityFrequencyMap['Mindful Reading'] || 0) + 1;
    });
  });

  const activityBarData = Object.entries(activityFrequencyMap).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count);

  // 6. Before and After Comparisons with valid ratings
  const beforeAfterEntries = completedActivities.filter(
    a => a.preStressRating != null && a.postStressRating != null
  );

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Longitudinal History & Trends
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            Progress & Recovery Trends
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Tracking verified physiological trends and recovery intervention consistency over time.
          </p>
        </div>

        <Link
          to="/app/check-in"
          className="pill-button-primary text-xs py-2.5 px-4 self-start sm:self-auto"
        >
          Add Daily Reflection
        </Link>
      </div>

      {/* 4 Stat Overview Cards (Computed from Real Data) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="glass-card p-5 rounded-2xl border-[#E4DED2] flex flex-col justify-between bg-[#FBF9F4]">
          <div className="flex items-center justify-between text-xs text-[#77766D] mb-1">
            <span>Consecutive Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#34483A]">
            {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
          </div>
          <p className="text-[10px] text-green-700 font-medium mt-1">
            {checkins.length} total logged check-ins
          </p>
        </div>

        {/* Average Sleep */}
        <div className="glass-card p-5 rounded-2xl border-[#E4DED2] flex flex-col justify-between bg-[#FBF9F4]">
          <div className="flex items-center justify-between text-xs text-[#77766D] mb-1">
            <span>Historical Avg Sleep</span>
            <Moon className="w-4 h-4 text-[#777B51]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#34483A]">
            {avgSleep} hrs
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1">
            Across {checkins.length} recorded nights
          </p>
        </div>

        {/* Stress Variance */}
        <div className="glass-card p-5 rounded-2xl border-[#E4DED2] flex flex-col justify-between bg-[#FBF9F4]">
          <div className="flex items-center justify-between text-xs text-[#77766D] mb-1">
            <span>Stress Shift</span>
            <TrendingUp className="w-4 h-4 text-[#34483A]" />
          </div>
          <div className={`font-serif text-3xl font-bold ${stressShift <= 0 ? 'text-green-700' : 'text-rose-700'}`}>
            {stressShift > 0 ? `+${stressShift}` : stressShift} pts
          </div>
          <p className="text-[10px] text-[#77766D] font-medium mt-1">
            {stressShift <= 0 ? 'Favorable reduction observed' : 'Elevated period detected'}
          </p>
        </div>

        {/* Completed Activities */}
        <div className="glass-card p-5 rounded-2xl border-[#E4DED2] flex flex-col justify-between bg-[#FBF9F4]">
          <div className="flex items-center justify-between text-xs text-[#77766D] mb-1">
            <span>Recovery Resets</span>
            <Award className="w-4 h-4 text-[#D7C5AC]" />
          </div>
          <div className="font-serif text-3xl font-bold text-[#34483A]">
            {completedActivities.length + checkins.filter(c => c.contextTags.some(t => ['outdoor', 'box-breathing', 'badminton'].includes(t))).length} Sessions
          </div>
          <p className="text-[10px] text-stone-600 font-medium mt-1">
            Logged reflections & somatic pauses
          </p>
        </div>
      </div>

      {/* Sleep vs Energy vs Stress Multi-Axis Trend */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4DED2] pb-3">
          <div>
            <h3 className="font-serif text-xl text-[#292B26]">Sleep, Energy & Stress Trajectory</h3>
            <p className="text-xs text-[#77766D]">
              Direct visualization of real user entries (Green: restorative, Red: elevated stress, Amber: moderate)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#34483A] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34483A]"></span> Sleep (hrs)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Energy (0-100)
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Stress (0-100)
            </span>
          </div>
        </div>

        {correlationData.length === 0 ? (
          <div className="py-12 text-center text-[#77766D] text-xs">
            No check-in entries available yet. Start logging to see multi-axis trajectories.
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4DED2" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#77766D' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11, fill: '#77766D' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 12]} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#FBF9F4] p-3 rounded-xl border border-[#E4DED2] shadow-lg text-xs space-y-1">
                          <div className="font-semibold text-[#292B26] border-b border-[#E4DED2] pb-1">{d.date}</div>
                          <div className="text-[#34483A]">Sleep: <strong>{d.sleep} hrs</strong></div>
                          <div className="text-amber-700">Energy Index: <strong>{d.energy}/100</strong></div>
                          <div className="text-rose-700">Stress Estimate: <strong>{d.stress}/100</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line yAxisId="right" type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#34483A" strokeWidth={2.5} dot={{ r: 4, fill: '#34483A' }} />
                <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy (0-100)" stroke="#D97706" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4, fill: '#D97706' }} />
                <Line yAxisId="left" type="monotone" dataKey="stress" name="Stress (0-100)" stroke="#DC2626" strokeWidth={2} dot={{ r: 4, fill: '#DC2626' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2-Column Section: Completed Recovery Activities & Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Activity Frequency Graph */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4 bg-[#FBF9F4]">
          <div className="border-b border-[#E4DED2] pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
              Logged Recovery Activities
            </span>
            <h3 className="font-serif text-2xl text-[#292B26]">Completed Recovery Resets</h3>
            <p className="text-xs text-[#77766D] mt-1">
              Distribution of logged activities and routines practiced by you.
            </p>
          </div>

          {activityBarData.length === 0 ? (
            <div className="py-12 text-center text-[#77766D] text-xs">
              No completed activities recorded yet. Complete a breathing or walking session to see your habits.
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityBarData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4DED2" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#77766D' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#292B26' }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip
                    formatter={(val) => [`${val} sessions`, 'Completed']}
                    contentStyle={{ backgroundColor: '#FBF9F4', borderRadius: '12px', border: '1px solid #E4DED2' }}
                  />
                  <Bar dataKey="count" fill="#34483A" radius={[0, 8, 8, 0]}>
                    {activityBarData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#34483A' : index === 1 ? '#777B51' : '#A6B59A'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right Column: Before-and-After Reported Comparisons */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4 bg-[#FBF9F4]">
          <div className="border-b border-[#E4DED2] pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
              Observed Shifts
            </span>
            <h3 className="font-serif text-2xl text-[#292B26]">Before & After Reflection</h3>
            <p className="text-xs text-[#77766D] mt-1">
              Clearly labelled as user-reported shifts rather than clinical proof of causation.
            </p>
          </div>

          {beforeAfterEntries.length === 0 ? (
            <div className="py-8 text-center text-[#77766D] space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-xs leading-relaxed max-w-xs mx-auto">
                When you complete an activity in the Wellness Studio and record your reflection, before-and-after ratings will appear here.
              </p>
              <Link
                to="/app/wellness"
                className="pill-button-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                <span>Visit Wellness Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto hide-scrollbar">
              {beforeAfterEntries.map((item) => {
                const diff = (item.preStressRating || 0) - (item.postStressRating || 0);
                return (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#292B26]">{item.activityTitle}</strong>
                      <span className="text-[10px] text-[#77766D]">
                        {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-600">Before: <strong>{item.preStressRating}/10</strong></span>
                        <ArrowRight className="w-3 h-3 text-[#77766D]" />
                        <span className="text-[#34483A]">After: <strong>{item.postStressRating}/10</strong></span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        diff > 0 ? 'bg-green-100 text-green-800' : diff < 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {diff > 0 ? `-${diff} pts` : diff < 0 ? `+${Math.abs(diff)} pts` : 'No change'}
                      </span>
                    </div>

                    {item.feelNow && (
                      <p className="text-[11px] text-[#77766D] italic">
                        Reported feeling: "{item.feelNow}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 text-[10px] text-[#77766D] italic">
            * Self-reported comparisons are not medical evaluations. Missing data is shown with explicit empty notices rather than fabricated values.
          </div>
        </div>
      </div>
    </div>
  );
};
