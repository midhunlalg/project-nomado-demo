import { Wifi, Star, MapPin, Users, ArrowRight } from 'lucide-react';
import type { CoworkingSpace } from '../types';

interface SpaceCardProps {
  space: CoworkingSpace;
  onSelect: (space: CoworkingSpace) => void;
  matchExplanation?: string;
  relevanceScore?: number;
}

export const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onSelect,
  matchExplanation,
  relevanceScore
}) => {
  const primaryImage =
    space.imageUrls && space.imageUrls.length > 0
      ? space.imageUrls[0]
      : 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80';

  const formatPrice = (price?: number) => {
    return price ? `₹${price.toLocaleString()}` : '₹450';
  };

  return (
    <div 
      onClick={() => onSelect(space)}
      className="card-outsite flex flex-col overflow-hidden bg-white group cursor-pointer"
    >
      {/* Image Banner */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={space.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Floating Badges (Outsite Minimalist Glass Style) */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-[#1A1918] shadow-xs">
            <Wifi className="w-3.5 h-3.5 text-[#1B3B36]" />
            <span>{space.verifiedWifiSpeedMbps} Mbps Fiber</span>
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-[#1A1918] shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{space.rating}</span>
            <span className="text-stone-400 font-normal">({space.reviewCount})</span>
          </span>
        </div>

        {/* AI Match Badge (if active) */}
        {relevanceScore && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#1B3B36] text-white text-xs font-semibold shadow-xs">
              ✦ {relevanceScore}% Match
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Capacity */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500 mb-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1B3B36]" />
              <span>{space.city}, Kerala</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-stone-400" />
              <span>{space.capacity} desks</span>
            </div>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] leading-snug mb-2.5 group-hover:text-[#1B3B36] transition-colors">
            {space.name}
          </h3>

          <p className="text-sm font-normal text-stone-600 line-clamp-2 mb-5 leading-relaxed">
            {space.description}
          </p>

          {/* AI Match Explanation Callout */}
          {matchExplanation && (
            <div className="mb-5 p-3.5 bg-[#F8F6F1] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 leading-relaxed">
              <span className="font-semibold text-[#1B3B36] mr-1">Match Reason:</span>
              {matchExplanation}
            </div>
          )}

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {space.amenities.slice(0, 3).map((a, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3F0EA] text-stone-700"
              >
                {a.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            ))}
            {space.amenities.length > 3 && (
              <span className="text-xs font-medium px-2 py-1 text-stone-400">
                +{space.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Day Pass
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-[#1A1918]">
                {formatPrice(space.pricing.dailyPrice)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-stone-500">/ day</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(space);
            }}
            className="btn-forest px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs"
          >
            <span>View Space</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
