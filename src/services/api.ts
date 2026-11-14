import type {
  CoworkingSpace,
  CreateCoworkingSpacePayload,
  MeetingRoom,
  Activity,
  WorkationPackage,
  Partner,
  PartnerWorkspaceSummary,
  RegisterPartnerPayload,
  NaturalLanguageSearchResult
} from '../types';
import {
  MOCK_SPACES,
  MOCK_ROOMS,
  MOCK_ACTIVITIES,
  MOCK_WORKATIONS,
  MOCK_PARTNERS
} from './mockData';

const BASE_URL = '/api/v1';

// Helper to determine if we should fall back to local mock data
async function handleResponse<T>(res: Response, fallbackData: T): Promise<T> {
  if (!res.ok) {
    console.warn(`[Nomado API] Server returned ${res.status}: ${res.statusText}. Using fallback data.`);
    return fallbackData;
  }
  try {
    return await res.json();
  } catch (err) {
    console.warn('[Nomado API] JSON parse error:', err);
    return fallbackData;
  }
}

export const api = {
  // Health check
  async checkHealth(): Promise<{ status: string; connected: boolean }> {
    try {
      const res = await fetch('/health', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return { status: data.status || 'Healthy', connected: true };
      }
      return { status: 'Degraded', connected: false };
    } catch {
      return { status: 'Offline (Using Mock Cache)', connected: false };
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
        : ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'],
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
          return result;
        }
      }
    } catch (err) {
      console.warn('AI search API error, applying client-side Kerala heuristic engine:', err);
    }

    // Heuristic client fallback for Kerala hubs
    const qLower = query.toLowerCase();
    let city = 'Varkala';
    if (qLower.includes('kochi') || qLower.includes('cochin') || qLower.includes('kakkanad') || qLower.includes('infopark')) {
      city = 'Kochi';
    } else if (qLower.includes('munnar') || qLower.includes('tea') || qLower.includes('mountain') || qLower.includes('hill')) {
      city = 'Munnar';
    } else if (qLower.includes('wayanad') || qLower.includes('coffee') || qLower.includes('rainforest')) {
      city = 'Wayanad';
    } else if (qLower.includes('alleppey') || qLower.includes('alappuzha') || qLower.includes('backwater') || qLower.includes('houseboat')) {
      city = 'Alleppey';
    } else if (qLower.includes('varkala') || qLower.includes('cliff') || qLower.includes('surf') || qLower.includes('sea')) {
      city = 'Varkala';
    }

    const matchedSpaces = MOCK_SPACES.filter(s => 
      s.city.toLowerCase() === city.toLowerCase() ||
      s.description.toLowerCase().includes(qLower) ||
      s.amenities.some(a => qLower.includes(a.toLowerCase()))
    );

    const budgetMatch = query.match(/\d+/);
    const maxBudget = budgetMatch ? parseInt(budgetMatch[0], 10) : undefined;

    return {
      query,
      parsedIntent: {
        targetType: 'CoworkingSpace',
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
  }
};
