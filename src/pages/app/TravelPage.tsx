import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Trees,
  MapPin,
  ShieldCheck,
  Sun,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Sparkles,
  Info,
  X,
  Compass,
  Navigation,
  DollarSign,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { NatureRetreat } from '../../types/wellness';

export const TravelPage: React.FC = () => {
  const [retreats, setRetreats] = useState<NatureRetreat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [startingCity, setStartingCity] = useState<string>('Bengaluru');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [savedRetreats, setSavedRetreats] = useState<string[]>([]);
  const [isTinyFishConnected, setIsTinyFishConnected] = useState<boolean>(false);
  const [providerSource, setProviderSource] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<NatureRetreat | null>(null);

  const majorCities = ['Bengaluru', 'Delhi', 'Mumbai', 'Pune', 'Chennai', 'Hyderabad'];

  const fetchRetreats = async () => {
    setLoading(true);
    try {
      const data = await psygmaApi.getRetreats({
        biomeFilter: selectedBiome,
        startingCity,
        region: selectedRegion,
        budget: selectedBudget !== 'all' ? selectedBudget : undefined
      });
      setRetreats(data.retreats);
      setIsTinyFishConnected(data.isTinyFishConnected);
      setProviderSource(data.source);
    } catch (err) {
      console.error('Error fetching retreats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetreats();
  }, [selectedBiome, startingCity, selectedRegion, selectedBudget]);

  const toggleSave = (id: string) => {
    setSavedRetreats(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 text-[#292B26] text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E4DED2]/60">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#777B51] block mb-1">
            Indian Nature Escapes & Wellness Retreats
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292B26]">
            Nature Escapes & Travel
          </h1>
          <p className="text-sm text-[#77766D] mt-1 font-light">
            Quiet Indian nature getaways, walking sanctuaries, and restorative retreats matching your preferences.
          </p>
        </div>
      </div>

      {/* Integration Status Banner */}
      <div className="p-4 rounded-2xl bg-[#E9E5D9]/70 border border-[#D7C5AC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isTinyFishConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
          <span className="text-[#292B26] font-medium">
            Discovery Provider: <strong>{providerSource || 'TinyFish Web Research Discovery Integration'}</strong>
          </span>
        </div>
        <span className="text-[#77766D] text-[11px]">
          {isTinyFishConnected
            ? 'Live external sanctuary verification active via TinyFish backend integration.'
            : 'Verified Curated Indian Sanctuary Inventory active.'}
        </span>
      </div>

      {/* Interactive Discovery Control Panel */}
      <div className="glass-card p-5 rounded-2xl border-[#E4DED2] bg-[#FBF9F4] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E4DED2] text-xs font-bold text-[#34483A]">
          <Navigation className="w-4 h-4 text-[#777B51]" />
          <span>Starting City & Travel Constraints</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Starting City */}
          <div>
            <label className="block font-semibold text-[#292B26] mb-1.5">Starting City (India)</label>
            <div className="flex items-center gap-2">
              <select
                value={startingCity}
                onChange={e => setStartingCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C5AC] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#34483A]"
              >
                {majorCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-[#77766D] mt-1 block">Distances recalculate automatically</span>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block font-semibold text-[#292B26] mb-1.5">Destination Region</label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C5AC] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#34483A]"
            >
              <option value="all">All Indian Regions</option>
              <option value="Western Ghats">Western Ghats (Karnataka / Kerala)</option>
              <option value="Uttarakhand">Himalayan Foothills (Uttarakhand)</option>
              <option value="Himachal">Himalayan Ranges (Himachal Pradesh)</option>
              <option value="Tamil Nadu">Coromandel Coast (Tamil Nadu)</option>
            </select>
          </div>

          {/* Biome Filter */}
          <div>
            <label className="block font-semibold text-[#292B26] mb-1.5">Environment / Biome</label>
            <select
              value={selectedBiome}
              onChange={e => setSelectedBiome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C5AC] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#34483A]"
            >
              <option value="all">All Biomes</option>
              <option value="Dense Forests">Dense Rainforest & Forests</option>
              <option value="Coastal Sanctuaries">Coastal & Ocean Sanctuaries</option>
              <option value="Highland Valleys">Tea Hills & Highland Valleys</option>
              <option value="Alpine Lakes">Himalayan River Valleys & Lakes</option>
            </select>
          </div>

          {/* Budget Filter */}
          <div>
            <label className="block font-semibold text-[#292B26] mb-1.5">Estimated Budget Tier</label>
            <select
              value={selectedBudget}
              onChange={e => setSelectedBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C5AC] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#34483A]"
            >
              <option value="all">All Budget Tiers</option>
              <option value="$">Budget / Ashrams ($)</option>
              <option value="$$">Moderate Eco-Lodges ($$)</option>
              <option value="$$$">Luxury Holistic Resorts ($$$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Retreats List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#77766D]">
          <div className="w-8 h-8 rounded-full border-2 border-[#34483A] border-t-transparent animate-spin mx-auto mb-3"></div>
          Discovering verified sanctuaries near {startingCity}...
        </div>
      ) : retreats.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl border-[#E4DED2] bg-[#FBF9F4]">
          <Trees className="w-10 h-10 text-[#777B51] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-bold text-[#292B26] mb-1">No retreats match this exact filter</h3>
          <p className="text-xs text-[#77766D] max-w-sm mx-auto mb-4">
            Try switching to 'All Biomes' or selecting a different Indian region.
          </p>
          <button
            onClick={() => { setSelectedBiome('all'); setSelectedRegion('all'); setSelectedBudget('all'); }}
            className="pill-button-secondary text-xs py-2 px-4"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {retreats.map(ret => {
            const isSaved = savedRetreats.includes(ret.id);
            return (
              <div
                key={ret.id}
                className="glass-card rounded-3xl overflow-hidden border-[#E4DED2] flex flex-col justify-between group shadow-sm bg-[#FBF9F4] hover:border-[#34483A]/50 transition-all"
              >
                <div>
                  <div className="h-60 w-full overflow-hidden relative">
                    <img
                      src={ret.imageUrl}
                      alt={ret.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#FBF9F4]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#34483A]">
                      {ret.biome}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#34483A]/90 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      ★ {ret.serenityRating}% Serenity Index
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-[#777B51] font-semibold uppercase tracking-wider mb-1">
                      <span className="truncate max-w-[200px]">{ret.region}</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] shrink-0">
                        <MapPin className="w-3.5 h-3.5" /> {ret.distanceKm} km from {startingCity}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-[#292B26] mb-1.5">{ret.name}</h3>
                    <div className="text-[11px] text-[#777B51] font-medium mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {ret.durationText}
                    </div>
                    <p className="text-xs text-[#77766D] leading-relaxed mb-4">{ret.description}</p>

                    {/* Verified provider pill */}
                    <div className="p-2.5 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between text-xs mb-4">
                      <span className="flex items-center gap-1.5 font-semibold text-[#34483A]">
                        <ShieldCheck className="w-4 h-4 text-[#777B51]" />
                        {ret.providerName}
                      </span>
                      <span className="text-[#77766D] font-mono font-bold">{ret.estimatedCost}</span>
                    </div>

                    {/* Facilities / Highlights */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[11px] font-semibold text-[#292B26]">Mindful Highlights:</div>
                      {ret.mindfulHighlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#77766D]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A] shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#77766D] flex items-center gap-2 pt-3 border-t border-[#E4DED2]">
                      <Sun className="w-3.5 h-3.5 text-[#D7C5AC]" />
                      <span>Forecast: {ret.weatherSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-3">
                  <button
                    onClick={() => toggleSave(ret.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSaved
                        ? 'bg-[#E9E5D9] border-[#34483A] text-[#34483A]'
                        : 'bg-[#FBF9F4] border-[#E4DED2] text-[#77766D] hover:bg-[#E9E5D9]'
                    }`}
                    title={isSaved ? 'Saved to bookmarks' : 'Bookmark sanctuary'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#34483A]' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedInquiry(ret)}
                    className="flex-1 pill-button-primary text-xs py-2.5 text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Retreat Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry / Verification Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-7 rounded-3xl border-[#E4DED2] bg-[#FBF9F4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DED2]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#34483A]" />
                <h3 className="font-serif text-xl font-bold text-[#292B26]">Retreat Verification & Details</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#292B26]">
              <div>
                <strong className="block text-sm text-[#34483A] mb-0.5">{selectedInquiry.name}</strong>
                <span className="text-[#77766D]">{selectedInquiry.region} • {selectedInquiry.distanceKm} km from {startingCity}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#E9E5D9]/60 border border-[#D7C5AC] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#77766D]">Verification Status:</span>
                  <span className="font-semibold text-emerald-800">{selectedInquiry.verificationStatus || 'Verified Inventory'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77766D]">Provider:</span>
                  <span className="font-semibold">{selectedInquiry.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#77766D]">Travel Estimate:</span>
                  <span className="font-semibold">{selectedInquiry.durationText}</span>
                </div>
              </div>

              {selectedInquiry.facilities && selectedInquiry.facilities.length > 0 && (
                <div>
                  <span className="font-semibold block mb-1">Available Facilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInquiry.facilities.map((fac, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-[#E4DED2] rounded-md text-[10px] text-[#77766D]">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-[#77766D] leading-relaxed pt-2">
                {selectedInquiry.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E4DED2] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="pill-button-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Close
              </button>
              {selectedInquiry.sourceUrl && (
                <a
                  href={selectedInquiry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <span>Visit Sanctuary Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
