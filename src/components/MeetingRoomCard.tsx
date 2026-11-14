import { Mic, Users, Tv, Clock, ArrowRight } from 'lucide-react';
import type { MeetingRoom } from '../types';

interface MeetingRoomCardProps {
  room: MeetingRoom;
  onReserve: (room: MeetingRoom) => void;
}

export const MeetingRoomCard: React.FC<MeetingRoomCardProps> = ({ room, onReserve }) => {
  const isPodcast = room.roomType === 'PodcastStudio';

  return (
    <div className="card-outsite p-6 sm:p-8 bg-white flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold">
            {isPodcast ? <Mic className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
            <span>{room.roomType.replace(/([A-Z])/g, ' $1').trim()}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Available</span>
          </span>
        </div>

        {/* Room Title */}
        <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] mb-2.5 leading-snug">
          {room.name}
        </h3>

        <p className="text-sm font-normal text-stone-600 line-clamp-2 mb-5 leading-relaxed">
          {room.description}
        </p>

        {/* Attributes */}
        <div className="flex items-center gap-5 text-xs sm:text-sm font-semibold text-stone-500 mb-5 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-stone-400" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Min {room.minBookingHours} hr</span>
          </div>
        </div>

        {/* AV Equipment Tags */}
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
            Installed Audio/Visual Equipment
          </div>
          <div className="flex flex-wrap gap-2">
            {room.equipment.map((eq, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1 rounded-full bg-[#F3F0EA] text-stone-700"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-stone-400 font-semibold">Hourly Rate</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#1A1918]">
              ₹{room.hourlyRate}
            </span>
            <span className="text-xs sm:text-sm font-medium text-stone-500">/ hr</span>
          </div>
        </div>

        <button
          onClick={() => onReserve(room)}
          className="btn-forest px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs"
        >
          <span>Reserve Studio</span>
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
