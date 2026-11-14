import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { WorkationPackage } from '../types';

interface WorkationModalProps {
  workation: WorkationPackage | null;
  onClose: () => void;
  onSubmit: (title: string, groupSize: number, teamName: string) => void;
}

export const WorkationModal: React.FC<WorkationModalProps> = ({
  workation,
  onClose,
  onSubmit
}) => {
  const [teamName, setTeamName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [groupSize, setGroupSize] = useState(6);
  const [targetMonth, setTargetMonth] = useState('Next Month');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!workation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(workation.title, groupSize, teamName);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div>
            <span className="text-xs font-semibold text-[#1B3B36] uppercase tracking-wider block mb-1">
              Retreat in {workation.destinationCity}, Kerala
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#1A1918] leading-tight">
              {workation.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Team / Startup Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Engineering Squad"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Group Size ({workation.minGroupSize}-{workation.maxGroupSize})
              </label>
              <input
                type="number"
                min={workation.minGroupSize}
                max={workation.maxGroupSize}
                required
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || workation.minGroupSize)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Target Timeline
              </label>
              <select
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
              >
                <option value="Next Month">Next Month</option>
                <option value="In 2-3 Months">In 2-3 Months</option>
                <option value="Q3/Q4 Retreat">Later this Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              required
              placeholder="lead@startup.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full input-outsite p-3 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="p-4 sm:p-5 bg-[#FBF9F5] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-700">
            <div className="text-stone-500 font-medium">Estimated retreat total for {groupSize} remote workers:</div>
            <div className="text-2xl font-bold text-[#1A1918] mt-1">
              ₹{(groupSize * workation.pricePerPerson).toLocaleString()}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-forest py-3.5 text-sm font-semibold shadow-xs"
          >
            {isSubmitting ? (
              <span>Submitting Inquiry...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Submit Kerala Team Retreat Inquiry</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
