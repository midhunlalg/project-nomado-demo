import { useState, useEffect } from 'react';
import { X, Search, Calendar, MapPin, Sparkles, CheckCircle2, Ticket, Clock, Download, ArrowRight } from 'lucide-react';
import type { Booking } from '../types';
import { api } from '../services/api';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  initialEmail = ''
}) => {
  const [emailInput, setEmailInput] = useState(initialEmail || '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load all or initial search
      handleSearch(initialEmail);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (emailToQuery = emailInput) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await api.getBookings(emailToQuery.trim() || undefined);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-auto shadow-2xl border border-stone-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-stone-200 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs font-semibold mb-1.5">
              <Ticket className="w-3.5 h-3.5" />
              <span>Digital Passes & Passports</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-stone-900">
              My Bookings
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Stored in Azure Table Storage. Retrieve your workspace passes from anywhere in the world.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Email Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by your email or leave empty to view all..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="input-outsite w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-forest px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-xs"
            >
              {isLoading ? 'Searching...' : 'Find Passes'}
            </button>
          </form>

          {/* Bookings List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-[#1B3B36] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500">Querying Azure Table Storage for passes...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#FAFAF8] border border-dashed border-stone-300">
              <Ticket className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h4 className="font-semibold text-stone-700 text-sm">No passes found</h4>
              <p className="text-xs text-stone-500 mt-1">
                {hasSearched ? 'Try checking with another email address.' : 'Book a day pass from any workspace to view it here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 sm:p-6 rounded-2xl border border-stone-200 bg-[#FAFAF8] hover:bg-white transition-all shadow-2xs hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#1B3B36] bg-[#EBF0ED] px-2.5 py-0.5 rounded-full">
                          {b.id}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">
                          {b.tier} PASS
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{b.status}</span>
                        </span>
                      </div>
                      <h4 className="font-editorial text-xl font-normal text-stone-900">
                        {b.spaceName}
                      </h4>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{b.city}, Kerala</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-stone-900">
                        ₹{b.totalPrice.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Pass for: {b.guestName}
                      </div>
                    </div>
                  </div>

                  {/* Booking details bar */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-stone-700 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Valid: {b.bookingDate}</span>
                      </span>

                      {b.isPremium && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>{b.premiumSeatType || 'Premium Seat'}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500">
                      Email: {b.guestEmail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
