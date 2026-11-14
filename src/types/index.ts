export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  daysOpen: string;
  openTime: string;
  closeTime: string;
  is247: boolean;
}

export interface Pricing {
  hourlyPrice?: number;
  dailyPrice?: number;
  monthlyPrice?: number;
  currency: string;
}

export interface TransitInfo {
  nearestAirport: {
    name: string;
    code: string;
    distanceKm: number;
    travelTime: string;
    notes: string;
  };
  taxiFare: {
    estimatedInr: string;
    prepaidInfo: string;
    rideHailing: string;
  };
  nearestRailway: {
    name: string;
    code: string;
    distanceKm: number;
    travelTime: string;
    connectivity: string;
  };
  localTransit: {
    busInfo: string;
    autoFareGuidance: string;
    specialTransit?: string;
  };
}

export interface ProximityHighlight {
  icon: string;
  label: string;
  distance: string;
  category: 'nature' | 'food' | 'transit' | 'health' | 'tech';
}

export interface CoworkingSpace {
  id: string;
  name: string;
  partnerId: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  location: GeoLocation;
  amenities: string[];
  capacity: number;
  pricing: Pricing;
  operatingHours: OperatingHours;
  imageUrls: string[];
  rating: number;
  reviewCount: number;
  verifiedWifiSpeedMbps: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCoworkingSpacePayload {
  name: string;
  partnerId: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  capacity: number;
  hourlyPrice?: number;
  dailyPrice?: number;
  monthlyPrice?: number;
  currency: string;
  amenities: string[];
  operatingHours?: OperatingHours;
  wifiSpeedMbps: number;
  imageUrls?: string[];
}

export type MeetingRoomType =
  | 'Boardroom'
  | 'ConferenceRoom'
  | 'HuddleRoom'
  | 'PodcastStudio'
  | 'PrivatePhoneBooth'
  | 'WorkshopSpace';

export interface MeetingRoom {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  roomType: MeetingRoomType;
  capacity: number;
  hourlyRate: number;
  currency: string;
  equipment: string[];
  isAvailable: boolean;
  minBookingHours: number;
  createdAt: string;
  updatedAt?: string;
}

export type ActivityCategory =
  | 'CommunityNetworking'
  | 'SurfSession'
  | 'TechTalk'
  | 'FounderDinner'
  | 'Skillshare'
  | 'YogaWellness'
  | 'WeekendExcursion';

export interface Activity {
  id: string;
  workspaceId?: string;
  organizerId: string;
  title: string;
  description: string;
  category: ActivityCategory;
  city: string;
  country: string;
  locationName: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  hasAvailableSeats: boolean;
  price: number;
  currency: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkationPackage {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  destinationCity: string;
  destinationCountry: string;
  minGroupSize: number;
  maxGroupSize: number;
  durationDays: number;
  pricePerPerson: number;
  currency: string;
  verifiedWifiSpeedMbps: number;
  accommodationsDetails: string;
  coworkingPerks: string[];
  includedExperiences: string[];
  availableFrom: string;
  availableTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type PartnerStatus = 'PendingVerification' | 'Active' | 'Suspended';

export interface Partner {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  billingAddress: string;
  status: PartnerStatus;
  payoutDetails: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PartnerWorkspaceSummary {
  partner: Partner;
  coworkingSpaces: CoworkingSpace[];
  meetingRooms: MeetingRoom[];
  workations: WorkationPackage[];
  totalCapacity: number;
  totalListings: number;
}

export interface RegisterPartnerPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  billingAddress?: string;
  payoutDetails?: string;
}

export interface ParsedIntent {
  targetType: string;
  city?: string;
  country?: string;
  maxDailyBudget?: number;
  maxHourlyBudget?: number;
  currency?: string;
  requiredAmenities?: string[];
  minCapacity?: number;
  groupSize?: number;
  vibeKeywords?: string;
  summaryOfIntent: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: 'CoworkingSpace' | 'MeetingRoom' | 'Workation' | 'Activity';
  city: string;
  country: string;
  price: number;
  currency: string;
  priceType: string;
  rating?: number;
  keyFeatures: string[];
  matchExplanation: string;
  relevanceScore: number;
}

export interface NaturalLanguageSearchResult {
  query: string;
  parsedIntent: ParsedIntent;
  results: SearchResultItem[];
  totalMatches: number;
}

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  city: string;
  guestName: string;
  guestEmail: string;
  bookingDate: string;
  tier: string;
  isPremium: boolean;
  premiumSeatType: string;
  basePrice: number;
  premiumFee: number;
  totalPrice: number;
  currency: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  spaceId: string;
  spaceName?: string;
  guestName: string;
  guestEmail: string;
  bookingDate: string;
  tier: 'DAILY' | 'HOURLY' | 'MONTHLY';
  isPremium: boolean;
  premiumSeatType?: string;
  notes?: string;
}

export interface SpaceOwner {
  spaceId: string;
  spaceName: string;
  city: string;
  username: string;
  ownerName: string;
  email: string;
  phone: string;
}

export interface SpaceOwnerLoginResponse {
  success: boolean;
  message: string;
  owner?: SpaceOwner;
  bookings?: Booking[];
}
