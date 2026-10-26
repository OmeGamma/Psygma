import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.auth import hash_password, verify_password, create_access_token, decode_token

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_unauthenticated_protected_routes():
    # Attempting to access protected endpoints without a token should return 401
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/checkins").status_code == 401
    assert client.get("/api/assessment").status_code == 401
    assert client.get("/api/insights").status_code == 401
    assert client.get("/api/user/profile").status_code == 401

def test_demo_login_and_data_isolation():
    # 1. Login with demo user
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    demo_auth = resp.json()
    token = demo_auth["token"]
    assert token is not None
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Access /api/auth/me
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["id"] == "usr_omega_01"
    assert user_data["email"] == "sameer@omegamma.wellness"

    # 3. Access check-ins (Demo user has 7 seeded check-ins)
    checkins_resp = client.get("/api/checkins", headers=headers)
    assert checkins_resp.status_code == 200
    checkins = checkins_resp.json()
    assert len(checkins) == 7

    # 4. Assessment with baseline comparison
    assess_resp = client.get("/api/assessment", headers=headers)
    assert assess_resp.status_code == 200
    assessment = assess_resp.json()
    assert "score" in assessment
    assert "baselineComparison" in assessment
    assert "Calibrated" in assessment["dataSufficiency"]

    # 5. Register new isolated user
    reg_resp = client.post("/api/auth/register", json={
        "name": "E2E Tester",
        "email": "e2etester@psygma.io",
        "password": "Password123!"
    })
    assert reg_resp.status_code == 201
    new_user_token = reg_resp.json()["token"]
    new_headers = {"Authorization": f"Bearer {new_user_token}"}

    # 6. Verify data isolation: New user has 0 check-ins
    new_checkins_resp = client.get("/api/checkins", headers=new_headers)
    assert new_checkins_resp.status_code == 200
    assert len(new_checkins_resp.json()) == 0

    # 7. Post check-in for new user
    post_checkin_resp = client.post("/api/checkins", json={
        "date": "2026-10-18",
        "mood": "peaceful",
        "reportedStress": 3,
        "sleepHours": 8.0,
        "sleepQuality": "good",
        "workloadHours": 4.0,
        "energyLevel": 75,
        "contextTags": ["nature", "reading"],
        "notes": "Feeling refreshed after a good walk."
    }, headers=new_headers)
    assert post_checkin_resp.status_code == 201

    # Demo user still has 7, new user now has 1
    assert len(client.get("/api/checkins", headers=headers).json()) == 7
    assert len(client.get("/api/checkins", headers=new_headers).json()) == 1

def test_token_revocation_on_logout():
    # Login
    resp = client.post("/api/auth/login", json={
        "email": "sameer@omegamma.wellness",
        "password": "demo123"
    })
    assert resp.status_code == 200
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Check authenticated access works
    assert client.get("/api/auth/me", headers=headers).status_code == 200

    # Logout
    logout_resp = client.post("/api/auth/logout", headers=headers)
    assert logout_resp.status_code == 200

    # Token is now revoked -> should return 401
    assert client.get("/api/auth/me", headers=headers).status_code == 401

def test_preference_filtering_in_recommendations():
    # Demo login
    resp = client.post("/api/auth/demo-login")
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Update profile to dislike "High-intensity cardio" and prefer "Quiet solo"
    pref_update = client.patch("/api/user/profile", json={
        "name": "Sameer",
        "preferences": {
            "dislikedActivities": ["High-intensity cardio", "Crowded gym"],
            "interests": ["Forest walking", "Box breathing"],
            "settingPreference": "Quiet solo",
            "budgetPreference": "Free"
        }
    }, headers=headers)
    assert pref_update.status_code == 200
    updated_profile = pref_update.json()
    assert "High-intensity cardio" in updated_profile["preferences"]["dislikedActivities"]

    # Generate recovery plan with explicit constraints
    plan_resp = client.post("/api/recovery-plan", json={
        "timeMinutes": 20,
        "energy": "Moderate",
        "budget": "Free",
        "location": "Quiet solo",
        "preference": "Quiet solo"
    }, headers=headers)
    assert plan_resp.status_code == 200
    plan = plan_resp.json()
    assert "activities" in plan
    assert len(plan["activities"]) > 0
    # Confirm none of the returned activities are in the disliked list
    activity_titles = [act["title"] for act in plan["activities"]]
    assert "High-intensity cardio" not in activity_titles
    assert "Crowded gym" not in activity_titles
    assert "explanation" in plan

def test_activity_completion_and_reflection():
    resp = client.post("/api/auth/demo-login")
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    completion_resp = client.post("/api/activities", json={
        "activityId": "act_box_breath_01",
        "activityTitle": "4-7-8 Breathing Exercise",
        "category": "breathing",
        "durationMinutes": 10,
        "completed": True,
        "helpful": True,
        "preStressRating": 8,
        "postStressRating": 4,
        "feelNow": "significantly calmer",
        "notes": "Very grounding exercise before meetings."
    }, headers=headers)
    assert completion_resp.status_code == 201
    entry = completion_resp.json()
    assert entry["activityTitle"] == "4-7-8 Breathing Exercise"
    assert entry["preStressRating"] == 8
    assert entry["postStressRating"] == 4

    # Verify history retrieval
    history_resp = client.get("/api/activities", headers=headers)
    assert history_resp.status_code == 200
    history = history_resp.json()
    assert len(history) >= 1
    assert any(h["activityTitle"] == "4-7-8 Breathing Exercise" for h in history)

