import {
  UserProfile,
  CheckInEntry,
  StressAssessment,
  AIInsight,
  WellnessActivity,
  NatureRetreat
} from '../types/wellness';

export const INITIAL_USER: UserProfile = {
  id: 'usr_omega_01',
  name: 'Sameer',
  email: 'sameer@omegamma.wellness',
  avatarUrl: '/avatars/male.png',
  joinedDate: 'September 2026',
  wellnessGoals: [
    'Lower evening cognitive fatigue',
    'Maintain 7.5h consistent sleep window',
    'Daily 20m natural light outdoor break'
  ],
  preferences: {
    interests: ['Forest walking', 'Box breathing', 'Acoustic soundscapes', 'Casual badminton'],
    dislikedActivities: [],
    socialPreference: 'Balanced mix',
    typicalSleepGoalHours: 7.5,
    preferredSessionMinutes: 30,
    budgetPreference: 'Free',
    settingPreference: 'Any',
    occupationCategory: 'working professional',
    ageBand: '26-35',
    preferredLanguage: 'English',
    region: 'Cascadia',
    indoorOutdoorPreference: 'Balanced',
    availableFreeTimeMinutes: 30,
    accessibilityNotes: '',
    hasCompletedOnboarding: true,
    locationAllowed: true,
    deviceSyncAllowed: false,
    aiPersonalizationAllowed: true,
    notificationsEnabled: true,
    themePreference: 'warm-cream',
  }
};

export const INITIAL_CHECKINS: CheckInEntry[] = [
  {
    id: 'chk_01',
    date: '2026-10-05',
    timestamp: '2026-10-05T08:30:00Z',
    mood: 'balanced',
    reportedStress: 4,
    estimatedStress: 38,
    sleepHours: 7.4,
    sleepQuality: 'good',
    workloadHours: 6.5,
    energyLevel: 68,
    contextTags: ['outdoor', 'morning-tea'],
    notes: 'Started the week feeling centered. Morning sunlight helped.'
  },
  {
    id: 'chk_02',
    date: '2026-10-06',
    timestamp: '2026-10-06T09:10:00Z',
    mood: 'overwhelmed',
    reportedStress: 7,
    estimatedStress: 74,
    sleepHours: 5.2,
    sleepQuality: 'poor',
    workloadHours: 9.5,
    energyLevel: 42,
    contextTags: ['long-meeting', 'coffee-heavy', 'screen-time'],
    notes: 'Late deadline kept me up until 1:30 AM. Back-to-back presentations.'
  },
  {
    id: 'chk_03',
    date: '2026-10-07',
    timestamp: '2026-10-07T08:45:00Z',
    mood: 'tired',
    reportedStress: 6,
    estimatedStress: 62,
    sleepHours: 6.1,
    sleepQuality: 'fair',
    workloadHours: 8.0,
    energyLevel: 51,
    contextTags: ['screen-time', 'light-walk'],
    notes: 'Still feeling yesterday fatigue. Took a short 15m walk at lunch.'
  },
  {
    id: 'chk_04',
    date: '2026-10-08',
    timestamp: '2026-10-08T09:00:00Z',
    mood: 'balanced',
    reportedStress: 4,
    estimatedStress: 44,
    sleepHours: 7.6,
    sleepQuality: 'good',
    workloadHours: 6.8,
    energyLevel: 70,
    contextTags: ['badminton', 'outdoor'],
    notes: 'Played badminton after work. Great physical reset.'
  },
  {
    id: 'chk_05',
    date: '2026-10-09',
    timestamp: '2026-10-09T08:20:00Z',
    mood: 'energized',
    reportedStress: 3,
    estimatedStress: 35,
    sleepHours: 8.1,
    sleepQuality: 'deep',
    workloadHours: 6.0,
    energyLevel: 82,
    contextTags: ['outdoor', 'reading', 'nature'],
    notes: 'Slept deeply. Completed tasks early and relaxed in the park.'
  },
  {
    id: 'chk_06',
    date: '2026-10-10',
    timestamp: '2026-10-10T10:00:00Z',
    mood: 'peaceful',
    reportedStress: 2,
    estimatedStress: 24,
    sleepHours: 8.5,
    sleepQuality: 'deep',
    workloadHours: 1.5,
    energyLevel: 88,
    contextTags: ['weekend', 'nature-hike', 'digital-detox'],
    notes: 'Lake trail hike. Completely disconnected from notifications.'
  },
  {
    id: 'chk_07',
    date: '2026-10-11',
    timestamp: '2026-10-11T09:15:00Z',
    mood: 'balanced',
    reportedStress: 3,
    estimatedStress: 32,
    sleepHours: 7.8,
    sleepQuality: 'good',
    workloadHours: 3.0,
    energyLevel: 78,
    contextTags: ['morning-tea', 'box-breathing'],
    notes: 'Practiced 10 minutes of box breathing. Mind feels receptive.'
  }
];

