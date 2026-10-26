from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal, Dict, Any

class UserPreferences(BaseModel):
    interests: List[str] = ["Forest walking", "Box breathing", "Acoustic soundscapes"]
    dislikedActivities: List[str] = []
    socialPreference: str = "Balanced mix"
    typicalSleepGoalHours: float = 7.5
    preferredSessionMinutes: int = 30
    budgetPreference: str = "Free"
    settingPreference: str = "Any"
    occupationCategory: str = "working professional"
    ageBand: Optional[str] = None
    preferredLanguage: str = "English"
    region: Optional[str] = None
    indoorOutdoorPreference: str = "Balanced"
    availableFreeTimeMinutes: int = 30
    accessibilityNotes: Optional[str] = None
    hasCompletedOnboarding: bool = False
    locationAllowed: bool = True
    deviceSyncAllowed: bool = False
    aiPersonalizationAllowed: bool = True
    notificationsEnabled: bool = True
    themePreference: str = "warm-cream"

class UserProfile(BaseModel):
    id: str = "usr_omega_01"
    name: str = "Sameer"
    email: str = "sameer@omegamma.wellness"
    avatarUrl: Optional[str] = "/avatars/male.png"
    joinedDate: str = "September 2026"
    wellnessGoals: List[str] = [
        "Lower evening cognitive fatigue",
        "Maintain 7.5h consistent sleep window",
        "Daily 20m natural light outdoor break"
    ]
    preferences: UserPreferences = Field(default_factory=UserPreferences)

class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=4, max_length=128)

class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user: UserProfile

class CheckInCreate(BaseModel):
    date: str
    mood: Literal["peaceful", "energized", "balanced", "tired", "overwhelmed", "restless"]
    reportedStress: int = Field(ge=1, le=10)
    sleepHours: float = Field(ge=0, le=24)
    sleepQuality: Literal["poor", "fair", "good", "deep"]
    workloadHours: float = Field(ge=0, le=24)
    energyLevel: int = Field(ge=0, le=100)
    contextTags: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

class CheckInEntry(CheckInCreate):
    id: str
    userId: str = "usr_omega_01"
    timestamp: str
    estimatedStress: int

class ActivityCompletionCreate(BaseModel):
    activityId: str
    activityTitle: str
    category: str
    durationMinutes: int
    completed: bool = True
    helpful: Optional[bool] = None
    feelNow: Optional[str] = None
    notes: Optional[str] = None
    preStressRating: Optional[int] = Field(default=None, ge=1, le=10)
    postStressRating: Optional[int] = Field(default=None, ge=1, le=10)

class ActivityCompletionEntry(ActivityCompletionCreate):
    id: str
    userId: str
    timestamp: str

class StressContributor(BaseModel):
    factor: str
    impact: Literal["positive", "negative", "neutral"]
    description: str
    weight: int

class StressAssessment(BaseModel):
    score: int
    level: Literal["Low", "Balanced", "Elevated", "High"]
    confidence: int
    modelVersion: str
    timestamp: str
    contributors: List[StressContributor]
    recommendations: List[str]
    disclaimer: str
    baselineComparison: Optional[str] = None
    rollingAvgStress: Optional[float] = None
    rollingAvgSleep: Optional[float] = None
    dataSufficiency: Optional[str] = None

class AIInsight(BaseModel):
    id: str
    userId: Optional[str] = None
    title: str
    category: Literal["sleep", "activity", "stress", "routine", "recovery"]
    observation: str
    grounding: str
    potentialContributors: List[str]
    limitations: str
    suggestedAction: str
    actionRoute: str
    timestamp: str
    confidenceScore: int
    feedback: Optional[Literal["helpful", "unhelpful", "applied"]] = None

class FeedbackPayload(BaseModel):
    feedback: Literal["helpful", "unhelpful", "applied"]

class RecoveryPlanRequest(BaseModel):
    timeMinutes: int
    energy: str
    budget: str
    location: str
    preference: str

class RecoveryPlanActivity(BaseModel):
    timeBlock: str
    title: str
    category: str
    description: str
    recoveryPoints: int

class RecoveryPlan(BaseModel):
    id: str
    generatedAt: str
    timeBudgetMinutes: int
    energyLevel: str
    budget: str
    location: str
    preference: str
    activities: List[RecoveryPlanActivity]
    totalRecoveryScore: int
    reflectionPrompt: str
    explanation: Optional[str] = None

class NatureRetreat(BaseModel):
    id: str
    name: str
    region: str
    biome: str
    distanceKm: int
    durationText: str
    serenityRating: int
    estimatedCost: str
    isVerifiedProvider: bool
    providerName: str
    description: str
    mindfulHighlights: List[str]
    weatherSummary: str
    imageUrl: str
    bookingInfo: Optional[str] = None
    sourceUrl: Optional[str] = None
    retrievalTimestamp: Optional[str] = None
    verificationStatus: Optional[str] = None
    facilities: List[str] = Field(default_factory=list)
    startingCity: Optional[str] = None

class HealthMeasurementCreate(BaseModel):
    measurementType: Literal[
        "heart_rate",
        "blood_pressure",
        "oxygen_saturation",
        "temperature",
        "sleep_duration",
        "physical_activity",
        "weight",
        "self_reported_stress",
        "mood_energy"
    ]
    value: float
    secondaryValue: Optional[float] = None
    unit: str
    source: Literal["manual_home", "device_import", "healthcare_professional", "pharmacy_medical_shop", "other"] = "manual_home"
    entryMethod: str = "manual"
    notes: Optional[str] = None
    measuredAt: Optional[str] = None

class HealthMeasurementEntry(HealthMeasurementCreate):
    id: str
    userId: str
    timestamp: str
    safetyGuidance: Optional[str] = None
    isPotentiallyUrgent: bool = False

class MusicTrack(BaseModel):
    id: str
    title: str
    category: str
    durationMinutes: int
    description: str
    audioUrl: Optional[str] = None
    listenUrl: Optional[str] = None
    synthType: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    imageUrl: str
    artist: Optional[str] = None
    isFavorite: bool = False

class MusicFeedbackPayload(BaseModel):
    trackId: str
    trackTitle: str
    helpful: bool
    moodAfter: Optional[str] = None
    notes: Optional[str] = None

class MusicFavoritePayload(BaseModel):
    trackId: str

class WellnessReportSummary(BaseModel):
    period: Literal["weekly", "monthly"]
    generatedDate: str
    userName: str
    avgStressScore: float
    avgSleepHours: float
    checkInCompletionRate: int
    topStressDriver: str
    topRecoveryActivity: str
    keyObservations: List[str]
    actionRecommendations: List[str]
    dataPointsCount: int
    stressTrend: str
    baselineStatus: str
    healthBiometricsSummary: Optional[Dict[str, Any]] = None