def test_health_measurements_crud_and_safety_alerts():
    resp = client.post("/api/auth/demo-login")
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch existing health measurements (Demo user starts with seeded records)
    meas_list = client.get("/api/health-measurements", headers=headers)
    assert meas_list.status_code == 200
    measurements = meas_list.json()
    assert len(measurements) >= 5

    # 2. Record normal blood pressure
    normal_bp = client.post("/api/health-measurements", json={
        "measurementType": "blood_pressure",
        "value": 115.0,
        "secondaryValue": 75.0,
        "unit": "mmHg",
        "source": "manual_home",
        "entryMethod": "manual",
        "notes": "Morning resting reading."
    }, headers=headers)
    assert normal_bp.status_code == 201
    bp_data = normal_bp.json()
    assert bp_data["value"] == 115.0
    assert bp_data["isPotentiallyUrgent"] is False
    assert bp_data["safetyGuidance"] is None

    # 3. Record severely elevated blood pressure -> Clinical Safety Alert
    crisis_bp = client.post("/api/health-measurements", json={
        "measurementType": "blood_pressure",
        "value": 185.0,
        "secondaryValue": 125.0,
        "unit": "mmHg",
        "source": "pharmacy_medical_shop",
        "entryMethod": "manual",
        "notes": "Checked at clinic."
    }, headers=headers)
    assert crisis_bp.status_code == 201
    crisis_data = crisis_bp.json()
    assert crisis_data["isPotentiallyUrgent"] is True
    assert "CRITICAL" in crisis_data["safetyGuidance"]

    # 4. Out of range validation error (e.g. impossible heart rate)
    invalid_hr = client.post("/api/health-measurements", json={
        "measurementType": "heart_rate",
        "value": 350.0,
        "unit": "bpm"
    }, headers=headers)
    assert invalid_hr.status_code == 400

    # 5. Delete measurement
    meas_id = crisis_data["id"]
    del_resp = client.delete(f"/api/health-measurements/{meas_id}", headers=headers)
    assert del_resp.status_code == 200

def test_music_tracks_and_feedback():
    resp = client.post("/api/auth/demo-login")
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch tracks
    tracks_resp = client.get("/api/music/tracks", headers=headers)
    assert tracks_resp.status_code == 200
    tracks = tracks_resp.json()
    assert len(tracks) == 4
    assert any("Bansuri" in t["title"] or "Om" in t["title"] for t in tracks)

    # 2. Toggle favorite
    first_track_id = tracks[0]["id"]
    fav_resp = client.post("/api/music/favorite", json={"trackId": first_track_id}, headers=headers)
    assert fav_resp.status_code == 200
    fav_data = fav_resp.json()
    assert "isFavorite" in fav_data

    # 3. Submit feedback
    feedback_resp = client.post("/api/music/feedback", json={
        "trackId": first_track_id,
        "trackTitle": tracks[0]["title"],
        "helpful": True,
        "moodAfter": "centered",
        "notes": "Calmed heartbeat noticeably."
    }, headers=headers)
    assert feedback_resp.status_code == 200

def test_indian_travel_retreats_and_city_filter():
    # 1. Fetch retreats with starting city Bengaluru
    blr_resp = client.get("/api/travel/retreats?startingCity=Bengaluru")
    assert blr_resp.status_code == 200
    blr_data = blr_resp.json()
    assert len(blr_data["retreats"]) >= 6
    assert blr_data["startingCity"] == "Bengaluru"
    # SwaSwara or Soukya should have realistic distance from Bengaluru
    soukya = next((r for r in blr_data["retreats"] if "Soukya" in r["name"]), None)
    assert soukya is not None
    assert soukya["distanceKm"] == 35

    # 2. Fetch retreats with starting city Delhi
    delhi_resp = client.get("/api/travel/retreats?startingCity=Delhi")
    assert delhi_resp.status_code == 200
    delhi_data = delhi_resp.json()
    vana = next((r for r in delhi_data["retreats"] if "Vana" in r["name"]), None)
    assert vana is not None
    assert vana["distanceKm"] == 240

def test_reports_summary_generation():
    resp = client.post("/api/auth/demo-login")
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch weekly report
    weekly_resp = client.get("/api/reports/summary?period=weekly", headers=headers)
    assert weekly_resp.status_code == 200
    weekly = weekly_resp.json()
    assert weekly["period"] == "weekly"
    assert weekly["dataPointsCount"] >= 1
    assert "avgStressScore" in weekly
    assert "healthBiometricsSummary" in weekly
    assert "stressTrend" in weekly

    # Fetch monthly report
    monthly_resp = client.get("/api/reports/summary?period=monthly", headers=headers)
    assert monthly_resp.status_code == 200
    monthly = monthly_resp.json()
    assert monthly["period"] == "monthly"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
