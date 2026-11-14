import { useState, useEffect } from 'react';
import {
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Calendar,
  Mail,
  DollarSign,
  TrendingUp,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Building2,
  Search,
  Eye
} from 'lucide-react';
import type { Booking, SpaceOwner } from '../types';
import { api } from '../services/api';
import { MOCK_SPACE_OWNER_CREDENTIALS } from '../services/mockData';

export const SpaceOwnerPortal: React.FC = () => {
  const [username, setUsername] = useState('varkala_cliff');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentOwner, setCurrentOwner] = useState<SpaceOwner | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogin = async (loginUser = username, loginPass = password) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.ownerLogin(loginUser, loginPass);
      if (res.success && res.owner) {
        setCurrentOwner(res.owner);
        setBookings(res.bookings || []);
      } else {
        setErrorMessage(res.message || 'Invalid username or password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please check network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (testUser: string, testPass: string) => {
    setUsername(testUser);
    setPassword(testPass);
    handleLogin(testUser, testPass);
  };

  const handleRefreshBookings = async () => {
    if (!currentOwner) return;
    setIsRefreshing(true);
    try {
      const data = await api.getBookings(undefined, currentOwner.spaceId);
      setBookings(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    setCurrentOwner(null);
    setBookings([]);
    setErrorMessage('');
  };

  // Filter bookings by search term
  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.guestName.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.bookingDate.includes(q) ||
      b.premiumSeatType?.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const premiumCount = bookings.filter((b) => b.isPremium).length;
  const standardCount = bookings.length - premiumCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* If Not Logged In: Show Owner Login Box */}
      {!currentOwner ? (
        <div className="max-w-xl mx-auto">
          {/* Card */}
          <div className="p-8 sm:p-10 card-outsite bg-white rounded-3xl shadow-xl border border-stone-200">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF0ED] text-[#1B3B36] flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <Lock className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Space Owner Secure Access</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1A1918]">
                Space Owner Login
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                Each coworking space has a dedicated username & password to view live bookings stored in Azure Table Storage.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Space Owner Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. varkala_cliff"
                    className="input-outsite w-full pl-10 pr-4 py-3 text-sm bg-[#FBF9F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-outsite w-full pl-10 pr-4 py-3 text-sm bg-[#FBF9F5]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-forest w-full py-3.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>View Space Bookings</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Accounts */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 text-center">
                ✦ 1-Click Demo Logins for Space Owners
              </span>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_SPACE_OWNER_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.username}
                    type="button"
                    onClick={() => handleQuickLogin(cred.username, cred.password)}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-[#1B3B36] bg-[#FAFAF8] hover:bg-white text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-stone-800 group-hover:text-[#1B3B36] truncate">
                      {cred.city}: {cred.username}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {cred.premiumSeatView}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In Dashboard */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="p-8 card-outsite bg-white rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF0ED] text-[#1B3B36] flex items-center justify-center text-2xl font-bold shadow-xs">
                {currentOwner.spaceName.charAt(0)}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Space Owner Portal • Azure Storage Connected</span>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1A1918]">
                  {currentOwner.spaceName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span>Host: <strong>{currentOwner.ownerName}</strong> ({currentOwner.username})</span>
                  <span>•</span>
                  <span>{currentOwner.city}, Kerala</span>
                  <span>•</span>
                  <span>{currentOwner.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshBookings}
                disabled={isRefreshing}
                className="btn-outsite-outline px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 sm:p-6 card-outsite bg-white rounded-2xl border border-stone-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Total Bookings
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-editorial">
                {bookings.length}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Active & upcoming passes
              </p>
            </div>

            <div className="p-5 sm:p-6 card-outsite bg-white rounded-2xl border border-stone-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Premium Seats</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-editorial">
                {premiumCount}
              </div>
              <p className="text-[11px] text-amber-700/80 mt-1">
                Scenic view desks allocated
              </p>
            </div>

            <div className="p-5 sm:p-6 card-outsite bg-white rounded-2xl border border-stone-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Standard Desks
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-stone-800 font-editorial">
                {standardCount}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Regular workstation passes
              </p>
            </div>

            <div className="p-5 sm:p-6 card-outsite bg-white rounded-2xl border border-stone-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Total Revenue</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-900 font-editorial">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700/80 mt-1">
                Across all passes
              </p>
            </div>
          </div>

          {/* Bookings Table / List */}
          <div className="p-6 sm:p-8 card-outsite bg-white rounded-3xl border border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-editorial text-2xl font-normal text-stone-900">
                  Live Bookings for {currentOwner.spaceName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Stored in Azure Table Storage (`NomadoBookings`)
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by guest or pass date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-outsite w-full pl-9 pr-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-[#FAFAF8] border border-dashed border-stone-300">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="font-semibold text-stone-700 text-sm">No bookings found</h4>
                <p className="text-xs text-stone-500 mt-1">
                  New passes booked by digital nomads will instantly appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 pr-4">Confirmation ID</th>
                      <th className="pb-3 pr-4">Guest Nomad</th>
                      <th className="pb-3 pr-4">Pass Date</th>
                      <th className="pb-3 pr-4">Tier</th>
                      <th className="pb-3 pr-4">Seat Allocation</th>
                      <th className="pb-3 pr-4 text-right">Price</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FBF9F5] transition-all">
                        <td className="py-4 pr-4 font-mono font-bold text-[#1B3B36]">
                          {b.id}
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-bold text-stone-900">{b.guestName}</div>
                          <div className="text-stone-500 text-[11px]">{b.guestEmail}</div>
                        </td>
                        <td className="py-4 pr-4 text-stone-800 font-semibold">
                          {b.bookingDate}
                        </td>
                        <td className="py-4 pr-4">
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-semibold text-[11px]">
                            {b.tier}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          {b.isPremium ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[11px]">
                              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{b.premiumSeatType || 'Premium Seat'}</span>
                              <span className="text-amber-700 text-[10px]">(+₹{b.premiumFee})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium text-[11px]">
                              Standard Desk
                            </span>
                          )}
                        </td>
                        <td className="py-4 pr-4 text-right font-bold text-stone-900 text-sm">
                          ₹{b.totalPrice.toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{b.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
