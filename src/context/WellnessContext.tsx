import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CheckInEntry,
  StressAssessment,
  AIInsight,
  UserProfile
} from '../types/wellness';
import { psygmaApi, calculateStressAssessment } from '../services/api';
import { audioSynth } from '../services/audioSynth';
import { INITIAL_ASSESSMENT } from '../constants/demoData';
import { useAuth } from './AuthContext';

interface AudioState {
  isPlaying: boolean;
  currentTrack: string | null;
  trackName: string;
  volume: number;
}

interface WellnessContextType {
  checkins: CheckInEntry[];
  assessment: StressAssessment;
  insights: AIInsight[];
  isLoading: boolean;
  audioState: AudioState;
  submitCheckIn: (entry: Omit<CheckInEntry, 'id' | 'timestamp' | 'estimatedStress'>) => Promise<CheckInEntry>;
  submitFeedback: (insightId: string, feedback: 'helpful' | 'unhelpful' | 'applied') => Promise<void>;
  playAudio: (trackType: 'rain' | 'bowls' | 'stream' | 'brown-noise' | 'om-tanpura' | 'bansuri-flute' | string, name: string) => void;
  stopAudio: () => void;
  setAudioVolume: (volume: number) => void;
  refreshWellnessData: () => Promise<void>;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [checkins, setCheckins] = useState<CheckInEntry[]>([]);
  const [assessment, setAssessment] = useState<StressAssessment>(INITIAL_ASSESSMENT);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTrack: null,
    trackName: '',
    volume: 0.6
  });

  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setCheckins([]);
      setAssessment(calculateStressAssessment([]));
      setInsights([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [chk, ass, ins] = await Promise.all([
        psygmaApi.getCheckIns(),
        psygmaApi.getAssessment(),
        psygmaApi.getInsights()
      ]);
      setCheckins(chk);
      setAssessment(ass);
      setInsights(ins);
    } catch (e) {
      console.error('Failed to load wellness data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitCheckIn = async (entry: Omit<CheckInEntry, 'id' | 'timestamp' | 'estimatedStress'>) => {
    const saved = await psygmaApi.addCheckIn(entry);
    await loadData();
    return saved;
  };

  const submitFeedback = async (insightId: string, feedback: 'helpful' | 'unhelpful' | 'applied') => {
    await psygmaApi.submitInsightFeedback(insightId, feedback);
    setInsights(prev => prev.map(i => i.id === insightId ? { ...i, feedback } : i));
  };

  const playAudio = (trackType: 'rain' | 'bowls' | 'stream' | 'brown-noise' | 'om-tanpura' | 'bansuri-flute' | string, name: string) => {
    audioSynth.playTrack(trackType as any, audioState.volume);
    setAudioState(prev => ({
      ...prev,
      isPlaying: true,
      currentTrack: trackType,
      trackName: name
    }));
  };

  const stopAudio = () => {
    audioSynth.stop();
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      currentTrack: null,
      trackName: ''
    }));
  };

  const setAudioVolume = (vol: number) => {
    audioSynth.setVolume(vol);
    setAudioState(prev => ({ ...prev, volume: vol }));
  };

  return (
    <WellnessContext.Provider value={{
      checkins,
      assessment,
      insights,
      isLoading,
      audioState,
      submitCheckIn,
      submitFeedback,
      playAudio,
      stopAudio,
      setAudioVolume,
      refreshWellnessData: loadData
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
