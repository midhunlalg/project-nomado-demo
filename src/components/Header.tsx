import { useState, useRef, useEffect } from 'react';
import { Building2, Plus, Sparkles, Ticket, Lock, MapPin, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  activeMode: 'explorer' | 'partner' | 'owner';
  onToggleMode: (mode: 'explorer' | 'partner' | 'owner') => void;
  onOpenCreateSpace: () => void;
  onOpenMyBookings: () => void;
  apiConnected: boolean;
  apiStatus: string;
}

interface DestinationOption {
  value: string;
  label: string;
  tagline: string;
}

const DESTINATION_OPTIONS: DestinationOption[] = [
  { value: 'All', label: 'Locations', tagline: 'All Kerala Spaces' },
  { value: 'Varkala', label: 'Varkala', tagline: 'Cliffs & Arabian Sea' },
  { value: 'Kochi', label: 'Kochi', tagline: 'Fort Kochi & Infopark' },
  { value: 'Munnar', label: 'Munnar', tagline: 'Tea Hills & Mountain Mist' },
  { value: 'Wayanad', label: 'Wayanad', tagline: 'Cloud Forests & Nature' },
  { value: 'Alleppey', label: 'Alleppey', tagline: 'Backwaters & Lagoons' },
];

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  activeMode,
  onToggleMode,
  onOpenCreateSpace,
  onOpenMyBookings,
  apiConnected,
  apiStatus
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const currentDestination = DESTINATION_OPTIONS.find(
    opt => opt.value.toLowerCase() === selectedCity.toLowerCase()
  );
  const currentLabel = currentDestination
    ? currentDestination.label
    : (selectedCity === 'All' ? 'All Spaces' : selectedCity);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E5DF] px-4 sm:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onToggleMode('explorer')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img 
              src="/deskindo-logo.png" 
              alt="deskIndo" 
              className="h-20 sm:h-24 md:h-28 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-102"
            />
          </div>

          {/* Mobile Status */}
          <div 
            title={`Backend status: ${apiStatus}`}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${apiConnected ? 'bg-[#16a34a]' : 'bg-[#eab308]'}`} />
            <span>{apiConnected ? 'Kerala Hubs Live' : 'Cached'}</span>
          </div>
        </div>

        {/* Navigation Menu Tabs (Equal Horizontal Spacing & Matching Padding) */}
        <nav className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* 1. Explore & Location DDL (Clubbed Single Tab) */}
          <div ref={dropdownRef} className="relative z-30">
            <button
              type="button"
              onClick={() => {
                if (activeMode !== 'explorer') {
                  onToggleMode('explorer');
                }
                setIsDropdownOpen(prev => !prev);
              }}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              className={`group flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-2xs select-none ${
                activeMode === 'explorer'
                  ? 'bg-[#1B3B36] border-[#1B3B36] text-white shadow-xs'
                  : 'bg-[#F2EFE9] border-[#E7E5DF] text-stone-700 hover:bg-[#EAE6DF] hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${activeMode === 'explorer' ? 'text-white' : 'text-[#1B3B36]'}`} />
              <span>Explore</span>
              <span className={activeMode === 'explorer' ? 'text-white/40' : 'text-stone-300'}>·</span>
              <span className={`tracking-tight font-medium ${activeMode === 'explorer' ? 'text-white/90' : 'text-stone-600'}`}>
                {currentLabel}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 shrink-0 ${
                  activeMode === 'explorer' ? 'text-white/80' : 'text-stone-500 group-hover:text-stone-800'
                } ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {isDropdownOpen && (
              <div
                role="listbox"
                className="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl border border-[#E7E5DF] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left"
              >
                <div className="px-3 py-2 border-b border-[#F2EFE9] mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-[#1B3B36]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Kerala Destinations
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-stone-400">
                    {DESTINATION_OPTIONS.length} Locations
                  </span>
                </div>
                <div className="space-y-1">
                  {DESTINATION_OPTIONS.map((opt) => {
                    const isSelected = selectedCity.toLowerCase() === opt.value.toLowerCase();
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelectCity(opt.value);
                          if (activeMode !== 'explorer') {
                            onToggleMode('explorer');
                          }
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1B3B36] text-white shadow-xs font-semibold'
                            : 'text-stone-700 hover:bg-[#F2EFE9] hover:text-[#1A1918]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-xs sm:text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                            {opt.label}
                          </span>
                          <span className={`text-[11px] leading-tight mt-0.5 ${isSelected ? 'text-white/75' : 'text-stone-500'}`}>
                            {opt.tagline}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-white shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Space Owners Tab */}
          <button
            onClick={() => onToggleMode('owner')}
            className={`flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-2xs border ${
              activeMode === 'owner'
                ? 'bg-[#1B3B36] border-[#1B3B36] text-white shadow-xs'
                : 'bg-[#F2EFE9] border-[#E7E5DF] text-stone-700 hover:bg-[#EAE6DF] hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            <Lock className={`w-4 h-4 ${activeMode === 'owner' ? 'text-white' : 'text-[#1B3B36]'}`} />
            <span>Space Owners</span>
          </button>

          {/* 3. Hosts Tab */}
          <button
            onClick={() => onToggleMode('partner')}
            className={`flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-2xs border ${
              activeMode === 'partner'
                ? 'bg-[#1B3B36] border-[#1B3B36] text-white shadow-xs'
                : 'bg-[#F2EFE9] border-[#E7E5DF] text-stone-700 hover:bg-[#EAE6DF] hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeMode === 'partner' ? 'text-white' : 'text-[#1B3B36]'}`} />
            <span>Hosts</span>
          </button>

          {/* 4. My Bookings Tab */}
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-2xs border bg-white border-[#D6D3CB] text-stone-800 hover:bg-[#F6F4EE] hover:border-[#BCB8AD]"
            title="View your booked passes from anywhere"
          >
            <Ticket className="w-4 h-4 text-[#1B3B36]" />
            <span>My Bookings</span>
          </button>

          {/* 5. List Space Tab */}
          <button
            onClick={onOpenCreateSpace}
            className="flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-xs bg-[#1B3B36] border border-[#1B3B36] text-white hover:bg-[#132B27] hover:border-[#132B27]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>List Space</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
