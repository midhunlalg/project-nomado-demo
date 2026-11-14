import { useState } from 'react';
import { Search, Sparkles, X, MapPin } from 'lucide-react';
import type { ParsedIntent } from '../types';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeIntent?: ParsedIntent | null;
  onClearSearch: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading,
  activeIntent,
  onClearSearch
}) => {
  const [inputQuery, setInputQuery] = useState('');

  const suggestions = [
    { label: '🌊 Varkala cliff sea-view under ₹500', query: 'Quiet oceanfront space in Varkala cliff under ₹500 with fast wifi and phone booths' },
    { label: '💻 Kochi Infopark 1Gbps fiber desks', query: 'High speed fiber coworking space in Kochi Infopark with private phone booths' },
    { label: '🍃 Munnar misty tea hill workstation', query: 'Quiet workstation in Munnar tea hills with fiber internet and mountain views' },
    { label: '🛶 Alleppey backwater villa retreat', query: 'Workation retreat in Alleppey backwaters with solar backup and private pool' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      onSearch(inputQuery.trim());
    }
  };

  const handleChipClick = (query: string) => {
    setInputQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
      {/* Category Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white text-xs sm:text-sm font-semibold text-stone-700 tracking-wide mb-6 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-[#1B3B36]" />
        <span>🌴 Kerala Workation & Digital Nomad Network</span>
      </div>

      {/* Outsite-Style Editorial Headline (Larger & Impactful) */}
      <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#1A1918] tracking-tight leading-[1.1] mb-6">
        Work from God's Own Country, <br />
        <span className="italic font-light text-[#1B3B36]">feel inspired</span> everywhere.
      </h1>

      <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl font-normal text-stone-600 mb-10 leading-relaxed">
        Verified 500Mbps–1Gbps workspaces, clifftop desks, acoustic podcast studios, and tea estate retreats across Varkala, Kochi, Munnar, Wayanad, and Alleppey.
      </p>

      {/* Outsite-Inspired Integrated Search Bar with AI Intelligence */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6">
        <div className="relative flex flex-col sm:flex-row items-center gap-2.5 p-2.5 sm:p-3 bg-white border border-[#D6D3CB] rounded-2xl sm:rounded-full shadow-md hover:shadow-lg focus-within:border-[#1B3B36] focus-within:ring-2 focus-within:ring-[#1B3B36]/15 transition-all">
          <div className="flex items-center w-full px-4 gap-3">
            <Sparkles className="w-6 h-6 text-[#1B3B36] shrink-0" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. Quiet cliffside desk in Varkala under ₹500 with phone booths and high-speed fiber..."
              className="w-full bg-transparent text-base sm:text-lg font-normal text-[#1A1918] placeholder:text-stone-400 outline-none"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => {
                  setInputQuery('');
                  onClearSearch();
                }}
                className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="w-full sm:w-auto btn-forest px-8 py-3.5 text-base font-semibold whitespace-nowrap shadow-xs"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching Kerala Hubs...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>Search Spaces</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Refined Quick Suggestion Prompts */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 text-sm text-stone-500">
        <span className="font-semibold text-stone-700 mr-1">Popular searches:</span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(s.query)}
            className="px-4 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:border-stone-300"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* AI Intent Breakdown Card (Clean, Sophisticated Style) */}
      {activeIntent && (
        <div className="max-w-3xl mx-auto p-6 card-outsite bg-[#FAFAF8] border border-stone-300 rounded-3xl text-left animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B3B36]" />
              <span className="text-xs sm:text-sm font-semibold text-[#1B3B36] uppercase tracking-wide">
                AI Match Criteria
              </span>
            </div>
            <button
              onClick={() => {
                setInputQuery('');
                onClearSearch();
              }}
              className="btn-outsite-outline text-xs sm:text-sm px-4 py-1.5 font-medium"
            >
              <X className="w-4 h-4 mr-1" />
              <span>Reset Search</span>
            </button>
          </div>

          <p className="text-base font-medium text-stone-800 mb-4 italic">
            "{activeIntent.summaryOfIntent}"
          </p>

          <div className="flex flex-wrap gap-2.5 text-xs sm:text-sm font-medium">
            {activeIntent.city && (
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 flex items-center gap-1.5 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#1B3B36]" />
                <span>Destination: <strong>{activeIntent.city}, Kerala</strong></span>
              </span>
            )}
            {activeIntent.maxDailyBudget && (
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 shadow-2xs">
                Max Daily Pass: <strong>₹{activeIntent.maxDailyBudget}</strong>
              </span>
            )}
            {activeIntent.targetType && (
              <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 shadow-2xs">
                Category: <strong>{activeIntent.targetType}</strong>
              </span>
            )}
            {activeIntent.requiredAmenities && activeIntent.requiredAmenities.length > 0 && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] font-semibold">
                Perks: {activeIntent.requiredAmenities.join(', ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
