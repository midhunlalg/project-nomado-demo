import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { CreateCoworkingSpacePayload, Partner } from '../types';

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  partners: Partner[];
  onSubmit: (payload: CreateCoworkingSpacePayload) => Promise<void>;
}

export const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  partners,
  onSubmit
}) => {
  const [partnerId, setPartnerId] = useState(partners[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Varkala');
  const [country, setCountry] = useState('Kerala, India');
  const [capacity, setCapacity] = useState(50);
  const [dailyPrice, setDailyPrice] = useState(450);
  const [currency, setCurrency] = useState('INR');
  const [wifiSpeedMbps, setWifiSpeedMbps] = useState(500);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'HighSpeedWifi',
    'StandingDesks',
    'PrivatePhoneBooths',
    'SpecialtyCoffee'
  ]);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableAmenities = [
    'HighSpeedWifi',
    'SeaViewTerrace',
    'StandingDesks',
    'ErgonomicChairs',
    'PrivatePhoneBooths',
    '24/7Access',
    'SpecialtyCoffee',
    'MountainView',
    'QuietZone',
    'OrganicTeaBar',
    'PetFriendly',
    'Monitors',
    'CourtyardGarden',
    'SurfBoardRacks'
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setCountry('Kerala, India');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        partnerId: partnerId || partners[0]?.id || 'partner-gen',
        description,
        address,
        city,
        country: 'Kerala, India',
        capacity: Number(capacity),
        dailyPrice: Number(dailyPrice),
        hourlyPrice: Math.round(dailyPrice / 5),
        monthlyPrice: Math.round(dailyPrice * 14),
        currency: 'INR',
        wifiSpeedMbps: Number(wifiSpeedMbps),
        amenities: selectedAmenities,
        latitude: city === 'Varkala' ? 8.7379 : city === 'Kochi' ? 9.9658 : city === 'Munnar' ? 10.0889 : 9.4981,
        longitude: city === 'Varkala' ? 76.7032 : city === 'Kochi' ? 76.2421 : city === 'Munnar' ? 77.0595 : 76.3388,
        imageUrls: imageUrl ? [imageUrl] : undefined
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
              List a Workspace in Kerala
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Publish spaces to verified remote workers across Kerala's top workation destinations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Workspace Host
              </label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.companyName} ({p.contactName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Space Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Varkala Cliff Top Loft"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Description & Nomad Highlights
            </label>
            <textarea
              required
              rows={2}
              placeholder="Describe view, quiet work zones, fiber internet, natural breeze, filter coffee..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Kerala Destination
              </label>
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              >
                <option value="Varkala">Varkala (Cliff Beach)</option>
                <option value="Kochi">Kochi (Fort Kochi / Kakkanad)</option>
                <option value="Munnar">Munnar (Tea Hills)</option>
                <option value="Wayanad">Wayanad (Rainforest)</option>
                <option value="Alleppey">Alleppey (Backwaters)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Street Address / Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. North Cliff, Helipad Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Desk Capacity
              </label>
              <input
                type="number"
                min={5}
                required
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 20)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Tested Wifi (Mbps)
              </label>
              <input
                type="number"
                min={50}
                required
                value={wifiSpeedMbps}
                onChange={(e) => setWifiSpeedMbps(parseInt(e.target.value) || 100)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Day Pass Rate (₹)
              </label>
              <input
                type="number"
                min={100}
                required
                value={dailyPrice}
                onChange={(e) => setDailyPrice(parseFloat(e.target.value) || 450)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              >
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              Amenities & Environment
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((a) => {
                const isSelected = selectedAmenities.includes(a);
                return (
                  <button
                    type="button"
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B3B36] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {a.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-forest py-3.5 text-sm font-semibold shadow-xs mt-4"
          >
            {isSubmitting ? (
              <span>Publishing Space...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Publish Kerala Workspace Listing</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
