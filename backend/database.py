import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or project root
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

from datetime import datetime
from typing import List, Dict, Any, Optional
import re
import urllib.parse
import pymongo
from .auth import hash_password

def sanitize_mongo_uri(uri: str) -> str:
    """
    Ensures username and password in MongoDB URI are properly escaped
    according to RFC 3986 without double-encoding existing percent escapes.
    """
    if not uri:
        return uri
    match = re.match(r'^(mongodb(?:\+srv)?:\/\/)(.*)@([^@]+)$', uri)
    if not match:
        return uri
    scheme, userinfo, host = match.groups()
    if ':' in userinfo:
        user, pwd = userinfo.split(':', 1)
        clean_user = urllib.parse.unquote(user)
        clean_pwd = urllib.parse.unquote(pwd)
        encoded_user = urllib.parse.quote_plus(clean_user)
        encoded_pwd = urllib.parse.quote_plus(clean_pwd)
        return f"{scheme}{encoded_user}:{encoded_pwd}@{host}"
    return uri

MONGO_URI = sanitize_mongo_uri(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
DATABASE_NAME = os.getenv("MONGO_DB_NAME", "psygma_wellness")

DEMO_USER_ID = "usr_omega_01"
DEMO_EMAIL = "sameer@omegamma.wellness"

INITIAL_DEMO_USER = {
    "id": DEMO_USER_ID,
    "name": "Sameer",
    "email": DEMO_EMAIL,
    "hashed_password": hash_password("demo123"),
    "avatarUrl": "/avatars/male.png",
    "joinedDate": "September 2026",
    "wellnessGoals": [
        "Lower evening cognitive fatigue",
        "Maintain 7.5h consistent sleep window",
        "Daily 20m natural light outdoor break"
    ],
    "preferences": {
        "interests": ["Forest walking", "Box breathing", "Acoustic soundscapes", "Badminton"],
        "dislikedActivities": [],
        "socialPreference": "Balanced mix",
        "typicalSleepGoalHours": 7.5,
        "preferredSessionMinutes": 30,
        "budgetPreference": "Free",
        "settingPreference": "Any",
        "occupationCategory": "working professional",
        "ageBand": "26-35",
        "preferredLanguage": "English",
        "region": "Cascadia",
        "indoorOutdoorPreference": "Balanced",
        "availableFreeTimeMinutes": 30,
        "hasCompletedOnboarding": True,
        "locationAllowed": True,
        "deviceSyncAllowed": False,
        "aiPersonalizationAllowed": True,
        "notificationsEnabled": True,
        "themePreference": "warm-cream"
    }
}

INITIAL_DEMO_CHECKINS: List[Dict[str, Any]] = [
    {
        "id": "chk_01",
        "userId": DEMO_USER_ID,
        "date": "2026-10-05",
        "timestamp": "2026-10-05T08:30:00Z",
        "mood": "balanced",
        "reportedStress": 4,
        "estimatedStress": 38,
        "sleepHours": 7.4,
        "sleepQuality": "good",
        "workloadHours": 6.5,
        "energyLevel": 68,
        "contextTags": ["outdoor", "morning-tea"],
        "notes": "Started the week feeling centered."
    },
    {
        "id": "chk_02",
        "userId": DEMO_USER_ID,
        "date": "2026-10-06",
        "timestamp": "2026-10-06T09:10:00Z",
        "mood": "overwhelmed",
        "reportedStress": 7,
        "estimatedStress": 74,
        "sleepHours": 5.2,
        "sleepQuality": "poor",
        "workloadHours": 9.5,
        "energyLevel": 42,
        "contextTags": ["long-meeting", "coffee-heavy", "screen-time"],
        "notes": "Late deadline kept me up."
    },
    {
        "id": "chk_03",
        "userId": DEMO_USER_ID,
        "date": "2026-10-07",
        "timestamp": "2026-10-07T08:45:00Z",
        "mood": "tired",
        "reportedStress": 6,
        "estimatedStress": 62,
        "sleepHours": 6.1,
        "sleepQuality": "fair",
        "workloadHours": 8.0,
        "energyLevel": 51,
        "contextTags": ["screen-time", "light-walk"],
        "notes": "Took a short 15m walk at lunch."
    },
    {
        "id": "chk_04",
        "userId": DEMO_USER_ID,
        "date": "2026-10-08",
        "timestamp": "2026-10-08T09:00:00Z",
        "mood": "balanced",
        "reportedStress": 4,
        "estimatedStress": 44,
        "sleepHours": 7.6,
        "sleepQuality": "good",
        "workloadHours": 6.8,
        "energyLevel": 70,
        "contextTags": ["badminton", "outdoor"],
        "notes": "Played badminton after work."
    },
    {
        "id": "chk_05",
        "userId": DEMO_USER_ID,
        "date": "2026-10-09",
        "timestamp": "2026-10-09T08:20:00Z",
        "mood": "energized",
        "reportedStress": 3,
        "estimatedStress": 35,
        "sleepHours": 8.1,
        "sleepQuality": "deep",
        "workloadHours": 6.0,
        "energyLevel": 82,
        "contextTags": ["outdoor", "reading", "nature"],
        "notes": "Slept deeply."
    },
    {
        "id": "chk_06",
        "userId": DEMO_USER_ID,
        "date": "2026-10-10",
        "timestamp": "2026-10-10T10:00:00Z",
        "mood": "peaceful",
        "reportedStress": 2,
        "estimatedStress": 24,
        "sleepHours": 8.5,
        "sleepQuality": "deep",
        "workloadHours": 1.5,
        "energyLevel": 88,
        "contextTags": ["weekend", "nature-hike", "digital-detox"],
        "notes": "Lake trail hike."
    },
    {
        "id": "chk_07",
        "userId": DEMO_USER_ID,
        "date": "2026-10-11",
        "timestamp": "2026-10-11T09:15:00Z",
        "mood": "balanced",
        "reportedStress": 3,
        "estimatedStress": 32,
        "sleepHours": 7.8,
        "sleepQuality": "good",
        "workloadHours": 3.0,
        "energyLevel": 78,
        "contextTags": ["morning-tea", "box-breathing"],
        "notes": "Practiced 10 minutes of box breathing."
    }
]

INITIAL_DEMO_INSIGHTS: List[Dict[str, Any]] = [
    {
        "id": "ins_01",
        "userId": DEMO_USER_ID,
        "title": "The Sleep-Stress Elasticity Pattern",
        "category": "sleep",
        "observation": "On days with under 6.0 hours of sleep, your estimated stress rises by 42% on average.",
        "grounding": "Correlated across 7 logged check-ins (specifically Tuesday Oct 6 where 5.2h sleep preceded a stress score of 74).",
        "potentialContributors": [
            "Elevated cortisol latency following shortened REM cycles",
            "Cognitive compensation for fatigue during intensive meetings",
            "Increased caffeine consumption (3+ cups on low-sleep days)"
        ],
        "limitations": "Calculated from personal self-reported logs and heuristic biometric proxy modeling; not a clinical sleep study.",
        "suggestedAction": "Adopt a fixed 10:30 PM digital wind-down buffer to safeguard sleep duration.",
        "actionRoute": "/app/wellness",
        "timestamp": "2 hours ago",
        "confidenceScore": 92,
        "feedback": "helpful"
    },
    {
        "id": "ins_02",
        "userId": DEMO_USER_ID,
        "title": "Outdoor Movement Catalyzes Rapid Stress Clearance",
        "category": "activity",
        "observation": "A single 30-minute nature walk or badminton session reduces reported mental strain within 4 hours.",
        "grounding": "Observed on Wednesday and Friday check-ins where post-exercise recovery scores jumped from 51 to 78.",
        "potentialContributors": [
            "Visual green-spectrum stimulation activating parasympathetic tone",
            "Dynamic bilateral ocular movement lowering amygdalar hyperactivity"
        ],
        "limitations": "Contextual correlation; individual recovery rates fluctuate based on daily nutrition and hydration.",
        "suggestedAction": "Reserve 30 minutes in your calendar tomorrow between 4:00 PM and 5:00 PM for green space.",
        "actionRoute": "/app/recovery-planner",
        "timestamp": "1 day ago",
        "confidenceScore": 86,
        "feedback": None
    }
]


INITIAL_DEMO_HEALTH_MEASUREMENTS: List[Dict[str, Any]] = [
    {
        "id": "meas_01",
        "userId": DEMO_USER_ID,
        "measurementType": "heart_rate",
        "value": 72.0,
        "secondaryValue": None,
        "unit": "bpm",
        "source": "manual_home",
        "entryMethod": "manual",
        "notes": "Resting pulse measured seated after morning tea.",
        "measuredAt": "2026-10-11T08:45:00Z",
        "timestamp": "2026-10-11T08:45:00Z",
        "safetyGuidance": None,
        "isPotentiallyUrgent": False
    },
    {
        "id": "meas_02",
        "userId": DEMO_USER_ID,
        "measurementType": "blood_pressure",
        "value": 118.0,
        "secondaryValue": 76.0,
        "unit": "mmHg",
        "source": "pharmacy_medical_shop",
        "entryMethod": "manual",
        "notes": "Checked at local wellness pharmacy counter; optimal range.",
        "measuredAt": "2026-10-10T11:20:00Z",
        "timestamp": "2026-10-10T11:20:00Z",
        "safetyGuidance": None,
        "isPotentiallyUrgent": False
    },
    {
        "id": "meas_03",
        "userId": DEMO_USER_ID,
        "measurementType": "oxygen_saturation",
        "value": 98.0,
        "secondaryValue": None,
        "unit": "%",
        "source": "manual_home",
        "entryMethod": "manual",
        "notes": "Fingertip pulse oximeter home reading.",
        "measuredAt": "2026-10-10T11:22:00Z",
        "timestamp": "2026-10-10T11:22:00Z",
        "safetyGuidance": None,
        "isPotentiallyUrgent": False
    },
    {
        "id": "meas_04",
        "userId": DEMO_USER_ID,
        "measurementType": "temperature",
        "value": 36.6,
        "secondaryValue": None,
        "unit": "°C",
        "source": "manual_home",
        "entryMethod": "manual",
        "notes": "Oral digital thermometer morning reading.",
        "measuredAt": "2026-10-09T08:15:00Z",
        "timestamp": "2026-10-09T08:15:00Z",
        "safetyGuidance": None,
        "isPotentiallyUrgent": False
    },
    {
        "id": "meas_05",
        "userId": DEMO_USER_ID,
        "measurementType": "physical_activity",
        "value": 8450.0,
        "secondaryValue": None,
        "unit": "steps",
        "source": "device_import",
        "entryMethod": "device_sync",
        "notes": "Includes evening park walking and daily mobility.",
        "measuredAt": "2026-10-10T21:00:00Z",
        "timestamp": "2026-10-10T21:00:00Z",
        "safetyGuidance": None,
        "isPotentiallyUrgent": False
    }
]


class StorageManager:
    def __init__(self):
        self.is_mongo_connected = False
        self.client = None
        self.db = None
        self.mongo_connection_error: Optional[str] = None
        
        # In-memory storage for testing/fallback when MongoDB is unavailable
        self._users: Dict[str, Dict[str, Any]] = {DEMO_USER_ID: dict(INITIAL_DEMO_USER)}
        self._users_by_email: Dict[str, str] = {DEMO_EMAIL.lower(): DEMO_USER_ID}
        self._checkins: Dict[str, List[Dict[str, Any]]] = {DEMO_USER_ID: [dict(c) for c in INITIAL_DEMO_CHECKINS]}
        self._insights: Dict[str, List[Dict[str, Any]]] = {DEMO_USER_ID: [dict(i) for i in INITIAL_DEMO_INSIGHTS]}
        self._activities: Dict[str, List[Dict[str, Any]]] = {DEMO_USER_ID: []}
        self._health_measurements: Dict[str, List[Dict[str, Any]]] = {
            DEMO_USER_ID: [dict(m) for m in INITIAL_DEMO_HEALTH_MEASUREMENTS]
        }
        self._music_favorites: Dict[str, List[str]] = {DEMO_USER_ID: ["track_om_432", "track_bansuri_yaman"]}
        self._music_feedback: Dict[str, List[Dict[str, Any]]] = {DEMO_USER_ID: []}

        try:
            self.client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=2500)
            self.client.server_info()
            self.db = self.client[DATABASE_NAME]
            self.is_mongo_connected = True
            self.mongo_connection_error = None
            self._ensure_indexes()
            self._ensure_mongo_seeded()
        except Exception as e:
            self.is_mongo_connected = False
            self.mongo_connection_error = str(e)

    def _ensure_indexes(self):
        """Ensure optimized MongoDB indexes for querying patterns."""
        if self.is_mongo_connected and self.db is not None:
            try:
                self.db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
                self.db.users.create_index([("id", pymongo.ASCENDING)], unique=True)
                self.db.checkins.create_index([("userId", pymongo.ASCENDING), ("date", pymongo.ASCENDING)])
                self.db.insights.create_index([("userId", pymongo.ASCENDING)])
                self.db.activities.create_index([("userId", pymongo.ASCENDING), ("timestamp", pymongo.DESCENDING)])
                self.db.health_measurements.create_index([("userId", pymongo.ASCENDING), ("timestamp", pymongo.DESCENDING)])
                self.db.music_favorites.create_index([("userId", pymongo.ASCENDING)])
                self.db.music_feedback.create_index([("userId", pymongo.ASCENDING)])
            except Exception:
                pass

    def _ensure_mongo_seeded(self):
        """Seed demo user into MongoDB if collection is empty."""
        try:
            if self.is_mongo_connected and self.db is not None:
                if self.db.users.count_documents({"id": DEMO_USER_ID}) == 0:
                    self.db.users.insert_one(dict(INITIAL_DEMO_USER))
                if self.db.checkins.count_documents({"userId": DEMO_USER_ID}) == 0:
                    self.db.checkins.insert_many([dict(c) for c in INITIAL_DEMO_CHECKINS])
                if self.db.insights.count_documents({"userId": DEMO_USER_ID}) == 0:
                    self.db.insights.insert_many([dict(i) for i in INITIAL_DEMO_INSIGHTS])
                if self.db.health_measurements.count_documents({"userId": DEMO_USER_ID}) == 0:
                    self.db.health_measurements.insert_many([dict(m) for m in INITIAL_DEMO_HEALTH_MEASUREMENTS])
        except Exception:
            pass

    # --- User Operations ---
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()
        if self.is_mongo_connected and self.db is not None:
            user = self.db.users.find_one({"email": {"$regex": f"^{clean_email}$", "$options": "i"}}, {"_id": 0})
            if user:
                return user
        user_id = self._users_by_email.get(clean_email)
        if user_id and user_id in self._users:
            return self._users[user_id]
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            user = self.db.users.find_one({"id": user_id}, {"_id": 0})
            if user:
                return user
        return self._users.get(user_id)

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = user_data["id"]
        email = user_data["email"].strip().lower()
        if self.is_mongo_connected and self.db is not None:
            self.db.users.insert_one(user_data.copy())
            return user_data
        self._users[user_id] = user_data
        self._users_by_email[email] = user_id
        self._checkins[user_id] = []
        self._insights[user_id] = []
        self._activities[user_id] = []
        return user_data

    def update_user(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        current = self.get_user_by_id(user_id)
        if not current:
            return None
        updated = {**current, **updates}
        if "preferences" in updates and isinstance(updates["preferences"], dict):
            updated["preferences"] = {**current.get("preferences", {}), **updates["preferences"]}
        
        if self.is_mongo_connected and self.db is not None:
            self.db.users.update_one({"id": user_id}, {"$set": updated})
            return self.get_user_by_id(user_id)
        self._users[user_id] = updated
        return updated

    # --- Check-in Operations ---
    def get_checkins(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            return list(self.db.checkins.find({"userId": user_id}, {"_id": 0}).sort("date", 1))
        return self._checkins.get(user_id, [])

    def insert_checkin(self, checkin: Dict[str, Any]):
        user_id = checkin.get("userId", DEMO_USER_ID)
        if self.is_mongo_connected and self.db is not None:
            self.db.checkins.insert_one(checkin.copy())
            return
        if user_id not in self._checkins:
            self._checkins[user_id] = []
        self._checkins[user_id].append(checkin)

    # --- Insights Operations ---
    def get_insights(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            return list(self.db.insights.find({"$or": [{"userId": user_id}, {"userId": None}]}, {"_id": 0}))
        if user_id == DEMO_USER_ID:
            return self._insights.get(user_id, self._insights.get(DEMO_USER_ID, []))
        return self._insights.get(user_id, [])

    def update_insight_feedback(self, user_id: str, insight_id: str, feedback: str) -> bool:
        if self.is_mongo_connected and self.db is not None:
            res = self.db.insights.update_one(
                {"id": insight_id},
                {"$set": {"feedback": feedback}}
            )
            return res.matched_count > 0 or res.modified_count > 0
        user_insights = self._insights.get(user_id, [])
        for ins in user_insights:
            if ins["id"] == insight_id:
                ins["feedback"] = feedback
                return True
        return False

    def insert_insight(self, user_id: str, insight: Dict[str, Any]):
        insight["userId"] = user_id
        if self.is_mongo_connected and self.db is not None:
            self.db.insights.insert_one(insight.copy())
            return
        if user_id not in self._insights:
            self._insights[user_id] = []
        self._insights[user_id].insert(0, insight)

    # --- Activity Completion Operations (Closed-Loop Learning) ---
    def get_activities(self, user_id: str) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            return list(self.db.activities.find({"userId": user_id}, {"_id": 0}).sort("timestamp", -1))
        return self._activities.get(user_id, [])

    def insert_activity(self, activity: Dict[str, Any]):
        user_id = activity.get("userId", DEMO_USER_ID)
        if self.is_mongo_connected and self.db is not None:
            self.db.activities.insert_one(activity.copy())
            return
        if user_id not in self._activities:
            self._activities[user_id] = []
        self._activities[user_id].insert(0, activity)

    # --- Health Measurement Operations ---
    def get_health_measurements(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        if self.is_mongo_connected and self.db is not None:
            return list(self.db.health_measurements.find({"userId": user_id}, {"_id": 0}).sort("timestamp", -1).limit(limit))
        return self._health_measurements.get(user_id, [])[:limit]

    def insert_health_measurement(self, measurement: Dict[str, Any]):
        user_id = measurement.get("userId", DEMO_USER_ID)
        if self.is_mongo_connected and self.db is not None:
            self.db.health_measurements.insert_one(measurement.copy())
            return
        if user_id not in self._health_measurements:
            self._health_measurements[user_id] = []
        self._health_measurements[user_id].insert(0, measurement)

    def delete_health_measurement(self, user_id: str, measurement_id: str) -> bool:
        if self.is_mongo_connected and self.db is not None:
            res = self.db.health_measurements.delete_one({"id": measurement_id, "userId": user_id})
            return res.deleted_count > 0
        records = self._health_measurements.get(user_id, [])
        for idx, rec in enumerate(records):
            if rec.get("id") == measurement_id:
                del records[idx]
                return True
        return False

    # --- Music Favorites & Feedback Operations ---
    def get_music_favorites(self, user_id: str) -> List[str]:
        if self.is_mongo_connected and self.db is not None:
            doc = self.db.music_favorites.find_one({"userId": user_id}, {"_id": 0})
            return doc.get("favoriteIds", []) if doc else []
        return self._music_favorites.get(user_id, [])

    def toggle_music_favorite(self, user_id: str, track_id: str) -> bool:
        current_favs = list(self.get_music_favorites(user_id))
        is_now_favorite = False
        if track_id in current_favs:
            current_favs = [fid for fid in current_favs if fid != track_id]
            is_now_favorite = False
        else:
            current_favs.append(track_id)
            is_now_favorite = True

        if self.is_mongo_connected and self.db is not None:
            self.db.music_favorites.update_one(
                {"userId": user_id},
                {"$set": {"favoriteIds": current_favs}},
                upsert=True
            )
        else:
            self._music_favorites[user_id] = current_favs
        return is_now_favorite

    def save_music_feedback(self, user_id: str, feedback: Dict[str, Any]):
        feedback["userId"] = user_id
        if self.is_mongo_connected and self.db is not None:
            self.db.music_feedback.insert_one(feedback.copy())
            return
        if user_id not in self._music_feedback:
            self._music_feedback[user_id] = []
        self._music_feedback[user_id].insert(0, feedback)


storage = StorageManager()

