import type { TransitInfo, ProximityHighlight, CoworkingSpace } from '../types';

export function getTransitInfoForSpace(space: CoworkingSpace): TransitInfo {
  const cityLower = space.city.toLowerCase();

  if (cityLower.includes('varkala')) {
    return {
      nearestAirport: {
        name: 'Trivandrum International Airport',
        code: 'TRV',
        distanceKm: 42,
        travelTime: '1 hr 15 mins',
        notes: 'Direct flights from Bangalore, Mumbai, Delhi, Chennai, Dubai, Singapore & Doha.'
      },
      taxiFare: {
        estimatedInr: '₹1,400 – ₹1,800',
        prepaidInfo: 'Prepaid taxi counters are open 24/7 inside the TRV Arrival hall.',
        rideHailing: 'Uber & Ola are available at the airport pickup bays.'
      },
      nearestRailway: {
        name: 'Varkala Sivagiri Railway Station',
        code: 'VAK',
        distanceKm: 3.2,
        travelTime: '10 mins',
        connectivity: 'Serviced by Vande Bharat Express, Jan Shatabdi, and coastal express trains.'
      },
      localTransit: {
        busInfo: 'KSRTC Fast Passenger and AC Low-Floor buses run continuously along NH-66 from Trivandrum to Varkala Temple Junction.',
        autoFareGuidance: 'Local auto-rickshaws charge approximately ₹60 – ₹100 between Varkala Station/Town and North Cliff.',
        specialTransit: 'Pedestrian cliff path allows direct walking between Helipad, North Cliff, and Black Beach.'
      }
    };
  }

  if (cityLower.includes('kochi') || cityLower.includes('cochin')) {
    const isKakkanad = space.address.toLowerCase().includes('kakkanad') || space.name.toLowerCase().includes('kakkanad');
    return {
      nearestAirport: {
        name: 'Cochin International Airport',
        code: 'COK',
        distanceKm: isKakkanad ? 26 : 38,
        travelTime: isKakkanad ? '45 mins' : '1 hr 10 mins',
        notes: 'World\'s first fully solar-powered airport. Direct connections to Europe, Gulf hubs, and all Indian metros.'
      },
      taxiFare: {
        estimatedInr: isKakkanad ? '₹900 – ₹1,200' : '₹1,200 – ₹1,500',
        prepaidInfo: 'Prepaid official taxi booths situated at Terminal 1 (Domestic) and Terminal 3 (International).',
        rideHailing: 'Uber, Ola, and airport electric cabs available with dedicated pickup lounges.'
      },
      nearestRailway: {
        name: isKakkanad ? 'Ernakulam Town (North) / Aluva' : 'Ernakulam Junction (South)',
        code: isKakkanad ? 'ERN / AWY' : 'ERS',
        distanceKm: isKakkanad ? 9 : 12,
        travelTime: '20 – 30 mins',
        connectivity: 'Major national rail hub with daily superfast connectivity across India.'
      },
      localTransit: {
        busInfo: 'KSRTC Electric AC Feeder buses link the metro line, Infopark, and Fort Kochi at 15-minute intervals.',
        autoFareGuidance: 'Metered auto-rickshaws with minimum fare ₹30; typically ₹80 – ₹150 for neighborhood hops.',
        specialTransit: 'Kochi Water Metro operates ultra-modern air-conditioned electric catamaran ferries between High Court, Fort Kochi, and Vypeen island for ₹20 – ₹40.'
      }
    };
  }

  if (cityLower.includes('munnar')) {
    return {
      nearestAirport: {
        name: 'Cochin International Airport',
        code: 'COK',
        distanceKm: 108,
        travelTime: '3 hrs 30 mins',
        notes: 'Scenic mountain climb along NH-85 passing through lush Cheeyappara & Valara waterfalls.'
      },
      taxiFare: {
        estimatedInr: '₹2,800 – ₹3,600',
        prepaidInfo: 'Airport prepaid counter can assign AC tourist sedans and SUVs for hill station travel.',
        rideHailing: 'Pre-booked private cabs or airport chauffeur services recommended for the mountain route.'
      },
      nearestRailway: {
        name: 'Aluva Railway Station',
        code: 'AWY',
        distanceKm: 105,
        travelTime: '3 hrs 15 mins',
        connectivity: 'Major mainline station on the Ernakulam route before the hill ascent.'
      },
      localTransit: {
        busInfo: 'KSRTC Super Fast & Swift AC buses run frequently from Ernakulam Central KSRTC Bus Station directly to Munnar town.',
        autoFareGuidance: 'Town auto-rickshaws available; local 4x4 jeeps can be hired for rugged plantation tracks at ₹1,500/day.',
        specialTransit: 'Private estate shared jeeps commute through tea factory settlements and trekking trails.'
      }
    };
  }

  if (cityLower.includes('wayanad')) {
    return {
      nearestAirport: {
        name: 'Calicut International Airport',
        code: 'CCJ',
        distanceKm: 85,
        travelTime: '2 hrs 30 mins',
        notes: 'Scenic drive through the famous 9-hairpin Thamarassery Mountain Pass (Churam).'
      },
      taxiFare: {
        estimatedInr: '₹2,200 – ₹2,800',
        prepaidInfo: 'Prepaid counters available at CCJ airport terminal exit.',
        rideHailing: 'Uber available around Kozhikode city, or book authorized tourist taxis.'
      },
      nearestRailway: {
        name: 'Kozhikode Railway Station',
        code: 'CLT',
        distanceKm: 72,
        travelTime: '2 hrs 15 mins',
        connectivity: 'Connected by high-speed express trains along the Malabar coastal corridor.'
      },
      localTransit: {
        busInfo: 'KSRTC buses depart every 20 minutes from Kozhikode KSRTC Terminal towards Kalpetta and Sulthan Bathery.',
        autoFareGuidance: 'Local autos readily available at town junctions; minimum fare ₹30.',
        specialTransit: 'Coffee estate 4WD pickups arranged for off-road plantation cottages.'
      }
    };
  }

  // Default: Alleppey / Backwaters
  return {
    nearestAirport: {
      name: 'Cochin International Airport',
      code: 'COK',
      distanceKm: 82,
      travelTime: '2 hrs',
      notes: 'Smooth highway drive south via the 4-lane NH-66 coastal corridor.'
    },
    taxiFare: {
      estimatedInr: '₹2,000 – ₹2,500',
      prepaidInfo: 'Prepaid airport taxi booths provide fixed-rate vouchers to Alleppey town and jetty.',
      rideHailing: 'Intercity Uber and Ola available from Kochi airport to Alleppey.'
    },
    nearestRailway: {
      name: 'Alappuzha Railway Station',
      code: 'ALLP',
      distanceKm: 3.5,
      travelTime: '10 mins',
      connectivity: 'Direct express rail connections along the coastal line to Ernakulam and Trivandrum.'
    },
    localTransit: {
      busInfo: 'KSRTC Swift buses connect Ernakulam to Alleppey KSRTC stand along the coastal bypass every 15 minutes.',
      autoFareGuidance: 'Auto-rickshaws available at railway station and bus stands (₹50 – ₹100 to houseboats and Finishing Point).',
      specialTransit: 'State Water Transport Department (SWTD) canal ferries run like water buses throughout the Vembanad Lake canals for ₹10 – ₹25.'
    }
  };
}

