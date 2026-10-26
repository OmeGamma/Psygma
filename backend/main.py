import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or project root
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Literal
from fastapi import FastAPI, HTTPException, Query, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials

from .models import (
    CheckInCreate,
    CheckInEntry,
    StressAssessment,
    AIInsight,
    FeedbackPayload,
    RecoveryPlanRequest,
    RecoveryPlan,
    UserProfile,
    UserRegister,
    UserLogin,
    AuthResponse,
    ActivityCompletionCreate,
    ActivityCompletionEntry,
    HealthMeasurementCreate,
    HealthMeasurementEntry,
    MusicTrack,
    MusicFeedbackPayload,
    MusicFavoritePayload,
    WellnessReportSummary,
    NatureRetreat
)
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
    revoke_token,
    security
)
from .services.stress_ai import (
    calculate_stress_assessment,
    generate_context_aware_recovery_plan
)
from .services.tinyfish import tinyfish_service
from .database import storage, DEMO_USER_ID

app = FastAPI(
    title="Psygma Wellness API",
    description="AI-powered personal stress intelligence & wellness platform by Team OmeGamma",
    version="2.5.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Authentication Dependency ---
async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserProfile:
    """
    Validates the bearer token against revocation and signature,
    and returns the authenticated user profile.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_dict = storage.get_user_by_id(user_id)
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account removed.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    clean_user = {k: v for k, v in user_dict.items() if k != "hashed_password"}
    return UserProfile(**clean_user)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[UserProfile]:
    """Optional authentication for endpoints that support both public and personalized views."""
    if not credentials or not credentials.credentials:
        return None
    try:
        token = credentials.credentials
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            return None
        user_dict = storage.get_user_by_id(user_id)
        if not user_dict:
            return None
        clean_user = {k: v for k, v in user_dict.items() if k != "hashed_password"}
        return UserProfile(**clean_user)
    except Exception:
        return None


# --- System Health ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Psygma BioStress Core API",
        "team": "Team OmeGamma",
        "mongoConnected": storage.is_mongo_connected,
        "mongoError": storage.mongo_connection_error if not storage.is_mongo_connected else None,
        "tinyFishConfigured": bool(tinyfish_service.api_key),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# --- Authentication Endpoints ---
@app.post("/api/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    email_clean = payload.email.strip().lower()
    existing = storage.get_user_by_email(email_clean)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = f"usr_{int(datetime.now(timezone.utc).timestamp())}"
    new_user_data = {
        "id": user_id,
        "name": payload.name.strip(),
        "email": email_clean,
        "hashed_password": hash_password(payload.password),
        "avatarUrl": "/avatars/female.png",
        "joinedDate": datetime.now(timezone.utc).strftime("%B %Y"),
        "wellnessGoals": [
            "Lower evening cognitive fatigue",
            "Maintain 7.5h consistent sleep window",
            "Daily 20m natural light outdoor break"
        ],
        "preferences": {
            "interests": ["Forest walking", "Box breathing", "Acoustic soundscapes"],
            "dislikedActivities": [],
            "socialPreference": "Balanced mix",
            "typicalSleepGoalHours": 7.5,
            "preferredSessionMinutes": 30,
            "budgetPreference": "Free",
            "settingPreference": "Any",
            "occupationCategory": "working professional",
            "ageBand": None,
            "preferredLanguage": "English",
            "region": None,
            "indoorOutdoorPreference": "Balanced",
            "availableFreeTimeMinutes": 30,
            "accessibilityNotes": None,
            "hasCompletedOnboarding": False,
            "locationAllowed": True,
            "deviceSyncAllowed": False,
            "aiPersonalizationAllowed": True,
            "notificationsEnabled": True,
            "themePreference": "warm-cream"
        }
    }

    storage.create_user(new_user_data)
    token = create_access_token({"sub": user_id, "email": email_clean})
    clean_user = {k: v for k, v in new_user_data.items() if k != "hashed_password"}
    return AuthResponse(token=token, user=UserProfile(**clean_user))


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(payload: UserLogin):
    email_clean = payload.email.strip().lower()
    user_dict = storage.get_user_by_email(email_clean)
    if not user_dict or not verify_password(payload.password, user_dict.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )

    user_id = user_dict["id"]
    token = create_access_token({"sub": user_id, "email": email_clean})
    clean_user = {k: v for k, v in user_dict.items() if k != "hashed_password"}
    return AuthResponse(token=token, user=UserProfile(**clean_user))


@app.post("/api/auth/demo-login", response_model=AuthResponse)
async def demo_login():
    """Instant 1-click evaluation access with pre-seeded demo user history (Sameer)."""
    user_dict = storage.get_user_by_id(DEMO_USER_ID)
    if not user_dict:
        raise HTTPException(status_code=500, detail="Demo user configuration error")

    token = create_access_token({"sub": DEMO_USER_ID, "email": user_dict["email"]})
    clean_user = {k: v for k, v in user_dict.items() if k != "hashed_password"}
    return AuthResponse(token=token, user=UserProfile(**clean_user))


@app.post("/api/auth/logout")
async def logout(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if credentials and credentials.credentials:
        revoke_token(credentials.credentials)
    return {"status": "ok", "message": "Session invalidated successfully."}


@app.get("/api/auth/me", response_model=UserProfile)
async def get_current_user_profile(user: UserProfile = Depends(get_current_user)):
    return user


# --- Check-in Endpoints (Protected & User-Specific) ---
@app.get("/api/checkins", response_model=List[CheckInEntry])
async def get_checkins(user: UserProfile = Depends(get_current_user)):
    docs = storage.get_checkins(user.id)
    return [CheckInEntry(**d) for d in docs]


@app.post("/api/checkins", response_model=CheckInEntry, status_code=status.HTTP_201_CREATED)
async def create_checkin(payload: CheckInCreate, user: UserProfile = Depends(get_current_user)):
    current_entries = [CheckInEntry(**d) for d in storage.get_checkins(user.id)]
    
    temp_entry = CheckInEntry(
        **payload.model_dump(),
        id=f"chk_{int(datetime.now(timezone.utc).timestamp())}",
        userId=user.id,
        timestamp=datetime.now(timezone.utc).isoformat(),
        estimatedStress=50
    )

    assessment = calculate_stress_assessment(current_entries + [temp_entry], temp_entry, user)
    temp_entry.estimatedStress = assessment.score

    storage.insert_checkin(temp_entry.model_dump())

    # Synthesize proactive AI insight if short sleep + high workload pattern observed
    if temp_entry.sleepHours < 6.0 and temp_entry.workloadHours > 8.0:
        new_insight = AIInsight(
            id=f"ins_{int(datetime.now(timezone.utc).timestamp())}",
            userId=user.id,
            title="Cognitive Exhaustion Alert",
            category="stress",
            observation=f"Short sleep ({temp_entry.sleepHours}h) coupled with {temp_entry.workloadHours}h intense work elevates acute nervous tension.",
            grounding=f"Logged on {temp_entry.date}. Self-reported tension: {temp_entry.reportedStress}/10.",
            potentialContributors=["Elevated sympathetic activation", "REM sleep deficiency", "Prolonged screen convergence"],
            limitations="Observational model finding based on today's logged parameters; not a diagnostic assessment.",
            suggestedAction="Initiate a 15-minute guided Box Breathing reset and disengage from screen notifications.",
            actionRoute="/app/wellness",
            timestamp="Just now",
            confidenceScore=90
        )
        storage.insert_insight(user.id, new_insight.model_dump())

    return temp_entry


# --- Stress Assessment (Protected & User-Specific) ---
@app.get("/api/assessment", response_model=StressAssessment)
async def get_assessment(user: UserProfile = Depends(get_current_user)):
    checkins = [CheckInEntry(**d) for d in storage.get_checkins(user.id)]
    return calculate_stress_assessment(checkins, user_profile=user)


# --- AI Insights (Protected & User-Specific) ---
@app.get("/api/insights", response_model=List[AIInsight])
async def get_insights(user: UserProfile = Depends(get_current_user)):
    docs = storage.get_insights(user.id)
    return [AIInsight(**d) for d in docs]


@app.post("/api/insights/{insight_id}/feedback")
async def submit_insight_feedback(
    insight_id: str,
    payload: FeedbackPayload,
    user: UserProfile = Depends(get_current_user)
):
    success = storage.update_insight_feedback(user.id, insight_id, payload.feedback)
    if not success:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"status": "ok", "insightId": insight_id, "feedback": payload.feedback}


# --- Activity Completion & Closed-Loop Learning (Protected) ---
@app.get("/api/activities", response_model=List[ActivityCompletionEntry])
async def get_completed_activities(user: UserProfile = Depends(get_current_user)):
    docs = storage.get_activities(user.id)
    return [ActivityCompletionEntry(**d) for d in docs]


@app.post("/api/activities", response_model=ActivityCompletionEntry, status_code=status.HTTP_201_CREATED)
async def log_activity_completion(
    payload: ActivityCompletionCreate,
    user: UserProfile = Depends(get_current_user)
):
    entry = ActivityCompletionEntry(
        **payload.model_dump(),
        id=f"act_log_{int(datetime.now(timezone.utc).timestamp())}",
        userId=user.id,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    storage.insert_activity(entry.model_dump())

    # If user reported helpful=True, reinforce in user interests if not already present
    if payload.helpful and payload.activityTitle:
        current_interests = list(user.preferences.interests)
        if payload.activityTitle not in current_interests and len(current_interests) < 10:
            current_interests.append(payload.activityTitle)
            storage.update_user(user.id, {"preferences": {"interests": current_interests}})

    return entry


CURATED_MUSIC_TRACKS: List[Dict[str, Any]] = [
    {
        "id": "track_om_chant",
        "title": "Sacred Om Chanting with Tanpura",
        "category": "Om Chanting",
        "durationMinutes": 15,
        "description": "Authentic, deep vocal Om chanting with traditional acoustic tanpura drone to quiet restless thoughts, slow rapid breathing, and restore inner peace.",
        "audioUrl": "/audio/om_chanting.mp3",
        "listenUrl": "https://archive.org/details/112OMAUMChanting",
        "synthType": "om-tanpura",
        "tags": ["Om Chanting", "Meditation", "Vedic Chanting", "Tanpura", "Inner Peace"],
        "imageUrl": "https://images.unsplash.com/photo-1506744626753-1fa30fd22541?auto=format&fit=crop&q=80&w=600",
        "artist": "Vedic Chanting Tradition"
    },
    {
        "id": "track_bansuri_flute",
        "title": "Soulful Bansuri Flute in Classical Raga",
        "category": "Bansuri Flute",
        "durationMinutes": 20,
        "description": "Authentic Indian bamboo flute melody with gentle tanpura in soothing classical raga to melt away evening tiredness and soften mental tension.",
        "audioUrl": "/audio/bansuri_flute.mp3",
        "listenUrl": "https://archive.org/details/MusicForMeditationRagaKeeravaniIndianBansuriFluteIndianMusic",
        "synthType": "bansuri-flute",
        "tags": ["Bansuri Flute", "Indian Classical", "Raga Keeravani", "Evening Calm"],
        "imageUrl": "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=600",
        "artist": "Indian Classical Bansuri"
    },
    {
        "id": "track_monsoon_rain",
        "title": "Monsoon Rain & Sweet Birdsong",
        "category": "Monsoon Rain",
        "durationMinutes": 25,
        "description": "Gentle, steady natural monsoon rain falling softly on green garden leaves with morning birdsong and soothing fresh earth aroma.",
        "audioUrl": "/audio/monsoon_rain.mp3",
        "listenUrl": "https://archive.org/details/relaxingsoundofrain",
        "synthType": "rain",
        "tags": ["Monsoon Rain", "Nature Sounds", "Fresh Earth Aroma", "Birdsong"],
        "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600",
        "artist": "Natural Monsoon Soundscape"
    },
    {
        "id": "track_temple_bowls",
        "title": "Temple Chimes & Singing Bowls",
        "category": "Temple Sounds",
        "durationMinutes": 15,
        "description": "Clear, resonant acoustic vibrations of traditional brass temple bells and hand-hammered singing bowls to clear mind fog and ease head tightness.",
        "audioUrl": "/audio/singing_bowl.mp3",
        "listenUrl": "https://archive.org/details/SingingBowl1Minute",
        "synthType": "bowls",
        "tags": ["Temple Sounds", "Singing Bowl", "Deep Rest", "Mindful Calm"],
        "imageUrl": "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=600",
        "artist": "Sacred Temple Chimes"
    }
]


# --- Health Measurements & Vital Records (Protected & Validated) ---
@app.get("/api/health-measurements", response_model=List[HealthMeasurementEntry])
async def get_health_measurements(user: UserProfile = Depends(get_current_user)):
    docs = storage.get_health_measurements(user.id)
    return [HealthMeasurementEntry(**d) for d in docs]


@app.post("/api/health-measurements", response_model=HealthMeasurementEntry, status_code=status.HTTP_201_CREATED)
async def record_health_measurement(
    payload: HealthMeasurementCreate,
    user: UserProfile = Depends(get_current_user)
):
    # Field-specific physiological range validation
    val = payload.value
    m_type = payload.measurementType

    if m_type == "heart_rate" and (val < 30 or val > 250):
        raise HTTPException(status_code=400, detail="Heart rate must be between 30 and 250 bpm.")
    elif m_type == "blood_pressure":
        if val < 50 or val > 260:
            raise HTTPException(status_code=400, detail="Systolic blood pressure must be between 50 and 260 mmHg.")
        if payload.secondaryValue is not None and (payload.secondaryValue < 30 or payload.secondaryValue > 160):
            raise HTTPException(status_code=400, detail="Diastolic blood pressure must be between 30 and 160 mmHg.")
    elif m_type == "oxygen_saturation" and (val < 50 or val > 100):
        raise HTTPException(status_code=400, detail="Oxygen saturation (SpO2) must be between 50% and 100%.")
    elif m_type == "temperature":
        # Supports Celsius or Fahrenheit
        is_fahrenheit = "f" in payload.unit.lower()
        if is_fahrenheit and (val < 86 or val > 113):
            raise HTTPException(status_code=400, detail="Body temperature must be between 86°F and 113°F.")
        elif not is_fahrenheit and (val < 30 or val > 45):
            raise HTTPException(status_code=400, detail="Body temperature must be between 30°C and 45°C.")
    elif m_type == "sleep_duration" and (val < 0 or val > 24):
        raise HTTPException(status_code=400, detail="Sleep duration must be between 0 and 24 hours.")
    elif m_type == "physical_activity" and (val < 0 or val > 150000):
        raise HTTPException(status_code=400, detail="Physical activity steps or minutes must be between 0 and 150,000.")
    elif m_type == "weight" and (val < 20 or val > 450):
        raise HTTPException(status_code=400, detail="Weight must be between 20 and 450 kg/lbs.")

    # Clinical Safety Guidance (Non-diagnostic safety boundary)
    safety_guidance = None
    is_urgent = False

    if m_type == "blood_pressure":
        sys = val
        dia = payload.secondaryValue or 0
        if sys >= 180 or dia >= 120:
            is_urgent = True
            safety_guidance = (
                "CRITICAL: Blood pressure reading is in the severely elevated crisis range (≥180 systolic or ≥120 diastolic). "
                "If accompanied by chest pain, severe headache, shortness of breath, or numbness, please seek urgent emergency "
                "medical evaluation immediately. Do not substitute wellness activities or meditation for immediate medical care."
            )
        elif sys >= 140 or dia >= 90:
            safety_guidance = (
                "Notice: Blood pressure reading is in the elevated/hypertensive range. "
                "We recommend consulting your healthcare provider or primary physician for clinical review."
            )
    elif m_type == "oxygen_saturation" and val < 90:
        is_urgent = True
        safety_guidance = (
            "CRITICAL: Oxygen saturation below 90% indicates hypoxemia. "
            "Please seek prompt professional clinical evaluation or emergency medical attention."
        )
    elif m_type == "heart_rate":
        if val > 140:
            is_urgent = True
            safety_guidance = (
                "Notice: Significantly elevated resting heart rate (>140 bpm). "
                "If you are at rest and experiencing chest fluttering, dizziness, or shortness of breath, consult a physician."
            )
        elif val < 40:
            safety_guidance = (
                "Notice: Low resting heart rate (<40 bpm). If you are not an endurance athlete or are feeling faint, "
                "consult a healthcare professional."
            )
    elif m_type == "temperature":
        is_f = "f" in payload.unit.lower()
        if (is_f and val >= 103.1) or (not is_f and val >= 39.5):
            is_urgent = True
            safety_guidance = "HIGH FEVER ALERT: Body temperature is significantly elevated. Please consult a physician promptly."

    entry = HealthMeasurementEntry(
        **payload.model_dump(),
        id=f"meas_{int(datetime.now(timezone.utc).timestamp())}_{os.urandom(2).hex()}",
        userId=user.id,
        timestamp=payload.measuredAt or datetime.now(timezone.utc).isoformat(),
        safetyGuidance=safety_guidance,
        isPotentiallyUrgent=is_urgent
    )
    storage.insert_health_measurement(entry.model_dump())
    return entry


@app.delete("/api/health-measurements/{measurement_id}")
async def delete_health_measurement(measurement_id: str, user: UserProfile = Depends(get_current_user)):
    success = storage.delete_health_measurement(user.id, measurement_id)
    if not success:
        raise HTTPException(status_code=404, detail="Health measurement not found")
    return {"status": "ok", "message": "Measurement deleted successfully"}


# --- Daily Music & Audio Wellness Endpoints ---
@app.get("/api/music/tracks", response_model=List[MusicTrack])
async def get_music_tracks(user: Optional[UserProfile] = Depends(get_optional_user)):
    user_favs = storage.get_music_favorites(user.id) if user else []
    tracks = []
    for t in CURATED_MUSIC_TRACKS:
        item = dict(t)
        item["isFavorite"] = item["id"] in user_favs
        tracks.append(MusicTrack(**item))
    return tracks


@app.post("/api/music/favorite")
async def toggle_favorite(payload: MusicFavoritePayload, user: UserProfile = Depends(get_current_user)):
    is_fav = storage.toggle_music_favorite(user.id, payload.trackId)
    return {"status": "ok", "trackId": payload.trackId, "isFavorite": is_fav}


@app.post("/api/music/feedback")
async def record_music_feedback(payload: MusicFeedbackPayload, user: UserProfile = Depends(get_current_user)):
    storage.save_music_feedback(user.id, payload.model_dump())
    return {"status": "ok", "message": "Music wellness feedback recorded successfully."}


# --- Nature Retreats (Indian Sanctuaries & TinyFish Integration) ---
@app.get("/api/travel/retreats")
async def get_nature_retreats(
    biome: Optional[str] = Query(None),
    startingCity: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    budget: Optional[str] = Query(None)
):
    retreats = await tinyfish_service.fetch_sanctuaries(
        biome=biome,
        starting_city=startingCity,
        region=region,
        max_budget=budget
    )
    return {
        "retreats": retreats,
        "isTinyFishConnected": bool(tinyfish_service.api_key),
        "source": "TinyFish Discovery API Integration" if tinyfish_service.api_key else "Verified Curated Sanctuary Inventory",
        "startingCity": startingCity or "Bengaluru"
    }


# --- Weekly & Monthly Comprehensive Reports (MongoDB-Grounded) ---
@app.get("/api/reports/summary", response_model=WellnessReportSummary)
async def get_report_summary(
    period: Literal["weekly", "monthly"] = Query("weekly"),
    user: UserProfile = Depends(get_current_user)
):
    checkin_docs = storage.get_checkins(user.id)
    activity_docs = storage.get_activities(user.id)
    health_docs = storage.get_health_measurements(user.id)

    window_days = 7 if period == "weekly" else 30
    checkin_entries = [CheckInEntry(**d) for d in checkin_docs][-window_days:]
    count = len(checkin_entries)

    avg_stress = round(sum(c.reportedStress * 10 for c in checkin_entries) / count, 1) if count > 0 else 35.0
    avg_sleep = round(sum(c.sleepHours for c in checkin_entries) / count, 1) if count > 0 else 7.5
    completion_rate = min(100, round((count / window_days) * 100))

    # Trend computation
    if count >= 2:
        earliest = checkin_entries[0].reportedStress
        latest = checkin_entries[-1].reportedStress
        diff = latest - earliest
        if diff <= -1:
            stress_trend = f"Improving ({abs(diff)} pt reduction in self-reported stress)"
        elif diff >= 1:
            stress_trend = f"Elevating (+{diff} pt rise over observation window)"
        else:
            stress_trend = "Stable / consistent with baseline"
    else:
        stress_trend = "Baseline calibrating (requires more check-in records)"

    # Top activities
    helpful_activities = [a for a in activity_docs if a.get("helpful") is True]
    top_recovery_activity = (
        helpful_activities[0]["activityTitle"]
        if helpful_activities
        else ("Nature walking" if any("outdoor" in c.contextTags for c in checkin_entries) else "Box Breathing")
    )

    # Health biometrics summary
    hr_readings = [h["value"] for h in health_docs if h.get("measurementType") == "heart_rate"]
    bp_readings = [h for h in health_docs if h.get("measurementType") == "blood_pressure"]
    spo2_readings = [h["value"] for h in health_docs if h.get("measurementType") == "oxygen_saturation"]

    bio_summary = {
        "avgHeartRate": round(sum(hr_readings) / len(hr_readings), 1) if hr_readings else None,
        "latestBloodPressure": (
            f"{int(bp_readings[0]['value'])}/{int(bp_readings[0].get('secondaryValue', 80))} mmHg"
            if bp_readings else None
        ),
        "avgSpO2": round(sum(spo2_readings) / len(spo2_readings), 1) if spo2_readings else None,
        "totalMeasurementsLogged": len(health_docs)
    }

    key_obs = []
    if count < 3:
        key_obs.append(f"Preliminary summary: Only {count} check-in(s) recorded in this {period} window. Statistical precision increases with daily check-ins.")
    else:
        key_obs.append(f"Recorded {count} daily check-ins ({completion_rate}% consistency for the {period} period).")
        if avg_sleep < 6.8:
            key_obs.append(f"Average sleep was {avg_sleep}h, slightly below your personal target window.")
        else:
            key_obs.append(f"Consistent restorative sleep duration ({avg_sleep}h avg).")

    recommendations = [
        "Maintain regular morning hydration and 15m outdoor natural light exposure.",
        "Practice evening Box Breathing or 4-7-8 breathing before digital wind-down."
    ]

    return WellnessReportSummary(
        period=period,
        generatedDate=datetime.now(timezone.utc).strftime("%B %d, %Y"),
        userName=user.name,
        avgStressScore=avg_stress,
        avgSleepHours=avg_sleep,
        checkInCompletionRate=completion_rate,
        topStressDriver="Screen Convergence & High Workload" if any(c.workloadHours > 8 for c in checkin_entries) else "Routine Variation",
        topRecoveryActivity=top_recovery_activity,
        keyObservations=key_obs,
        actionRecommendations=recommendations,
        dataPointsCount=count,
        stressTrend=stress_trend,
        baselineStatus=f"Calibrated from {count} records in MongoDB",
        healthBiometricsSummary=bio_summary
    )


# --- Recovery Plan (Context-Aware, Feedback-Reinforced & Grounded) ---
@app.post("/api/recovery-plan", response_model=RecoveryPlan)
@app.post("/api/recommendations/recovery-plan", response_model=RecoveryPlan)
async def generate_recovery_plan(
    req: RecoveryPlanRequest,
    user: Optional[UserProfile] = Depends(get_optional_user)
):
    current_assessment = None
    past_activities = None
    if user:
        checkins = [CheckInEntry(**d) for d in storage.get_checkins(user.id)]
        current_assessment = calculate_stress_assessment(checkins, user_profile=user)
        past_activities = storage.get_activities(user.id)

    plan = generate_context_aware_recovery_plan(
        time_minutes=req.timeMinutes,
        energy_level=req.energy,
        budget_pref=req.budget,
        location_pref=req.location,
        social_pref=req.preference,
        user_profile=user,
        current_assessment=current_assessment,
        past_activities=past_activities
    )
    return plan


# --- User Profile & Preferences (Protected) ---
@app.get("/api/user/profile", response_model=UserProfile)
async def get_profile(user: UserProfile = Depends(get_current_user)):
    return user


@app.patch("/api/user/profile", response_model=UserProfile)
@app.put("/api/user/profile", response_model=UserProfile)
async def update_profile(payload: Dict[str, Any], user: UserProfile = Depends(get_current_user)):
    # Protect against tampering with id or password hash via patch
    filtered = {k: v for k, v in payload.items() if k not in ["id", "hashed_password"]}
    updated_dict = storage.update_user(user.id, filtered)
    if not updated_dict:
        raise HTTPException(status_code=404, detail="User not found")
    clean = {k: v for k, v in updated_dict.items() if k != "hashed_password"}
    return UserProfile(**clean)


if __name__ == "__main__":
    import uvicorn
    server_port = int(os.getenv("PORT", 8000))
    server_host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("backend.main:app", host=server_host, port=server_port, reload=True)

