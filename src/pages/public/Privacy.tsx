import React, { useState } from 'react';
import { Shield, Lock, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { psygmaApi } from '../../services/api';

export const Privacy: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [purgeSuccess, setPurgeSuccess] = useState<boolean>(false);

  const handleExportData = async () => {
    const checkins = await psygmaApi.getCheckIns();
    const profile = await psygmaApi.getUserProfile();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ profile, checkins }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'psygma_wellness_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePurgeData = () => {
    if (window.confirm('Are you sure you want to delete your stored check-ins and reset local profile data?')) {
      localStorage.removeItem('psygma_checkin_history');
      localStorage.removeItem('psygma_current_assessment');
      localStorage.removeItem('psygma_ai_insights');
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 3000);
    }
  };

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-[#292B26] text-left">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Data Governance
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Privacy & Security Manifesto
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Your emotional states and daily reflections are intimate and sacred. At Psygma, we treat user data with unyielding privacy standards.
        </p>
      </div>

      {/* 3 Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
          <Lock className="w-6 h-6 text-[#34483A] mb-3" />
          <h3 className="font-serif text-xl font-semibold mb-2">Zero Data Brokering</h3>
          <p className="text-xs text-[#77766D] leading-relaxed">
            We do not sell, rent, or monetize your emotional logs, sleep patterns, or check-in history to third-party ad networks or insurers.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
          <Shield className="w-6 h-6 text-[#777B51] mb-3" />
          <h3 className="font-serif text-xl font-semibold mb-2">Encrypted Storage</h3>
          <p className="text-xs text-[#77766D] leading-relaxed">
            All data in transit utilizes TLS 1.3 encryption. At rest, sensitive fields are protected with modern cryptographic hashing and salted tokens.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-[#E4DED2]">
          <Download className="w-6 h-6 text-[#D7C5AC] mb-3" />
          <h3 className="font-serif text-xl font-semibold mb-2">Instant Data Sovereignty</h3>
          <p className="text-xs text-[#77766D] leading-relaxed">
            You retain absolute sovereignty over your records. Download a comprehensive JSON export or permanently erase your profile at any time.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border-[#E4DED2] space-y-8 text-sm text-[#77766D] leading-relaxed mb-16">
        <div>
          <h2 className="font-serif text-2xl text-[#292B26] mb-3">1. Information We Collect</h2>
          <p>
            Psygma collects only the information necessary to provide personal wellness intelligence. This includes user-provided inputs during daily check-ins (mood rating, sleep hours, subjective tension, and contextual tags) and configuration preferences (interests, notification choices). We never track background GPS or microphone audio.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-[#292B26] mb-3">2. How Information is Used</h2>
          <p>
            Your logs are processed exclusively to compute baseline statistics, calculate personalized stress estimation indices, and suggest relevant wellness studio interventions. Machine learning models run deterministically against your own historical baseline.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-[#292B26] mb-3">3. External Providers & Third Parties</h2>
          <p>
            When utilizing nature sanctuary discovery, queries are routed through a secure backend proxy to our partner service (TinyFish). Only regional geographic coordinates are shared to return destination availability; your personal name, health reflections, and check-in scores are never exposed.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-[#292B26] mb-3">4. Clinical Disclaimer & Non-Medical Status</h2>
          <p>
            Psygma is not certified as a medical device under the FDA, CE, or equivalent regulatory frameworks. The software does not provide medical treatment, diagnosis, or clinical prescriptions. If you are experiencing severe psychological distress, please contact licensed medical practitioners or local emergency services immediately.
          </p>
        </div>
      </div>

      {/* Interactive Sovereignty Tools */}
      <div className="glass-card p-8 rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
        <h3 className="font-serif text-2xl text-[#292B26] mb-2">Self-Service Data Sovereignty Center</h3>
        <p className="text-xs text-[#77766D] mb-6">
          Exercise your direct rights under modern privacy regulations (GDPR, CCPA, and ethical guidelines).
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportData}
            className="pill-button-secondary text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Personal JSON Archive</span>
          </button>

          <button
            onClick={handlePurgeData}
            className="pill-button bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Check-in History</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Archive exported successfully. Check your browser downloads.</span>
          </div>
        )}

        {purgeSuccess && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Local history purged. Default baseline restored.</span>
          </div>
        )}
      </div>
    </div>
  );
};
