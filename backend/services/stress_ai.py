from datetime import datetime
from typing import List, Optional, Dict, Any
from ..models import (
    CheckInEntry,
    StressAssessment,
    StressContributor,
    UserProfile,
    RecoveryPlan,
    RecoveryPlanActivity
)

MODEL_VERSION = "Psygma Grounded BioStress Engine v2.4 (OmeGamma)"

# Curated library of potential recovery activities for candidate generation
ACTIVITY_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "act_box_breath",
        "title": "Box Breathing (4-4-4-4)",
        "category": "Somatic",
        "description": "Inhale 4s, hold 4s, exhale 4s, hold 4s. Activates parasympathetic vagal calming.",
        "durationMinutes": 10,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["breathing", "mindful", "calm", "Box breathing"],
        "recoveryPoints": 25,
        "stressSuitability": ["Elevated", "High", "Balanced"]
    },
    {
        "id": "act_om_chanting",
        "title": "Om Chanting & Tanpura Resonance",
        "category": "Acoustic Reset",
        "description": "Vocal humming and 432 Hz harmonic drone to soothe amygdala tension and deepen exhalations.",
        "durationMinutes": 15,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["audio", "meditation", "mantra", "Om chanting", "Indian classical music"],
        "recoveryPoints": 35,
        "stressSuitability": ["High", "Elevated", "Balanced"]
    },
    {
        "id": "act_bansuri_raga",
        "title": "Bansuri Flute Raga Meditation",
        "category": "Acoustic Reset",
        "description": "Meditative bamboo flute improvisations in gentle evening Yaman and Bhairav scales.",
        "durationMinutes": 20,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["audio", "music", "relaxation", "Bansuri and flute", "Indian classical music"],
        "recoveryPoints": 30,
        "stressSuitability": ["High", "Elevated", "Balanced"]
    },
    {
        "id": "act_nadi_shodhana",
        "title": "Nadi Shodhana (Alternate Nostril Pranayama)",
        "category": "Somatic",
        "description": "Gentle alternate nostril breathing to balance sympathetic and parasympathetic nervous channels.",
        "durationMinutes": 12,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["breathing", "pranayama", "yoga", "calm"],
        "recoveryPoints": 30,
        "stressSuitability": ["Elevated", "High", "Balanced"]
    },
    {
        "id": "act_horizon_gaze",
        "title": "Open-Air Horizon Gaze",
        "category": "Visual Calm",
        "description": "Scan distant green trees or skyline without focusing on screens to release ocular strain.",
        "durationMinutes": 15,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Outdoor",
        "tags": ["outdoor", "vision", "nature"],
        "recoveryPoints": 20,
        "stressSuitability": ["Elevated", "High", "Balanced", "Low"]
    },
    {
        "id": "act_nature_walk",
        "title": "Park & Garden Walk",
        "category": "Nature Movement",
        "description": "A relaxed walk along tree-lined garden or colony paths, keeping phone notifications on silent.",
        "durationMinutes": 30,
        "energyRequired": "Moderate",
        "budget": "Free",
        "setting": "Outdoor",
        "tags": ["outdoor", "walking", "nature", "Forest walking"],
        "recoveryPoints": 45,
        "stressSuitability": ["Elevated", "Balanced", "High"]
    },
    {
        "id": "act_pine_soundscape",
        "title": "Monsoon Rain & Sweet Birdsong",
        "category": "Acoustic Reset",
        "description": "Headphone listening session featuring natural monsoon rain, birdsong, and soothing temple chimes.",
        "durationMinutes": 20,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["audio", "relaxation", "Acoustic soundscapes"],
        "recoveryPoints": 30,
        "stressSuitability": ["High", "Elevated", "Balanced"]
    },
    {
        "id": "act_surya_namaskar",
        "title": "Gentle Surya Namaskar & Spinal Release",
        "category": "Active Movement",
        "description": "Synchronized fluid breath and movement cycle releasing tight thoracic fascia and hips.",
        "durationMinutes": 20,
        "energyRequired": "Moderate",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["movement", "yoga", "stretching"],
        "recoveryPoints": 40,
        "stressSuitability": ["Balanced", "Elevated"]
    },
    {
        "id": "act_badminton",
        "title": "Light Badminton Rallies",
        "category": "Active Movement",
        "description": "Social, moderate aerobic play that stimulates dopamine and eye-hand coordination.",
        "durationMinutes": 40,
        "energyRequired": "High",
        "budget": "Free",
        "setting": "Outdoor",
        "tags": ["sport", "movement", "social", "Badminton"],
        "recoveryPoints": 50,
        "stressSuitability": ["Balanced", "Low", "Elevated"]
    },
    {
        "id": "act_478_breath",
        "title": "4-7-8 Relaxing Evening Breath",
        "category": "Circadian Restoration",
        "description": "Inhale 4s, hold 7s, slow exhale 8s. Natural nervous system tranquilizer before sleep.",
        "durationMinutes": 10,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["sleep", "breathing", "evening"],
        "recoveryPoints": 25,
        "stressSuitability": ["High", "Elevated", "Balanced"]
    },
    {
        "id": "act_study_break",
        "title": "Pomodoro Sensory Reset Pause",
        "category": "Cognitive Reset",
        "description": "Disengage from study tasks, perform gentle shoulder rolls, hydrate with warm herbal tea.",
        "durationMinutes": 15,
        "energyRequired": "Low",
        "budget": "Free",
        "setting": "Indoor",
        "tags": ["study", "focus", "work"],
        "recoveryPoints": 20,
        "stressSuitability": ["Elevated", "Balanced"]
    }
]


