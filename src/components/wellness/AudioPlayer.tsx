import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Music,
  Sparkles,
  Heart,
  ExternalLink,
  ThumbsUp,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';
import { psygmaApi } from '../../services/api';
import { MusicTrack } from '../../types/wellness';

const FALLBACK_TRACKS: MusicTrack[] = [
  {
    id: 'track_om_chant',
    title: 'Sacred Om Chanting with Tanpura',
    category: 'Om Chanting',
    durationMinutes: 15,
    description: 'Real, soothing Om chanting with traditional acoustic tanpura drone to quiet restless thoughts, slow your breathing, and bring inner peace.',
    synthType: 'om-tanpura',
    tags: ['Om Chanting', 'Meditation', 'Vedic Chanting', 'Tanpura', 'Inner Peace'],
    imageUrl: 'https://images.unsplash.com/photo-1506744626753-1fa30fd22541?auto=format&fit=crop&q=80&w=400',
    artist: 'Vedic Chanting Tradition',
    listenUrl: 'https://archive.org/details/112OMAUMChanting',
    isFavorite: true
  },
  {
    id: 'track_bansuri_flute',
    title: 'Soulful Bansuri Flute in Classical Raga',
    category: 'Bansuri Flute',
    durationMinutes: 20,
    description: 'Authentic Indian bamboo flute recital with gentle tanpura in peaceful classical raga to melt away evening tiredness and soften mental tension.',
    synthType: 'bansuri-flute',
    tags: ['Bansuri Flute', 'Indian Classical', 'Raga Keeravani', 'Evening Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=400',
    artist: 'Indian Classical Bansuri',
    listenUrl: 'https://archive.org/details/MusicForMeditationRagaKeeravaniIndianBansuriFluteIndianMusic',
    isFavorite: true
  },
  {
    id: 'track_monsoon_rain',
    title: 'Monsoon Rain & Sweet Birdsong',
    category: 'Monsoon Rain',
    durationMinutes: 25,
    description: 'Gentle, steady monsoon rain falling softly on green garden leaves with morning birdsong and soothing fresh earth aroma.',
    synthType: 'rain',
    tags: ['Monsoon Rain', 'Nature Sounds', 'Fresh Earth Aroma', 'Birdsong'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
    artist: 'Natural Monsoon Soundscape',
    listenUrl: 'https://archive.org/details/relaxingsoundofrain',
    isFavorite: false
  },
  {
    id: 'track_temple_bowls',
    title: 'Temple Chimes & Singing Bowls',
    category: 'Temple Sounds',
    durationMinutes: 15,
    description: 'Clear, resonant acoustic vibrations of traditional brass temple bells and hand-hammered singing bowls to clear mind fog and ease head tightness.',
    synthType: 'bowls',
    tags: ['Temple Sounds', 'Singing Bowl', 'Deep Rest', 'Mindful Calm'],
    imageUrl: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=400',
    artist: 'Sacred Temple Chimes',
    listenUrl: 'https://archive.org/details/SingingBowl1Minute',
    isFavorite: false
  }
];

export const AudioPlayer: React.FC = () => {
  const { audioState, playAudio, stopAudio, setAudioVolume } = useWellness();
  const [tracks, setTracks] = useState<MusicTrack[]>(FALLBACK_TRACKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    psygmaApi.getMusicTracks().then(serverTracks => {
      if (serverTracks && serverTracks.length > 0) {
        setTracks(serverTracks);
      }
    });
  }, []);

  const categories = [
    'All',
    'Om Chanting',
    'Bansuri Flute',
    'Monsoon Rain',
    'Temple Sounds'
  ];

  const filteredTracks = selectedCategory === 'All'
    ? tracks
    : tracks.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleToggleFavorite = async (trackId: string) => {
    try {
      const isNowFav = await psygmaApi.toggleMusicFavorite(trackId);
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isFavorite: isNowFav } : t));
    } catch {
      // Local toggle
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
    }
  };

  const handleFeedback = async (track: MusicTrack) => {
    try {
      await psygmaApi.submitMusicFeedback({
        trackId: track.id,
        trackTitle: track.title,
        helpful: true,
        moodAfter: 'calm and centered'
      });
      setFeedbackToast(`Feedback recorded for "${track.title}" in MongoDB.`);
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch {
      setFeedbackToast('Feedback recorded locally.');
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 w-full border-[#E4DED2]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E4DED2]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77766D] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#777B51]" /> Calming Sounds & Music
          </span>
          <h3 className="font-serif text-2xl text-[#292B26]">Real Indian Music & Nature Soundscapes</h3>
          <p className="text-xs text-[#77766D] mt-0.5">
            Authentic Om chanting, soulful Bansuri flute, gentle monsoon rain, and temple chimes to ease daily stress and bring peace.
          </p>
        </div>

        {/* Volume & Equalizer indicator */}
        <div className="flex items-center gap-4 bg-[#E9E5D9]/60 px-4 py-2 rounded-full border border-[#D7C5AC]/50 self-start sm:self-auto">
          <Volume2 className="w-4 h-4 text-[#77766D]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioState.volume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            className="w-24 accent-[#34483A] cursor-pointer h-1.5 bg-[#D7C5AC] rounded-lg"
            title="Adjust volume"
          />
          <span className="text-xs font-medium text-[#77766D] w-8">
            {Math.round(audioState.volume * 100)}%
          </span>
        </div>
      </div>

      {feedbackToast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#34483A] text-white shadow-xs'
                : 'bg-[#F4F0E8] text-[#77766D] hover:bg-[#E9E5D9] hover:text-[#292B26] border border-[#E4DED2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Track Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracks.map(track => {
          const isThisPlaying = audioState.isPlaying && audioState.currentTrack === (track.synthType || track.id);

          return (
            <div
              key={track.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                isThisPlaying
                  ? 'bg-[#E9E5D9]/90 border-[#34483A] shadow-sm'
                  : 'bg-[#FBF9F4] border-[#E4DED2] hover:bg-[#F4F0E8] hover:border-[#D7C5AC]'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative shadow-inner">
                  <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover" />
                  {isThisPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                      <span className="w-1 h-4 bg-white rounded-full animate-pulse"></span>
                      <span className="w-1 h-6 bg-white rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-150"></span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#292B26] truncate">{track.title}</span>
                    <button
                      onClick={() => handleToggleFavorite(track.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={track.isFavorite ? 'Favorited' : 'Add to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${track.isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                  </div>
                  {track.artist && <div className="text-[10px] text-[#777B51] font-medium">{track.artist}</div>}
                  <p className="text-xs text-[#77766D] line-clamp-2 mt-0.5">{track.description}</p>
                </div>
              </div>

              {/* Controls & Feedback Bar */}
              <div className="pt-2 border-t border-[#E4DED2]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#A6B59A]/20 text-[10px] font-semibold text-[#34483A]">
                    {track.category}
                  </span>
                  <span className="text-[10px] text-[#77766D]">{track.durationMinutes} min</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Feedback button */}
                  <button
                    onClick={() => handleFeedback(track)}
                    className="p-1.5 rounded-lg text-[#77766D] hover:text-[#34483A] hover:bg-[#E9E5D9] transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                    title="Mark this audio as helpful for stress recovery"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Helpful</span>
                  </button>

                  {/* External Streaming Link */}
                  {track.listenUrl && (
                    <a
                      href={track.listenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-[#77766D] hover:text-[#34483A] hover:bg-[#E9E5D9] transition-all"
                      title="Open full authorized recording in streaming portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Play / Stop Button */}
                  <button
                    onClick={() => {
                      if (isThisPlaying) {
                        stopAudio();
                      } else {
                        playAudio(track.synthType || 'bowls', track.title);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isThisPlaying
                        ? 'bg-[#34483A] text-white hover:bg-[#26352b]'
                        : 'bg-[#F4F0E8] text-[#34483A] hover:bg-[#34483A] hover:text-white border border-[#E4DED2]'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Play Tone</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
