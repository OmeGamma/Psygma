import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { psygmaApi } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [locationAllowed, setLocationAllowed] = useState(user.preferences.locationAllowed);
  const [aiAllowed, setAiAllowed] = useState(user.preferences.aiPersonalizationAllowed);
  const [notifications, setNotifications] = useState(user.preferences.notificationsEnabled);
  const [themePreference, setThemePreference] = useState(user.preferences.themePreference || 'warm-cream');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleToggle = async (key: string, value: boolean) => {
    if (key === 'location') setLocationAllowed(value);
    if (key === 'ai') setAiAllowed(value);
    if (key === 'notifications') setNotifications(value);

    await updateUser({
      preferences: {
        ...user.preferences,
        locationAllowed: key === 'location' ? value : locationAllowed,
        aiPersonalizationAllowed: key === 'ai' ? value : aiAllowed,
        notificationsEnabled: key === 'notifications' ? value : notifications
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleThemeChange = async (theme: string) => {
    setThemePreference(theme);
    await updateUser({
      preferences: {
        ...user.preferences,
        themePreference: theme
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const [checkins, activities, assessment] = await Promise.all([
        psygmaApi.getCheckIns(),
        psygmaApi.getCompletedActivities(),
        psygmaApi.getAssessment()
      ]);

      const exportBundle = {
        exportDate: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          preferences: user.preferences,
          wellnessGoals: user.wellnessGoals
        },
        currentAssessment: assessment,
        checkinHistory: checkins,
        activityCompletions: activities
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataStr);
      anchor.setAttribute('download', `psygma_wellness_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all local check-in records? Baseline will revert to default.')) {
      psygmaApi.clearPrivateCache();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
          Account Governance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
          Settings & Sovereignty
        </h1>
        <p className="text-sm text-[#77766D] mt-1 font-light">
          Manage privacy permissions, algorithmic modeling parameters, themes, and data ownership.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#A6B59A]/30 text-[#34483A] border border-[#A6B59A]/50 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#34483A]" />
          <span>Setting updated and synchronized.</span>
        </div>
      )}

      {/* Group 1: Theme & Visual Tone */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-5 h-5 text-[#34483A]" />
          <h2 className="font-serif text-xl font-semibold text-[#292B26]">Visual Palette</h2>
        </div>

        <p className="text-xs text-[#77766D]">
          Select your preferred nature-inspired ambiance. Changes are saved to your profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { id: 'warm-cream', label: 'Warm Ivory & Sage', desc: 'Serene warm sunlight and muted botanical tones' },
            { id: 'calm-sage', label: 'Nilgiri Green Forest', desc: 'Deep lush foliage with rich earth accents' }
          ].map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => handleThemeChange(th.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                themePreference === th.id
                  ? 'bg-[#E9E5D9] border-[#34483A] shadow-xs'
                  : 'bg-white border-[#E4DED2] hover:bg-[#F4F0E8]'
              }`}
            >
              <div className="text-sm font-semibold text-[#292B26]">{th.label}</div>
              <div className="text-xs text-[#77766D] mt-0.5">{th.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Group 2: Privacy Controls */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-[#34483A]" />
          <h2 className="font-serif text-xl font-semibold text-[#292B26]">Privacy & Permissions</h2>
        </div>

        <div className="divide-y divide-[#E4DED2]">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#292B26]">Location Access</div>
              <p className="text-xs text-[#77766D]">Allows Psygma to surface nearby green trails and retreats.</p>
            </div>
            <input
              type="checkbox"
              checked={locationAllowed}
              onChange={(e) => handleToggle('location', e.target.checked)}
              className="w-5 h-5 accent-[#34483A] cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-[#292B26]">Personalized AI Modeling</div>
              <p className="text-xs text-[#77766D]">Enables the grounded inference engine to identify multi-day correlations.</p>
            </div>
            <input
              type="checkbox"
              checked={aiAllowed}
              onChange={(e) => handleToggle('ai', e.target.checked)}
              className="w-5 h-5 accent-[#34483A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Group 3: Notifications */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-[#34483A]" />
          <h2 className="font-serif text-xl font-semibold text-[#292B26]">Gentle Notifications</h2>
        </div>

        <div className="py-3.5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-[#292B26]">Daily Reflection Reminder</div>
            <p className="text-xs text-[#77766D]">Soft prompt at 8:30 AM to log morning state.</p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => handleToggle('notifications', e.target.checked)}
            className="w-5 h-5 accent-[#34483A] cursor-pointer"
          />
        </div>
      </div>

      {/* Group 4: Data Sovereignty & Export */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Download className="w-5 h-5 text-[#34483A]" />
          <h2 className="font-serif text-xl font-semibold text-[#292B26]">Data Export & Portability</h2>
        </div>

        <p className="text-xs text-[#77766D] leading-relaxed">
          You own your biometric and wellness records. Download your entire history in open JSON format at any time.
        </p>

        <button
          onClick={handleExportData}
          disabled={exporting}
          className="pill-button-secondary text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Preparing JSON export...' : 'Export All Records (JSON)'}</span>
        </button>
      </div>

      {/* Group 5: Data Management & Reset */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border-[#E4DED2] space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-red-700" />
          <h2 className="font-serif text-xl font-semibold text-[#292B26]">Data Reset</h2>
        </div>

        <p className="text-xs text-[#77766D] leading-relaxed">
          Clear all locally cached check-in entries and revert the BioStress engine back to its clean initial state.
        </p>

        <button
          onClick={handleClearHistory}
          className="pill-button bg-red-50 text-red-700 border border-red-200 text-xs py-2 px-4 hover:bg-red-100 transition-colors"
        >
          Reset All Check-in History
        </button>
      </div>
    </div>
  );
};
