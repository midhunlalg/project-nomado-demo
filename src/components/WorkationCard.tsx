import { Palmtree, Wifi, Users, Calendar, ArrowRight, Check, Sparkles } from 'lucide-react';
import type { WorkationPackage } from '../types';

interface WorkationCardProps {
  workation: WorkationPackage;
  onInquire: (workation: WorkationPackage) => void;
}

export const WorkationCard: React.FC<WorkationCardProps> = ({ workation, onInquire }) => {
  return (
    <div className="card-outsite p-6 sm:p-9 bg-white flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBF0ED] text-[#1B3B36] text-xs sm:text-sm font-semibold">
            <Palmtree className="w-4 h-4" />
            <span>{workation.destinationCity}, Kerala</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium">
              <Wifi className="w-4 h-4 text-[#1B3B36]" />
              <span>{workation.verifiedWifiSpeedMbps} Mbps</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>{workation.durationDays} Days</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-editorial text-3xl sm:text-4xl font-normal text-[#1A1918] mb-3 leading-snug group-hover:text-[#1B3B36] transition-colors">
          {workation.title}
        </h3>

        {/* Group Size */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 mb-5">
          <Users className="w-4 h-4 text-stone-400" />
          <span>Curated for squads of {workation.minGroupSize} – {workation.maxGroupSize} remote workers</span>
        </div>

        {/* Description */}
        <p className="text-sm font-normal text-stone-600 mb-5 leading-relaxed">
          {workation.description}
        </p>

        {/* Accommodations Highlight */}
        <div className="p-4 sm:p-5 bg-[#FBF9F5] border border-stone-200 rounded-2xl mb-6 text-xs sm:text-sm text-stone-800 leading-relaxed">
          <span className="text-[#1B3B36] font-semibold uppercase text-xs tracking-wider block mb-1">
            Living & Retreat Setup:
          </span>
          {workation.accommodationsDetails}
        </div>

        {/* Perks & Experiences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
              Work & Productivity
            </div>
            <div className="space-y-2">
              {workation.coworkingPerks.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#1B3B36] stroke-[2.5] shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
              Included Experiences
            </div>
            <div className="space-y-2">
              {workation.includedExperiences.map((e, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Sparkles className="w-4 h-4 text-amber-500 stroke-[2] shrink-0" />
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-stone-400 font-semibold">Retreat Package</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl sm:text-4xl font-bold text-[#1A1918]">
              ₹{workation.pricePerPerson.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-medium text-stone-500">/ person</span>
          </div>
        </div>

        <button
          onClick={() => onInquire(workation)}
          className="btn-forest px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs"
        >
          <span>Inquire Retreat</span>
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
