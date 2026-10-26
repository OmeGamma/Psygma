export type MoodType = 'peaceful' | 'energized' | 'balanced' | 'tired' | 'overwhelmed' | 'restless';

export interface UserPreferences {
  interests: string[];
  dislikedActivities?: string[];
  socialPreference: 'Solo focus' | 'Social & active' | 'Balanced mix' | string;
  typicalSleepGoalHours: number;
  preferredSessionMinutes?: number;
  budgetPreference?: string;
  settingPreference?: string;
  occupationCategory?: string;
  ageBand?: string;
  preferredLanguage?: string;
  region?: string;
  indoorOutdoorPreference?: string;
  availableFreeTimeMinutes?: number;
  accessibilityNotes?: string;
  hasCompletedOnboarding?: boolean;
  locationAllowed: boolean;
  deviceSyncAllowed: boolean;
  aiPersonalizationAllowed: boolean;
  notificationsEnabled: boolean;
  themePreference: 'warm-cream' | 'calm-sage' | string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
  wellnessGoals: string[];
  preferences: UserPreferences;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface CheckInEntry {
  id: string;
  userId?: string;
  date: string;
  timestamp: string;
  mood: MoodType;
  reportedStress: number; // 1 to 10 scale
  estimatedStress: number; // 0 to 100 model scale
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'deep';
  workloadHours: number;
  energyLevel: number; // 0 to 100
  contextTags: string[];
  notes?: string;
}

export interface ActivityCompletionEntry {
  id: string;
  userId?: string;
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
  timestamp: string;
}

export interface StressContributor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  weight: number;
}

export interface StressAssessment {
  score: number; // 0 to 100
  level: 'Low' | 'Balanced' | 'Elevated' | 'High';
  confidence: number; // 0 to 100%
  modelVersion: string;
  timestamp: string;
  contributors: StressContributor[];
  recommendations: string[];
  disclaimer: string;
  baselineComparison?: string;
  baselineAverage?: number;
  deviationFromBaseline?: number;
  rollingAvgStress?: number;
  rollingAvgSleep?: number;
  dataSufficiency?: string;
}

export interface AIInsight {
  id: string;
  userId?: string;
  title: string;
  category: 'sleep' | 'activity' | 'stress' | 'routine' | 'recovery';
  observation: string;
  grounding: string;
  potentialContributors: string[];
  limitations: string;
  suggestedAction: string;
  actionRoute: string;
  timestamp: string;
  confidenceScore: number;
  feedback?: 'helpful' | 'unhelpful' | 'applied';
}

export interface WellnessActivity {
  id: string;
  title: string;
  subtitle: string;
  category: 'breathing' | 'meditation' | 'movement' | 'audio' | 'nature' | 'study';
  durationMinutes: number;
  energyRequired: 'low' | 'moderate' | 'high';
  setting: 'indoor' | 'outdoor' | 'any';
  description: string;
  steps?: string[];
  benefits: string[];
  imageUrl: string;
  tags: string[];
  soundType?: 'rain' | 'stream' | 'bowls' | 'brown-noise';
}

export interface NatureRetreat {
  id: string;
  name: string;
  region: string;
  biome: 'Alpine Lakes' | 'Dense Forests' | 'Coastal Sanctuaries' | 'Highland Valleys' | string;
  distanceKm: number;
  durationText: string;
  serenityRating: number; // 0 to 100
  estimatedCost: '$' | '$$' | '$$$' | string;
  isVerifiedProvider: boolean;
  providerName: string;
  description: string;
  mindfulHighlights: string[];
  weatherSummary: string;
  imageUrl: string;
  bookingInfo?: string;
  sourceUrl?: string;
  retrievalTimestamp?: string;
  verificationStatus?: string;
  facilities?: string[];
  startingCity?: string;
}

export interface RecoveryPlanActivity {
  timeBlock: string;
  title: string;
  category: string;
  description: string;
  recoveryPoints: number;
}

export interface RecoveryPlan {
  id: string;
  generatedAt: string;
  timeBudgetMinutes: number;
  energyLevel: string;
  budget: string;
  location: string;
  preference: string;
  activities: RecoveryPlanActivity[];
  totalRecoveryScore: number;
  reflectionPrompt: string;
  explanation?: string;
}

export interface HealthMeasurementCreate {
  measurementType:
    | 'heart_rate'
    | 'blood_pressure'
    | 'oxygen_saturation'
    | 'temperature'
    | 'sleep_duration'
    | 'physical_activity'
    | 'weight'
    | 'self_reported_stress'
    | 'mood_energy';
  value: number;
  secondaryValue?: number;
  unit: string;
  source: 'manual_home' | 'device_import' | 'healthcare_professional' | 'pharmacy_medical_shop' | 'other';
  entryMethod?: string;
  notes?: string;
  measuredAt?: string;
}

export interface HealthMeasurementEntry extends HealthMeasurementCreate {
  id: string;
  userId: string;
  timestamp: string;
  safetyGuidance?: string;
  isPotentiallyUrgent: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  description: string;
  audioUrl?: string;
  listenUrl?: string;
  synthType?: 'rain' | 'bowls' | 'stream' | 'brown-noise' | string;
  tags: string[];
  imageUrl: string;
  artist?: string;
  isFavorite?: boolean;
}

export interface MusicFeedbackPayload {
  trackId: string;
  trackTitle: string;
  helpful: boolean;
  moodAfter?: string;
  notes?: string;
}

export interface WellnessReportSummary {
  period: 'weekly' | 'monthly';
  generatedDate: string;
  userName: string;
  avgStressScore: number;
  avgSleepHours: number;
  checkInCompletionRate: number;
  topStressDriver: string;
  topRecoveryActivity: string;
  keyObservations: string[];
  actionRecommendations: string[];
  dataPointsCount: number;
  stressTrend?: string;
  baselineStatus?: string;
  healthBiometricsSummary?: {
    avgHeartRate?: number;
    latestBloodPressure?: string;
    avgSpO2?: number;
    totalMeasurementsLogged?: number;
  };
}
