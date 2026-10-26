import {
  UserProfile,
  CheckInEntry,
  StressAssessment,
  AIInsight,
  RecoveryPlan,
  NatureRetreat,
  WellnessReportSummary,
  ActivityCompletionEntry,
  AuthResponse,
  HealthMeasurementCreate,
  HealthMeasurementEntry,
  MusicTrack,
  MusicFeedbackPayload
} from '../types/wellness';
import {
  INITIAL_USER,
  INITIAL_CHECKINS,
  INITIAL_ASSESSMENT,
  INITIAL_INSIGHTS,
  NATURE_RETREATS
} from '../constants/demoData';

export const STORAGE_KEYS = {
  TOKEN: 'psygma_auth_token',
  AUTH: 'isAuthenticated'
};

// Local storage helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Grounded AI estimation algorithm fallback (client-side matching backend model)
export function calculateStressAssessment(
  checkins: CheckInEntry[],
  latestCheckIn?: CheckInEntry,
  userProfile?: UserProfile
): StressAssessment {
  const current = latestCheckIn || checkins[checkins.length - 1];
  if (!current) {
    return {
      score: 35,
      level: 'Balanced',
      confidence: 50,
      modelVersion: 'Psygma Grounded BioStress Engine',
      timestamp: 'Today',
      contributors: [],
      recommendations: [
        'Complete your first daily check-in to calibrate your personal baseline.',
        'Maintain a consistent sleep window to support natural recovery.'
      ],
      disclaimer: 'Psygma delivers wellness awareness heuristics. This does not constitute clinical medical diagnosis.',
      baselineComparison: 'No previous history yet. Baseline will calibrate with consecutive daily check-ins.',
      dataSufficiency: 'Initial state: 0 check-ins recorded.'
    };
  }

  // 14-day history subset for rolling baseline
  const historySubset = checkins.slice(-14);
  const rollingAvgSleep = historySubset.reduce((acc, c) => acc + c.sleepHours, 0) / historySubset.length;
  const rollingAvgWork = historySubset.reduce((acc, c) => acc + c.workloadHours, 0) / historySubset.length;
  const rollingAvgStress = historySubset.reduce((acc, c) => acc + c.reportedStress, 0) / historySubset.length;

  const targetSleep = userProfile?.preferences.typicalSleepGoalHours || 7.5;
  const sleepDiff = targetSleep - current.sleepHours;
  const sleepScoreImpact = Math.round(sleepDiff * 10);

  const normalWork = rollingAvgWork || 7.0;
  const workDiff = current.workloadHours - normalWork;
  const workScoreImpact = Math.round(workDiff * 4);

  const moodMap: Record<string, number> = {
    peaceful: -15,
    balanced: -8,
    energized: -5,
    tired: 12,
    restless: 18,
    overwhelmed: 28
  };
  const moodImpact = moodMap[current.mood] || 0;
  const reportedImpact = Math.round((current.reportedStress - 5) * 5);

  let rawScore = 40 + sleepScoreImpact + workScoreImpact + moodImpact + reportedImpact;
  rawScore = Math.max(10, Math.min(95, rawScore));

  let level: 'Low' | 'Balanced' | 'Elevated' | 'High' = 'Balanced';
  if (rawScore < 30) level = 'Low';
  else if (rawScore < 55) level = 'Balanced';
  else if (rawScore < 75) level = 'Elevated';
  else level = 'High';

  const confidence = Math.min(96, Math.max(70, 75 + checkins.length * 2));

  const contributors = [];
  if (current.sleepHours < 6.5) {
    contributors.push({
      factor: 'Short Sleep Window',
      impact: 'negative' as const,
      description: `${current.sleepHours}h recorded vs ${targetSleep}h baseline`,
      weight: 35
    });
  } else {
    contributors.push({
      factor: 'Sufficient Sleep Restoration',
      impact: 'positive' as const,
      description: `${current.sleepHours}h recorded supports neurological recovery`,
      weight: 30
    });
  }

  if (current.workloadHours > 8) {
    contributors.push({
      factor: 'High Cognitive Workload',
      impact: 'negative' as const,
      description: `${current.workloadHours} hours intensive work logged`,
      weight: 25
    });
  } else {
    contributors.push({
      factor: 'Sustainable Workload Tempo',
      impact: 'positive' as const,
      description: `${current.workloadHours}h work within optimal capacity limits`,
      weight: 20
    });
  }

  if (current.contextTags.includes('outdoor') || current.contextTags.includes('badminton') || current.contextTags.includes('nature')) {
    contributors.push({
      factor: 'Physical Movement Active',
      impact: 'positive' as const,
      description: 'Physical or outdoor reset verified in context tags',
      weight: 20
    });
  } else if (current.contextTags.includes('coffee-heavy') || current.contextTags.includes('screen-time')) {
    contributors.push({
      factor: 'Sensory & Screen Overstimulation',
      impact: 'negative' as const,
      description: 'Multiple stimulants or high screen exposure indicated',
      weight: 15
    });
  }

  const recommendations = [];
  if (rawScore > 60) {
    recommendations.push('Initiate a 10-minute Box Breathing session before evening transitions.');
    recommendations.push('Shift screen filters to warm spectrum and disengage from work notifications.');
    recommendations.push('Prioritize a 30-minute nature walk tomorrow afternoon.');
  } else {
    recommendations.push('Maintain current rhythmic morning hydration or tea routine.');
    recommendations.push('Continue balanced sleep timing between 10:30 PM and 7:00 AM.');
    recommendations.push('Schedule active movement (badminton or brisk walking) to sustain momentum.');
  }

  const sleepComparisonText = current.sleepHours < rollingAvgSleep - 0.5
    ? `shorter than your ${rollingAvgSleep.toFixed(1)}h average`
    : `consistent with your ${rollingAvgSleep.toFixed(1)}h baseline`;
  const stressComparisonText = current.reportedStress > rollingAvgStress + 0.8
    ? `higher than your recent ${rollingAvgStress.toFixed(1)}/10 average`
    : `aligned with your typical ${rollingAvgStress.toFixed(1)}/10 baseline`;

  return {
    score: rawScore,
    level,
    confidence,
    modelVersion: 'Psygma Grounded Engine v2.4 (OmeGamma)',
    timestamp: 'Just now',
    contributors,
    recommendations,
    disclaimer: 'Psygma delivers wellness awareness heuristics. This does not constitute clinical medical diagnosis.',
    baselineComparison: `Your reported stress is ${stressComparisonText}, and your sleep was ${sleepComparisonText}.`,
    rollingAvgStress: Math.round(rollingAvgStress * 10) / 10,
    rollingAvgSleep: Math.round(rollingAvgSleep * 10) / 10,
    dataSufficiency: `Calibrated with ${historySubset.length} recorded entries.`
  };
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const psygmaApi = {
  // --- Authentication ---
  async login(email: string, pass: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to authenticate');
    }
    const data: AuthResponse = await res.json();
    setToken(data.token);
    return data;
  },

  async register(name: string, email: string, pass: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration encountered an issue');
    }
    const data: AuthResponse = await res.json();
    setToken(data.token);
    return data;
  },

  async demoLogin(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      throw new Error('Demo login service unavailable');
    }
    const data: AuthResponse = await res.json();
    setToken(data.token);
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      if (res.status === 401) {
        this.clearPrivateCache();
      }
      throw new Error('Session invalid');
    }
    return await res.json();
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(1500)
      });
    } catch {}
    this.clearPrivateCache();
  },

  clearPrivateCache(): void {
    removeStored(STORAGE_KEYS.TOKEN);
    removeStored(STORAGE_KEYS.AUTH);
    removeStored('psygma_user_data');
    removeStored('psygma_checkin_history');
    removeStored('psygma_current_assessment');
    removeStored('psygma_ai_insights');
    removeStored('psygma_completed_activities');
  },

  // --- Checkins (Persisted in MongoDB) ---
  async getCheckIns(): Promise<CheckInEntry[]> {
    const res = await fetch(`${API_BASE}/api/checkins`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve check-in records from database.');
    }
    return await res.json();
  },

  async addCheckIn(entry: Omit<CheckInEntry, 'id' | 'timestamp' | 'estimatedStress'>): Promise<CheckInEntry> {
    const res = await fetch(`${API_BASE}/api/checkins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to save check-in to database.');
    }
    return await res.json();
  },

  // --- Stress Assessment ---
  async getAssessment(): Promise<StressAssessment> {
    const res = await fetch(`${API_BASE}/api/assessment`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve stress assessment from database.');
    }
    return await res.json();
  },

  // --- AI Insights (Persisted in MongoDB) ---
  async getInsights(): Promise<AIInsight[]> {
    const res = await fetch(`${API_BASE}/api/insights`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve insights from database.');
    }
    return await res.json();
  },

  async submitInsightFeedback(insightId: string, feedback: 'helpful' | 'unhelpful' | 'applied'): Promise<void> {
    const res = await fetch(`${API_BASE}/api/insights/${insightId}/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ feedback }),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to record insight feedback in database.');
    }
  },

  // --- Activity Completion (Persisted in MongoDB) ---
  async logActivityCompletion(entry: {
    activityId: string;
    activityTitle: string;
    category: string;
    durationMinutes: number;
    completed: boolean;
    helpful?: boolean;
    feelNow?: string;
    notes?: string;
    preStressRating?: number;
    postStressRating?: number;
  }): Promise<ActivityCompletionEntry> {
    const res = await fetch(`${API_BASE}/api/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to persist completed activity to database.');
    }
    return await res.json();
  },

  async getCompletedActivities(): Promise<ActivityCompletionEntry[]> {
    const res = await fetch(`${API_BASE}/api/activities`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve completed activities from database.');
    }
    return await res.json();
  },

  // --- User Profile & Preferences (Persisted in MongoDB) ---
  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve user profile from database.');
    }
    return await res.json();
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to persist profile updates to database.');
    }
    return await res.json();
  },

  // --- Health Measurements & Vital Records (Persisted in MongoDB) ---
  async getHealthMeasurements(): Promise<HealthMeasurementEntry[]> {
    const res = await fetch(`${API_BASE}/api/health-measurements`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to retrieve health measurements from database.');
    }
    return await res.json();
  },

  async recordHealthMeasurement(entry: HealthMeasurementCreate): Promise<HealthMeasurementEntry> {
    const res = await fetch(`${API_BASE}/api/health-measurements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to persist health measurement to database.');
    }
    return await res.json();
  },

  async deleteHealthMeasurement(measurementId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/health-measurements/${measurementId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to delete health measurement.');
    }
  },

  // --- Daily Music & Audio Wellness (Persisted in MongoDB) ---
  async getMusicTracks(): Promise<MusicTrack[]> {
    try {
      const res = await fetch(`${API_BASE}/api/music/tracks`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return [];
  },

  async toggleMusicFavorite(trackId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/music/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ trackId }),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to update music favorite.');
    }
    const data = await res.json();
    return data.isFavorite;
  },

  async submitMusicFeedback(payload: MusicFeedbackPayload): Promise<void> {
    const res = await fetch(`${API_BASE}/api/music/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to record music feedback.');
    }
  },

  // --- Nature Retreats (Indian Sanctuaries & TinyFish Integration) ---
  async getRetreats(params?: string | {
    biomeFilter?: string;
    startingCity?: string;
    region?: string;
    budget?: string;
  }): Promise<{ retreats: NatureRetreat[]; isTinyFishConnected: boolean; source: string; startingCity: string }> {
    const biome = typeof params === 'string' ? params : params?.biomeFilter;
    const startingCity = typeof params === 'object' ? params?.startingCity : undefined;
    const region = typeof params === 'object' ? params?.region : undefined;
    const budget = typeof params === 'object' ? params?.budget : undefined;

    try {
      const queryParts: string[] = [];
      if (biome && biome !== 'all') {
        queryParts.push(`biome=${encodeURIComponent(biome)}`);
      }
      if (startingCity) {
        queryParts.push(`startingCity=${encodeURIComponent(startingCity)}`);
      }
      if (region && region !== 'all') {
        queryParts.push(`region=${encodeURIComponent(region)}`);
      }
      if (budget) {
        queryParts.push(`budget=${encodeURIComponent(budget)}`);
      }
      const qs = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const url = `${API_BASE}/api/travel/retreats${qs}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return {
          retreats: data.retreats || NATURE_RETREATS,
          isTinyFishConnected: data.isTinyFishConnected ?? false,
          source: data.source || 'Curated Sanctuaries',
          startingCity: data.startingCity || startingCity || 'Bengaluru'
        };
      }
    } catch {}

    const filtered = !biome || biome === 'all'
      ? NATURE_RETREATS
      : NATURE_RETREATS.filter(r => r.biome.toLowerCase().includes(biome.toLowerCase()));

    return {
      retreats: filtered,
      isTinyFishConnected: false,
      source: 'Verified Curated Sanctuary Inventory (Local Fallback)',
      startingCity: startingCity || 'Bengaluru'
    };
  },

  // --- Recovery Planner Generator ---
  async generateRecoveryPlan(params: {
    timeMinutes: number;
    energy: string;
    budget: string;
    location: string;
    preference: string;
  }): Promise<RecoveryPlan> {
    try {
      const res = await fetch(`${API_BASE}/api/recovery-plan`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Fallback generator
    const time = params.timeMinutes;
    const activities = [];

    if (time <= 20) {
      activities.push({
        timeBlock: 'Minute 0 - 5',
        title: 'Diaphragmatic Coherence Breathing',
        category: 'Mind & Somatic',
        description: 'Synchronize 5-second inhales with 5-second exhales to activate vagal nerve calming.',
        recoveryPoints: 20
      });
      activities.push({
        timeBlock: 'Minute 5 - 20',
        title: 'Open-Air Gaze Horizon Scan',
        category: 'Sensory Reconnection',
        description: 'Stand at a window or outdoors; scan distant tree line to release ocular convergence tension.',
        recoveryPoints: 25
      });
    } else if (time <= 45) {
      activities.push({
        timeBlock: 'Minute 0 - 10',
        title: 'Monsoon Rain & Sweet Birdsong',
        category: 'Acoustic Grounding',
        description: 'Listen through headphones while closing eyes and letting your neck and shoulders relax.',
        recoveryPoints: 30
      });
      activities.push({
        timeBlock: 'Minute 10 - 40',
        title: params.preference === 'Social & active' ? 'Casual Badminton Rallies' : 'Park & Garden Walk',
        category: params.preference === 'Social & active' ? 'Active Movement' : 'Nature Immersion',
        description: params.preference === 'Social & active'
          ? 'Light, friendly badminton rallies in a park or open space with a companion.'
          : 'A relaxed stroll in a tree-shaded park or colony lane, keeping phone notifications on silent.',
        recoveryPoints: 45
      });
      activities.push({
        timeBlock: 'Minute 40 - 45',
        title: 'Herbal Tulsi-Ginger Hydration & Centering',
        category: 'Nourishment',
        description: 'Slow sips of warm tulsi, ginger or herbal green tea; pause and feel the calming warmth.',
        recoveryPoints: 15
      });
    } else {
      activities.push({
        timeBlock: 'Block 1 (Morning)',
        title: 'Riverside & Nature Sanctuary Trail',
        category: 'Deep Nature Immersion',
        description: 'Explore scenic riverside or garden paths, taking time to pause at quiet shaded viewpoints.',
        recoveryPoints: 50
      });
      activities.push({
        timeBlock: 'Block 2 (Mid-day)',
        title: 'Somatic Stillness & Singing Bowls',
        category: 'Mindful Reflection',
        description: 'Lie on a restorative mat, practicing mindful body scan with resonant chime acoustics.',
        recoveryPoints: 35
      });
      activities.push({
        timeBlock: 'Block 3 (Evening)',
        title: 'Digital Sunset Wind-Down Buffer',
        category: 'Circadian Restoration',
        description: 'Dim indoor lighting, read physical literature, and practice 4-7-8 relaxing breath before sleep.',
        recoveryPoints: 35
      });
    }

    const totalRecoveryScore = activities.reduce((acc, a) => acc + a.recoveryPoints, 0);

    return {
      id: `plan_${Date.now()}`,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeBudgetMinutes: time,
      energyLevel: params.energy,
      budget: params.budget,
      location: params.location,
      preference: params.preference,
      activities,
      totalRecoveryScore,
      reflectionPrompt: 'Notice the immediate difference in chest tightness and mental space after completing step one.',
      explanation: `Suggested activities matching ${params.preference} in ${params.location} with ${time} minutes allocated.`
    };
  },

  // --- Weekly & Monthly Reports (MongoDB-Grounded) ---
  async getReportSummary(period: 'weekly' | 'monthly' = 'weekly'): Promise<WellnessReportSummary> {
    try {
      const res = await fetch(`${API_BASE}/api/reports/summary?period=${period}`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    const allCheckins = await this.getCheckIns();
    const user = await this.getUserProfile();
    const activities = await this.getCompletedActivities();

    const windowDays = period === 'weekly' ? 7 : 30;
    const checkins = allCheckins.slice(-windowDays);
    const count = checkins.length;

    const avgStress = count > 0
      ? Math.round(checkins.reduce((acc, c) => acc + (c.estimatedStress || c.reportedStress * 10), 0) / count)
      : 35;
    const avgSleep = count > 0
      ? +(checkins.reduce((acc, c) => acc + c.sleepHours, 0) / count).toFixed(1)
      : 7.5;

    const completionRate = Math.min(100, Math.round((count / (period === 'weekly' ? 7 : 14)) * 100));

    // Grounded top activity from completed logs
    const helpfulActivities = activities.filter(a => a.helpful);
    const topRecoveryActivity = helpfulActivities.length > 0
      ? helpfulActivities[0].activityTitle
      : (count > 0 && checkins.some(c => c.contextTags.includes('outdoor')) ? 'Outdoor nature walking' : 'Paced breathing reset');

    const keyObservations: string[] = [];
    if (count === 0) {
      keyObservations.push('Initial baseline calibration pending; 0 check-ins recorded for this interval.');
      keyObservations.push('Complete daily check-ins to monitor correlation between sleep and stress.');
    } else {
      if (avgSleep < 7.0) {
        keyObservations.push(`Average sleep (${avgSleep}h) was below your target window during this period.`);
      } else {
        keyObservations.push(`Average sleep (${avgSleep}h) maintained restorative consistency.`);
      }
      if (avgStress > 55) {
        keyObservations.push(`Stress was elevated across ${count} logged check-in entries.`);
      } else {
        keyObservations.push(`Stress remained balanced or low throughout this period.`);
      }
      if (helpfulActivities.length > 0) {
        keyObservations.push(`${helpfulActivities.length} completed wellness session(s) rated helpful for recovery.`);
      }
    }

    const actionRecommendations: string[] = count === 0
      ? [
          'Log your first daily check-in to establish your personal baseline.',
          'Schedule a 10-minute focus or breathing break during the day.',
          'Protect a regular sleep schedule between 10:30 PM and 7:00 AM.'
        ]
      : [
          avgSleep < 7.0 ? 'Prioritize a 30-minute earlier wind-down tonight.' : 'Maintain your consistent sleep schedule.',
          'Incorporate at least one preferred outdoor or movement activity weekly.',
          'Continue brief daily check-ins to keep recommendations accurate.'
        ];

    return {
      period,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      userName: user.name,
      avgStressScore: avgStress,
      avgSleepHours: avgSleep,
      checkInCompletionRate: completionRate,
      topStressDriver: avgSleep < 7.0 ? 'Shortened sleep duration & daily workload' : 'Workload demand & screen time',
      topRecoveryActivity,
      keyObservations,
      actionRecommendations,
      dataPointsCount: count
    };
  }
};
