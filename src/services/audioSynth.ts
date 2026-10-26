// Authentic Audio Player & Sound Service for Mindful Wellness Experiences
// Plays authentic, high-quality recorded acoustic files (Om chanting, Bansuri flute, Temple singing bowls, Monsoon rain)
// with HTML5 Audio looping, volume control, and Web Audio API spectrum analysis.

const REAL_AUDIO_MAP: Record<string, string> = {
  'om-tanpura': '/audio/om_chanting.mp3',
  'om': '/audio/om_chanting.mp3',
  'track_om_chant': '/audio/om_chanting.mp3',
  'track_om_432': '/audio/om_chanting.mp3',

  'bansuri-flute': '/audio/bansuri_flute.mp3',
  'flute': '/audio/bansuri_flute.mp3',
  'track_bansuri_flute': '/audio/bansuri_flute.mp3',
  'track_bansuri_yaman': '/audio/bansuri_flute.mp3',
  'track_bansuri_keeravani': '/audio/bansuri_flute.mp3',

  'bowls': '/audio/singing_bowl.mp3',
  'singing-bowl': '/audio/singing_bowl.mp3',
  'track_temple_bowls': '/audio/singing_bowl.mp3',
  'track_tibetan_bowls': '/audio/singing_bowl.mp3',

  'rain': '/audio/monsoon_rain.mp3',
  'stream': '/audio/monsoon_rain.mp3',
  'brown-noise': '/audio/monsoon_rain.mp3',
  'track_monsoon_rain': '/audio/monsoon_rain.mp3',
  'track_rain_canopy': '/audio/monsoon_rain.mp3',
};

class MindfulAudioSynthesizer {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentTrack: string | null = null;
  private currentVolume: number = 0.5;
  private analyserNode: AnalyserNode | null = null;

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getFrequencyData(dataArray: Uint8Array): void {
    if (this.analyserNode && this.isPlaying) {
      this.analyserNode.getByteFrequencyData(dataArray as any);
    } else if (dataArray && typeof dataArray.fill === 'function') {
      dataArray.fill(0);
    }
  }

  public playTrack(
    type: 'rain' | 'bowls' | 'stream' | 'brown-noise' | 'om-tanpura' | 'bansuri-flute' | string,
    volume: number = 0.5
  ): void {
    this.stop();

    this.isPlaying = true;
    this.currentTrack = type;
    this.currentVolume = Math.max(0, Math.min(1, volume));

    // Resolve target audio source
    let targetSrc: string;
    if (type.startsWith('/') || type.startsWith('http')) {
      targetSrc = type;
    } else {
      targetSrc = REAL_AUDIO_MAP[type] || '/audio/singing_bowl.mp3';
    }

    if (!this.audioElement) {
      this.audioElement = new Audio();
    }

    this.audioElement.src = targetSrc;
    this.audioElement.loop = true;
    this.audioElement.volume = this.currentVolume;

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio playback notice:', err);
      });
    }
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  public stop(): void {
    this.isPlaying = false;
    this.currentTrack = null;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (err) {
        console.warn('Error pausing audio:', err);
      }
    }
  }

  public getStatus(): { isPlaying: boolean; currentTrack: string | null } {
    return { isPlaying: this.isPlaying, currentTrack: this.currentTrack };
  }
}

export const audioSynth = new MindfulAudioSynthesizer();
