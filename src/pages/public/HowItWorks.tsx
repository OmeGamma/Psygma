import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Compass,
  Activity,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Layers,
  Heart,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { FAQS } from '../../constants/demoData';

const STAGES = [
  {
    id: 'input',
    num: '01',
    title: 'Input & Daily Reflection',
    tagline: 'Effortless 2-minute daily check-ins',
    desc: 'You log mood, subjective stress level, sleep duration & quality, cognitive workload, and contextual tags (such as caffeine, screen time, or outdoor activity).',
    details: [
      'Multi-dimensional mood selection reflecting emotional valence',
      'Continuous slider for sleep hours and subjective sleep restfulness',
      'Contextual tags that capture lifestyle variables without cumbersome logging',
      'Optional freeform reflections for somatic nuance'
    ],
    visualType: 'checkin_preview'
  },
  {
    id: 'baseline',
    num: '02',
    title: 'Personal Baseline Calibration',
    tagline: 'Your unique equilibrium, not population averages',
    desc: 'Psygma constructs a rolling statistical model of what represents "normal" for you. Some individuals thrive on 7 hours of sleep; others require 8.5 hours.',
    details: [
      'Moving 14-day median calculation of resting energy and cognitive load',
      'Adjustment for individual circadian predispositions (morning vs evening chronotypes)',
      'Threshold calibration that adapts to shifting life rhythms (such as seasonal changes)',
      'Exclusion of atypical statistical outliers to prevent calibration skew'
    ],
    visualType: 'baseline_preview'
  },
  {
    id: 'analysis',
    num: '03',
    title: 'Grounded Stress Estimation',
    tagline: 'Multi-factor predictive correlation modeling',
    desc: 'Our grounded model (Psygma BioStress Engine v2.4 by Team OmeGamma) synthesizes sleep debt, workload saturation, and reported stress into an objective 0–100 index.',
    details: [
      'Weighted sleep-elasticity curve highlighting delayed fatigue onset',
      'Workload index factoring consecutive screen hours',
      'Confidence interval calculation based on logged historical density',
      'Clear separation of subjective sensation from computed estimate'
    ],
    visualType: 'analysis_preview'
  },
  {
    id: 'insight',
    num: '04',
    title: 'Explainable Insight Synthesis',
    tagline: 'Actionable observations cited in real data',
    desc: 'Instead of abstract numbers, Psygma generates plain-language insights that point directly to the underlying factors driving today\'s nervous state.',
    details: [
      'Specific grounding: "Based on 3 days with <6h sleep and heavy screen time"',
      'Attribution of positive factors (such as recent outdoor movement) alongside stressors',
      'Explicit communication of model uncertainty and non-diagnostic boundaries',
      'Actionable recommendations targeted to immediate time windows'
    ],
    visualType: 'insight_preview'
  },
  {
    id: 'action',
    num: '05',
    title: 'Personalized Recovery Interventions',
    tagline: 'Tailored actions matched to available time and energy',
    desc: 'Psygma recommends precise somatic and environmental interventions: Box Breathing, 4-7-8 relaxing breath, mindful audio soundscapes, or nearby nature walks.',
    details: [
      'Recovery actions categorized by duration (5 min, 15 min, 30 min, or full retreat)',
      'Sensory acoustic therapy using synthesized rain, stream, and singing bowls',
      'Integration with TinyFish verified nature retreats for weekend resets',
      'Dynamic filtering based on your immediate energy and weather conditions'
    ],
    visualType: 'action_preview'
  },
  {
    id: 'feedback',
    num: '06',
    title: 'Adaptive Feedback Loop',
    tagline: 'Continuous machine learning refinement',
    desc: 'Every time you complete an activity or mark an insight as helpful, the model updates its recommendation weights to better understand what genuinely restores you.',
    details: [
      'One-tap feedback buttons: "Helpful", "Not for me", or "Applied"',
      'Continuous weighting adjustments for activity categories',
      'Privacy-preserving local preference caching',
      'Measurable pre- and post-activity recovery tracking'
    ],
    visualType: 'feedback_preview'
  }
];