export function getProximityHighlights(space: CoworkingSpace): ProximityHighlight[] {
  const cityLower = space.city.toLowerCase();

  if (cityLower.includes('varkala')) {
    return [
      { icon: '🏖️', label: 'Varkala North Cliff & Papanasam Beach', distance: '3 min walk (250m)', category: 'nature' },
      { icon: '☕', label: 'Coffee Temple & Darjeeling Artisan Cafe', distance: '2 min walk (150m)', category: 'food' },
      { icon: '🏄', label: 'Soul & Surf Board Rentals & Yoga Shala', distance: '5 min walk (400m)', category: 'nature' },
      { icon: '🏧', label: 'Helipad SBI / HDFC ATM & Forex', distance: '4 min walk (300m)', category: 'transit' },
      { icon: '🏥', label: 'S.N. Mission Specialty Hospital', distance: '8 min drive (3.2 km)', category: 'health' }
    ];
  }

  if (cityLower.includes('kochi') || cityLower.includes('cochin')) {
    const isKakkanad = space.address.toLowerCase().includes('kakkanad') || space.name.toLowerCase().includes('kakkanad');
    if (isKakkanad) {
      return [
        { icon: '💻', label: 'Infopark Phase 1 & SmartCity Campus', distance: '3 min walk (200m)', category: 'tech' },
        { icon: '☕', label: 'Chai Break, Roastery & Starbucks', distance: '2 min walk (150m)', category: 'food' },
        { icon: '🚇', label: 'Kakkanad Metro Feeder Station', distance: '4 min walk (300m)', category: 'transit' },
        { icon: '🏋️', label: 'Cult.fit & Infopark Sports Hub', distance: '5 min walk (400m)', category: 'health' },
        { icon: '🏥', label: 'Sunrise Multi-Specialty Hospital', distance: '7 min drive (2.8 km)', category: 'health' }
      ];
    }
    return [
      { icon: '🏛️', label: 'Fort Kochi Beach & Historic Chinese Nets', distance: '4 min walk (350m)', category: 'nature' },
      { icon: '☕', label: 'Kashi Art Cafe & Loafer’s Corner', distance: '2 min walk (180m)', category: 'food' },
      { icon: '⛴️', label: 'Kochi Water Metro Terminal', distance: '6 min walk (500m)', category: 'transit' },
      { icon: '🎨', label: 'Kochi-Muziris Biennale Art Pavilions', distance: '5 min walk (450m)', category: 'nature' },
      { icon: '🏥', label: 'Fort Kochi Taluk Government Hospital', distance: '6 min walk (500m)', category: 'health' }
    ];
  }

  if (cityLower.includes('munnar')) {
    return [
      { icon: '🍃', label: 'KDHP Mattupetty Tea Estate Slopes', distance: '1 min walk (50m)', category: 'nature' },
      { icon: '☕', label: 'Rapsy Cardamom Tea House & Bakery', distance: '4 min walk (300m)', category: 'food' },
      { icon: '🥾', label: 'Chokramudi Peak Trailhead & Viewpoint', distance: '10 min drive (5.5 km)', category: 'nature' },
      { icon: '🏧', label: 'SBI Old Munnar Bazaar Branch & ATM', distance: '5 min walk (400m)', category: 'transit' },
      { icon: '🏥', label: 'Tata General Hospital Munnar', distance: '6 min drive (2.8 km)', category: 'health' }
    ];
  }

  if (cityLower.includes('wayanad')) {
    return [
      { icon: '🌲', label: 'Chembra Peak & Heart Lake Trailhead', distance: '12 min drive (7.5 km)', category: 'nature' },
      { icon: '☕', label: 'Malabar Shade-Grown Coffee Plantations', distance: 'On-site garden (0m)', category: 'food' },
      { icon: '🦌', label: 'Wayanad Wildlife Sanctuary Forest Border', distance: '18 min drive', category: 'nature' },
      { icon: '🏧', label: 'Kalpetta Banking Square & ATMs', distance: '10 min drive (4.5 km)', category: 'transit' },
      { icon: '🏥', label: 'WIMS Medical College & Super Specialty', distance: '12 min drive (6.0 km)', category: 'health' }
    ];
  }

  // Alleppey
  return [
    { icon: '🛶', label: 'Punnamada Lake & Finishing Point Jetty', distance: '3 min walk (200m)', category: 'nature' },
    { icon: '☕', label: 'Floating Houseboat Spiced Tea Hut & Cafe', distance: '4 min walk (250m)', category: 'food' },
    { icon: '🏖️', label: 'Alappuzha Lighthouse Beach & Pier', distance: '10 min auto (4.0 km)', category: 'nature' },
    { icon: '⛴️', label: 'SWTD Canal Ferry Station', distance: '5 min walk (350m)', category: 'transit' },
    { icon: '🏥', label: 'Alappuzha District General Hospital', distance: '7 min auto (2.5 km)', category: 'health' }
  ];
}
