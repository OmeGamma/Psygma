import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { CheckInEntry } from '../../types/wellness';

interface StressChartProps {
  checkins: CheckInEntry[];
  showControls?: boolean;
}

interface ChartPoint {
  date: string;
  modelStress: number;
  reportedStress: number;
  confidenceUpper: number;
  confidenceLower: number;
  sleep: number;
  mood: string;
}

export const StressChart: React.FC<StressChartProps> = ({ checkins, showControls = true }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  if (!checkins || checkins.length === 0) {
    return (
      <div className="w-full py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mx-auto">
          <Activity className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-2xl text-[#292B26]">No Recorded Stress Data Yet</h4>
        <p className="text-xs text-[#77766D] max-w-sm mx-auto">
          Complete your first daily check-in to begin calibrating your personal stress trajectory and baseline comparison.
        </p>
        <Link
          to="/app/check-in"
          className="pill-button-primary text-xs py-2.5 px-5 inline-flex items-center gap-1.5 shadow-xs"
        >
          <span>Start Daily Reflection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Slice real check-ins by timeframe (never synthesize fake records)
  const count = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const filteredCheckins = checkins.slice(-count);

  const chartData: ChartPoint[] = filteredCheckins.map(c => ({
    date: new Date(c.date).toLocaleDateString('en-US', {
      weekday: filteredCheckins.length <= 7 ? 'short' : undefined,
      month: 'short',
      day: 'numeric'
    }),
    modelStress: c.estimatedStress || Math.round(c.reportedStress * 10),
    reportedStress: c.reportedStress * 10,
    confidenceUpper: Math.min(100, (c.estimatedStress || c.reportedStress * 10) + 12),
    confidenceLower: Math.max(0, (c.estimatedStress || c.reportedStress * 10) - 12),
    sleep: c.sleepHours,
    mood: c.mood
  }));

  return (
    <div className="w-full">
      {showControls && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-serif text-xl text-[#292B26]">Historical Stress Trajectory</h3>
            <p className="text-xs text-[#77766D]">
              Comparing algorithmic estimation against your self-reported inputs ({chartData.length} verified observations)
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#E9E5D9]/70 rounded-full border border-[#D7C5AC]/50 self-start sm:self-auto">
            {(['7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeframe === t
                    ? 'bg-[#FBF9F4] text-[#34483A] shadow-xs'
                    : 'text-[#77766D] hover:text-[#292B26]'
                }`}
              >
                {t === '7d' ? 'Last 7 Days' : t === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notice if available history is shorter than requested timeframe */}
      {timeframe !== '7d' && checkins.length < (timeframe === '30d' ? 30 : 90) && (
        <div className="mb-4 p-2.5 rounded-xl bg-[#E9E5D9]/40 border border-[#D7C5AC]/50 text-[11px] text-[#77766D] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#777B51] shrink-0" />
          <span>
            Displaying all {checkins.length} available entries. Longitudinal curves expand continuously with consecutive daily check-ins.
          </span>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="modelStressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A6B59A" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A6B59A" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E4DED2" vertical={false} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#77766D' }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#77766D' }}
              tickCount={5}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartPoint;
                  return (
                    <div className="bg-[#FBF9F4] p-3 rounded-xl border border-[#E4DED2] shadow-lg text-xs space-y-1">
                      <div className="font-semibold text-[#292B26] border-b border-[#E4DED2]/60 pb-1 mb-1">
                        {data.date}
                      </div>
                      <div className="flex items-center justify-between gap-4 text-[#34483A]">
                        <span>Model Estimate:</span>
                        <strong className="font-bold">{data.modelStress}/100</strong>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-[#777B51]">
                        <span>User Reported:</span>
                        <strong>{data.reportedStress / 10}/10 ({data.reportedStress}%)</strong>
                      </div>
                      <div className="text-[10px] text-[#77766D] pt-1">
                        Sleep: {data.sleep}h • Mood: {data.mood}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
              formatter={(value) => <span className="text-xs text-[#292B26] font-medium">{value}</span>}
            />

            {/* Shaded Area for Model Stress */}
            <Area
              type="monotone"
              dataKey="modelStress"
              name="Model Estimate (0-100)"
              stroke="#34483A"
              strokeWidth={2.5}
              fill="url(#modelStressGradient)"
            />

            {/* Distinct Line for User Reported Stress */}
            <Line
              type="monotone"
              dataKey="reportedStress"
              name="User Reported (Scaled 0-100)"
              stroke="#777B51"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#777B51', strokeWidth: 1, stroke: '#FBF9F4' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-[#E4DED2]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#77766D]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34483A]"></span>
          <span>Solid Line: Algorithmic BioStress Estimate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-0.5 border-b-2 border-dashed border-[#777B51]"></span>
          <span>Dashed Line: Discrete self-reported check-in score</span>
        </div>
      </div>
    </div>
  );
};
