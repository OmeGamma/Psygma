import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Brain,
  Sparkles,
  Heart,
  Moon,
  Battery,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Compass,
  CheckCircle2,
  Calendar,
  Zap,
  Clock,
  Wind,
  Trees,
  Music
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { psygmaApi } from '../../services/api';
import { StressChart } from '../../components/wellness/StressChart';
import { ActivityCompletionEntry } from '../../types/wellness';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { assessment, insights, checkins } = useWellness();
  const [recentActivities, setRecentActivities] = useState<ActivityCompletionEntry[]>([]);

  useEffect(() => {
    psygmaApi.getCompletedActivities().then(acts => {
      setRecentActivities(acts);
    });
  }, []);

  const latestCheckIn = checkins[checkins.length - 1];
  const primaryInsight = insights[0];
  const hasHistory = checkins.length >= 3;

  // Determine time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Recent completed activity
  const lastActivity = recentActivities[0];

  // Primary recommendation grounded in user preferences and current stress
  const userInterests = user?.preferences?.interests || ['Box breathing', 'Forest walking'];
  const userDislikes = user?.preferences?.dislikedActivities || [];
  const freeTime = user?.preferences?.availableFreeTimeMinutes || 30;
  const isOutdoor = user?.preferences?.indoorOutdoorPreference === 'Outdoor';

  // Select candidate recommendation
  const primaryAction = {
    title: userInterests.includes('Forest walking') && isOutdoor
      ? 'Morning Garden Walk'
      : 'Box Breathing Reset (4-4-4-4)',
    duration: Math.min(freeTime, 15),
    route: userInterests.includes('Forest walking') && isOutdoor ? '/app/wellness#movement' : '/app/wellness',
    explanation: userInterests.includes('Forest walking') && isOutdoor
      ? `Recommended because you enjoy fresh air walks and have ${freeTime} minutes available.`
      : `Recommended because you prefer calm breathing to balance stress in ${Math.min(freeTime, 15)} minutes.`
  };

  // Alternative recommendations
  const alternatives = [
    {
      title: 'Monsoon Rain & Bansuri Flute',
      duration: 15,
      route: '/app/wellness#audio',
      desc: 'Authentic Indian rain & flute sounds to ease head and eye tiredness.'
    },
    {
      title: 'Balcony or Window Fresh Air Pause',
      duration: 10,
      route: '/app/recovery-planner',
      desc: 'Look outside at green trees or open sky to rest tired eyes after screen work.'
    }
  ].filter(alt => !userDislikes.some(d => alt.title.toLowerCase().includes(d.toLowerCase())));

  // Check if today's checkin is already done
  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInToday = latestCheckIn && latestCheckIn.date === todayStr;

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* ---------------- 1. WELCOME SECTION ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4DED2]/60">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            {getGreeting()}, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Here's your wellness summary.
          </p>
        </div>

        <Link
          to="/app/check-in"
          className="pill-button-primary text-xs py-3 px-5 shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Activity className="w-4 h-4" />
          <span>{checkedInToday ? "Update Today's Check-in" : "Log Daily Check-in"}</span>
        </Link>
      </div>

      {/* ---------------- 2. MAIN WELLNESS SUMMARY CARDS ---------------- */}
      {/* Answers: "How am I doing?" and "What has changed?" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Stress Level (Model vs Self-Reported) */}
        <Link
          to="/app/stress-monitor"
          className="glass-card p-5 rounded-2xl border-[#E4DED2] hover:border-[#34483A] transition-all flex flex-col justify-between group shadow-xs bg-[#FBF9F4]"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#77766D] mb-2">
              <span>Current Stress</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                assessment.level === 'Low' || assessment.level === 'Balanced'
                  ? 'bg-emerald-100 text-emerald-800'
                  : assessment.level === 'Elevated'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {assessment.level}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[#34483A]">
                {assessment.score}
              </span>
              <span className="text-xs text-[#77766D]">/ 100 estimated</span>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#E4DED2] flex items-center justify-between text-xs text-[#77766D]">
            <span>Self-Reported:</span>
            <strong className="text-[#292B26]">
              {latestCheckIn ? `${latestCheckIn.reportedStress} / 10` : 'None logged'}
            </strong>
          </div>
        </Link>

        {/* Card 2: Baseline Comparison */}
        <Link
          to="/app/stress-monitor"
          className="glass-card p-5 rounded-2xl border-[#E4DED2] hover:border-[#34483A] transition-all flex flex-col justify-between group shadow-xs bg-[#FBF9F4]"
        >
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77766D] mb-2">
              Personal Baseline
            </div>
            <div className="text-sm font-semibold text-[#292B26] leading-snug">
              {hasHistory ? (
                assessment.baselineComparison || 'Aligned with your usual pattern.'
              ) : (
                'Calibration in progress'
              )}
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-[#E4DED2] text-xs text-[#77766D]">
            {hasHistory ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated with {checkins.length} records
              </span>
            ) : (
              <span>Need {Math.max(1, 3 - checkins.length)} more check-in(s)</span>
            )}
          </div>
        </Link>

        {/* Card 3: Recent Recovery Activity */}
        <Link
          to="/app/wellness"
          className="glass-card p-5 rounded-2xl border-[#E4DED2] hover:border-[#34483A] transition-all flex flex-col justify-between group shadow-xs bg-[#FBF9F4]"
        >
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#77766D] mb-2">
              Recent Activity
            </div>
            {lastActivity ? (
              <div>
                <div className="text-sm font-semibold text-[#292B26] truncate">
                  {lastActivity.activityTitle}
                </div>
                <div className="text-xs text-[#77766D] mt-0.5">
                  {lastActivity.durationMinutes} min • {lastActivity.helpful ? 'Rated helpful' : 'Completed'}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold text-[#292B26]">No activity logged yet</div>
                <div className="text-xs text-[#77766D] mt-0.5">Take a 5-minute pause today</div>
              </div>
            )}
          </div>
          <div className="pt-3 mt-3 border-t border-[#E4DED2] flex items-center justify-between text-xs text-[#34483A] font-medium group-hover:underline">
            <span>Wellness Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Card 4: Recommended Next Step */}
        <Link
          to={primaryAction.route}
          className="glass-card p-5 rounded-2xl border-[#D7C5AC] bg-[#E9E5D9]/50 hover:bg-[#E9E5D9] transition-all flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#777B51] mb-2">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#34483A]" /> Next Step
              </span>
              <span>{primaryAction.duration}m</span>
            </div>
            <div className="text-sm font-semibold text-[#292B26] leading-tight">
              {primaryAction.title}
            </div>
            <p className="text-[11px] text-[#77766D] mt-1 line-clamp-2">
              {primaryAction.explanation}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-[#D7C5AC] flex items-center justify-between text-xs text-[#34483A] font-semibold">
            <span>Start activity</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ---------------- 3. STRESS TREND & GROUNDED AI INSIGHT ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stress & Recovery Graph (7-Day Trend) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#292B26]">
                Recent Stress & Recovery Trend
              </h2>
              <p className="text-xs text-[#77766D] mt-0.5">
                Green (&lt;40 Balanced), Amber (40-70 Elevated), Red (&gt;70 High)
              </p>
            </div>
            <Link
              to="/app/stress-monitor"
              className="text-xs text-[#34483A] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <StressChart checkins={checkins.slice(-7)} showControls={false} />
        </div>

        {/* Right Column: One Useful AI Insight & Alternatives */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: One Grounded Observation */}
          <div className="bg-[#34483A] text-white p-6 sm:p-7 rounded-3xl shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#A6B59A]" /> Grounded Observation
              </span>
              <Link to="/app/insights" className="text-xs text-white/75 hover:text-white underline">
                All insights →
              </Link>
            </div>

            {primaryInsight ? (
              <div className="space-y-3">
                <h3 className="font-serif text-xl text-white font-medium leading-snug">
                  {primaryInsight.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                  {primaryInsight.observation}
                </p>
                <div className="p-3 rounded-xl bg-white/10 text-xs text-white/80">
                  <span className="font-semibold block text-white/95">Supporting Evidence:</span>
                  <span className="text-[11px] leading-relaxed">{primaryInsight.grounding}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-xs text-white/80 leading-relaxed">
                <p className="mb-2">
                  Complete consecutive daily check-ins to generate personalized observations grounded in your sleep, energy, and workload patterns.
                </p>
                <Link
                  to="/app/check-in"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#A6B59A] hover:underline"
                >
                  Log today's check-in →
                </Link>
              </div>
            )}
          </div>

          {/* Card: Recommended Next Steps & Alternatives */}
          <div className="glass-card p-6 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-semibold text-[#292B26]">
                Alternative Options for Today
              </h3>
              <Link to="/app/recovery-planner" className="text-xs text-[#34483A] font-semibold hover:underline">
                Custom Planner →
              </Link>
            </div>

            <div className="space-y-2.5">
              {alternatives.map((alt, idx) => (
                <Link
                  key={idx}
                  to={alt.route}
                  className="p-3 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between text-xs hover:border-[#34483A] transition-all group block"
                >
                  <div>
                    <div className="font-semibold text-[#292B26] group-hover:text-[#34483A] flex items-center gap-1.5">
                      <span>{alt.title}</span>
                      <span className="text-[10px] text-[#77766D]">({alt.duration}m)</span>
                    </div>
                    <div className="text-[11px] text-[#77766D] mt-0.5">{alt.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#77766D] group-hover:text-[#34483A] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
