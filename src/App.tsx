import { useState, useEffect } from 'react';
import {
  Building2,
  Tv,
  Calendar,
  Palmtree,
  Wifi
} from 'lucide-react';
import type {
  CoworkingSpace,
  MeetingRoom,
  Activity,
  WorkationPackage,
  Partner,
  NaturalLanguageSearchResult,
  CreateCoworkingSpacePayload
} from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { SpaceCard } from './components/SpaceCard';
import { SpaceDetailPage } from './components/SpaceDetailPage';
import { MeetingRoomCard } from './components/MeetingRoomCard';
import { MeetingRoomModal } from './components/MeetingRoomModal';
import { ActivityCard } from './components/ActivityCard';
import { WorkationCard } from './components/WorkationCard';
import { WorkationModal } from './components/WorkationModal';
import { PartnerPortal } from './components/PartnerPortal';
import { SpaceOwnerPortal } from './components/SpaceOwnerPortal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { CreateSpaceModal } from './components/CreateSpaceModal';
import { NotificationToast } from './components/NotificationToast';
import type { ToastMessage } from './components/NotificationToast';
import { Footer } from './components/Footer';

export function App() {
  // Navigation State
  const [activeMode, setActiveMode] = useState<'explorer' | 'partner' | 'owner'>('explorer');
  const [activeTab, setActiveTab] = useState<'spaces' | 'meeting-rooms' | 'activities' | 'workations'>('spaces');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);

  // Backend Health
  const [apiConnected, setApiConnected] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<string>('Connecting...');

  // Data State
  const [spaces, setSpaces] = useState<CoworkingSpace[]>([]);
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [workations, setWorkations] = useState<WorkationPackage[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Filters for spaces
  const [minWifiSpeed, setMinWifiSpeed] = useState<number>(0);
  const [selectedAmenityFilter, setSelectedAmenityFilter] = useState<string>('');

  // AI Natural Language Search State
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [aiSearchResult, setAiSearchResult] = useState<NaturalLanguageSearchResult | null>(null);

  // Space Page & Modals
  const [selectedSpacePage, setSelectedSpacePage] = useState<CoworkingSpace | null>(null);
  const [selectedRoomModal, setSelectedRoomModal] = useState<MeetingRoom | null>(null);
  const [selectedWorkationModal, setSelectedWorkationModal] = useState<WorkationPackage | null>(null);
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Initial Data Load
  useEffect(() => {
    checkHealthAndLoadData();
  }, []);

  // Reload filtered items when city changes
  useEffect(() => {
    if (!aiSearchResult) {
      loadCityScopedData(selectedCity);
    }
  }, [selectedCity]);

  const checkHealthAndLoadData = async () => {
    setIsLoadingData(true);
    const health = await api.checkHealth();
    setApiConnected(health.connected);
    setApiStatus(health.status);

    try {
      const [allSpaces, allRooms, allActivities, allWorkations, allPartners] = await Promise.all([
        api.getSpaces(),
        api.getMeetingRooms(),
        api.getActivities(),
        api.getWorkations(),
        api.getPartners()
      ]);
      setSpaces(allSpaces);
      setRooms(allRooms);
      setActivities(allActivities);
      setWorkations(allWorkations);
      setPartners(allPartners);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadCityScopedData = async (city: string) => {
    setIsLoadingData(true);
    try {
      const [citySpaces, cityActivities, cityWorkations] = await Promise.all([
        api.getSpaces(city),
        api.getActivities(city),
        api.getWorkations(city)
      ]);
      setSpaces(citySpaces);
      setActivities(cityActivities);
      setWorkations(cityWorkations);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle AI Search Execution
  const handleAiSearch = async (query: string) => {
    setIsSearching(true);
    setSelectedSpacePage(null);
    try {
      const result = await api.searchNaturalLanguage(query);
      setAiSearchResult(result);
      if (result.parsedIntent?.city) {
        setSelectedCity(result.parsedIntent.city);
      }
      setActiveTab('spaces');
      addToast(
        'success',
        'Kerala Hubs Matched',
        `Discovered ${result.results.length} spaces matching "${query}".`
      );
    } catch {
      addToast('error', 'Search Error', 'Could not parse intent. Showing standard catalog.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearAiSearch = () => {
    setAiSearchResult(null);
    setSelectedSpacePage(null);
    loadCityScopedData(selectedCity);
  };

  // Action Handlers
  const handleActivityRsvp = async (activity: Activity) => {
    try {
      const updated = await api.registerForActivity(activity.city, activity.id);
      setActivities(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      );
      addToast(
        'success',
        "You're on the Guestlist! 🎟️",
        `Confirmed for "${activity.title}". Digital pass ready.`
      );
    } catch {
      addToast('error', 'Registration Failed', 'Seats may be full or network unreachable.');
    }
  };

  const handleBookDayPass = (
    spaceName: string,
    date: string,
    tier: string,
    isPremium?: boolean,
    premiumSeatType?: string
  ) => {
    addToast(
      'success',
      isPremium ? 'Premium Pass Reserved ✦' : 'Pass Reserved',
      `${tier} pass for "${spaceName}" on ${date} confirmed${
        isPremium ? ` with ${premiumSeatType}` : ''
      }. Saved to Azure Table Storage.`
    );
  };

  const handleReserveRoom = (roomName: string, hours: number, total: number) => {
    addToast(
      'success',
      'Studio Reserved ✦',
      `"${roomName}" reserved for ${hours} hours (Total: ₹${total.toLocaleString()}). Saved to Azure Table Storage.`
    );
  };

  const handleInquireWorkation = (title: string, groupSize: number, teamName: string) => {
    addToast(
      'success',
      'Retreat Inquiry Sent',
      `Inquiry for ${teamName} (${groupSize} guests) on "${title}" sent to our Kerala retreat curator.`
    );
  };

  const handleCreateSpace = async (payload: CreateCoworkingSpacePayload) => {
    try {
      const newSpace = await api.createSpace(payload);
      setSpaces(prev => [newSpace, ...prev]);
      addToast(
        'success',
        'Workspace Listed',
        `"${newSpace.name}" in ${newSpace.city}, Kerala is now live on deskIndo.`
      );
    } catch {
      addToast('error', 'Error Listing Space', 'Could not save space to the API.');
    }
  };

  const handlePartnerRegistered = (newPartner: Partner) => {
    setPartners(prev => [...prev, newPartner]);
    addToast(
      'success',
      'Host Registered',
      `Welcome ${newPartner.companyName}! You can now manage your locations across Kerala.`
    );
  };

  // Filter logic for Spaces
  const filteredSpaces = spaces.filter(space => {
    if (minWifiSpeed > 0 && space.verifiedWifiSpeedMbps < minWifiSpeed) {
      return false;
    }
    if (selectedAmenityFilter && !space.amenities.includes(selectedAmenityFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1918]">
      {/* Outsite-Style Navigation Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setSelectedSpacePage(null);
          if (aiSearchResult) setAiSearchResult(null);
        }}
        activeMode={activeMode}
        onToggleMode={(mode) => {
          setActiveMode(mode);
          setSelectedSpacePage(null);
        }}
        onOpenCreateSpace={() => setIsCreateSpaceOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        apiConnected={apiConnected}
        apiStatus={apiStatus}
      />

      {/* Dedicated Space Page View (When a Space is Clicked) */}
      {selectedSpacePage ? (
        <main className="flex-1">
          <SpaceDetailPage
            space={selectedSpacePage}
            activities={activities}
            rooms={rooms}
            onBack={() => {
              setSelectedSpacePage(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookPass={handleBookDayPass}
            onActivityRsvp={handleActivityRsvp}
            onReserveRoom={setSelectedRoomModal}
          />
        </main>
      ) : activeMode === 'owner' ? (
        /* SPACE OWNER PORTAL VIEW (Unique Username & Password per space) */
        <main className="flex-1">
          <SpaceOwnerPortal />
        </main>
      ) : activeMode === 'partner' ? (
        /* HOST / PARTNER PORTAL VIEW */
        <PartnerPortal
          partners={partners}
          onOpenCreateSpace={() => setIsCreateSpaceOpen(true)}
          onPartnerRegistered={handlePartnerRegistered}
        />
      ) : (
        /* NOMAD EXPLORER VIEW */
        <main className="flex-1">
          {/* Outsite-Style Hero with AI Integration (Pitched for Kerala) */}
          <HeroSearch
            onSearch={handleAiSearch}
            isLoading={isSearching}
            activeIntent={aiSearchResult?.parsedIntent}
            onClearSearch={handleClearAiSearch}
          />

          {/* Navigation Category Tabs */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5DF] pb-4">
              {/* Tab Navigation (Larger Pill Style) */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setActiveTab('spaces')}
                  className={`flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                    activeTab === 'spaces'
                      ? 'bg-[#1B3B36] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Coworking Spaces</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'spaces' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {spaces.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('meeting-rooms')}
                  className={`flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                    activeTab === 'meeting-rooms'
                      ? 'bg-[#1B3B36] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>Meeting Studios</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'meeting-rooms' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {rooms.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('workations')}
                  className={`flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                    activeTab === 'workations'
                      ? 'bg-[#1B3B36] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Palmtree className="w-4 h-4" />
                  <span>Curated Retreats</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'workations' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {workations.length}
                  </span>
                </button>

                {/* Community & Events Tab */}
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                    activeTab === 'activities'
                      ? 'bg-[#1B3B36] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Community & Events</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {activities.length}
                  </span>
                </button>
              </div>

              {/* Sub-Filters (When viewing Coworking Spaces) */}
              {activeTab === 'spaces' && !aiSearchResult && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-sm text-stone-500">
                    <Wifi className="w-4 h-4 text-stone-400" />
                    <select
                      value={minWifiSpeed}
                      onChange={(e) => setMinWifiSpeed(Number(e.target.value))}
                      className="input-outsite p-2 text-xs sm:text-sm bg-white text-stone-700 font-semibold"
                    >
                      <option value={0}>Any Verified Wifi</option>
                      <option value={300}>300+ Mbps</option>
                      <option value={500}>500+ Mbps Fiber</option>
                      <option value={900}>1 Gbps Gigabit</option>
                    </select>
                  </div>

                  <select
                    value={selectedAmenityFilter}
                    onChange={(e) => setSelectedAmenityFilter(e.target.value)}
                    className="input-outsite p-2 text-xs sm:text-sm bg-white text-stone-700 font-semibold"
                  >
                    <option value="">All Amenities</option>
                    <option value="StandingDesks">Standing Desks</option>
                    <option value="PrivatePhoneBooths">Phone Booths</option>
                    <option value="SeaViewTerrace">Sea View Terrace</option>
                    <option value="SpecialtyCoffee">Filter Coffee & Espresso</option>
                    <option value="24/7Access">24/7 Access</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB CONTENTS */}
            {isLoadingData ? (
              <div className="py-24 text-center">
                <div className="inline-block w-9 h-9 border-3 border-stone-200 border-t-[#1B3B36] rounded-full animate-spin mb-4" />
                <div className="text-sm uppercase tracking-wider text-stone-500 font-semibold">
                  Loading Kerala Remote Network...
                </div>
              </div>
            ) : (
              <div className="pt-8">
                {/* 1. COWORKING SPACES TAB */}
                {activeTab === 'spaces' && (
                  <div>
                    {aiSearchResult ? (
                      <div>
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                            AI Recommended Workspaces ({aiSearchResult.results.length})
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {aiSearchResult.results.map((res) => {
                            const matchedSpace = spaces.find(s => s.id === res.id) || spaces[0];
                            return (
                              <SpaceCard
                                key={res.id}
                                space={matchedSpace}
                                onSelect={(sp) => {
                                  setSelectedSpacePage(sp);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                matchExplanation={res.matchExplanation}
                                relevanceScore={res.relevanceScore}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ) : filteredSpaces.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSpaces.map((space) => (
                          <SpaceCard
                            key={space.id}
                            space={space}
                            onSelect={(sp) => {
                              setSelectedSpacePage(sp);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-16 card-outsite bg-white text-center">
                        <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                        <h4 className="font-editorial text-2xl sm:text-3xl text-[#1A1918]">
                          No spaces match your active filters
                        </h4>
                        <p className="text-sm text-stone-500 mt-2 mb-6">
                          Try adjusting your wifi speed filter or exploring all Kerala destination hubs.
                        </p>
                        <button
                          onClick={() => {
                            setMinWifiSpeed(0);
                            setSelectedAmenityFilter('');
                            setSelectedCity('All');
                          }}
                          className="btn-forest text-sm px-6 py-2.5 font-semibold"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. MEETING ROOMS TAB */}
                {activeTab === 'meeting-rooms' && (
                  <div>
                    <div className="mb-6 text-sm text-stone-500 font-medium">
                      Acoustic boardrooms, ocean-facing video studios, and podcast recording booths with 4K AV setups.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {rooms.map((room) => (
                        <MeetingRoomCard
                          key={room.id}
                          room={room}
                          onReserve={setSelectedRoomModal}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. COMMUNITY & EVENTS TAB (OUTSITE ELEGANT HOSPITALITY STYLE) */}
                {activeTab === 'activities' && (
                  <div>
                    {/* Refined Section Intro */}
                    <div className="p-8 sm:p-10 card-outsite bg-white rounded-3xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold mb-2.5">
                          <span>✦ Kerala Remote Community & Events</span>
                        </div>
                        <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918]">
                          Connect, Collaborate & Unwind
                        </h3>
                        <p className="text-base font-normal text-stone-600 mt-2 max-w-2xl leading-relaxed">
                          Weekly rooftop chai socials, Varkala cliff dawn surf sessions, and AI engineer meetups across Kerala. Instant guestlist RSVP.
                        </p>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-stone-100 text-stone-700 self-start md:self-auto whitespace-nowrap">
                        {activities.length} Events this week
                      </div>
                    </div>

                    {/* Playful Ticket Stubs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                      {activities.map((act) => (
                        <ActivityCard
                          key={act.id}
                          activity={act}
                          onRsvp={handleActivityRsvp}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. WORKATIONS TAB */}
                {activeTab === 'workations' && (
                  <div>
                    <div className="mb-6 text-sm text-stone-500 font-medium">
                      Curated group workations and villa retreats for remote startups, distributed engineering teams, and nomad collectives across Kerala.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {workations.map((workation) => (
                        <WorkationCard
                          key={workation.id}
                          workation={workation}
                          onInquire={setSelectedWorkationModal}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      )}

      {/* MODALS */}
      <MeetingRoomModal
        room={selectedRoomModal}
        onClose={() => setSelectedRoomModal(null)}
        onConfirm={handleReserveRoom}
      />

      <WorkationModal
        workation={selectedWorkationModal}
        onClose={() => setSelectedWorkationModal(null)}
        onSubmit={handleInquireWorkation}
      />

      <CreateSpaceModal
        isOpen={isCreateSpaceOpen}
        onClose={() => setIsCreateSpaceOpen(false)}
        partners={partners}
        onSubmit={handleCreateSpace}
      />

      {/* Nomad My Bookings Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
      />

      {/* Notifications Toast Bar */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