export const INITIAL_ASSESSMENT: StressAssessment = {
  score: 32,
  level: 'Balanced',
  confidence: 88,
  modelVersion: 'Psygma Grounded Engine v2.4 (OmeGamma)',
  timestamp: 'Today, 09:15 AM',
  contributors: [
    {
      factor: 'Consistent Sleep Window',
      impact: 'positive',
      description: 'Averaged 7.8h restful sleep over the last 3 days',
      weight: 35
    },
    {
      factor: 'Weekend Nature Immersion',
      impact: 'positive',
      description: 'Outdoor trail activity noticeably stabilized nervous state',
      weight: 25
    },
    {
      factor: 'Manageable Workload Index',
      impact: 'positive',
      description: 'Workload remains within optimal personal capacity bounds',
      weight: 20
    },
    {
      factor: 'Residual Screen Fatigue',
      impact: 'negative',
      description: 'Late screen exposure on Tuesday still manifests minor recovery lag',
      weight: 12
    }
  ],
  recommendations: [
    'Maintain the evening wind-down routine that aided sleep restoration.',
    'Schedule a 25-minute brisk green-space walk around mid-afternoon.',
    'Do a 5-minute Coherence Breathing session before demanding meetings.'
  ],
  disclaimer: 'Psygma provides wellness self-awareness and biometric estimation. This is not medical diagnostic advice.'
};

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'ins_01',
    title: 'The Sleep-Stress Elasticity Pattern',
    category: 'sleep',
    observation: 'On days with under 6.0 hours of sleep, your estimated stress rises by 42% on average.',
    grounding: 'Correlated across 7 logged check-ins (specifically Tuesday Oct 6 where 5.2h sleep preceded a stress score of 74).',
    potentialContributors: [
      'Elevated cortisol latency following shortened REM cycles',
      'Cognitive compensation for fatigue during intensive meetings',
      'Increased caffeine consumption (3+ cups on low-sleep days)'
    ],
    limitations: 'Calculated from personal self-reported logs and heuristic biometric proxy modeling; not a clinical sleep study.',
    suggestedAction: 'Adopt a fixed 10:30 PM digital wind-down buffer to safeguard sleep duration.',
    actionRoute: '/app/wellness',
    timestamp: '2 hours ago',
    confidenceScore: 92,
    feedback: 'helpful'
  },
  {
    id: 'ins_02',
    title: 'Outdoor Movement Catalyzes Rapid Stress Clearance',
    category: 'activity',
    observation: 'A single 30-minute nature walk or badminton session reduces reported mental strain within 4 hours.',
    grounding: 'Observed on Wednesday and Friday check-ins where post-exercise recovery scores jumped from 51 to 78.',
    potentialContributors: [
      'Visual green-spectrum stimulation activating parasympathetic tone',
      'Dynamic bilateral ocular movement lowering amygdalar hyperactivity',
      'Physical metabolic outlet for accumulated sympathetic energy'
    ],
    limitations: 'Contextual correlation; individual recovery rates fluctuate based on daily nutrition and hydration.',
    suggestedAction: 'Reserve 30 minutes in your calendar tomorrow between 4:00 PM and 5:00 PM for green space.',
    actionRoute: '/app/recovery-planner',
    timestamp: '1 day ago',
    confidenceScore: 86
  },
  {
    id: 'ins_03',
    title: 'Mid-Morning Screen Load Warning',
    category: 'routine',
    observation: 'Extended blocks (>3.5 hours) without a deliberate gaze shift compound micro-fatigue.',
    grounding: 'Consistent self-reported "overwhelmed" or "tired" moods on days with contiguous calendar meetings.',
    potentialContributors: [
      'Visual convergence strain',
      'Unconscious shallow breathing during intense text entry (screen apnea)'
    ],
    limitations: 'Based on reported workload hours rather than optical sensor tracking.',
    suggestedAction: 'Try 3 cycles of 4-7-8 relaxing breath every 90 minutes.',
    actionRoute: '/app/wellness',
    timestamp: '2 days ago',
    confidenceScore: 81
  }
];

