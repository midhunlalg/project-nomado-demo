import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { MeetingRoom } from '../types';

interface MeetingRoomModalProps {
  room: MeetingRoom | null;
  onClose: () => void;
  onConfirm: (roomName: string, hours: number, total: number) => void;
}

export const MeetingRoomModal: React.FC<MeetingRoomModalProps> = ({
  room,
  onClose,
  onConfirm
}) => {
  const [hours, setHours] = useState(2);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [organizer, setOrganizer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!room) return null;

  const total = hours * room.hourlyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(room.name, hours, total);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#1B3B36] uppercase tracking-wider block mb-1">
              {room.roomType}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
              {room.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              Booking Duration: <span className="text-[#1B3B36] font-bold">{hours} Hours</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[1, 2, 4, 8].map((h) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHours(h)}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    hours === h
                      ? 'bg-[#1B3B36] text-white border-[#1B3B36] shadow-xs'
                      : 'bg-[#FBF9F5] border-stone-200 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  {h} {h === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Organizer Name / Squad
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Nair (Kerala AI Collective)"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium">
                ₹{room.hourlyRate}/hr × {hours} hours
              </div>
              <div className="text-2xl font-bold text-[#1A1918] mt-0.5">
                Total: ₹{total.toLocaleString()}
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1B3B36] bg-[#EBF0ED] px-3.5 py-1.5 rounded-full">
              Instant Pass
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-forest py-3.5 text-sm font-semibold shadow-xs"
          >
            {isSubmitting ? (
              <span>Confirming Reservation...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Confirm Studio Reservation (₹{total.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
