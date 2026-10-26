import React from 'react';
import { PROGRAMS, LEARNING_GOALS, ProgramId } from '../utils/enrollmentLogic';
import { ArrowRight } from 'lucide-react';

interface ProgramCatalogProps {
  selectedProgramId: ProgramId;
  onChooseProgramAndEnroll: (id: ProgramId) => void;
}

export const ProgramCatalog: React.FC<ProgramCatalogProps> = ({
  selectedProgramId,
  onChooseProgramAndEnroll
}) => {
  return (
    <div className="space-y-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="text-xs font-medium text-slate-500">
            Edu Saptarish Curriculum · Mode: Live Online Classes · Small Interactive Batches
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1.5 tracking-tight">
            Program Tracks & Monthly Fee Structure
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Every track is delivered through live online mentor-led sessions tailored to the learner’s age group and real-world speaking goals. Select any track below to open the enrollment form with that program pre-selected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {PROGRAMS.map((prog, index) => {
            const isSelected = prog.id === selectedProgramId;
            return (
              <div
                key={prog.id}
                className={`flex flex-col justify-between p-6 rounded-xl border transition-colors ${
                  isSelected
                    ? 'border-[#0284C7] bg-sky-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-mono text-slate-400">
                        0{index + 1}. {prog.audience}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                        {prog.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xl font-bold text-[#0284C7] tabular-nums block">
                        ₹{prog.monthlyFee.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500">per month</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 font-medium">
                    {prog.scheduleSummary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {prog.keyModules.map((moduleItem) => (
                      <li key={moduleItem} className="flex items-start gap-2.5">
                        <span className="text-[#0284C7] font-bold">·</span>
                        <span>{moduleItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Mode: Live Online Classes
                  </span>
                  <button
                    type="button"
                    onClick={() => onChooseProgramAndEnroll(prog.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Enroll in {prog.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Core Learning Pillars */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="text-xs font-medium text-slate-500">
          5 Core Learning Outcomes (Field 9 Selection Guide)
        </div>
        <h3 className="text-xl font-bold text-slate-900 mt-1">
          What Participants Master in Live Online Classes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {LEARNING_GOALS.map((goal, idx) => {
            const descriptions: Record<string, string> = {
              'Spoken English':
                'Think in English naturally and converse fluently without hesitation or translation.',
              Grammar:
                'Master functional sentence structures, tenses, and error-free everyday usage.',
              'Public Speaking':
                'Deliver structured speeches, debates, and presentations with vocal modulation.',
              'Confidence Building':
                'Overcome stage fright and social anxiety through supportive live practice labs.',
              'Professional Communication':
                'Lead workplace meetings, client pitches, interviews, and executive correspondence.'
            };
            return (
              <div
                key={goal}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono text-slate-400">0{idx + 1}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{goal}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {descriptions[goal]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
