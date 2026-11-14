import { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onRsvp: (activity: Activity) => Promise<void>;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onRsvp }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [hasRsvpd, setHasRsvpd] = useState(false);

  const startDate = new Date(activity.startTime);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const remainingSeats = Math.max(0, activity.maxParticipants - activity.currentParticipants);

  const handleRsvpClick = async () => {
    if (hasRsvpd || !activity.hasAvailableSeats) return;
    setIsRegistering(true);
    try {
      await onRsvp(activity);
      setHasRsvpd(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'CommunityNetworking':
        return 'Chai & Remote Founder Mixer';
      case 'SurfSession':
        return 'Ocean Surf & Work Sprint';
      case 'TechTalk':
        return 'Kerala AI & Tech Talk';
      default:
        return 'Community Experience';
    }
  };

  return (
    <div className="card-outsite p-6 sm:p-8 bg-white flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold">
            <span>✦ {getCategoryLabel(activity.category)}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-500">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>{formattedDate} • {formattedTime}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] mb-2.5 leading-snug group-hover:text-[#1B3B36] transition-colors">
          {activity.title}
        </h3>

        {/* Location & City */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-500 mb-4">
          <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
          <span>{activity.locationName}, {activity.city}, Kerala</span>
        </div>

        {/* Description */}
        <p className="text-sm font-normal text-stone-600 line-clamp-3 mb-5 leading-relaxed">
          {activity.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activity.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-3 py-1 rounded-full bg-[#F3F0EA] text-stone-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing & RSVP Action */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-stone-400 font-semibold">
            {activity.price === 0 ? 'Entry' : 'Registration'}
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1918]">
              {activity.price === 0 ? 'FREE' : `₹${activity.price}`}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-medium text-stone-500 mt-0.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {remainingSeats <= 5 ? (
                <strong className="text-amber-700 font-semibold">Only {remainingSeats} spots left</strong>
              ) : (
                `${remainingSeats} spots available`
              )}
            </span>
          </div>
        </div>

        <button
          onClick={handleRsvpClick}
          disabled={isRegistering || hasRsvpd || !activity.hasAvailableSeats}
          className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
            hasRsvpd
              ? 'bg-[#EBF0ED] text-[#1B3B36] border border-[#1B3B36]/20 cursor-default'
              : !activity.hasAvailableSeats
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'btn-forest'
          }`}
        >
          {isRegistering ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Confirming...</span>
            </span>
          ) : hasRsvpd ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1B3B36] stroke-[2.5]" />
              <span>You're Registered</span>
            </span>
          ) : !activity.hasAvailableSeats ? (
            <span>Sold Out</span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>RSVP Seat</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
