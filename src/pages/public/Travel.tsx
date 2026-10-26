import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trees,
  Compass,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { psygmaApi } from '../../services/api';
import { NatureRetreat } from '../../types/wellness';

export const Travel: React.FC = () => {
  const [selectedBiome, setSelectedBiome] = useState<string>('all');
  const [retreats, setRetreats] = useState<NatureRetreat[]>([]);
  const [isTinyFishConnected, setIsTinyFishConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    psygmaApi.getRetreats(selectedBiome).then(data => {
      setRetreats(data.retreats);
      setIsTinyFishConnected(data.isTinyFishConnected);
      setLoading(false);
    });
  }, [selectedBiome]);

  const biomes = [
    { id: 'all', label: 'All Destinations' },
    { id: 'Dense Forests', label: 'Dense Forests & Rainforests' },
    { id: 'Highland Valleys', label: 'Tea Hills & Valleys' },
    { id: 'Coastal Sanctuaries', label: 'Coastal Sanctuaries' },
    { id: 'Himalayan Lakes', label: 'Himalayan Rivers & Lakes' },
  ];

  return (
    <div className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-[#292B26]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A6B59A]/20 text-[#34483A] text-xs font-semibold uppercase tracking-wider mb-4">
          Mindful Escapes & Sanctuaries
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#292B26] leading-tight">
          Nature Escapes & Retreats
        </h1>
        <p className="text-base sm:text-lg text-[#77766D] mt-4 leading-relaxed font-light">
          Discover peaceful nature sanctuaries, tea plantations, and riverside ashrams for deep mental rest, fresh air, and genuine stillness.
        </p>

        {/* Integration Status Badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E5D9]/80 border border-[#D7C5AC] text-xs text-[#34483A]">
          <ShieldCheck className="w-4 h-4 text-[#777B51]" />
          <span>
            {isTinyFishConnected
              ? 'Integrated with TinyFish Discovery API • Verified Provider Records'
              : 'Demonstration Mode • External Discovery Service'}
          </span>
        </div>
      </div>

      {/* Biome Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-12 justify-center hide-scrollbar">
        {biomes.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBiome(b.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
              selectedBiome === b.id
                ? 'bg-[#34483A] text-[#FBF9F4] border-[#34483A] shadow-xs'
                : 'bg-[#FBF9F4] text-[#77766D] border-[#E4DED2] hover:bg-[#E9E5D9]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Sanctuaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-20">
        {retreats.map(retreat => (
          <div
            key={retreat.id}
            className="glass-card rounded-3xl overflow-hidden border-[#E4DED2] flex flex-col justify-between group hover:border-[#34483A] transition-all shadow-sm"
          >
            <div>
              <div className="h-64 w-full overflow-hidden relative">
                <img
                  src={retreat.imageUrl}
                  alt={retreat.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#FBF9F4]/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#34483A]">
                  {retreat.biome}
                </div>
                <div className="absolute top-4 right-4 bg-[#34483A]/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ★ {retreat.serenityRating}% Serenity Index
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs text-[#777B51] font-semibold uppercase tracking-wider mb-1">
                  <span>{retreat.region}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {retreat.distanceKm} km away
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B26] mb-3">
                  {retreat.name}
                </h3>
                <p className="text-sm text-[#77766D] leading-relaxed mb-6">
                  {retreat.description}
                </p>

                {/* Verified Provider Badge */}
                <div className="mb-6 p-3 rounded-xl bg-[#F4F0E8] border border-[#E4DED2] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-[#34483A]">
                    <ShieldCheck className="w-4 h-4 text-[#777B51]" />
                    {retreat.providerName}
                  </span>
                  <span className="text-[#77766D]">{retreat.estimatedCost}</span>
                </div>

                {/* Mindful Highlights */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-semibold text-[#292B26]">Sanctuary Features:</div>
                  {retreat.mindfulHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#77766D]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34483A] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Weather Forecast */}
                <div className="text-xs text-[#77766D] flex items-center gap-2 pt-4 border-t border-[#E4DED2]">
                  <Sun className="w-4 h-4 text-[#D7C5AC]" />
                  <span>Weather: {retreat.weatherSummary}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <Link
                to="/app/recovery-planner"
                className="pill-button-primary w-full text-center text-xs py-3 shadow-xs flex items-center justify-center gap-2"
              >
                <span>Plan Sanctuary Trip</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Discovery Charter Note */}
      <div className="p-6 rounded-2xl bg-[#E9E5D9]/70 border border-[#D7C5AC] text-left text-xs text-[#77766D] max-w-3xl mx-auto flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#34483A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#292B26] block mb-1">Authentic Discovery Standards:</strong>
          Psygma only lists verified natural settings and authorized retreat partners. We never fabricate pricing, reservations, or meteorological conditions. If an external booking connection is unavailable, it is clearly demarcated.
        </div>
      </div>
    </div>
  );
};
