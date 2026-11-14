import { Terminal, Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-[#E7E5DF] bg-[#F6F4EE] pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1B3B36] flex items-center justify-center text-white text-sm font-bold">
              ✦
            </div>
            <span className="font-editorial text-3xl font-normal text-[#1A1918]">
              Nomado
            </span>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Kerala Network
            </span>
          </div>

          <p className="text-base font-normal text-stone-600 max-w-md leading-relaxed">
            Spaces designed for living and working remotely across God's Own Country. Verified 500Mbps-1Gbps fiber internet, oceanfront cliff desks, acoustic podcast studios, and tea plantation retreats.
          </p>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-semibold text-stone-700 pt-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200">Varkala (Cliff Beach)</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200">Kochi (Fort Kochi & Infopark)</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200">Munnar (Tea Hills)</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200">Wayanad</span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200">Alleppey</span>
          </div>
        </div>

        {/* Platform Endpoints */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3.5 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            <span>Platform API</span>
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm font-mono text-stone-600">
            <li className="hover:text-[#1B3B36] transition-colors">
              GET /api/v1/spaces
            </li>
            <li className="hover:text-[#1B3B36] transition-colors">
              POST /api/v1/search/natural-language
            </li>
            <li className="hover:text-[#1B3B36] transition-colors">
              GET /api/v1/meeting-rooms
            </li>
            <li className="hover:text-[#1B3B36] transition-colors">
              POST /api/v1/activities/register
            </li>
            <li className="hover:text-[#1B3B36] transition-colors">
              GET /api/v1/workations
            </li>
            <li className="hover:text-[#1B3B36] transition-colors">
              GET /api/v1/partners
            </li>
          </ul>
        </div>

        {/* Stack & Architecture */}
        <div>
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3.5 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Architecture</span>
          </h4>
          <div className="space-y-2 text-xs sm:text-sm text-stone-600">
            <div>ASP.NET Core Web API (.NET 10)</div>
            <div>Azure Table Storage SDK</div>
            <div>React 19 + TypeScript + Vite 8</div>
            <div>Tailwind CSS (Outsite Aesthetic)</div>
            <div>AI Intent Natural Language Engine</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-500">
        <div>
          Nomado Kerala • Digital Nomad & Workation Discovery Platform.
        </div>
        <div>
          <a
            href="http://localhost:5135/swagger"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-stone-900 transition-colors"
          >
            <span>Swagger API Documentation</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
