import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Wifi,
  Star,
  Users,
  Clock,
  ShieldCheck,
  Check,
  Plane,
  Car,
  Train,
  Bus,
  ExternalLink,
  Navigation,
  Copy,
  Calendar,
  Share2,
  Coffee,
  Sparkles,
  Zap,
  CheckCircle2,
  Tv,
  ArrowRight
} from 'lucide-react';
import type { CoworkingSpace, Activity, MeetingRoom, Booking } from '../types';
import { getTransitInfoForSpace, getProximityHighlights } from '../services/transitData';
import { api } from '../services/api';

interface SpaceDetailPageProps {
  space: CoworkingSpace;
  activities: Activity[];
  rooms: MeetingRoom[];
  onBack: () => void;
  onBookPass: (spaceName: string, date: string, tier: string, isPremium?: boolean, premiumSeatType?: string) => void;
  onActivityRsvp: (activity: Activity) => void;
  onReserveRoom?: (room: MeetingRoom) => void;
}

export const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({
  space,
  activities,
  rooms,
  onBack,
  onBookPass,
  onActivityRsvp,
  onReserveRoom
}) => {
  // Booking widget state
  const [selectedTier, setSelectedTier] = useState<'daily' | 'hourly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Transit & Location data
  const transitInfo = getTransitInfoForSpace(space);
  const proximityHighlights = getProximityHighlights(space);

  // Filter activities for this space or city
  const nearbyActivities = activities.filter(
    (act) =>
      (act.workspaceId && act.workspaceId === space.id) ||
      act.city.toLowerCase() === space.city.toLowerCase()
  );

  // Filter meeting rooms belonging to this space
  const spaceRooms = rooms.filter((r) => r.workspaceId === space.id);

  // Pricing calculations
  const dailyPrice = space.pricing.dailyPrice || 450;
  const hourlyPrice = space.pricing.hourlyPrice || 80;
  const monthlyPrice = space.pricing.monthlyPrice || 6500;

  const currentPrice =
    selectedTier === 'daily'
      ? dailyPrice
      : selectedTier === 'hourly'
      ? hourlyPrice
      : monthlyPrice;

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
  const premiumFee = isPremium
    ? (selectedTier === 'hourly' ? 30 : selectedTier === 'monthly' ? 1200 : 150)
    : 0;
  const totalDue = currentPrice + premiumFee;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const booking = await api.createBooking({
        spaceId: space.id,
        spaceName: space.name,
        guestName,
        guestEmail,
        bookingDate: selectedDate,
        tier: selectedTier.toUpperCase() as 'DAILY' | 'HOURLY' | 'MONTHLY',
        isPremium,
        premiumSeatType: isPremium ? premiumSeatView : undefined
      });
      setConfirmedBooking(booking);
      setBookingConfirmed(true);
      onBookPass(space.name, selectedDate, selectedTier.toUpperCase(), isPremium, premiumSeatView);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${space.address}, ${space.city}, Kerala, India`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${space.location.latitude}, ${space.location.longitude}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${space.name} - deskIndo Kerala`,
        text: `Check out ${space.name} in ${space.city}, Kerala on deskIndo.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const images = space.imageUrls && space.imageUrls.length > 0
    ? space.imageUrls
    : [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80'
      ];

  const lat = space.location.latitude;
  const lng = space.location.longitude;

  return (
    <div className="bg-[#FBF9F5] min-h-screen pb-20">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-[#E7E5DF] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1B3B36] hover:text-[#142d29] px-3.5 py-1.5 rounded-full bg-[#EBF0ED] hover:bg-[#dfe6e2] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back to all spaces</span>
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-stone-500">
              <span>/</span>
              <span>Kerala</span>
              <span>/</span>
              <span className="font-medium text-stone-700">{space.city}</span>
              <span>/</span>
              <span className="font-semibold text-stone-900 truncate max-w-xs">{space.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 sm:px-3.5 sm:py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Share workspace"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3.5 sm:py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#1B3B36]" />
              <span className="hidden sm:inline">Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* HERO TITLE & ADDRESS */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{space.city}, Kerala</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200/60">
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Verified Dual Fiber SLA</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs sm:text-sm font-semibold border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{space.rating} ({space.reviewCount} nomad reviews)</span>
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A1918] leading-tight">
            {space.name}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-stone-600 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1B3B36] shrink-0" />
              <span>{space.address}, {space.city}, Kerala, India</span>
              <button
                onClick={handleCopyAddress}
                className="text-xs text-[#1B3B36] font-semibold hover:underline flex items-center gap-1 ml-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAddress ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-6 text-xs sm:text-sm text-stone-500 font-medium">
              <a href="#experiences" className="hover:text-[#1B3B36] transition-colors">
                ✦ Nearby Experiences ({nearbyActivities.length})
              </a>
              <a href="#how-to-reach" className="hover:text-[#1B3B36] transition-colors">
                ✈️ How to Reach
              </a>
              <a href="#location" className="hover:text-[#1B3B36] transition-colors">
                📍 Map & Neighborhood
              </a>
            </div>
          </div>
        </div>

        {/* IMAGE GALLERY MOSAIC (OUTSITE EDITORIAL STYLE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 rounded-3xl overflow-hidden card-outsite bg-white p-2">
          {/* Main Large Image */}
          <div className="md:col-span-2 relative h-72 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden bg-stone-100 group">
            <img
              src={images[activeImageIdx] || images[0]}
              alt={space.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-xs sm:text-sm font-semibold text-[#1A1918] shadow-xs">
                <Wifi className="w-4 h-4 text-[#1B3B36]" />
                <span>{space.verifiedWifiSpeedMbps} Mbps Tested Fiber</span>
              </span>
            </div>
          </div>

          {/* Secondary Images or Amenity Highlight */}
          <div className="flex flex-col gap-4 h-full">
            <div
              className={`relative h-44 sm:h-52 md:h-[218px] rounded-2xl overflow-hidden bg-stone-100 cursor-pointer border-2 transition-all ${
                activeImageIdx === 1 ? 'border-[#1B3B36]' : 'border-transparent'
              }`}
              onClick={() => setActiveImageIdx(images[1] ? 1 : 0)}
            >
              <img
                src={images[1] || images[0]}
                alt={`${space.name} preview`}
                className="w-full h-full object-cover hover:scale-103 transition-transform"
              />
              <div className="absolute inset-0 bg-black/15 hover:bg-transparent transition-colors" />
            </div>

            <div className="relative h-44 sm:h-52 md:h-[218px] rounded-2xl overflow-hidden bg-[#1B3B36] text-white p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                  Kerala Remote Hub
                </span>
                <h4 className="font-editorial text-2xl font-normal mt-1 leading-snug">
                  Curated for focused work & deep flow
                </h4>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-200 pt-3 border-t border-white/15">
                <span>{space.capacity} Desks available</span>
                <span>{space.operatingHours.is247 ? '24/7 Access' : space.operatingHours.daysOpen}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT 2 COLUMNS: Overview, Experiences, How to Reach, Location */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* OVERVIEW & DESCRIPTION */}
            <section id="overview" className="card-outsite bg-white p-7 sm:p-9">
              <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] mb-4">
                About this Workspace
              </h2>
              <p className="text-stone-700 text-base sm:text-lg leading-relaxed mb-8">
                {space.description}
              </p>

              {/* Quick Stat Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
                <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Capacity</div>
                  <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-[#1B3B36]" />
                    <span>{space.capacity} Desks</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Hours</div>
                  <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-[#1B3B36]" />
                    <span>{space.operatingHours.is247 ? '24/7 Access' : space.operatingHours.daysOpen}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Internet</div>
                  <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                    <Wifi className="w-4 h-4 text-[#1B3B36]" />
                    <span>{space.verifiedWifiSpeedMbps} Mbps</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-2xl">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Power</div>
                  <div className="text-base sm:text-lg font-semibold text-stone-900 flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4 text-[#1B3B36]" />
                    <span>100% Backup</span>
                  </div>
                </div>
              </div>

              {/* Verified Amenities */}
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">
                Verified Amenities & Facilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {space.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F6F1] border border-stone-200/80 text-stone-800 text-sm font-medium"
                  >
                    <Check className="w-4 h-4 text-[#1B3B36] stroke-[2.5] shrink-0" />
                    <span>{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* MEETING ROOMS IN THIS SPACE (IF ANY) */}
            {spaceRooms.length > 0 && (
              <section className="card-outsite bg-white p-7 sm:p-9">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      On-site Studios
                    </span>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                      Meeting Rooms & Call Booths
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-600">
                    {spaceRooms.length} available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spaceRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-[#FBF9F5] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                          <span className="font-semibold text-[#1B3B36]">{room.roomType}</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>Up to {room.capacity} seats</span>
                          </span>
                        </div>
                        <h4 className="font-editorial text-xl font-normal text-stone-900 mb-1.5">
                          {room.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-3">
                          {room.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {room.equipment.map((eq, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-200/80">
                        <div className="text-sm font-bold text-stone-900">
                          ₹{room.hourlyRate.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ hour</span>
                        </div>
                        {onReserveRoom && (
                          <button
                            onClick={() => onReserveRoom(room)}
                            className="btn-forest text-xs px-3.5 py-1.5 font-semibold"
                          >
                            <span>Reserve</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================================= */}
            {/* SECTION 1: EXPERIENCES & ACTIVITIES NEARBY */}
            {/* ========================================================================= */}
            <section id="experiences" className="card-outsite bg-white p-7 sm:p-9 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#1B3B36]" />
                    <span>Section 1 • deskIndo Community</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                    Experiences & Activities Nearby
                  </h2>
                  <p className="text-stone-600 text-sm sm:text-base mt-1">
                    Curated social mixers, dawn surf sessions, and tech circles happening around {space.city}.
                  </p>
                </div>

                <div className="text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-700 self-start sm:self-auto">
                  {nearbyActivities.length} Events Scheduled
                </div>
              </div>

              {nearbyActivities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {nearbyActivities.map((act) => {
                    const eventDate = new Date(act.startTime).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    });
                    const eventTime = new Date(act.startTime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    const availableSpots = act.maxParticipants - act.currentParticipants;

                    return (
                      <div
                        key={act.id}
                        className="rounded-2xl border border-stone-200 bg-[#FBF9F5] p-5 sm:p-6 flex flex-col justify-between hover:border-stone-300 transition-all group"
                      >
                        <div>
                          {/* Category & Status */}
                          <div className="flex items-center justify-between text-xs font-semibold mb-3">
                            <span className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[#1B3B36]">
                              {act.category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-stone-500">
                              {availableSpots > 0 ? `${availableSpots} spots left` : 'Guestlist Full'}
                            </span>
                          </div>

                          <h3 className="font-editorial text-xl sm:text-2xl font-normal text-stone-900 group-hover:text-[#1B3B36] transition-colors leading-snug mb-2">
                            {act.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
                            {act.description}
                          </p>

                          {/* Event Metadata */}
                          <div className="space-y-1.5 mb-5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200/60">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#1B3B36]" />
                              <span className="font-medium text-stone-900">{eventDate} • {eventTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{act.locationName}, {act.city}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & RSVP */}
                        <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                              Entry Pass
                            </div>
                            <div className="text-base sm:text-lg font-bold text-stone-900">
                              {act.price === 0 ? 'FREE' : `₹${act.price.toLocaleString()}`}
                            </div>
                          </div>

                          <button
                            onClick={() => onActivityRsvp(act)}
                            className="btn-forest text-xs sm:text-sm px-4 py-2 font-semibold shadow-xs"
                          >
                            <span>RSVP / Pass</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FBF9F5] rounded-2xl border border-stone-200">
                  <Coffee className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <h4 className="font-editorial text-xl text-stone-900">
                    No scheduled meetups in {space.city} today
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                    deskIndo residents host informal chai chats and sunset sessions daily. Drop into the workspace lounge to connect!
                  </p>
                </div>
              )}

              {/* Nomad Community Note */}
              <div className="mt-6 p-4 rounded-2xl bg-[#EBF0ED]/70 border border-[#1B3B36]/15 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1B3B36] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <span className="font-semibold text-[#1B3B36]">deskIndo Resident Access:</span> All day pass holders and residents get free priority access to community mixers, founder circles, and weekend excursions.
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 2: HOW TO REACH (AIRPORT, TAXI KMS, BUS INFO) */}
            {/* ========================================================================= */}
            <section id="how-to-reach" className="card-outsite bg-white p-7 sm:p-9 scroll-mt-20">
              <div className="mb-6 pb-4 border-b border-stone-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs font-semibold mb-2">
                  <Plane className="w-3.5 h-3.5 text-[#1B3B36]" />
                  <span>Section 2 • Transit & Connectivity</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                  How to Reach {space.name}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-1">
                  Accurate airport distances, taxi fares in ₹ INR, railway links, and Kerala public transit advice.
                </p>
              </div>

              {/* 4 Structured Transit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                
                {/* 1. Nearest Airport */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-[#FBF9F5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#1B3B36]">
                        <Plane className="w-3.5 h-3.5" />
                        <span>Nearest Airport</span>
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#1B3B36] text-white">
                        {transitInfo.nearestAirport.code}
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-normal text-stone-900 mb-1">
                      {transitInfo.nearestAirport.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-stone-700 my-2.5">
                      <div className="flex items-center gap-1 text-[#1B3B36]">
                        <span>📍 {transitInfo.nearestAirport.distanceKm} km</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{transitInfo.nearestAirport.travelTime}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                      {transitInfo.nearestAirport.notes}
                    </p>
                  </div>
                </div>

                {/* 2. Prepaid Taxi & Cabs (Taxi Kms & INR Fares) */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-[#FBF9F5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#1B3B36]">
                        <Car className="w-3.5 h-3.5" />
                        <span>Taxi & Cab Guidance</span>
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        Airport to Doorstep
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-normal text-stone-900 mb-1">
                      Estimated Fare: <span className="font-bold text-[#1B3B36]">{transitInfo.taxiFare.estimatedInr}</span>
                    </h3>

                    <div className="text-xs font-semibold text-stone-500 my-2">
                      Distance: <span className="text-stone-800">{transitInfo.nearestAirport.distanceKm} km direct drive</span>
                    </div>

                    <div className="space-y-2 mt-3 text-xs sm:text-sm text-stone-600">
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200/80">
                        <span className="font-semibold text-stone-800">Prepaid Counter: </span>
                        {transitInfo.taxiFare.prepaidInfo}
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-stone-200/80">
                        <span className="font-semibold text-stone-800">Ride Hailing: </span>
                        {transitInfo.taxiFare.rideHailing}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Nearest Railway Station */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-[#FBF9F5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#1B3B36]">
                        <Train className="w-3.5 h-3.5" />
                        <span>Nearest Railway Station</span>
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                        {transitInfo.nearestRailway.code}
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-normal text-stone-900 mb-1">
                      {transitInfo.nearestRailway.name}
                    </h3>

                    <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-stone-700 my-2.5">
                      <div className="flex items-center gap-1 text-[#1B3B36]">
                        <span>📍 {transitInfo.nearestRailway.distanceKm} km</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{transitInfo.nearestRailway.travelTime}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                      {transitInfo.nearestRailway.connectivity}
                    </p>
                  </div>
                </div>

                {/* 4. Local Bus & Public Transit */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-[#FBF9F5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#1B3B36]">
                        <Bus className="w-3.5 h-3.5" />
                        <span>Local Bus & Auto Transit</span>
                      </span>
                      <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        KSRTC Network
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl font-normal text-stone-900 mb-2">
                      Public Buses & Auto Rickshaws
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
                      {transitInfo.localTransit.busInfo}
                    </p>

                    <div className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Auto Guidance: </span>
                      {transitInfo.localTransit.autoFareGuidance}
                    </div>

                    {transitInfo.localTransit.specialTransit && (
                      <div className="mt-2.5 p-2.5 bg-[#EBF0ED] rounded-xl text-xs text-[#1B3B36] font-medium">
                        ✦ <span className="font-semibold">Local Feature: </span>
                        {transitInfo.localTransit.specialTransit}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kerala Nomad Transit Pro-Tips */}
              <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B3B36] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1B3B36]" />
                  <span>Kerala Nomad Travel Tips</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 mt-2">
                  <div>
                    <span className="font-semibold text-stone-900 block mb-0.5">UPI Everywhere:</span>
                    Google Pay and PhonePe are accepted by 99% of auto drivers, roadside tea stalls, and local shops.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block mb-0.5">5G Mobile Network:</span>
                    Airtel and Jio 5G provide 200+ Mbps coverage along highway routes and coastal towns.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block mb-0.5">Train Bookings:</span>
                    Reserve Vande Bharat or Jan Shatabdi via IRCTC 2-3 days ahead during weekend holidays.
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 3: LOCATION & MAP SECTION */}
            {/* ========================================================================= */}
            <section id="location" className="card-outsite bg-white p-7 sm:p-9 scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs font-semibold mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#1B3B36]" />
                    <span>Section 3 • Geographic Location</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                    Location & Neighborhood Map
                  </h2>
                  <p className="text-stone-600 text-sm sm:text-base mt-1">
                    Exact coordinates, walking proximity to cafes & coast, and interactive navigation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCoords}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCoords ? 'Coords Copied' : `${lat.toFixed(3)}, ${lng.toFixed(3)}`}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-forest text-xs px-3.5 py-1.5 font-semibold flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>

              {/* Interactive OpenStreetMap Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 mb-8 bg-stone-100 shadow-inner">
                {/* Embedded Map */}
                <div className="w-full h-80 sm:h-96 relative">
                  <iframe
                    title={`Map of ${space.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012}%2C${lat - 0.012}%2C${lng + 0.012}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lng}`}
                    className="w-full h-full filter saturate-[0.9] contrast-[1.05]"
                  />

                  {/* Floating Location Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#1B3B36]">
                          Workspace Location
                        </div>
                        <h4 className="font-editorial text-lg font-normal text-stone-900 mt-0.5">
                          {space.name}
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          {space.address}, {space.city}, Kerala
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#1B3B36] text-white flex items-center justify-center shrink-0 hover:bg-[#142d29] transition-colors"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-4 h-4 stroke-[2]" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8F6F1] px-4 py-2 text-right border-t border-stone-200">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                  >
                    View larger OpenStreetMap
                  </a>
                </div>
              </div>

              {/* Neighborhood Proximity & Walking Highlights */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-4">
                  Walking Distance & Neighborhood Highlights
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {proximityHighlights.map((poi, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200/80 bg-[#FBF9F5] flex items-center gap-3"
                    >
                      <span className="text-2xl shrink-0">{poi.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                          {poi.label}
                        </div>
                        <div className="text-xs text-stone-500 font-medium">
                          {poi.distance}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY OUTSITE PASS RESERVATION WIDGET */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              
              {/* Main Pass Card */}
              <div className="card-outsite bg-white p-6 sm:p-7 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                      Pass Pricing
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-bold text-[#1A1918]">
                        ₹{currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-stone-500">
                        {selectedTier === 'daily' ? '/ day' : selectedTier === 'hourly' ? '/ hr' : '/ mo'}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5" />
                    <span>Instant Pass</span>
                  </span>
                </div>

                {/* Tier Switcher Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl my-5">
                  <button
                    type="button"
                    onClick={() => setSelectedTier('daily')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedTier === 'daily'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Day Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTier('hourly')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedTier === 'hourly'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Hourly
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTier('monthly')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedTier === 'monthly'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                {/* Form or Confirmation */}
                {bookingConfirmed ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-900 text-[11px] font-bold tracking-wider uppercase mb-1.5">
                      Ref: {confirmedBooking?.id || 'CONFIRMED'}
                    </div>
                    <h4 className="font-editorial text-xl font-normal text-emerald-950">
                      Digital Pass Confirmed!
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-800 mt-1.5">
                      Your {selectedTier.toUpperCase()} pass for <strong>{space.name}</strong> on <strong>{selectedDate}</strong> is saved to Azure Cloud.
                    </p>
                    {isPremium && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        <span>Premium Seat: {confirmedBooking?.premiumSeatType || premiumSeatView}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-emerald-700 mt-2">
                      You can view this booking anytime from any device using your email.
                    </p>
                    <button
                      onClick={() => setBookingConfirmed(false)}
                      className="mt-4 text-xs font-semibold text-emerald-900 underline cursor-pointer"
                    >
                      Book another pass
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                        Pass Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        className="input-outsite w-full p-2.5 text-sm bg-[#FBF9F5] text-stone-800 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        className="input-outsite w-full p-2.5 text-sm bg-[#FBF9F5] text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                        Nomad Email
                      </label>
                      <input
                        type="email"
                        placeholder="alex@remotecompany.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        className="input-outsite w-full p-2.5 text-sm bg-[#FBF9F5] text-stone-800"
                      />
                    </div>

                    {/* Premium Seat Checkbox */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 transition-all hover:border-amber-300">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isPremium}
                          onChange={(e) => setIsPremium(e.target.checked)}
                          className="mt-1 w-4 h-4 text-[#1B3B36] rounded border-stone-300 focus:ring-[#1B3B36] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              <span>Premium Seat</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">
                                {premiumSeatView}
                              </span>
                            </span>
                            <span className="text-xs font-bold text-[#1B3B36]">
                              +₹{selectedTier === 'hourly' ? '30' : selectedTier === 'monthly' ? '1,200' : '150'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                            Guaranteed window view desk ({premiumSeatView}) with dedicated power supply and filter coffee bar access.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
                      <div className="flex justify-between">
                        <span>Workspace Desk ({selectedTier})</span>
                        <span className="font-semibold text-stone-800">₹{currentPrice.toLocaleString()}</span>
                      </div>
                      {isPremium && (
                        <div className="flex justify-between text-amber-900 font-semibold">
                          <span className="flex items-center gap-1">✦ Premium Seat ({premiumSeatView})</span>
                          <span>+₹{premiumFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Fiber Wifi SLA & Filter Coffee</span>
                        <span className="text-emerald-700 font-medium">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Community Event Guestlist</span>
                        <span className="text-emerald-700 font-medium">Included</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                        <span>Total Due</span>
                        <span>₹{totalDue.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-forest w-full py-3.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Pass...</span>
                        </>
                      ) : (
                        <>
                          <span>Reserve Pass Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Assurance points */}
                <div className="mt-6 pt-5 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant digital pass confirmation to your email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Free cancellation up to 24 hours prior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unlimited artisanal South Indian filter coffee & tea</span>
                  </div>
                </div>
              </div>

              {/* Host Contact Box */}
              <div className="card-outsite bg-[#F8F6F1] p-5 rounded-2xl">
                <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1">
                  Verified Kerala Partner
                </div>
                <h4 className="font-editorial text-lg text-stone-900">
                  Local Community Host
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Have special team requirements or looking for long-term residential membership?
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#1B3B36]">
                  <span>On-site concierge: Available</span>
                  <span className="text-stone-400">Response &lt; 15 min</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
