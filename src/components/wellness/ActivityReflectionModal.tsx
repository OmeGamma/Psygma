import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Smile,
  Meh,
  Frown,
  Sparkles,
  ArrowRight,
  Heart,
  Wind
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { ActivityCompletionEntry } from '../../types/wellness';

interface ActivityReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  category: string;
  durationMinutes: number;
  initialPreRating?: number;
  onSaved?: (entry: ActivityCompletionEntry) => void;
}

export const ActivityReflectionModal: React.FC<ActivityReflectionModalProps> = ({
  isOpen,
  onClose,
  activityTitle,
  category,
  durationMinutes,
  initialPreRating = 6,
  onSaved
}) => {
  const [completed, setCompleted] = useState<boolean>(true);
  const [helpful, setHelpful] = useState<boolean | null>(true);
  const [feelNow, setFeelNow] = useState<string>('Calmer & lighter');
  const [preRating, setPreRating] = useState<number>(initialPreRating);
  const [postRating, setPostRating] = useState<number>(Math.max(1, initialPreRating - 2));
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const saved = await psygmaApi.logActivityCompletion({
        activityId: `act_${activityTitle.toLowerCase().replace(/\s+/g, '_')}`,
        activityTitle,
        category,
        durationMinutes,
        completed,
        helpful: helpful ?? undefined,
        feelNow,
        notes: notes.trim() ? notes : undefined,
        preStressRating: preRating,
        postStressRating: postRating
      });

      setSuccess(true);
      if (onSaved) onSaved(saved);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Failed to log reflection:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="glass-card bg-[#FBF9F4] p-6 sm:p-8 rounded-3xl border-[#E4DED2] max-w-lg w-full text-left shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#77766D] hover:bg-[#E9E5D9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#A6B59A]/30 text-[#34483A] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#292B26]">Reflection Recorded</h3>
            <p className="text-xs text-[#77766D] max-w-xs mx-auto">
              Your feedback is securely recorded and reinforces future recovery personalization.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777B51] block mb-0.5">
                Closed-Loop Reflection
              </span>
              <h3 className="font-serif text-2xl text-[#292B26]">{activityTitle}</h3>
              <p className="text-xs text-[#77766D] mt-0.5">
                {category} • {durationMinutes} minutes session
              </p>
            </div>

            {/* Q1: Completion */}
            <div>
              <label className="block text-xs font-semibold text-[#292B26] mb-1.5">
                Did you complete this reset?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCompleted(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    completed
                      ? 'bg-[#34483A] text-white border-[#34483A]'
                      : 'bg-[#F4F0E8] text-[#77766D] border-[#E4DED2]'
                  }`}
                >
                  Yes, Completed
                </button>
                <button
                  type="button"
                  onClick={() => setCompleted(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    !completed
                      ? 'bg-[#34483A] text-white border-[#34483A]'
                      : 'bg-[#F4F0E8] text-[#77766D] border-[#E4DED2]'
                  }`}
                >
                  Partially / Interrupted
                </button>
              </div>
            </div>

            {/* Q2: Helpful? */}
            <div>
              <label className="block text-xs font-semibold text-[#292B26] mb-1.5">
                Was this activity helpful for your current state?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHelpful(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    helpful === true
                      ? 'bg-[#A6B59A]/30 text-[#34483A] border-[#34483A]'
                      : 'bg-[#F4F0E8] text-[#77766D] border-[#E4DED2]'
                  }`}
                >
                  Helpful & Restorative
                </button>
                <button
                  type="button"
                  onClick={() => setHelpful(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    helpful === false
                      ? 'bg-stone-200 text-stone-800 border-stone-400'
                      : 'bg-[#F4F0E8] text-[#77766D] border-[#E4DED2]'
                  }`}
                >
                  Not Helpful Today
                </button>
              </div>
            </div>

            {/* Q3: How do you feel now? */}
            <div>
              <label className="block text-xs font-semibold text-[#292B26] mb-1.5">
                How does your nervous system feel right now?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {['Calmer & lighter', 'More centered', 'Energized', 'Same as before', 'Sleepy & relaxed'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFeelNow(f)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      feelNow === f
                        ? 'bg-[#34483A] text-white border-[#34483A] font-semibold'
                        : 'bg-[#F4F0E8] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Before and After Self-Reported Rating */}
            <div className="p-3.5 rounded-2xl bg-[#F4F0E8] border border-[#E4DED2] space-y-3">
              <span className="text-[11px] font-semibold text-[#777B51] uppercase tracking-wider block">
                Self-Reported Tension Comparison (1 to 10)
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-[#77766D] mb-1">
                    <span>Before Session:</span>
                    <strong className="text-[#292B26] font-mono">{preRating}/10</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={preRating}
                    onChange={(e) => setPreRating(parseInt(e.target.value))}
                    className="w-full accent-[#34483A]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#77766D] mb-1">
                    <span>After Session:</span>
                    <strong className="text-[#34483A] font-mono">{postRating}/10</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={postRating}
                    onChange={(e) => setPostRating(parseInt(e.target.value))}
                    className="w-full accent-[#34483A]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#77766D] italic">
                * Labelled as self-reported shift rather than clinical proof of causation.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#77766D] hover:bg-[#E9E5D9]"
              >
                Skip Reflection
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="pill-button-primary text-xs py-2 px-5 shadow-xs"
              >
                {submitting ? 'Saving...' : 'Save Reflection'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
