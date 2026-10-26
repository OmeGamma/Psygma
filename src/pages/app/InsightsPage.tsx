import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Shield,
  Clock,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export const InsightsPage: React.FC = () => {
  const { insights, submitFeedback } = useWellness();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const filteredInsights = filterCategory === 'all'
    ? insights
    : insights.filter(i => i.category === filterCategory);

  const handleFeedbackClick = async (insightId: string, feedbackType: 'helpful' | 'unhelpful' | 'applied') => {
    await submitFeedback(insightId, feedbackType);
    setFeedbackToast(`Feedback recorded: "${feedbackType}". Thank you.`);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Grounded Observations
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            AI Wellness Insights
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Concise, explainable observations based on your real check-in entries and personal baseline.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E9E5D9]/70 rounded-full border border-[#D7C5AC]/60 self-start sm:self-auto overflow-x-auto hide-scrollbar">
          {['all', 'sleep', 'activity', 'routine', 'stress'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-[#34483A] text-white shadow-xs'
                  : 'text-[#77766D] hover:text-[#292B26]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {feedbackToast && (
        <div className="p-3 bg-[#A6B59A]/30 text-[#34483A] border border-[#A6B59A]/50 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Empty State */}
      {filteredInsights.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border-[#E4DED2] bg-[#FBF9F4] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E9E5D9] text-[#34483A] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#292B26]">No Observations for this Filter</h3>
          <p className="text-xs text-[#77766D] max-w-md mx-auto">
            AI observations require at least 2–3 daily check-ins to detect meaningful correlations. Check back after your next reflection.
          </p>
          <Link
            to="/app/check-in"
            className="pill-button-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5"
          >
            <span>Complete Daily Check-in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        /* Insights List */
        <div className="space-y-6">
          {filteredInsights.map(insight => (
            <div
              key={insight.id}
              className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] shadow-sm space-y-5 bg-[#FBF9F4]"
            >
              {/* Top Card Badge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E4DED2]">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A6B59A]/30 text-[#34483A] text-xs font-bold uppercase tracking-wider">
                    {insight.category}
                  </span>
                  <span className="text-xs text-[#77766D] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {insight.timestamp}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#34483A] bg-[#E9E5D9] px-3 py-1 rounded-full border border-[#D7C5AC] self-start sm:self-auto">
                  Confidence: {insight.confidenceScore}%
                </div>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-serif text-2xl text-[#292B26] mb-1">{insight.title}</h2>
              </div>

              {/* 4 Standardized Elements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. What Psygma Noticed */}
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] space-y-1.5">
                  <span className="font-semibold text-[#34483A] uppercase tracking-wider text-[10px] block">
                    1. What Psygma Noticed
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    "{insight.observation}"
                  </p>
                </div>

                {/* 2. Why It Matters */}
                <div className="p-4 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] space-y-1.5">
                  <span className="font-semibold text-[#34483A] uppercase tracking-wider text-[10px] block">
                    2. Why It May Matter
                  </span>
                  <ul className="space-y-1 text-[#77766D]">
                    {insight.potentialContributors.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#777B51]"></span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. What You Can Try */}
                <div className="p-4 rounded-2xl bg-[#E9E5D9]/50 border border-[#D7C5AC] space-y-1.5">
                  <span className="font-semibold text-[#34483A] uppercase tracking-wider text-[10px] block">
                    3. What You Can Try
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {insight.suggestedAction}
                  </p>
                </div>

                {/* 4. Evidence & Limitations */}
                <div className="p-4 rounded-2xl bg-[#E9E5D9]/50 border border-[#D7C5AC] space-y-1.5">
                  <span className="font-semibold text-[#34483A] uppercase tracking-wider text-[10px] block">
                    4. Evidence & Limitations
                  </span>
                  <p className="text-[#77766D] leading-relaxed">
                    <strong>Evidence:</strong> {insight.grounding}
                  </p>
                  <p className="text-[11px] text-[#77766D] italic">
                    <strong>Limitation:</strong> {insight.limitations}
                  </p>
                </div>
              </div>

              {/* Action & Feedback Footer */}
              <div className="pt-3 border-t border-[#E4DED2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={insight.actionRoute || '/app/wellness'}
                    className="pill-button-primary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5"
                  >
                    <span>Try Activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Feedback collection: Was this helpful? */}
                <div className="flex items-center gap-2 text-xs text-[#77766D]">
                  <span>Was this helpful?</span>
                  <button
                    onClick={() => handleFeedbackClick(insight.id, 'helpful')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      insight.feedback === 'helpful'
                        ? 'bg-[#34483A] text-white border-[#34483A]'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                    title="Mark as helpful"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Yes</span>
                  </button>

                  <button
                    onClick={() => handleFeedbackClick(insight.id, 'unhelpful')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      insight.feedback === 'unhelpful'
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                    title="Mark as unhelpful"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
