import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Sliders,
  Shield,
  Activity,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

export const Intelligence: React.FC = () => {
  // Interactive Simulator State
  const [simSleep, setSimSleep] = useState<number>(6.5);
  const [simWorkload, setSimWorkload] = useState<number>(8.0);
  const [simTension, setSimTension] = useState<number>(6);
  const [simOutdoorMin, setSimOutdoorMin] = useState<number>(20);

  // Real-time calculation based on Psygma Grounded formula
  const sleepDebt = Math.max(0, 7.5 - simSleep);
  const workExcess = Math.max(0, simWorkload - 7.0);
  const outdoorRelief = Math.min(25, (simOutdoorMin / 30) * 12);

  let computedScore = Math.round(
    38 + sleepDebt * 14 + workExcess * 6 + (simTension - 5) * 6 - outdoorRelief
  );
  computedScore = Math.max(12, Math.min(95, computedScore));

  let stressTier: 'Low' | 'Balanced' | 'Elevated' | 'High' = 'Balanced';
  let tierColor = 'text-[#34483A]';
  if (computedScore < 30) {
    stressTier = 'Low';
    tierColor = 'text-[#777B51]';
  } else if (computedScore < 55) {
    stressTier = 'Balanced';
    tierColor = 'text-[#34483A]';
  } else if (computedScore < 75) {
    stressTier = 'Elevated';
    tierColor = 'text-amber-800';
  } else {
    stressTier = 'High';
    tierColor = 'text-rose-800';
  }

  const confidenceScore = Math.min(94, Math.max(76, 80 + Math.round((simSleep > 6 ? 6 : 2))));

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Algorithmic Architecture
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          AI Intelligence Built on Grounded Transparency
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Psygma’s proprietary BioStress Engine v2.4 (OmeGamma) transforms everyday qualitative reflections and quantitative rhythms into actionable nervous state models.
        </p>
      </div>

      {/* ----------------- INTERACTIVE MODEL SIMULATOR ----------------- */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border-[#E4DED2] shadow-xl mb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E4DED2]">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-1">
              <Sliders className="w-3.5 h-3.5 text-[#34483A]" /> Interactive Engine Sandbox
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#292B26]">Stress Estimation Simulator</h2>
          </div>
          <div className="text-xs text-[#77766D] bg-[#E9E5D9]/70 px-3 py-1.5 rounded-full border border-[#D7C5AC]/50 self-start md:self-auto">
            Algorithm: OmeGamma BioStress v2.4
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-[#292B26]">
                <span>Nightly Sleep Duration</span>
                <strong className="text-[#34483A]">{simSleep} hours</strong>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={simSleep}
                onChange={(e) => setSimSleep(parseFloat(e.target.value))}
                className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                <span>4.0h (Severe deficit)</span>
                <span>7.5h (Baseline)</span>
                <span>10.0h (Deep recovery)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-[#292B26]">
                <span>Cognitive Workload Hours</span>
                <strong className="text-[#34483A]">{simWorkload} hours</strong>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={simWorkload}
                onChange={(e) => setSimWorkload(parseFloat(e.target.value))}
                className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                <span>2.0h (Light)</span>
                <span>7.0h (Standard)</span>
                <span>12.0h (Intense strain)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-[#292B26]">
                <span>Self-Reported Tension Rating</span>
                <strong className="text-[#34483A]">{simTension} / 10</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={simTension}
                onChange={(e) => setSimTension(parseInt(e.target.value))}
                className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                <span>1 (Serene)</span>
                <span>5 (Neutral)</span>
                <span>10 (Overwhelmed)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-[#292B26]">
                <span>Natural Outdoor Exposure</span>
                <strong className="text-[#34483A]">{simOutdoorMin} minutes</strong>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="10"
                value={simOutdoorMin}
                onChange={(e) => setSimOutdoorMin(parseInt(e.target.value))}
                className="w-full accent-[#34483A] cursor-pointer h-2 bg-[#E9E5D9] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-[#77766D] mt-1">
                <span>0m (Indoor confinement)</span>
                <span>30m (Recommended)</span>
                <span>120m (Full immersion)</span>
              </div>
            </div>
          </div>

          {/* Model Output Gauges */}
          <div className="lg:col-span-5 bg-[#E9E5D9]/60 p-6 rounded-2xl border border-[#D7C5AC] flex flex-col justify-between text-left">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-2">
                Simulated Assessment
              </div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-serif text-5xl font-bold text-[#292B26]">
                  {computedScore}
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FBF9F4] shadow-xs">
                  <span className={tierColor}>{stressTier}</span>
                </span>
              </div>
              <div className="text-xs text-[#77766D] mb-6">
                Calculated Index (0–100) • Confidence Interval: <strong>{confidenceScore}%</strong>
              </div>

              {/* Contributing factors breakdown */}
              <div className="space-y-2 pt-4 border-t border-[#D7C5AC]">
                <div className="text-xs font-semibold text-[#292B26] mb-2">Active Contributing Drivers:</div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] text-xs flex justify-between">
                  <span>Sleep Factor:</span>
                  <strong>{simSleep < 7 ? `-${Math.round(sleepDebt * 14)} pts deficit` : '+15 pts restorative'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] text-xs flex justify-between">
                  <span>Workload Strain:</span>
                  <strong>{simWorkload > 8 ? `+${Math.round(workExcess * 6)} pts strain` : 'Sustainable'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9F4] text-xs flex justify-between">
                  <span>Nature Reset Buffer:</span>
                  <strong className="text-[#34483A]">-{Math.round(outdoorRelief)} pts relief</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D7C5AC] text-xs">
              <span className="font-semibold text-[#34483A]">Grounded Recommendation:</span>
              <p className="text-[#77766D] mt-1">
                {computedScore > 65
                  ? 'Initiate a 10-minute Box Breathing session and step away from illuminated screens.'
                  : computedScore > 45
                  ? 'Maintain a 20-minute gentle evening walk before digital wind-down.'
                  : 'Nervous state is receptive and centered. Ideal window for creative focus or sports.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- METHODOLOGY DEEP DIVES ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-24">
        <div className="glass-card p-8 rounded-3xl border-[#E4DED2]">
          <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-[#292B26] mb-3">Pattern Discovery & Correlation</h3>
          <p className="text-sm text-[#77766D] leading-relaxed">
            Rather than treating each day in isolation, Psygma examines rolling windows. It detects the lagged consequences of irregular sleep—how a difficult Monday deadline often precipitates a recovery dip on Wednesday morning.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border-[#E4DED2]">
          <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-[#292B26] mb-3">Uncertainty Quantification</h3>
          <p className="text-sm text-[#77766D] leading-relaxed">
            AI should never masquerade uncertainty as omniscience. Psygma calculates explicit confidence bounds based on input completeness. If data is sparse, the model widens its confidence interval and states what information is missing.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border-[#E4DED2]">
          <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-[#292B26] mb-3">Zero-Hallucination Grounding</h3>
          <p className="text-sm text-[#77766D] leading-relaxed">
            Every insight displayed by Psygma cites the precise check-in entries that prompted it. We employ deterministic attribution schemas so you can verify why a recommendation was made.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border-[#E4DED2]">
          <div className="w-10 h-10 rounded-xl bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mb-4">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl text-[#292B26] mb-3">Recommendation Feedback Loop</h3>
          <p className="text-sm text-[#77766D] leading-relaxed">
            Your feedback directly calibrates the intervention rankings. If breathing exercises prove more restorative for you than audio sessions, the ranking engine dynamically elevates respiratory practices in your feed.
          </p>
        </div>
      </div>

      {/* Non-Medical Disclaimer Banner */}
      <div className="bg-[#E9E5D9]/70 border border-[#D7C5AC] p-6 rounded-2xl flex items-start gap-3.5 text-left text-xs text-[#77766D] mb-16">
        <Info className="w-5 h-5 text-[#777B51] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#292B26] block mb-1">Ethical Guardrail & Clinical Non-Diagnostic Boundary:</strong>
          Psygma is engineered exclusively as a lifestyle intelligence and personal reflection tool. It does not measure clinical psychiatric disorders, prescribe therapeutics, or substitute for licensed mental healthcare professionals.
        </div>
      </div>

      <div className="text-center">
        <Link to="/app/stress-monitor" className="pill-button-primary px-8 py-3.5 text-base shadow-lg">
          <span>View Live Stress Monitor in App</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
