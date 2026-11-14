import { Globe, Building2, Plus, Sparkles, Activity as PulseIcon, Ticket, Lock } from 'lucide-react';

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
  const keralaHubs = ['All', 'Varkala', 'Kochi', 'Munnar', 'Wayanad', 'Alleppey'];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E7E5DF] px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => onToggleMode('explorer')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#1B3B36] flex items-center justify-center text-white text-base font-bold shadow-xs">
              ✦
            </div>
            <div>
              <span className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1918]">
                Nomado
              </span>
              <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase ml-3 hidden sm:inline">
                Kerala Remote Network
              </span>
            </div>
          </div>

          {/* Mobile Status */}
          <div className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700">
            <span className={`w-2.5 h-2.5 rounded-full ${apiConnected ? 'bg-[#16a34a]' : 'bg-[#eab308]'}`} />
            <span>{apiConnected ? 'Kerala Hubs Live' : 'Cached'}</span>
          </div>
        </div>

        {/* Destination Filter Pills (Kerala Nomad Destinations) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none bg-[#F2EFE9] p-1.5 rounded-full border border-[#E7E5DF]">
          <Globe className="w-4 h-4 text-stone-500 ml-2.5 hidden sm:inline shrink-0" />
          {keralaHubs.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1B3B36] text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {city === 'All' ? 'All Kerala Hubs' : city}
              </button>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* API Health Pill */}
          <div 
            title={`Backend status: ${apiStatus}`}
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full border border-stone-200 bg-white text-xs font-semibold text-stone-700 shadow-2xs"
          >
            <PulseIcon className={`w-4 h-4 ${apiConnected ? 'text-[#16a34a]' : 'text-[#ca8a04]'}`} />
            <span>
              {apiConnected ? 'Connected (5135)' : 'Cached'}
            </span>
          </div>

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
