import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Brain,
  Shield,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Zap,
  Calendar
} from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';
import { StressChart } from '../../components/wellness/StressChart';

export const StressMonitor: React.FC = () => {
  const { assessment, checkins } = useWellness();

  const checkinsCount = checkins.length;
  const latestCheckIn = checkinsCount > 0 ? checkins[checkinsCount - 1] : null;

  const baselineScore = assessment.baselineAverage || (checkinsCount > 0
    ? Math.round(checkins.reduce((acc, c) => acc + (c.estimatedStress || c.reportedStress * 10), 0) / checkinsCount)
    : 0);

  // Real divergence between reported and model estimate from latest checkin
  const latestReported = latestCheckIn ? latestCheckIn.reportedStress * 10 : 0;
  const latestEstimated = latestCheckIn ? (latestCheckIn.estimatedStress || latestReported) : 0;
  const divergenceGap = Math.abs(latestReported - latestEstimated);

  const deviation = assessment.deviationFromBaseline ?? (latestCheckIn ? (latestEstimated - baselineScore) : 0);

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Personal Stress Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            Stress Monitor & Baseline
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Compare your daily stress patterns against your personal baseline over time.
          </p>
        </div>

        <Link
          to="/app/check-in"
          className="pill-button-secondary text-xs py-2.5 px-4 self-start sm:self-auto"
        >
          Add Daily Check-In
        </Link>
      </div>

      {/* Baseline Status Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FBF9F4] border border-[#E4DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E9E5D9] flex items-center justify-center text-[#34483A] shrink-0 font-serif font-bold">
            Ψ
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#777B51]">
              Personal Baseline Status
            </div>
            <div className="text-sm font-semibold text-[#292B26] mt-0.5">
              {checkinsCount < 3 ? (
                <span>Calibration in progress ({checkinsCount}/3 daily check-ins completed)</span>
              ) : (
                <span>
                  7-Day Personal Baseline: <strong>{baselineScore}/100</strong>{' '}
                  <span className={`text-xs ml-1 font-bold ${deviation > 0 ? 'text-rose-700' : deviation < 0 ? 'text-green-700' : 'text-stone-600'}`}>
                    ({deviation > 0 ? `+${deviation} pts higher than usual` : deviation < 0 ? `${Math.abs(deviation)} pts lower than usual` : 'Aligned with usual pattern'})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-[#77766D] sm:text-right">
          {checkinsCount < 3
            ? 'Complete at least 3 check-ins to calibrate rolling statistical comparisons.'
            : `${checkinsCount} recorded check-ins analyzed.`}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm bg-[#FBF9F4]">
        <StressChart checkins={checkins} showControls={true} />
      </div>

      {/* 2-Column Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contributing Factors */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-6 bg-[#FBF9F4]">
          <div className="flex items-center justify-between border-b border-[#E4DED2] pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block">
                Grounded Observations
              </span>
              <h3 className="font-serif text-2xl text-[#292B26]">Contributing Factor Analysis</h3>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[#A6B59A]/30 text-[#34483A]">
              Confidence {assessment.confidence}%
            </div>
          </div>

          <p className="text-xs text-[#77766D] leading-relaxed">
            Stress levels are influenced by physiological inputs and daily context recorded in your check-ins:
          </p>

          <div className="space-y-3">
            {assessment.contributors && assessment.contributors.length > 0 ? (
              assessment.contributors.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#292B26]">{c.factor}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          c.impact === 'positive'
                            ? 'bg-[#A6B59A]/20 text-[#34483A]'
                            : c.impact === 'negative'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {c.impact === 'positive' ? 'Restorative' : 'Strain'}
                      </span>
                    </div>
                    <p className="text-xs text-[#77766D] mt-1">{c.description}</p>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#34483A] shrink-0">
                    {c.impact === 'positive' ? '-' : '+'}{c.weight} pts
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] text-xs text-[#77766D] text-center">
                Log daily check-ins to detect factors affecting your stress levels.
              </div>
            )}
          </div>

          <div className="pt-2 text-xs text-[#77766D] italic">
            * Contributing factors are computed from your recorded sleep, workload, energy, and context tags.
          </div>
        </div>

        {/* Right Column: Pattern Alignment & Next Step */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Perception vs Model Divergence */}
          <div className="glass-card p-6 rounded-3xl border-[#E4DED2] space-y-3 bg-[#FBF9F4]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#777B51]">
              <Brain className="w-4 h-4 text-[#34483A]" /> Self-Report vs Model Comparison
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#292B26]">
              Perception Alignment
            </h4>
            {latestCheckIn ? (
              <div className="space-y-2 text-xs text-[#77766D] leading-relaxed">
                <p>
                  In your latest check-in on{' '}
                  <strong>{new Date(latestCheckIn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>,
                  you reported stress at <strong>{latestCheckIn.reportedStress}/10</strong> ({latestReported}%) and the model estimated <strong>{latestEstimated}/100</strong>.
                </p>
                <p>
                  {divergenceGap <= 12
                    ? 'Strong alignment: your subjective perception matches the calculated tension from your sleep and workload inputs.'
                    : 'Divergence observed: a variance between your perceived tension and daily factors, common during concentrated work periods.'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#77766D] leading-relaxed">
                Complete a daily check-in to compare your subjective stress rating with model estimates.
              </p>
            )}
          </div>

          {/* Card: Recent Daily Entries Summary */}
          <div className="glass-card p-6 rounded-3xl border-[#E4DED2] space-y-3 bg-[#FBF9F4]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#777B51]">
              <Calendar className="w-4 h-4 text-[#34483A]" /> Recent Observations
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#292B26]">
              Recorded Days
            </h4>
            {checkinsCount === 0 ? (
              <p className="text-xs text-[#77766D]">No check-in entries found yet.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {checkins.slice(-3).reverse().map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-[#F4F0E8] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#292B26]">
                        {new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-[#77766D] ml-2">
                        {c.sleepHours}h sleep • {c.mood}
                      </span>
                    </div>
                    <div className="font-semibold text-[#34483A]">
                      {c.reportedStress}/10
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Card */}
          <div className="p-6 rounded-3xl bg-[#34483A] text-white space-y-3">
            <h4 className="font-serif text-xl font-semibold text-white">
              Recommended Next Step
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Explore restorative recovery activities matching your available time, current energy, and preferences.
            </p>
            <Link
              to="/app/recovery-planner"
              className="pill-button bg-white text-[#34483A] text-xs font-semibold py-2.5 px-4 inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Open Recovery Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
