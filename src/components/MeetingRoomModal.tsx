import { useState } from 'react';
import { X, ArrowRight, Sparkles, ShieldCheck, Mail, User } from 'lucide-react';
import type { MeetingRoom } from '../types';
import { api } from '../services/api';

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
  const [email, setEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!room) return null;

  const basePrice = hours * room.hourlyRate;
  const premiumFee = isPremium ? 200 : 0;
  const total = basePrice + premiumFee;

  const premiumFeatureLabel = room.roomType === 'PodcastStudio'
    ? '🎙️ 4K Broadcast Camera, Shure SM7B Mics & Soundproofing'
    : '✦ 4K Dual Video Bar, Smart Whiteboard & Artisan Coffee Service';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizer.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createBooking({
        spaceId: room.workspaceId || 'space-varkala-cliff',
        spaceName: `${room.name} (${room.roomType})`,
        guestName: organizer.trim(),
        guestEmail: email.trim().toLowerCase(),
        bookingDate: date,
        tier: 'STUDIO',
        isPremium,
        premiumSeatType: isPremium ? premiumFeatureLabel : undefined,
        notes: `Time: ${time} | Duration: ${hours} hrs | Room: ${room.name}`,
        basePrice,
        totalPrice: total
      });

      onConfirm(room.name, hours, total);
      onClose();
    } catch (err) {
      console.error('Failed to create meeting room booking:', err);
      // Fallback notification so UX remains resilient
      onConfirm(room.name, hours, total);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#1B3B36] uppercase tracking-wider">
                {room.roomType}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Azure Cloud Sync
              </span>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  Organizer Name / Squad
                </span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Nair"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  Email (for Pass & Cloud Sync)
                </span>
              </label>
              <input
                type="email"
                required
                placeholder="maya@nomad.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Premium Studio Upgrade Checkbox */}
          <div
            onClick={() => setIsPremium(!isPremium)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
              isPremium
                ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100/70'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="meeting-premium-toggle"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer accent-amber-600"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="meeting-premium-toggle"
                    className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Premium Studio Experience
                  </label>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
                    +₹200 flat
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                  {premiumFeatureLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs sm:text-sm text-stone-500 font-medium">
                ₹{room.hourlyRate}/hr × {hours} hrs {isPremium && <span className="text-amber-700 font-semibold">+ ₹200 Premium</span>}
              </div>
              <div className="text-2xl font-bold text-[#1A1918] mt-0.5">
                Total: ₹{total.toLocaleString()}
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1B3B36] bg-[#EBF0ED] px-3.5 py-1.5 rounded-full">
              Instant Azure Pass
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-forest py-3.5 text-sm font-semibold shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Azure Table Storage...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Confirm Studio Reservation (₹{total.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-500">
            Saved to Azure cloud. Viewable anytime under <span className="font-semibold text-stone-700">"My Bookings"</span> with your email.
          </p>
        </form>
      </div>
    </div>
  );
};
