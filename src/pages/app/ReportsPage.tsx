import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  Shield,
  TrendingDown,
  Clock,
  Heart,
  Activity
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { WellnessReportSummary, ActivityCompletionEntry } from '../../types/wellness';

export const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [report, setReport] = useState<WellnessReportSummary | null>(null);
  const [activities, setActivities] = useState<ActivityCompletionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      psygmaApi.getReportSummary(period),
      psygmaApi.getCompletedActivities()
    ]).then(([rep, acts]) => {
      setReport(rep);
      setActivities(acts);
      setLoading(false);
    });
  }, [period]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      report,
      period,
      completedActivities: activities
    }, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `psygma_${period}_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 print:hidden">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Grounded Reporting • Stored Records
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            {period === 'weekly' ? 'Weekly Wellness Report' : 'Monthly Wellness Report'}
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Synthesized from your actual stored check-in and activity completion history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Period Selector Toggle */}
          <div className="flex items-center p-1 bg-[#E9E5D9]/80 rounded-full border border-[#D7C5AC]">
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                period === 'weekly'
                  ? 'bg-[#34483A] text-white shadow-xs'
                  : 'text-[#77766D] hover:text-[#292B26]'
              }`}
            >
              Weekly (7 Days)
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                period === 'monthly'
                  ? 'bg-[#34483A] text-white shadow-xs'
                  : 'text-[#77766D] hover:text-[#292B26]'
              }`}
            >
              Monthly (30 Days)
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="pill-button-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="pill-button-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {loading || !report ? (
        <div className="p-16 text-center text-[#77766D] glass-card rounded-3xl">
          <div className="animate-pulse">Compiling {period} report from stored check-ins...</div>
        </div>
      ) : (
        /* Printable Report Document Card */
        <div
          id="printable-report"
          className="glass-card p-6 sm:p-10 rounded-3xl border-[#E4DED2] bg-[#FBF9F4] shadow-md space-y-8 print:p-0 print:border-none print:shadow-none"
        >
          {/* Document Header Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DED2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#34483A] text-white flex items-center justify-center font-serif text-lg font-bold">
                Ψ
              </div>
              <div>
                <div className="font-serif text-xl tracking-wider font-semibold text-[#292B26]">PSYGMA</div>
                <div className="text-[10px] uppercase tracking-widest text-[#77766D]">
                  {period === 'weekly' ? '7-Day' : '30-Day'} Stress Intelligence Summary
                </div>
              </div>
            </div>

            <div className="text-xs text-[#77766D] sm:text-right space-y-0.5">
              <div>Member: <strong className="text-[#292B26]">{report.userName}</strong></div>
              <div>Period: <strong>{period === 'weekly' ? 'Past 7 Days' : 'Past 30 Days'} ({report.generatedDate})</strong></div>
              <div>Attribution: <strong className="text-[#34483A]">{report.dataPointsCount} Verified Daily Records</strong></div>
            </div>
          </div>

          {/* Key Executive Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F4F0E8] rounded-2xl border border-[#E4DED2]">
              <div className="text-[10px] text-[#77766D] uppercase font-semibold">Average Stress</div>
              <div className="font-serif text-3xl font-bold text-[#34483A] mt-1">
                {report.avgStressScore} / 100
              </div>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${
                report.avgStressScore < 40
                  ? 'text-emerald-700'
                  : report.avgStressScore < 70
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}>
                {report.stressTrend || (report.avgStressScore < 40 ? 'Balanced baseline' : 'Moderate tension')}
              </span>
            </div>

            <div className="p-4 bg-[#F4F0E8] rounded-2xl border border-[#E4DED2]">
              <div className="text-[10px] text-[#77766D] uppercase font-semibold">Average Sleep</div>
              <div className="font-serif text-3xl font-bold text-[#34483A] mt-1">
                {report.avgSleepHours} hrs
              </div>
              <span className="text-[10px] text-[#77766D] font-medium mt-1 inline-block">
                {report.avgSleepHours >= 7.0 ? 'Meets recommended window' : 'Slight sleep debt observed'}
              </span>
            </div>

            <div className="p-4 bg-[#F4F0E8] rounded-2xl border border-[#E4DED2]">
              <div className="text-[10px] text-[#77766D] uppercase font-semibold">Check-in Cadence</div>
              <div className="font-serif text-3xl font-bold text-[#34483A] mt-1">
                {report.checkInCompletionRate}%
              </div>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 inline-block">
                {report.dataPointsCount} daily check-ins
              </span>
            </div>

            <div className="p-4 bg-[#F4F0E8] rounded-2xl border border-[#E4DED2]">
              <div className="text-[10px] text-[#77766D] uppercase font-semibold">Top Restorer</div>
              <div className="font-serif text-base font-bold text-[#34483A] mt-2 line-clamp-1">
                {report.topRecoveryActivity}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Verified helpful</span>
            </div>
          </div>

          {/* Health & Biometrics Snapshot */}
          {report.healthBiometricsSummary && (
            <div className="p-4 rounded-2xl bg-[#E9E5D9]/60 border border-[#D7C5AC] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#34483A]">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#777B51]" />
                  <span>Biometric Measurements Recorded ({report.healthBiometricsSummary.totalMeasurementsLogged || 0} logged)</span>
                </div>
                <span className="text-[11px] text-[#77766D] font-normal">Non-clinical home & clinic vitals</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E4DED2]">
                  <span className="text-[10px] text-[#77766D] block">Resting Heart Rate</span>
                  <strong className="text-sm text-[#292B26]">
                    {report.healthBiometricsSummary.avgHeartRate ? `${report.healthBiometricsSummary.avgHeartRate} bpm` : 'None logged'}
                  </strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E4DED2]">
                  <span className="text-[10px] text-[#77766D] block">Latest Blood Pressure</span>
                  <strong className="text-sm text-[#292B26]">
                    {report.healthBiometricsSummary.latestBloodPressure || 'None logged'}
                  </strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E4DED2]">
                  <span className="text-[10px] text-[#77766D] block">Oxygen Saturation (SpO₂)</span>
                  <strong className="text-sm text-[#292B26]">
                    {report.healthBiometricsSummary.avgSpO2 ? `${report.healthBiometricsSummary.avgSpO2}%` : 'None logged'}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* 1. Key Behavioral Observations */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#292B26] border-b border-[#E4DED2] pb-2">
              1. Behavioral Observations
            </h3>
            <div className="space-y-2">
              {report.keyObservations.map((obs, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#292B26]">
                  <CheckCircle2 className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Completed Wellness Activities & Helpfulness */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#292B26] border-b border-[#E4DED2] pb-2">
              2. Completed Recovery Activities & Feedback
            </h3>
            {activities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activities.slice(0, 6).map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#292B26]">{act.activityTitle}</div>
                      <div className="text-[11px] text-[#77766D]">
                        {act.durationMinutes} min • {act.category}
                        {act.preStressRating && act.postStressRating && (
                          <span> • Stress: {act.preStressRating} → {act.postStressRating}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      act.helpful
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {act.helpful ? 'Rated Helpful' : 'Completed'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#77766D] italic">
                No individual wellness activities logged during this period yet. Complete a breathing or nature session from the Wellness Studio to view before-and-after ratings here.
              </p>
            )}
          </div>

          {/* 3. Action Protocol for Next Cycle */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#292B26] border-b border-[#E4DED2] pb-2">
              3. Recommended Action Protocol
            </h3>
            <div className="space-y-2">
              {report.actionRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#292B26]">
                  <span className="w-5 h-5 rounded-full bg-[#34483A] text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-off & Medical Disclaimer */}
          <div className="pt-6 border-t border-[#E4DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-[#77766D]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#777B51] shrink-0" />
              <span>Non-clinical wellness reflection summary generated by Psygma. Not diagnostic medicine.</span>
            </div>
            <div>Report Attribution: Stored records for {report.userName}</div>
          </div>
        </div>
      )}
    </div>
  );
};
