import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  Shield,
  Clock,
  Thermometer,
  Wind,
  Moon,
  Flame,
  Scale,
  Calendar,
  Building2,
  Stethoscope,
  Watch,
  User,
  Info
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { HealthMeasurementEntry, HealthMeasurementCreate } from '../../types/wellness';

export const HealthMeasurementsPage: React.FC = () => {
  const [measurements, setMeasurements] = useState<HealthMeasurementEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [measurementType, setMeasurementType] = useState<HealthMeasurementCreate['measurementType']>('heart_rate');
  const [value, setValue] = useState<string>('72');
  const [secondaryValue, setSecondaryValue] = useState<string>('80'); // For diastolic BP
  const [unit, setUnit] = useState<string>('bpm');
  const [source, setSource] = useState<HealthMeasurementCreate['source']>('manual_home');
  const [entryMethod, setEntryMethod] = useState<string>('manual');
  const [notes, setNotes] = useState<string>('');

  // Latest urgent alert banner
  const [activeUrgentAlert, setActiveUrgentAlert] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await psygmaApi.getHealthMeasurements();
      setMeasurements(data);
      const latestUrgent = data.find(m => m.isPotentiallyUrgent);
      if (latestUrgent && latestUrgent.safetyGuidance) {
        setActiveUrgentAlert(latestUrgent.safetyGuidance);
      } else {
        setActiveUrgentAlert(null);
      }
    } catch (err: unknown) {
      console.error('Failed to load health records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Update default units when measurement type changes
  const handleTypeChange = (type: HealthMeasurementCreate['measurementType']) => {
    setMeasurementType(type);
    if (type === 'heart_rate') {
      setValue('72');
      setUnit('bpm');
    } else if (type === 'blood_pressure') {
      setValue('120');
      setSecondaryValue('80');
      setUnit('mmHg');
    } else if (type === 'oxygen_saturation') {
      setValue('98');
      setUnit('%');
    } else if (type === 'temperature') {
      setValue('36.7');
      setUnit('°C');
    } else if (type === 'sleep_duration') {
      setValue('7.5');
      setUnit('hours');
    } else if (type === 'physical_activity') {
      setValue('7500');
      setUnit('steps');
    } else if (type === 'weight') {
      setValue('68');
      setUnit('kg');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const numVal = parseFloat(value);
    if (isNaN(numVal)) {
      setErrorMsg('Please enter a valid numeric measurement.');
      setSubmitting(false);
      return;
    }

    const payload: HealthMeasurementCreate = {
      measurementType,
      value: numVal,
      secondaryValue: measurementType === 'blood_pressure' ? parseFloat(secondaryValue) || undefined : undefined,
      unit,
      source,
      entryMethod,
      notes: notes.trim() || undefined,
      measuredAt: new Date().toISOString()
    };

    try {
      const saved = await psygmaApi.recordHealthMeasurement(payload);
      setSuccessToast(`Saved ${formatMeasurementName(measurementType)} to MongoDB.`);
      if (saved.isPotentiallyUrgent && saved.safetyGuidance) {
        setActiveUrgentAlert(saved.safetyGuidance);
      }
      setNotes('');
      await fetchRecords();
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to record health measurement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await psygmaApi.deleteHealthMeasurement(id);
      setMeasurements(prev => prev.filter(m => m.id !== id));
      setSuccessToast('Record deleted.');
      setTimeout(() => setSuccessToast(null), 2500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete record.');
    }
  };

  const formatMeasurementName = (type: string) => {
    switch (type) {
      case 'heart_rate':
        return 'Heart Rate';
      case 'blood_pressure':
        return 'Blood Pressure';
      case 'oxygen_saturation':
        return 'Oxygen Saturation (SpO₂)';
      case 'temperature':
        return 'Body Temperature';
      case 'sleep_duration':
        return 'Sleep Duration';
      case 'physical_activity':
        return 'Physical Activity';
      case 'weight':
        return 'Body Weight';
      default:
        return type;
    }
  };

  const getSourceIcon = (src: string) => {
    switch (src) {
      case 'healthcare_professional':
        return <Stethoscope className="w-3.5 h-3.5 text-blue-600" />;
      case 'pharmacy_medical_shop':
        return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'device_import':
        return <Watch className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <User className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getSourceLabel = (src: string) => {
    switch (src) {
      case 'healthcare_professional':
        return 'Healthcare Professional';
      case 'pharmacy_medical_shop':
        return 'Pharmacy / Medical Shop';
      case 'device_import':
        return 'Device / Oximeter Import';
      default:
        return 'Manual Home Record';
    }
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4DED2]/60">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Personal Health & Biometric Records
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            Health Measurements & Vitals
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Record physiological measurements taken at home, clinics, or pharmacies. Stored securely in MongoDB.
          </p>
        </div>
      </div>

      {/* Non-Diagnostic Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#E9E5D9]/70 border border-[#D7C5AC] flex items-start gap-3 text-xs text-[#292B26]">
        <Shield className="w-4 h-4 text-[#34483A] shrink-0 mt-0.5" />
        <div>
          <strong>Wellness Monitoring Notice:</strong> Psygma organizes self-reported and device measurements for personal awareness.
          It does not diagnose medical conditions or substitute for professional medical assessment. Health measurements are kept separate from algorithm stress estimates.
        </div>
      </div>

      {/* Urgent Clinical Alert Banner */}
      {activeUrgentAlert && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Important Health Safety Notice</h4>
              <p className="text-xs leading-relaxed">{activeUrgentAlert}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-600 font-bold ml-2">✕</button>
        </div>
      )}

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main 2-Column Grid: Entry Form + History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Entry Form (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-7 rounded-3xl border-[#E4DED2] bg-[#FBF9F4] shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#E4DED2]">
            <Plus className="w-4 h-4 text-[#34483A]" />
            <h3 className="font-serif text-xl font-bold text-[#292B26]">Record New Measurement</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Measurement Type Selector */}
            <div>
              <label className="block font-semibold text-[#292B26] mb-2">Measurement Category</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'heart_rate', label: 'Heart Rate (bpm)', icon: Heart },
                  { type: 'blood_pressure', label: 'Blood Pressure', icon: Activity },
                  { type: 'oxygen_saturation', label: 'SpO₂ Oxygen (%)', icon: Wind },
                  { type: 'temperature', label: 'Temperature', icon: Thermometer },
                  { type: 'sleep_duration', label: 'Sleep Window', icon: Moon },
                  { type: 'physical_activity', label: 'Steps / Activity', icon: Flame },
                  { type: 'weight', label: 'Body Weight', icon: Scale },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = measurementType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => handleTypeChange(item.type as HealthMeasurementCreate['measurementType'])}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#34483A] text-white border-[#34483A] shadow-xs'
                          : 'bg-white border-[#E4DED2] text-[#292B26] hover:bg-[#F4F0E8]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#FBF9F4]' : 'text-[#777B51]'}`} />
                      <span className="truncate font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Value & Secondary Value Fields */}
            {measurementType === 'blood_pressure' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#292B26] mb-1">Systolic (mmHg)</label>
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="260"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    placeholder="e.g. 120"
                  />
                  <span className="text-[10px] text-[#77766D] mt-0.5 block">Upper pressure</span>
                </div>
                <div>
                  <label className="block font-semibold text-[#292B26] mb-1">Diastolic (mmHg)</label>
                  <input
                    type="number"
                    step="1"
                    min="30"
                    max="160"
                    value={secondaryValue}
                    onChange={e => setSecondaryValue(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    placeholder="e.g. 80"
                  />
                  <span className="text-[10px] text-[#77766D] mt-0.5 block">Lower pressure</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#292B26] mb-1">Recorded Value</label>
                  <input
                    type="number"
                    step={measurementType === 'temperature' || measurementType === 'sleep_duration' ? '0.1' : '1'}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#292B26] mb-1">Unit</label>
                  {measurementType === 'temperature' ? (
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    >
                      <option value="°C">°C</option>
                      <option value="°F">°F</option>
                    </select>
                  ) : measurementType === 'weight' ? (
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#34483A]"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={unit}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E4DED2] bg-[#E9E5D9]/50 text-xs font-semibold text-[#77766D]"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Source & Provenance */}
            <div>
              <label className="block font-semibold text-[#292B26] mb-1">Measurement Source / Provenance</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as HealthMeasurementCreate['source'])}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D7C5AC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#34483A]"
              >
                <option value="manual_home">Manual Home Measurement</option>
                <option value="pharmacy_medical_shop">Pharmacy / Medical Shop Counter</option>
                <option value="healthcare_professional">Healthcare Professional / Clinic</option>
                <option value="device_import">Device Import / Pulse Oximeter / Watch</option>
                <option value="other">Other Recognized Source</option>
              </select>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block font-semibold text-[#292B26] mb-1">Optional Context Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Measured seated 15m after waking"
                className="w-full px-3 py-2 rounded-xl border border-[#D7C5AC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#34483A]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full pill-button-primary py-3 text-xs font-bold shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? 'Saving to Database...' : 'Save Measurement to History'}
            </button>
          </form>
        </div>

        {/* History Table (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl border-[#E4DED2] bg-[#FBF9F4] shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E4DED2]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#34483A]" />
              <h3 className="font-serif text-xl font-bold text-[#292B26]">Recorded History</h3>
            </div>
            <span className="text-xs text-[#77766D] font-medium">
              {measurements.length} stored records in MongoDB
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#77766D]">
              <div className="w-8 h-8 rounded-full border-2 border-[#34483A] border-t-transparent animate-spin mx-auto mb-3"></div>
              Loading verified records from MongoDB...
            </div>
          ) : measurements.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Activity className="w-10 h-10 text-[#777B51] mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#292B26]">No health measurements recorded yet</p>
              <p className="text-xs text-[#77766D] max-w-sm mx-auto">
                Add your resting heart rate, blood pressure, or oxygen saturation to track personal physiological stability over time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E4DED2] text-[#77766D] font-semibold">
                    <th className="pb-3 pr-2">Metric</th>
                    <th className="pb-3 px-2">Reading</th>
                    <th className="pb-3 px-2">Source</th>
                    <th className="pb-3 px-2">Recorded</th>
                    <th className="pb-3 pl-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DED2]/60">
                  {measurements.map(m => {
                    const isUrgent = m.isPotentiallyUrgent;
                    return (
                      <tr key={m.id} className={`hover:bg-[#F4F0E8]/50 transition-colors ${isUrgent ? 'bg-rose-50/70' : ''}`}>
                        <td className="py-3 pr-2 font-semibold text-[#292B26]">
                          <div className="flex items-center gap-1.5">
                            {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            <span>{formatMeasurementName(m.measurementType)}</span>
                          </div>
                          {m.notes && <p className="text-[10px] text-[#77766D] font-normal truncate max-w-[150px]">{m.notes}</p>}
                        </td>

                        <td className="py-3 px-2">
                          <span className={`font-bold ${isUrgent ? 'text-rose-800' : 'text-[#34483A]'}`}>
                            {m.measurementType === 'blood_pressure' && m.secondaryValue
                              ? `${m.value}/${m.secondaryValue} ${m.unit}`
                              : `${m.value} ${m.unit}`}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#E9E5D9]/80 text-[10px] text-[#292B26]">
                            {getSourceIcon(m.source)}
                            <span className="truncate max-w-[110px]">{getSourceLabel(m.source)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-[#77766D] whitespace-nowrap text-[11px]">
                          {new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>

                        <td className="py-3 pl-2 text-right">
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                            title="Delete measurement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