export const HowItWorks: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>('input');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const activeStage = STAGES.find(s => s.id === activeStageId) || STAGES[0];

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          The Psygma Methodology
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          How Psygma Turns Patterns into Calm
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          A continuous, six-stage intelligence framework developed by Team OmeGamma that honors personal subjectivity while applying rigorous machine learning heuristics.
        </p>
      </div>

      {/* Interactive 6-Stage Interactive Showcase */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border-[#E4DED2] shadow-xl mb-24">
        {/* Stage Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 hide-scrollbar border-b border-[#E4DED2]/80">
          {STAGES.map(stage => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#34483A] text-[#FBF9F4] shadow-sm'
                    : 'bg-[#FBF9F4] text-[#77766D] hover:bg-[#E9E5D9] hover:text-[#292B26] border border-[#E4DED2]'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{stage.num}</span>
                <span>{stage.title.split(' ')[0]} {stage.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 text-left">
            <div className="text-xs font-mono font-semibold text-[#777B51] uppercase tracking-wider mb-1">
              Stage {activeStage.num}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26] mb-2">{activeStage.title}</h2>
            <p className="text-sm font-medium text-[#34483A] mb-4">{activeStage.tagline}</p>
            <p className="text-sm text-[#77766D] leading-relaxed mb-6">{activeStage.desc}</p>

            <div className="space-y-3 pt-4 border-t border-[#E4DED2]">
              {activeStage.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#292B26]">
                  <CheckCircle2 className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Visual Card for Stage */}
          <div className="lg:col-span-6">
            <div className="bg-[#E9E5D9]/60 p-6 sm:p-8 rounded-3xl border border-[#D7C5AC]/70 shadow-inner">
              <div className="bg-[#FBF9F4] p-6 rounded-2xl border border-[#E4DED2] shadow-sm text-left">
                <div className="flex items-center justify-between text-xs text-[#77766D] mb-4 pb-2 border-b border-[#E4DED2]">
                  <span className="font-semibold uppercase tracking-wider text-[#34483A]">
                    Psygma Engine v2.4
                  </span>
                  <span>Live Simulation</span>
                </div>

                {activeStage.id === 'input' && (
                  <div className="space-y-3">
                    <div className="text-sm font-serif font-semibold">Today's Check-In Snapshot</div>
                    <div className="p-3 bg-[#F4F0E8] rounded-xl text-xs space-y-1">
                      <div className="flex justify-between"><span>Mood:</span> <strong>Balanced</strong></div>
                      <div className="flex justify-between"><span>Reported Stress:</span> <strong>4 / 10</strong></div>
                      <div className="flex justify-between"><span>Sleep Hours:</span> <strong>7.4 hours</strong></div>
                      <div className="flex justify-between"><span>Workload:</span> <strong>6.5 hours</strong></div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#A6B59A]/20 rounded-full text-[10px]">#morning-tea</span>
                      <span className="px-2 py-0.5 bg-[#A6B59A]/20 rounded-full text-[10px]">#outdoor-walk</span>
                    </div>
                  </div>
                )}

                {activeStage.id === 'baseline' && (
                  <div className="space-y-3">
                    <div className="text-sm font-serif font-semibold">14-Day Median Calibration</div>
                    <div className="p-3 bg-[#F4F0E8] rounded-xl text-xs space-y-2">
                      <div>
                        <div className="flex justify-between mb-1"><span>Target Sleep Window:</span> <strong>7.5 hrs</strong></div>
                        <div className="w-full bg-[#E4DED2] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#34483A] h-full w-[78%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><span>Workload Tolerance Limit:</span> <strong>8.0 hrs</strong></div>
                        <div className="w-full bg-[#E4DED2] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#777B51] h-full w-[65%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStage.id === 'analysis' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-serif font-semibold">Calculated Stress Score</span>
                      <span className="text-2xl font-serif text-[#34483A] font-bold">38 / 100</span>
                    </div>
                    <p className="text-xs text-[#77766D]">Classification: <strong>Balanced</strong> • Model Confidence: <strong>88%</strong></p>
                    <div className="p-3 bg-[#F4F0E8] rounded-xl text-xs space-y-1">
                      <div className="text-[#34483A]">✓ +30 pts: Restful 7.4h sleep</div>
                      <div className="text-[#77766D]">○ +20 pts: Sustainable workload</div>
                    </div>
                  </div>
                )}

                {activeStage.id === 'insight' && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase text-[#777B51]">Grounded Observation</div>
                    <p className="text-sm font-serif leading-snug">
                      "Your stress drops by 38% on days with outdoor physical activity before 4:00 PM."
                    </p>
                    <p className="text-xs text-[#77766D] bg-[#F4F0E8] p-2.5 rounded-xl">
                      * Supported by 7 historical check-ins across the past two weeks.
                    </p>
                  </div>
                )}

                {activeStage.id === 'action' && (
                  <div className="space-y-3">
                    <div className="text-sm font-serif font-semibold">Immediate Recommendation</div>
                    <div className="p-3 bg-[#F4F0E8] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#292B26]">Box Breathing (4-4-4-4)</div>
                        <div className="text-[11px] text-[#77766D]">5 min • Parasympathetic calming</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#34483A] text-white text-[10px] font-semibold">
                        Start Now
                      </span>
                    </div>
                  </div>
                )}

                {activeStage.id === 'feedback' && (
                  <div className="space-y-3">
                    <div className="text-sm font-serif font-semibold">Was this suggestion helpful?</div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg bg-[#A6B59A]/30 text-[#34483A] text-xs font-semibold">
                        ✓ Helpful
                      </button>
                      <button className="flex-1 py-1.5 rounded-lg bg-[#E9E5D9] text-[#77766D] text-xs font-medium">
                        Not for me
                      </button>
                    </div>
                    <p className="text-[10px] text-[#77766D] text-center">Model weights adapt dynamically.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <section id="faq" className="mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-3">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292B26]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#77766D] mt-2">
            Everything you need to know about Psygma’s technology, ethics, and practices.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border-[#E4DED2] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-lg font-medium text-[#292B26]">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#77766D] shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-5 pt-0 text-sm text-[#77766D] leading-relaxed border-t border-[#E4DED2]/60 bg-[#FBF9F4]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mt-24 text-center">
        <Link to="/app/check-in" className="pill-button-primary px-8 py-3.5 text-base shadow-lg">
          <span>Experience Stage 1: Try a Check-in</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
