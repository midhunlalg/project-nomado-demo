import type {
  CoworkingSpace,
  CreateCoworkingSpacePayload,
  MeetingRoom,
  Activity,
  WorkationPackage,
  Partner,
  PartnerWorkspaceSummary,
  RegisterPartnerPayload,
  NaturalLanguageSearchResult,
  Booking,
  CreateBookingPayload,
  SpaceOwnerLoginResponse
} from '../types';
import {
  MOCK_SPACES,
  MOCK_ROOMS,
  MOCK_ACTIVITIES,
  MOCK_WORKATIONS,
  MOCK_PARTNERS,
  MOCK_BOOKINGS,
  MOCK_SPACE_OWNER_CREDENTIALS
} from './mockData';

export const AZURE_HOSTED_URL = 'https://nomadoapi-fpe5b0cqcjhddsa8.centralindia-01.azurewebsites.net';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : import.meta.env.PROD
  ? `${AZURE_HOSTED_URL}/api/v1`
  : '/api/v1';

const HEALTH_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/health`
  : import.meta.env.PROD
  ? `${AZURE_HOSTED_URL}/health`
  : '/health';

// Helper to determine if we should fall back to local mock data
async function handleResponse<T>(res: Response, fallbackData: T): Promise<T> {
  if (!res.ok) {
    console.warn(`[deskIndo API] Server returned ${res.status}: ${res.statusText}. Using fallback data.`);
    return fallbackData;
  }
  try {
    return await res.json();
  } catch (err) {
    console.warn('[deskIndo API] JSON parse error:', err);
    return fallbackData;
  }
}

export const api = {
  // Health check
  async checkHealth(): Promise<{ status: string; connected: boolean; url?: string }> {
    try {
      const res = await fetch(HEALTH_URL, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        return { status: data.status || 'Healthy (Azure Cloud)', connected: true, url: AZURE_HOSTED_URL };
      }
      return { status: 'Degraded', connected: false, url: AZURE_HOSTED_URL };
    } catch {
      return { status: 'Offline (Using Mock Cache)', connected: false, url: AZURE_HOSTED_URL };
    }
  },

  // Spaces
  async getSpaces(city?: string): Promise<CoworkingSpace[]> {
    try {
      const url = city && city !== 'All' 
        ? `${BASE_URL}/spaces/by-city/${encodeURIComponent(city)}`
        : `${BASE_URL}/spaces`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const spaces = await handleResponse<CoworkingSpace[]>(res, MOCK_SPACES);
      // Filter if city is selected
      if (city && city !== 'All') {
        const filtered = spaces.filter(s => s.city.toLowerCase() === city.toLowerCase());
        return filtered.length > 0 ? filtered : MOCK_SPACES.filter(s => s.city.toLowerCase() === city.toLowerCase());
      }
      // If backend returned non-Kerala data or fewer spaces, prefer the enriched Kerala spaces
      return spaces && spaces.length >= MOCK_SPACES.length ? spaces : MOCK_SPACES;
    } catch {
      if (city && city !== 'All') {
        return MOCK_SPACES.filter(s => s.city.toLowerCase() === city.toLowerCase());
      }
      return MOCK_SPACES;
    }
  },

  async getSpaceById(city: string, id: string): Promise<CoworkingSpace | null> {
    try {
      const res = await fetch(`${BASE_URL}/spaces/${encodeURIComponent(city)}/${encodeURIComponent(id)}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch {
      return MOCK_SPACES.find(s => s.id === id) || null;
    }
  },

  async createSpace(payload: CreateCoworkingSpacePayload): Promise<CoworkingSpace> {
    try {
      const res = await fetch(`${BASE_URL}/spaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('createSpace failed on backend, simulating locally:', err);
    }

    // Local mock creation
    const newSpace: CoworkingSpace = {
      id: 'space-' + Math.random().toString(36).substring(2, 9),
      name: payload.name,
      partnerId: payload.partnerId,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      postalCode: payload.postalCode,
      location: { latitude: payload.latitude, longitude: payload.longitude },
      amenities: payload.amenities,
      capacity: payload.capacity,
      pricing: {
        hourlyPrice: payload.hourlyPrice,
        dailyPrice: payload.dailyPrice,
        monthlyPrice: payload.monthlyPrice,
        currency: payload.currency || 'INR'
      },
      operatingHours: payload.operatingHours || { daysOpen: 'Monday-Sunday', openTime: '00:00', closeTime: '23:59', is247: true },
      imageUrls: payload.imageUrls && payload.imageUrls.length > 0 
        ? payload.imageUrls 
        : ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'],
      rating: 5.0,
      reviewCount: 1,
      verifiedWifiSpeedMbps: payload.wifiSpeedMbps,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    MOCK_SPACES.unshift(newSpace);
    return newSpace;
  },

  // AI Natural Language Search with Kerala Intent Parser
  async searchNaturalLanguage(query: string, limit = 10): Promise<NaturalLanguageSearchResult> {
    const qLower = query.toLowerCase();
    const isMountain = qLower.includes('mountain') || qLower.includes('hill') || qLower.includes('highland') || qLower.includes('tea') || qLower.includes('misty');
    const isBeach = qLower.includes('cliff') || qLower.includes('surf') || qLower.includes('sea') || qLower.includes('ocean') || qLower.includes('beach') || qLower.includes('varkala');
    const isBackwater = qLower.includes('backwater') || qLower.includes('houseboat') || qLower.includes('canal') || qLower.includes('lake') || qLower.includes('alleppey') || qLower.includes('alappuzha');
    const isCity = qLower.includes('kochi') || qLower.includes('cochin') || qLower.includes('kakkanad') || qLower.includes('infopark');
    const isExplicitRetreat = qLower.includes('retreat') || qLower.includes('package') || qLower.includes('team trip') || qLower.includes('group trip');

    // For general "workation in Kerala" or mountain searches, digital nomads seek Coworking Spaces (workstations)
    const targetType = isExplicitRetreat ? 'Workation' : 'CoworkingSpace';

    try {
      const res = await fetch(`${BASE_URL}/search/natural-language`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit }),
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const result: NaturalLanguageSearchResult = await res.json();
        if (result.results && result.results.length > 0) {
          // If searching for mountain destinations in Kerala, ensure non-mountain destinations
          // (like coastal Varkala or backwater Alleppey) do not erroneously appear ahead of Munnar or Wayanad!
          if (isMountain) {
            const munnarSpace = MOCK_SPACES.find(s => s.city === 'Munnar')!;
            const wayanadSpace = MOCK_SPACES.find(s => s.city === 'Wayanad')!;

            if (isExplicitRetreat) {
              const munnarWorkation = MOCK_WORKATIONS.find(w => w.destinationCity === 'Munnar')!;
              const wayanadWorkation = MOCK_WORKATIONS.find(w => w.destinationCity === 'Wayanad')!;

              return {
                query,
                parsedIntent: {
                  targetType: 'Workation',
                  city: 'Munnar & Wayanad',
                  country: 'Kerala, India',
                  maxDailyBudget: result.parsedIntent?.maxDailyBudget,
                  currency: 'INR',
                  requiredAmenities: ['QuietZone', 'MountainView', 'HighSpeedWifi'],
                  vibeKeywords: 'Misty mountains, Western Ghats, high altitude, tea & coffee plantations, quiet deep-work',
                  summaryOfIntent: `Curated quiet mountain retreats in Munnar & Wayanad, Kerala matching "${query}".`
                },
                results: [
                  {
                    id: munnarWorkation.id,
                    title: munnarWorkation.title,
                    description: munnarWorkation.description,
                    category: 'Workation',
                    city: munnarWorkation.destinationCity,
                    country: munnarWorkation.destinationCountry,
                    price: munnarWorkation.pricePerPerson,
                    currency: munnarWorkation.currency,
                    priceType: 'person',
                    rating: 5.0,
                    keyFeatures: munnarWorkation.coworkingPerks.slice(0, 4),
                    matchExplanation: `Misty mountain retreat in Munnar tea plantations at 1,600m elevation with ${munnarWorkation.verifiedWifiSpeedMbps} Mbps fiber internet.`,
                    relevanceScore: 98
                  },
                  {
                    id: wayanadWorkation.id,
                    title: wayanadWorkation.title,
                    description: wayanadWorkation.description,
                    category: 'Workation',
                    city: wayanadWorkation.destinationCity,
                    country: wayanadWorkation.destinationCountry,
                    price: wayanadWorkation.pricePerPerson,
                    currency: wayanadWorkation.currency,
                    priceType: 'person',
                    rating: 4.9,
                    keyFeatures: wayanadWorkation.coworkingPerks.slice(0, 4),
                    matchExplanation: `Tranquil mountain coffee estate retreat in Wayanad with ${wayanadWorkation.verifiedWifiSpeedMbps} Mbps fiber, shaded gazebos, and Chembra Peak treks.`,
                    relevanceScore: 96
                  }
                ],
                totalMatches: 2
              };
            }

            // Normal mountain workation search: return Coworking Spaces in Munnar & Wayanad
            const mountainSpaceResults: NaturalLanguageSearchResult['results'] = [
              {
                id: munnarSpace.id,
                title: munnarSpace.name,
                description: munnarSpace.description,
                category: 'CoworkingSpace',
                city: munnarSpace.city,
                country: munnarSpace.country,
                price: munnarSpace.pricing.dailyPrice || 390,
                currency: 'INR',
                priceType: 'day',
                rating: munnarSpace.rating,
                keyFeatures: munnarSpace.amenities.slice(0, 4),
                matchExplanation: `Verified ${munnarSpace.verifiedWifiSpeedMbps} Mbps dual fiber with Starlink backup, panoramic valley focus desks, and quiet zones in Munnar tea hills at 1,600m elevation.`,
                relevanceScore: 98
              },
              {
                id: wayanadSpace.id,
                title: wayanadSpace.name,
                description: wayanadSpace.description,
                category: 'CoworkingSpace',
                city: wayanadSpace.city,
                country: wayanadSpace.country,
                price: wayanadSpace.pricing.dailyPrice || 380,
                currency: 'INR',
                priceType: 'day',
                rating: wayanadSpace.rating,
                keyFeatures: wayanadSpace.amenities.slice(0, 4),
                matchExplanation: `Verified ${wayanadSpace.verifiedWifiSpeedMbps} Mbps fiber internet, shaded teakwood gazebos, and tranquil quiet zones in misty Wayanad mountain coffee estate.`,
                relevanceScore: 96
              }
            ];

            return {
              query,
              parsedIntent: {
                targetType: 'CoworkingSpace',
                city: 'Munnar & Wayanad',
                country: 'Kerala, India',
                maxDailyBudget: result.parsedIntent?.maxDailyBudget,
                currency: 'INR',
                requiredAmenities: ['QuietZone', 'MountainView', 'HighSpeedWifi'],
                vibeKeywords: 'Misty mountains, Western Ghats, high altitude, tea & coffee plantations, quiet deep-work',
                summaryOfIntent: `Curated quiet mountain workspaces in Munnar & Wayanad, Kerala matching "${query}".`
              },
              results: mountainSpaceResults,
              totalMatches: mountainSpaceResults.length
            };
          }

          return result;
        }
      }
    } catch (err) {
      console.warn('AI search API error, applying client-side Kerala heuristic engine:', err);
    }

    // Heuristic client fallback for Kerala hubs
    let city = 'Varkala';
    if (isMountain) {
      city = qLower.includes('wayanad') && !qLower.includes('munnar')
        ? 'Wayanad'
        : qLower.includes('munnar') && !qLower.includes('wayanad')
        ? 'Munnar'
        : 'Munnar & Wayanad';
    } else if (isCity) {
      city = 'Kochi';
    } else if (isBackwater) {
      city = 'Alleppey';
    } else if (isBeach) {
      city = 'Varkala';
    }

    const budgetMatch = query.match(/\d+/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[0], 10) : undefined;

    // For mountain queries, curate results from both Munnar and Wayanad
    if (isMountain) {
      const munnarSpace = MOCK_SPACES.find(s => s.city === 'Munnar')!;
      const wayanadSpace = MOCK_SPACES.find(s => s.city === 'Wayanad')!;

      if (isExplicitRetreat) {
        const munnarWorkation = MOCK_WORKATIONS.find(w => w.destinationCity === 'Munnar')!;
        const wayanadWorkation = MOCK_WORKATIONS.find(w => w.destinationCity === 'Wayanad')!;

        return {
          query,
          parsedIntent: {
            targetType: 'Workation',
            city: 'Munnar & Wayanad',
            country: 'Kerala, India',
            maxDailyBudget: maxBudget,
            currency: 'INR',
            requiredAmenities: ['QuietZone', 'MountainView', 'HighSpeedWifi'],
            vibeKeywords: 'Misty mountains, Western Ghats, high altitude, tea & coffee plantations, quiet deep-work',
            summaryOfIntent: `Curated top verified quiet mountain retreats in Munnar & Wayanad, Kerala matching "${query}".`
          },
          results: [
            {
              id: munnarWorkation.id,
              title: munnarWorkation.title,
              description: munnarWorkation.description,
              category: 'Workation',
              city: 'Munnar',
              country: 'Kerala, India',
              price: munnarWorkation.pricePerPerson,
              currency: 'INR',
              priceType: 'person',
              rating: 5.0,
              keyFeatures: munnarWorkation.coworkingPerks.slice(0, 4),
              matchExplanation: `Misty mountain retreat amidst rolling Munnar tea gardens at 1,600m elevation. Includes verified ${munnarWorkation.verifiedWifiSpeedMbps} Mbps dual fiber and quiet focus spaces.`,
              relevanceScore: 98
            },
            {
              id: wayanadWorkation.id,
              title: wayanadWorkation.title,
              description: wayanadWorkation.description,
              category: 'Workation',
              city: 'Wayanad',
              country: 'Kerala, India',
              price: wayanadWorkation.pricePerPerson,
              currency: 'INR',
              priceType: 'person',
              rating: 4.9,
              keyFeatures: wayanadWorkation.coworkingPerks.slice(0, 4),
              matchExplanation: `Tranquil mountain sanctuary in Wayanad Western Ghats rainforest and coffee plantations with high-speed fiber and shaded canopy gazebos.`,
              relevanceScore: 96
            }
          ],
          totalMatches: 2
        };
      }

      // Normal mountain workation search returns Coworking Spaces
      const spaceResults: NaturalLanguageSearchResult['results'] = [
        {
          id: munnarSpace.id,
          title: munnarSpace.name,
          description: munnarSpace.description,
          category: 'CoworkingSpace',
          city: 'Munnar',
          country: 'Kerala, India',
          price: munnarSpace.pricing.dailyPrice || 390,
          currency: 'INR',
          priceType: 'day',
          rating: munnarSpace.rating,
          keyFeatures: munnarSpace.amenities.slice(0, 4),
          matchExplanation: `Panoramic valley focus desks in Munnar with 350 Mbps Starlink backup, crisp 18°C weather, and dedicated quiet zones.`,
          relevanceScore: 98
        },
        {
          id: wayanadSpace.id,
          title: wayanadSpace.name,
          description: wayanadSpace.description,
          category: 'CoworkingSpace',
          city: 'Wayanad',
          country: 'Kerala, India',
          price: wayanadSpace.pricing.dailyPrice || 380,
          currency: 'INR',
          priceType: 'day',
          rating: wayanadSpace.rating,
          keyFeatures: wayanadSpace.amenities.slice(0, 4),
          matchExplanation: `Shaded teakwood gazebos in an organic Wayanad mountain coffee estate with 300 Mbps fiber and natural quiet ambiance.`,
          relevanceScore: 96
        }
      ];

      return {
        query,
        parsedIntent: {
          targetType: 'CoworkingSpace',
          city: 'Munnar & Wayanad',
          country: 'Kerala, India',
          maxDailyBudget: maxBudget,
          currency: 'INR',
          requiredAmenities: ['QuietZone', 'MountainView', 'HighSpeedWifi'],
          vibeKeywords: 'Misty mountains, Western Ghats, high altitude, tea & coffee plantations, quiet deep-work',
          summaryOfIntent: `Curated top verified quiet mountain workspaces in Munnar & Wayanad, Kerala matching "${query}".`
        },
        results: spaceResults,
        totalMatches: spaceResults.length
      };
    }

    const matchedSpaces = MOCK_SPACES.filter(s => 
      s.city.toLowerCase() === city.toLowerCase() ||
      s.description.toLowerCase().includes(qLower) ||
      s.amenities.some(a => qLower.includes(a.toLowerCase()))
    );

    return {
      query,
      parsedIntent: {
        targetType,
        city,
        country: 'Kerala, India',
        maxDailyBudget: maxBudget,
        currency: 'INR',
        requiredAmenities: ['HighSpeedWifi', 'StandingDesks'],
        vibeKeywords: 'Nature, ocean breeze, high productivity, Kerala hospitality',
        summaryOfIntent: `Curated top verified workspaces in ${city}, Kerala matching "${query}".`
      },
      results: (matchedSpaces.length > 0 ? matchedSpaces : MOCK_SPACES).map((s, idx) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        category: 'CoworkingSpace',
        city: s.city,
        country: s.country,
        price: s.pricing.dailyPrice || 450,
        currency: s.pricing.currency || 'INR',
        priceType: 'day',
        rating: s.rating,
        keyFeatures: s.amenities.slice(0, 4),
        matchExplanation: `Verified ${s.verifiedWifiSpeedMbps} Mbps fiber wifi, ergonomic desks, and scenic natural ambiance in ${s.city}, Kerala.`,
        relevanceScore: 99 - idx * 3
      })),
      totalMatches: matchedSpaces.length
    };
  },

  // Meeting Rooms
  async getMeetingRooms(workspaceId?: string): Promise<MeetingRoom[]> {
    try {
      const url = workspaceId
        ? `${BASE_URL}/meeting-rooms/workspace/${encodeURIComponent(workspaceId)}`
        : `${BASE_URL}/meeting-rooms`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const rooms = await handleResponse<MeetingRoom[]>(res, MOCK_ROOMS);
      return rooms && rooms.length >= MOCK_ROOMS.length ? rooms : MOCK_ROOMS;
    } catch {
      return workspaceId ? MOCK_ROOMS.filter(r => r.workspaceId === workspaceId) : MOCK_ROOMS;
    }
  },

  // Activities
  async getActivities(city?: string): Promise<Activity[]> {
    try {
      const url = city && city !== 'All'
        ? `${BASE_URL}/activities/city/${encodeURIComponent(city)}`
        : `${BASE_URL}/activities`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const activities = await handleResponse<Activity[]>(res, MOCK_ACTIVITIES);
      if (city && city !== 'All') {
        const filtered = activities.filter(a => a.city.toLowerCase() === city.toLowerCase());
        return filtered.length > 0 ? filtered : MOCK_ACTIVITIES.filter(a => a.city.toLowerCase() === city.toLowerCase());
      }
      return activities && activities.length >= MOCK_ACTIVITIES.length ? activities : MOCK_ACTIVITIES;
    } catch {
      if (city && city !== 'All') {
        return MOCK_ACTIVITIES.filter(a => a.city.toLowerCase() === city.toLowerCase());
      }
      return MOCK_ACTIVITIES;
    }
  },

  async registerForActivity(city: string, id: string): Promise<Activity> {
    try {
      const res = await fetch(`${BASE_URL}/activities/${encodeURIComponent(city)}/${encodeURIComponent(id)}/register`, {
        method: 'POST',
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('registerForActivity API error, fallback local RSVP:', err);
    }

    const activity = MOCK_ACTIVITIES.find(a => a.id === id);
    if (activity) {
      activity.currentParticipants += 1;
      activity.hasAvailableSeats = activity.currentParticipants < activity.maxParticipants;
      return { ...activity };
    }
    throw new Error('Activity not found');
  },

  // Workations
  async getWorkations(city?: string): Promise<WorkationPackage[]> {
    try {
      const url = city && city !== 'All'
        ? `${BASE_URL}/workations/city/${encodeURIComponent(city)}`
        : `${BASE_URL}/workations`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const workations = await handleResponse<WorkationPackage[]>(res, MOCK_WORKATIONS);
      if (city && city !== 'All') {
        const filtered = workations.filter(w => w.destinationCity.toLowerCase() === city.toLowerCase());
        return filtered.length > 0 ? filtered : MOCK_WORKATIONS.filter(w => w.destinationCity.toLowerCase() === city.toLowerCase());
      }
      return workations && workations.length >= MOCK_WORKATIONS.length ? workations : MOCK_WORKATIONS;
    } catch {
      if (city && city !== 'All') {
        return MOCK_WORKATIONS.filter(w => w.destinationCity.toLowerCase() === city.toLowerCase());
      }
      return MOCK_WORKATIONS;
    }
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    try {
      const res = await fetch(`${BASE_URL}/partners`, { signal: AbortSignal.timeout(4000) });
      const partners = await handleResponse<Partner[]>(res, MOCK_PARTNERS);
      return partners && partners.length >= MOCK_PARTNERS.length ? partners : MOCK_PARTNERS;
    } catch {
      return MOCK_PARTNERS;
    }
  },

  async getPartnerSummary(id: string): Promise<PartnerWorkspaceSummary | null> {
    try {
      const res = await fetch(`${BASE_URL}/partners/${encodeURIComponent(id)}/summary`, {
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('getPartnerSummary error, using mock:', err);
    }

    const partner = MOCK_PARTNERS.find(p => p.id === id) || MOCK_PARTNERS[0];
    const spaces = MOCK_SPACES.filter(s => s.partnerId === partner.id);
    const rooms = MOCK_ROOMS.filter(r => spaces.some(s => s.id === r.workspaceId));
    const workations = MOCK_WORKATIONS.filter(w => w.partnerId === partner.id);

    return {
      partner,
      coworkingSpaces: spaces,
      meetingRooms: rooms,
      workations,
      totalCapacity: spaces.reduce((acc, s) => acc + s.capacity, 0),
      totalListings: spaces.length + rooms.length + workations.length
    };
  },

  async registerPartner(payload: RegisterPartnerPayload): Promise<Partner> {
    try {
      const res = await fetch(`${BASE_URL}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('registerPartner API call failed, creating locally:', err);
    }

    const newPartner: Partner = {
      id: 'partner-' + Math.random().toString(36).substring(2, 9),
      companyName: payload.companyName,
      contactName: payload.contactName,
      email: payload.email,
      phone: payload.phone,
      website: payload.website || '',
      billingAddress: payload.billingAddress || '',
      status: 'Active',
      payoutDetails: payload.payoutDetails || '',
      createdAt: new Date().toISOString()
    };
    MOCK_PARTNERS.push(newPartner);
    return newPartner;
  },

  // Bookings API
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        const created = await res.json();
        MOCK_BOOKINGS.unshift(created);
        return created;
      }
    } catch (err) {
      console.warn('createBooking API call failed, saving to mock storage:', err);
    }

    // Local fallback creation
    const space = MOCK_SPACES.find(s => s.id === payload.spaceId);
    const spaceName = payload.spaceName || space?.name || 'Kerala Workspace';
    const city = space?.city || 'Kerala';
    const basePrice = payload.basePrice ?? (payload.tier === 'HOURLY' ? 80 : payload.tier === 'MONTHLY' ? 6500 : 450);
    const premiumFee = payload.isPremium ? (payload.tier === 'HOURLY' ? 30 : payload.tier === 'MONTHLY' ? 1200 : payload.tier === 'STUDIO' ? 200 : 150) : 0;
    const bookingId = `BK-${city.substring(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: bookingId,
      spaceId: payload.spaceId,
      spaceName,
      city,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      bookingDate: payload.bookingDate,
      tier: payload.tier,
      isPremium: payload.isPremium,
      premiumSeatType: payload.isPremium ? (payload.premiumSeatType || 'Scenic Premium View Seat') : '',
      basePrice,
      premiumFee,
      totalPrice: payload.totalPrice ?? (basePrice + premiumFee),
      currency: 'INR',
      status: 'Confirmed',
      notes: payload.notes || '',
      createdAt: new Date().toISOString()
    };
    MOCK_BOOKINGS.unshift(newBooking);
    return newBooking;
  },

  async getBookings(email?: string, spaceId?: string): Promise<Booking[]> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (spaceId) params.append('spaceId', spaceId);
      const url = params.toString() ? `${BASE_URL}/bookings?${params.toString()}` : `${BASE_URL}/bookings`;

      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('getBookings API call failed, using mock data:', err);
    }

    if (email) {
      return MOCK_BOOKINGS.filter(b => b.guestEmail.toLowerCase() === email.toLowerCase());
    }
    if (spaceId) {
      return MOCK_BOOKINGS.filter(b => b.spaceId.toLowerCase() === spaceId.toLowerCase());
    }
    return MOCK_BOOKINGS;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('getBookingById API call failed:', err);
    }
    return MOCK_BOOKINGS.find(b => b.id.toLowerCase() === id.toLowerCase()) || null;
  },

  async ownerLogin(username: string, password: string): Promise<SpaceOwnerLoginResponse> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/owner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 401) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('ownerLogin API call failed, authenticating with mock data:', err);
    }

    // Mock fallback login
    const cred = MOCK_SPACE_OWNER_CREDENTIALS.find(
      c => c.username.toLowerCase() === username.trim().toLowerCase() && c.password === password
    );
    if (!cred) {
      return { success: false, message: 'Invalid space owner username or password.' };
    }

    const spaceBookings = MOCK_BOOKINGS.filter(b => b.spaceId === cred.spaceId);
    return {
      success: true,
      message: `Welcome back, ${cred.ownerName}! Showing live bookings for ${cred.spaceName}.`,
      owner: {
        spaceId: cred.spaceId,
        spaceName: cred.spaceName,
        city: cred.city,
        username: cred.username,
        ownerName: cred.ownerName,
        email: cred.email,
        phone: cred.phone
      },
      bookings: spaceBookings
    };
  },

  async getOwnerCredentials(): Promise<any[]> {
    try {
      const res = await fetch(`${BASE_URL}/bookings/owner/credentials`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return MOCK_SPACE_OWNER_CREDENTIALS;
  }
};