export const WELLNESS_ACTIVITIES: WellnessActivity[] = [
  {
    id: 'act_box_breath',
    title: 'Box Breathing (4-4-4-4)',
    subtitle: 'Autonomic Nervous System Regulation',
    category: 'breathing',
    durationMinutes: 5,
    energyRequired: 'low',
    setting: 'indoor',
    description: 'Equalized inhale, hold, exhale, and empty hold to stabilize heart rate variability and regain emotional poise.',
    steps: [
      'Sit comfortably with an upright spine and grounded feet.',
      'Inhale smoothly through your nose for 4 seconds.',
      'Hold the gentle breath in your chest for 4 seconds.',
      'Exhale slowly and completely through your mouth for 4 seconds.',
      'Hold the empty calm space for 4 seconds before the next breath.'
    ],
    benefits: ['Lowers blood pressure', 'Reduces acute anxiety', 'Enhances mental clarity'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    tags: ['Calm', 'Quick', 'Evidence-Based']
  },
  {
    id: 'act_478_breath',
    title: '4-7-8 Deep Evening Release',
    subtitle: 'Pre-Sleep Parasympathetic Activation',
    category: 'breathing',
    durationMinutes: 8,
    energyRequired: 'low',
    setting: 'indoor',
    description: 'Dr. Weil classic restorative sequence that acts as a natural tranquilizer for the nervous system.',
    steps: [
      'Exhale completely through your mouth with a soft whoosh sound.',
      'Close your mouth and inhale quietly through your nose for 4 counts.',
      'Hold your breath calmly for 7 counts.',
      'Exhale completely through your mouth with an audible whoosh for 8 counts.'
    ],
    benefits: ['Accelerates sleep onset', 'Dissolves rumination', 'Relaxes facial tension'],
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    tags: ['Evening', 'Sleep', 'Deep Rest']
  },
  {
    id: 'act_forest_rain',
    title: 'Monsoon Rain & Sweet Birdsong',
    subtitle: 'Gentle Rain & Fresh Earth Aroma',
    category: 'audio',
    durationMinutes: 25,
    energyRequired: 'low',
    setting: 'any',
    description: 'Authentic recording of steady tropical monsoon rain on fresh garden leaves with distant birdsong, bringing natural calm.',
    benefits: ['Masks harsh urban noise', 'Cools overactive racing thoughts', 'Soothes headache and screen tiredness'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
    tags: ['Audio', 'Rain', 'Nature', 'Focus'],
    soundType: 'rain'
  },
  {
    id: 'act_singing_bowls',
    title: 'Temple Bells & Himalayan Singing Bowls',
    subtitle: 'Acoustic Resonance & Calm',
    category: 'audio',
    durationMinutes: 15,
    energyRequired: 'low',
    setting: 'indoor',
    description: 'Pure resonant tones of hand-crafted bronze temple bells and singing bowls that gently dissolve mental clutter.',
    benefits: ['Grounds wandering thoughts', 'Deep somatic relaxation', 'Restores calm baseline'],
    imageUrl: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&q=80&w=800',
    tags: ['Audio', 'Bowls', 'Temple', 'Meditation'],
    soundType: 'bowls'
  },
  {
    id: 'act_nature_walk',
    title: 'Park & Garden Walk',
    subtitle: 'Fresh Morning or Evening Air',
    category: 'movement',
    durationMinutes: 30,
    energyRequired: 'moderate',
    setting: 'outdoor',
    description: 'A relaxed stroll in a nearby green garden or tree-lined colony path without checking phone notifications.',
    steps: [
      'Leave phone notifications on silent.',
      'Walk at an easy, comfortable pace without checking distance or time.',
      'Every 5 minutes, look up at the tree tops or open sky to rest your eyes.',
      'Take 3 slow deep breaths under the shade of neem or banyan trees.'
    ],
    benefits: ['Releases accumulated tension', 'Fresh morning oxygen & sunlight', 'Improves peaceful nighttime sleep'],
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    tags: ['Outdoor', 'Gentle', 'Nature', 'Walking']
  },
  {
    id: 'act_badminton',
    title: 'Casual Badminton Rallies',
    subtitle: 'Active Play & Smiles with Friends',
    category: 'movement',
    durationMinutes: 45,
    energyRequired: 'high',
    setting: 'outdoor',
    description: 'Friendly casual badminton rallies in a society compound or park. Easy movement and smiles naturally shake off work fatigue.',
    benefits: ['Lifts mood and energy', 'Healthy light cardio', 'Reconnecting with family & friends'],
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    tags: ['Sport', 'Social', 'Cardio', 'Badminton']
  }
];

export const NATURE_RETREATS: NatureRetreat[] = [
  {
    id: 'ret_01',
    name: 'Coorg Coffee & Pepper Estate Haven',
    region: 'Western Ghats (Karnataka)',
    biome: 'Dense Forests',
    distanceKm: 42,
    durationText: '1 hr 10 min drive',
    serenityRating: 96,
    estimatedCost: '$$',
    isVerifiedProvider: true,
    providerName: 'TinyFish Verified Retreat',
    description: 'Peaceful plantation retreat nestled under dense green shade and pepper vines. Features guided dawn silence walks and fresh herbal teas.',
    mindfulHighlights: ['Zero cell signal quiet zones', 'Organic herbal tea tasting', 'Private verandah meditation deck'],
    weatherSummary: 'Pleasant 21°C • Gentle hillside breeze',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=1000',
    bookingInfo: 'Verified partner with TinyFish Discovery API'
  },
  {
    id: 'ret_02',
    name: 'Nilgiri Mist & Tea Valley Sanctuary',
    region: 'Nilgiri Foothills (Tamil Nadu)',
    biome: 'Highland Valleys',
    distanceKm: 68,
    durationText: '1 hr 40 min drive',
    serenityRating: 94,
    estimatedCost: '$$$',
    isVerifiedProvider: true,
    providerName: 'TinyFish Verified Retreat',
    description: 'Secluded eco-cottages surrounded by rolling tea gardens and eucalyptus trails. Pure acoustic peace with distant waterfall sounds.',
    mindfulHighlights: ['Tea garden walking paths', 'Nighttime clear stargazing', 'Traditional Ayurvedic herbal bath'],
    weatherSummary: 'Mist clearing to 18°C • Fresh hill air',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=1000',
    bookingInfo: 'Direct reservation sync via TinyFish'
  },
  {
    id: 'ret_03',
    name: 'Rishikesh Ganges Riverside Ashram',
    region: 'Himalayan Foothills (Uttarakhand)',
    biome: 'Highland Valleys',
    distanceKm: 95,
    durationText: '2 hrs drive',
    serenityRating: 95,
    estimatedCost: '$$',
    isVerifiedProvider: true,
    providerName: 'OmeGamma Eco-Network',
    description: 'Serene riverside sanctuary by the holy Ganga with mountain backdrop. Yoga, pranayama, and peaceful evening aarti by the river.',
    mindfulHighlights: ['Riverside meditation ghat', 'Daily guided pranayama', 'Nutritious sattvic Ayurvedic dining'],
    weatherSummary: 'Serene 22°C • Clear skies',
    imageUrl: 'https://images.unsplash.com/photo-1506744626753-1fa30fd22541?auto=format&fit=crop&q=80&w=1000',
    bookingInfo: 'Curated wellness partner'
  },
  {
    id: 'ret_04',
    name: 'Solitude Cove Cedar Cabins',
    region: 'Fjordland Shoreline',
    biome: 'Coastal Sanctuaries',
    distanceKm: 120,
    durationText: '2 hr 30 min drive / ferry',
    serenityRating: 98,
    estimatedCost: '$$$',
    isVerifiedProvider: true,
    providerName: 'TinyFish Verified Retreat',
    description: 'Waterfront timber sanctuaries overlooking quiet oceanic fjords. Spot coastal wildlife and listen to the rhythmic tide.',
    mindfulHighlights: ['Private ocean-facing cedar tubs', 'Kayaking in glassy water', 'Sunset meditation bell ritual'],
    weatherSummary: 'Crisp 15°C • Sea mist aroma',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    bookingInfo: 'Verified partner with TinyFish Discovery API'
  }
];

export const FAQS = [
  {
    q: 'Is Psygma a medical diagnostic tool or psychiatric device?',
    a: 'No. Psygma is an everyday personal stress intelligence and wellness platform developed by Team OmeGamma. It is designed to foster self-awareness, highlight lifestyle patterns, and suggest restorative behavioral actions. It never provides medical diagnoses or replaces healthcare providers.'
  },
  {
    q: 'How does the AI estimate stress without invasive sensors?',
    a: 'Psygma correlates multi-modal lifestyle inputs—such as self-reported mood, sleep quality and duration, cognitive workload, physical movement, and contextual tags—against a personalized baseline calibrated over time. The model communicates an explicit confidence level and explains every contributing factor.'
  },
  {
    q: 'Where is my personal data stored, and is it used for advertising?',
    a: 'Your data is strictly yours. Psygma adheres to zero-advertising and non-data-brokering policies. We employ end-to-end encryption in transit and at rest. You can export or permanently delete your complete history with a single click from the Privacy Center.'
  },
  {
    q: 'Can I use Psygma offline or in demonstration mode?',
    a: 'Yes! Psygma has a complete local resilient state engine. Even without a live server connection, interactive breathing exercises, audio synthesis, check-in persistence, and recovery planning function immediately.'
  },
  {
    q: 'How does the TinyFish integration work for retreat discovery?',
    a: 'Psygma interfaces with the TinyFish Discovery service through a secure server proxy to surface genuine, verified nature destinations and retreat availability. We clearly label verified provider data separately from AI-generated suggestions to guarantee transparency.'
  }
];
