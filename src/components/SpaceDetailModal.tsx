import { useState } from 'react';
import { X, Wifi, Star, MapPin, Users, Clock, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { CoworkingSpace } from '../types';
import { api } from '../services/api';

interface SpaceDetailModalProps {
  space: CoworkingSpace | null;
  onClose: () => void;
  onBookPass: (spaceName: string, date: string, tier: string, isPremium?: boolean, premiumSeatType?: string) => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  space,
  onClose,
  onBookPass
}) => {
  const [selectedTier, setSelectedTier] = useState<'daily' | 'hourly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!space) return null;

  const getPremiumSeatView = (sp: CoworkingSpace) => {
    const text = `${sp.name} ${sp.city} ${sp.description}`.toLowerCase();
    if (text.includes('varkala') || text.includes('cliff') || text.includes('sea') || text.includes('ocean')) {
      return '🌊 Sea-Facing Cliffside Window Seat';
    }
    if (text.includes('munnar') || text.includes('tea') || text.includes('mountain') || text.includes('cloud')) {
      return '🍃 Tea Plantation Panoramic View Seat';
    }
    if (text.includes('alleppey') || text.includes('water') || text.includes('backwater')) {
      return '🛶 Backwater Canal & Houseboat View Seat';
    }
    if (text.includes('wayanad') || text.includes('coffee') || text.includes('rainforest')) {
      return '☕ Coffee Plantation Canopy View Seat';
    }
    if (text.includes('fort kochi') || text.includes('heritage') || text.includes('courtyard')) {
      return '🌿 Rain-Tree Courtyard Balcony Seat';
    }
    if (text.includes('kakkanad') || text.includes('tech') || text.includes('infopark')) {
      return '🏙️ Skyline Tech High-Floor View Seat';
    }
    return '✦ Scenic Premium View Seat';
  };

  const premiumSeatView = getPremiumSeatView(space);
  const basePrice =
    selectedTier === 'daily'
      ? space.pricing.dailyPrice || 450
      : selectedTier === 'hourly'
      ? space.pricing.hourlyPrice || 80
      : space.pricing.monthlyPrice || 6500;

  const premiumFee = isPremium
    ? (selectedTier === 'hourly' ? 30 : selectedTier === 'monthly' ? 1200 : 150)
    : 0;

  const totalDue = basePrice + premiumFee;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createBooking({
        spaceId: space.id,
        spaceName: space.name,
        guestName,
        guestEmail,
        bookingDate: selectedDate,
        tier: selectedTier.toUpperCase() as 'DAILY' | 'HOURLY' | 'MONTHLY',
        isPremium,
        premiumSeatType: isPremium ? premiumSeatView : undefined
      });
      onBookPass(space.name, selectedDate, selectedTier.toUpperCase(), isPremium, premiumSeatView);
      onClose();
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl border border-stone-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-stone-100 overflow-hidden">
          <img
            src={space.imageUrls[0] || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'}
            alt={space.name}
            className="w-full h-full object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xs text-xs sm:text-sm font-semibold text-[#1A1918] shadow-xs">
              <Wifi className="w-4 h-4 text-[#1B3B36]" />
              <span>{space.verifiedWifiSpeedMbps} Mbps Tested</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xs text-xs sm:text-sm font-semibold text-[#1A1918] shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{space.rating} ({space.reviewCount} reviews)</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-500 mb-1.5">
              <MapPin className="w-4 h-4 text-[#1B3B36]" />
              <span>{space.address}, {space.city}, Kerala</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1A1918]">
              {space.name}
            </h2>
            <p className="text-base font-normal text-stone-600 mt-2.5 leading-relaxed">
              {space.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Capacity</div>
              <div className="text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                <Users className="w-4 h-4 text-stone-400" />
                <span>{space.capacity} Desks</span>
              </div>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Hours</div>
              <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>{space.operatingHours.is247 ? '24/7 Access' : space.operatingHours.daysOpen}</span>
              </div>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Internet</div>
              <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-4 h-4 text-[#1B3B36]" />
                <span>Dual Fiber</span>
              </div>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Coordinates</div>
              <div className="text-xs sm:text-sm font-mono text-stone-700 mt-1.5">
                {space.location.latitude.toFixed(2)}, {space.location.longitude.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Included Workspace Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {space.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[#FBF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-800"
                >
                  <Check className="w-4 h-4 text-[#1B3B36] stroke-[2.5]" />
                  <span>{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Pass Form */}
          <div className="p-6 sm:p-7 bg-[#F8F6F1] border border-stone-200 rounded-3xl">
            <h4 className="font-editorial text-2xl font-normal text-[#1A1918] mb-3">
              Reserve Workspace Pass
            </h4>

            {/* Tier Selector */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setSelectedTier('hourly')}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTier === 'hourly'
                    ? 'bg-[#1B3B36] text-white border-[#1B3B36] shadow-xs'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div>Hourly Pass</div>
                <div className="text-base font-bold mt-1">₹{space.pricing.hourlyPrice || 80}/hr</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('daily')}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTier === 'daily'
                    ? 'bg-[#1B3B36] text-white border-[#1B3B36] shadow-xs'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div>Day Pass</div>
                <div className="text-base font-bold mt-1">₹{space.pricing.dailyPrice || 450}/day</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('monthly')}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedTier === 'monthly'
                    ? 'bg-[#1B3B36] text-white border-[#1B3B36] shadow-xs'
                    : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div>Monthly Resident</div>
                <div className="text-base font-bold mt-1">₹{(space.pricing.monthlyPrice || 6500).toLocaleString()}/mo</div>
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Pass Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Nomad Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Arjun Varma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Email Confirmation
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="arjun@nomad.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Premium Seat Checkbox */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 transition-all">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1B3B36] rounded border-stone-300 focus:ring-[#1B3B36] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Premium Seat</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">
                          {premiumSeatView}
                        </span>
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#1B3B36]">
                        +₹{selectedTier === 'hourly' ? '30' : selectedTier === 'monthly' ? '1,200' : '150'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                      Guaranteed premium location ({premiumSeatView}) with priority power outlet and barista service.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-stone-600">
                  Total: <span className="text-xl font-bold text-[#1A1918]">₹{totalDue.toLocaleString()}</span> {isPremium && <span className="text-xs text-amber-800 font-semibold">(Includes Premium View Seat)</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-forest px-8 py-3 text-sm font-semibold shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Confirming Pass...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Reserve {selectedTier.toUpperCase()} Pass</span>
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