def calculate_stress_assessment(
    checkins: List[CheckInEntry],
    latest: Optional[CheckInEntry] = None,
    user_profile: Optional[UserProfile] = None
) -> StressAssessment:
    """
    Computes a grounded multi-factor stress estimate distinguishing subjective reported
    tension from model-estimated tension, and contextualized against the user's personal baseline.
    """
    if not checkins and not latest:
        return StressAssessment(
            score=35,
            level="Balanced",
            confidence=75,
            modelVersion=MODEL_VERSION,
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
            contributors=[
                StressContributor(
                    factor="Population Reference Calibration",
                    impact="positive",
                    description="Default reference baseline active prior to personal check-in history",
                    weight=30
                )
            ],
            recommendations=[
                "Complete your first daily check-in to calibrate your personal baseline.",
                "Maintain a consistent sleep window between 10:30 PM and 7:00 AM."
            ],
            disclaimer="Psygma delivers wellness awareness heuristics. This does not constitute clinical medical diagnosis.",
            baselineComparison="No previous history yet. Baseline will calibrate with consecutive daily check-ins.",
            dataSufficiency="Initial state; 0 check-ins recorded."
        )

    current = latest or checkins[-1]

    # Calculate user's personal rolling historical baseline (up to last 14 entries)
    history_subset = checkins[-14:] if checkins else [current]
    rolling_avg_sleep = sum(c.sleepHours for c in history_subset) / len(history_subset)
    rolling_avg_work = sum(c.workloadHours for c in history_subset) / len(history_subset)
    rolling_avg_stress = sum(c.reportedStress for c in history_subset) / len(history_subset)

    # 1. Sleep Deficit against personal baseline (or target 7.5h)
    baseline_sleep_target = user_profile.preferences.typicalSleepGoalHours if user_profile else 7.5
    sleep_target = (baseline_sleep_target + rolling_avg_sleep) / 2.0
    sleep_diff = sleep_target - current.sleepHours
    sleep_impact = round(sleep_diff * 10)

    # 2. Workload index compared against personal rolling average
    work_diff = current.workloadHours - rolling_avg_work
    work_impact = round(work_diff * 4)

    # 3. Mood Mapping
    mood_weights = {
        "peaceful": -15,
        "balanced": -8,
        "energized": -5,
        "tired": 12,
        "restless": 18,
        "overwhelmed": 28
    }
    mood_impact = mood_weights.get(current.mood, 0)

    # 4. Subjective Reported Tension (scaled)
    reported_impact = round((current.reportedStress - 5) * 5)

    raw_score = 40 + sleep_impact + work_impact + mood_impact + reported_impact
    final_score = max(10, min(95, raw_score))

    if final_score < 30:
        level = "Low"
    elif final_score < 55:
        level = "Balanced"
    elif final_score < 75:
        level = "Elevated"
    else:
        level = "High"

    # Confidence scales with observation count
    confidence = min(96, max(75, 75 + len(history_subset) * 2))

    # Factor Contributors
    contributors: List[StressContributor] = []
    if current.sleepHours < (sleep_target - 0.8):
        contributors.append(StressContributor(
            factor="Short Sleep Window",
            impact="negative",
            description=f"{current.sleepHours}h recorded vs your personal {sleep_target:.1f}h baseline",
            weight=35
        ))
    else:
        contributors.append(StressContributor(
            factor="Restorative Sleep Window",
            impact="positive",
            description=f"{current.sleepHours}h recorded supports neurological recovery",
            weight=30
        ))

    if current.workloadHours > (rolling_avg_work + 1.2):
        contributors.append(StressContributor(
            factor="High Cognitive Workload",
            impact="negative",
            description=f"{current.workloadHours}h logged (exceeds your {rolling_avg_work:.1f}h average)",
            weight=25
        ))
    else:
        contributors.append(StressContributor(
            factor="Sustainable Workload Tempo",
            impact="positive",
            description=f"{current.workloadHours}h workload within sustainable capacity",
            weight=20
        ))

    if any(t in current.contextTags for t in ["outdoor", "badminton", "nature"]):
        contributors.append(StressContributor(
            factor="Physical Movement Active",
            impact="positive",
            description="Outdoor nature or sport reset confirmed in context tags",
            weight=20
        ))
    elif any(t in current.contextTags for t in ["coffee-heavy", "screen-time"]):
        contributors.append(StressContributor(
            factor="Sensory Overstimulation",
            impact="negative",
            description="Heavy screen exposure or multiple stimulants logged today",
            weight=15
        ))

    # Natural-language comparative baseline explanation
    sleep_comparison_text = (
        f"shorter than your {rolling_avg_sleep:.1f}h average"
        if current.sleepHours < rolling_avg_sleep - 0.5
        else f"consistent with your {rolling_avg_sleep:.1f}h baseline"
    )
    stress_comparison_text = (
        f"higher than your recent {rolling_avg_stress:.1f}/10 average"
        if current.reportedStress > rolling_avg_stress + 0.8
        else f"aligned with your typical {rolling_avg_stress:.1f}/10 baseline"
    )
    baseline_explanation = (
        f"Your reported stress is {stress_comparison_text}, and your sleep was {sleep_comparison_text}."
    )

    recommendations: List[str] = []
    if final_score > 60:
        recommendations.append("Initiate a 10-minute Box Breathing session before evening transitions.")
        recommendations.append("Shift screen filters to warm spectrum and disengage from work notifications.")
        recommendations.append("Prioritize a 25-minute nature walk in green space tomorrow afternoon.")
    else:
        recommendations.append("Maintain rhythmic morning hydration routine.")
        recommendations.append("Continue balanced sleep timing between 10:30 PM and 7:00 AM.")
        recommendations.append("Schedule active movement (badminton or brisk walking) to sustain momentum.")

    data_sufficiency = (
        f"Calibrated with {len(history_subset)} personal check-in records."
        if len(history_subset) >= 3
        else f"Initial data: {len(history_subset)} records. Precision increases with daily check-ins."
    )

    return StressAssessment(
        score=final_score,
        level=level,
        confidence=confidence,
        modelVersion=MODEL_VERSION,
        timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        contributors=contributors,
        recommendations=recommendations,
        disclaimer="Psygma delivers wellness awareness heuristics. This does not constitute clinical medical diagnosis.",
        baselineComparison=baseline_explanation,
        rollingAvgStress=round(rolling_avg_stress, 1),
        rollingAvgSleep=round(rolling_avg_sleep, 1),
        dataSufficiency=data_sufficiency
    )


