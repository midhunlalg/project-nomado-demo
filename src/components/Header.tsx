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
  { value: 'All', label: 'All Spaces', tagline: 'All Kerala Spaces' },
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

        {/* Destination Filter Dropdown (Kerala Nomad Destinations) */}
        <div ref={dropdownRef} className="relative z-30 flex items-center">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            className={`group flex items-center gap-2.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border transition-all duration-200 cursor-pointer shadow-2xs select-none ${
              isDropdownOpen
                ? 'bg-white border-[#1B3B36] ring-2 ring-[#1B3B36]/15 text-[#1B3B36]'
                : selectedCity !== 'All'
                ? 'bg-[#EBF0ED] border-[#1B3B36]/30 text-[#1B3B36] hover:bg-[#E2EBE5]'
                : 'bg-[#F2EFE9] border-[#E7E5DF] text-stone-800 hover:bg-[#EAE6DF] hover:border-stone-300'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]" />
            </span>
            <MapPin className="w-4 h-4 text-[#1B3B36] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#1A1918]">
              {currentLabel}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 shrink-0 ${
                isDropdownOpen ? 'rotate-180 text-[#1B3B36]' : 'group-hover:text-stone-800'
              }`}
            />
          </button>

          {/* Dropdown Menu Panel */}
          {isDropdownOpen && (
            <div
              role="listbox"
              className="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl border border-[#E7E5DF] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left"
            >
              <div className="px-3 py-2 border-b border-[#F2EFE9] mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Kerala Destinations
                </span>
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

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* <div 
            title={`Backend status: ${apiStatus}`}
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 shadow-2xs"
          >
            <PulseIcon className={`w-4 h-4 ${apiConnected ? 'text-[#16a34a]' : 'text-[#ca8a04]'}`} />
            <span>
              {apiConnected ? 'Azure Cloud Live' : 'Cached'}
            </span>
          </div> */}

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#F2EFE9] p-1.5 rounded-full border border-[#E7E5DF]">
            <button
              onClick={() => onToggleMode('explorer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'explorer'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1B3B36]" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => onToggleMode('owner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'owner'
                  ? 'bg-[#1B3B36] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Space Owners</span>
            </button>
            <button
              onClick={() => onToggleMode('partner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'partner'
                  ? 'bg-[#1B3B36] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hosts</span>
            </button>
          </div>

          {/* My Bookings Button */}
          <button
            onClick={onOpenMyBookings}
            className="btn-outsite-outline text-xs px-3.5 py-2 font-semibold shadow-2xs flex items-center gap-1.5"
            title="View your booked passes from anywhere"
          >
            <Ticket className="w-3.5 h-3.5 text-[#1B3B36]" />
            <span className="hidden sm:inline">My Bookings</span>
          </button>

          {/* Add Space Button */}
          <button
            onClick={onOpenCreateSpace}
            className="btn-forest text-xs px-4 py-2 font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">List Space</span>
          </button>
        </div>
      </div>
    </header>
  );
};
