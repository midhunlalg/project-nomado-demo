import { useState, useEffect } from 'react';
import { Building2, Plus, Users, Tv, Palmtree, Mail, Phone, ExternalLink } from 'lucide-react';
import type { Partner, PartnerWorkspaceSummary } from '../types';
import { api } from '../services/api';

interface PartnerPortalProps {
  partners: Partner[];
  onOpenCreateSpace: () => void;
  onPartnerRegistered: (partner: Partner) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  partners,
  onOpenCreateSpace,
  onPartnerRegistered
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');
  const [summary, setSummary] = useState<PartnerWorkspaceSummary | null>(null);

  // New Partner Form
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (selectedPartnerId) {
      loadPartnerSummary(selectedPartnerId);
    }
  }, [selectedPartnerId]);

  const loadPartnerSummary = async (partnerId: string) => {
    try {
      const data = await api.getPartnerSummary(partnerId);
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const newPartner = await api.registerPartner({
        companyName,
        contactName,
        email,
        phone,
        website,
        billingAddress
      });
      onPartnerRegistered(newPartner);
      setSelectedPartnerId(newPartner.id);
      setShowRegisterForm(false);
      setCompanyName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setBillingAddress('');
    } finally {
      setIsRegistering(false);
    }
  };

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Top Banner */}
      <div className="p-8 sm:p-10 card-outsite bg-white rounded-3xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold mb-2.5">
            <span>✦ Kerala Host & Workspace Management</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1918]">
            Workspaces & Retreat Inventory
          </h2>
          <p className="text-base font-normal text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Manage your coworking locations, meeting studios, retreat packages, and capacity allocations across Varkala, Kochi, Munnar, Wayanad & Alleppey.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="btn-outsite-outline px-5 py-2.5 text-xs sm:text-sm font-medium"
          >
            {showRegisterForm ? 'Close Registration' : '+ New Kerala Host'}
          </button>

          <button
            onClick={onOpenCreateSpace}
            className="btn-forest px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>List Space</span>
          </button>
        </div>
      </div>

      {/* Partner Registration Accordion */}
      {showRegisterForm && (
        <div className="p-8 card-outsite bg-[#FAFAF8] rounded-3xl mb-10 animate-in fade-in duration-200">
          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] mb-4">
            Register Workspace Host Organization
          </h3>

          <form onSubmit={handleRegisterPartner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Malabar Coast Workspaces"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full input-outsite p-3 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full input-outsite p-3 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="suresh@malabarworkspaces.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-outsite p-3 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="text"
                required
                placeholder="+91 98470 54321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full input-outsite p-3 text-sm font-medium"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isRegistering}
                className="btn-forest px-7 py-3 text-sm font-semibold shadow-xs"
              >
                {isRegistering ? 'Registering...' : 'Complete Host Registration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Select Partner Dropdown */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-wider">
          Active Host Profile:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {partners.map((p) => {
            const isSelected = p.id === selectedPartnerId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPartnerId(p.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B3B36] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {p.companyName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partner Details Card */}
      {currentPartner && (
        <div className="p-6 sm:p-7 card-outsite bg-white rounded-2xl mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EBF0ED] flex items-center justify-center font-bold text-xl text-[#1B3B36]">
              {currentPartner.companyName.charAt(0)}
            </div>
            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
                {currentPartner.companyName}
              </h3>
              <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm text-stone-500 mt-1">
                <span>Contact: {currentPartner.contactName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {currentPartner.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  {currentPartner.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Status: {currentPartner.status}</span>
            </span>
            {currentPartner.website && (
              <a
                href={currentPartner.website}
                target="_blank"
                rel="noreferrer"
                className="btn-outsite-outline text-xs sm:text-sm px-4 py-2 font-medium"
              >
                <span>Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="p-6 sm:p-7 card-outsite bg-white rounded-2xl">
          <div className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Workspaces
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-[#1A1918] flex items-center justify-between">
            <span>{summary?.coworkingSpaces.length || 0}</span>
            <Building2 className="w-6 h-6 text-stone-300" />
          </div>
        </div>

        <div className="p-6 sm:p-7 card-outsite bg-white rounded-2xl">
          <div className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Meeting Studios
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-[#1A1918] flex items-center justify-between">
            <span>{summary?.meetingRooms.length || 0}</span>
            <Tv className="w-6 h-6 text-stone-300" />
          </div>
        </div>

        <div className="p-6 sm:p-7 card-outsite bg-white rounded-2xl">
          <div className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Workation Packages
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-[#1A1918] flex items-center justify-between">
            <span>{summary?.workations.length || 0}</span>
            <Palmtree className="w-6 h-6 text-stone-300" />
          </div>
        </div>

        <div className="p-6 sm:p-7 card-outsite bg-white rounded-2xl">
          <div className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-wider mb-1">
            Total Desks
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-[#1A1918] flex items-center justify-between">
            <span>{summary?.totalCapacity || 0}</span>
            <Users className="w-6 h-6 text-stone-300" />
          </div>
        </div>
      </div>

      {/* Host Spaces List */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918]">
            Active Kerala Locations
          </h3>
          <span className="text-xs sm:text-sm text-stone-400 font-semibold">
            {summary?.coworkingSpaces.length || 0} Spaces listed
          </span>
        </div>

        {summary && summary.coworkingSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summary.coworkingSpaces.map((space) => (
              <div key={space.id} className="card-outsite p-6 sm:p-7 bg-white rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-stone-400 font-semibold mb-2">
                    <span>{space.city}, Kerala</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {space.capacity} Desks
                    </span>
                  </div>
                  <h4 className="font-editorial text-2xl font-normal text-[#1A1918] mb-1.5">
                    {space.name}
                  </h4>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed">
                    {space.description}
                  </p>
                  <div className="text-sm font-semibold text-stone-800">
                    Day Rate: ₹{space.pricing.dailyPrice || 450}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-500">
                  <span>Wifi: {space.verifiedWifiSpeedMbps} Mbps</span>
                  <span className="text-emerald-700">● Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 card-outsite bg-white rounded-2xl text-center text-stone-400 text-sm">
            No spaces found for this host profile. Click "List Space" to publish a new workspace.
          </div>
        )}
      </div>
    </div>
  );
};