def generate_context_aware_recovery_plan(
    time_minutes: int,
    energy_level: str,
    budget_pref: str,
    location_pref: str,
    social_pref: str,
    user_profile: Optional[UserProfile] = None,
    current_assessment: Optional[StressAssessment] = None,
    past_activities: Optional[List[Dict[str, Any]]] = None
) -> RecoveryPlan:
    """
    Ranks and selects candidate recovery activities matching user preferences,
    filtering out disliked activities, reinforcing activities previously reported helpful,
    and generating grounded explainable rationale.
    """
    user_dislikes = user_profile.preferences.dislikedActivities if user_profile else []
    user_interests = user_profile.preferences.interests if user_profile else []

    # Extract historical helpfulness feedback
    helpful_titles = [
        a.get("activityTitle", "").lower()
        for a in (past_activities or [])
        if a.get("helpful") is True
    ]
    unhelpful_titles = [
        a.get("activityTitle", "").lower()
        for a in (past_activities or [])
        if a.get("helpful") is False
    ]

    # Filter and score candidate set
    candidates = []
    for act in ACTIVITY_CATALOG:
        # 1. Filter out explicitly disliked activities
        if any(d.lower() in act["title"].lower() or any(d.lower() in t.lower() for t in act["tags"]) for d in user_dislikes):
            continue

        # 2. Score candidate by match
        score = act["recoveryPoints"]

        # Match user interests
        if any(interest.lower() in act["title"].lower() or any(interest.lower() in t.lower() for t in act["tags"]) for interest in user_interests):
            score += 20

        # Match location / setting preference
        if location_pref and location_pref.lower() in act["setting"].lower():
            score += 15

        # Match energy
        if energy_level.lower().startswith(act["energyRequired"].lower()):
            score += 15

        # Closed-loop learning: boost previously helpful activities
        if any(h in act["title"].lower() for h in helpful_titles):
            score += 25

        # Penalize activities user reported as unhelpful
        if any(u in act["title"].lower() for u in unhelpful_titles):
            score -= 30

        candidates.append((score, act))

    # Sort descending by match score
    candidates.sort(key=lambda x: x[0], reverse=True)

    selected_activities: List[RecoveryPlanActivity] = []
    accumulated_time = 0

    block_num = 1
    for _, item in candidates:
        if accumulated_time + item["durationMinutes"] <= time_minutes + 10:
            selected_activities.append(RecoveryPlanActivity(
                timeBlock=f"Block {block_num} ({item['durationMinutes']}m)",
                title=item["title"],
                category=item["category"],
                description=item["description"],
                recoveryPoints=item["recoveryPoints"]
            ))
            accumulated_time += item["durationMinutes"]
            block_num += 1
            if accumulated_time >= time_minutes or len(selected_activities) >= 3:
                break

    # If no activity fit in tight time, provide quick 5m breathing
    if not selected_activities:
        selected_activities.append(RecoveryPlanActivity(
            timeBlock="0 - 5 min",
            title="Coherence Breathing (5-5)",
            category="Somatic",
            description="5-second inhale, 5-second exhale to quickly balance heart rate variability.",
            recoveryPoints=15
        ))

    total_score = sum(a.recoveryPoints for a in selected_activities)

    # Generate transparent grounded explanation
    top_act = selected_activities[0].title if selected_activities else "Breathing"
    explanation_parts = [f"Suggested {top_act}"]
    if user_interests:
        matched_interests = [i for i in user_interests if any(i.lower() in a.title.lower() for a in selected_activities)]
        if matched_interests:
            explanation_parts.append(f"because you prefer {', '.join(matched_interests[:2])}")
    explanation_parts.append(f"and have {time_minutes} minutes available")
    if any(h in top_act.lower() for h in helpful_titles):
        explanation_parts.append("(which you previously found helpful)")
    if current_assessment and current_assessment.score > 60:
        explanation_parts.append("with elevated tension requiring somatic soothing")

    grounded_explanation = " ".join(explanation_parts) + "."

    return RecoveryPlan(
        id=f"plan_{int(datetime.utcnow().timestamp())}",
        generatedAt=datetime.utcnow().strftime("%H:%M UTC"),
        timeBudgetMinutes=time_minutes,
        energyLevel=energy_level,
        budget=budget_pref,
        location=location_pref,
        preference=social_pref,
        activities=selected_activities,
        totalRecoveryScore=total_score,
        reflectionPrompt="Notice how your shoulder and facial tension release after the first phase.",
        explanation=grounded_explanation
    )
