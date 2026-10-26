import React, { useState } from 'react';
import { EnrollmentSubmission, PROGRAMS, ProgramId } from '../utils/enrollmentLogic';
import { Download, Search, Plus } from 'lucide-react';

interface SubmissionsDirectoryProps {
  submissions: EnrollmentSubmission[];
  onNewEnrollment: () => void;
}

export const SubmissionsDirectory: React.FC<SubmissionsDirectoryProps> = ({
  submissions,
  onNewEnrollment
}) => {
  const [filterProgram, setFilterProgram] = useState<'all' | ProgramId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesProgram = filterProgram === 'all' || sub.programId === filterProgram;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      sub.participantName.toLowerCase().includes(query) ||
      sub.city.toLowerCase().includes(query) ||
      sub.state.toLowerCase().includes(query) ||
      sub.id.toLowerCase().includes(query) ||
      sub.email.toLowerCase().includes(query);
    return matchesProgram && matchesSearch;
  });

  const totalMonthlyRevenue = filteredSubmissions.reduce((acc, s) => acc + s.monthlyFee, 0);

  const handleExportCsv = () => {
    const headers = [
      'Enrollment ID',
      'Submitted At',
      'Participant Name',
      'Age',
      'Class',
      'Parent/Guardian Name',
      'Mobile/WhatsApp',
      'Email',
      'City',
      'State',
      'Program',
      'Monthly Fee (INR)',
      'Preferred Timing',
      'Learning Goals',
      'Payment Method',
      'Payment Status',
      'Mode'
    ];

    const rows = filteredSubmissions.map((s) => [
      s.id,
      s.submittedAt,
      s.participantName,
      s.age,
      s.studentClass,
      s.parentGuardianName || 'N/A',
      s.mobileWhatsapp,
      s.email,
      s.city,
      s.state,
      s.programName,
      String(s.monthlyFee),
      s.preferredTiming,
      s.learningGoals.join('; '),
      s.paymentMethod,
      s.paymentStatus,
      s.mode
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edu-saptarish-enrollments.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Google Forms Response Sheet Mirror · Live Online Cohort Roster
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              Submitted Enrollment Applications ({filteredSubmissions.length})
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Total Monthly Tuition Committed:{' '}
              <strong className="font-mono text-slate-900 tabular-nums">
                ₹{totalMonthlyRevenue.toLocaleString('en-IN')} / month
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
            <button
              type="button"
              onClick={onNewEnrollment}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Enrollment
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFilterProgram('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filterProgram === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tracks ({submissions.length})
            </button>
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setFilterProgram(prog.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterProgram === prog.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {prog.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search enrollments by name or city"
              placeholder="Search name, city, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>
        </div>

        {/* Table */}
        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700">
              No matching enrollment records found.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try clearing your search filter or submit a new enrollment form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Ref ID & Date</th>
                  <th className="py-3 pr-4 font-semibold">Participant & Guardian</th>
                  <th className="py-3 pr-4 font-semibold">Program & Fee</th>
                  <th className="py-3 pr-4 font-semibold">Timing & Goals</th>
                  <th className="py-3 pr-4 font-semibold">Contact & City</th>
                  <th className="py-3 font-semibold">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 pr-4 align-top whitespace-nowrap">
                      <span className="font-mono font-semibold text-slate-900 block tabular-nums">
                        {sub.id}
                      </span>
                      <span className="text-slate-500 tabular-nums">{sub.submittedAt}</span>
                    </td>
                    <td className="py-3.5 pr-4 align-top">
                      <span className="font-semibold text-slate-900 block">
                        {sub.participantName}
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        Age {sub.age} · {sub.studentClass}
                      </span>
                      {sub.parentGuardianName && (
                        <span className="text-slate-500 block">
                          Guardian: {sub.parentGuardianName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 align-top whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">
                        {sub.programName}
                      </span>
                      <span className="font-mono text-[#0284C7] font-semibold tabular-nums">
                        ₹{sub.monthlyFee.toLocaleString('en-IN')} / month
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 align-top max-w-xs">
                      <span className="font-medium text-slate-800 block">
                        {sub.preferredTiming}
                      </span>
                      <span className="text-slate-500 block mt-0.5">
                        {sub.learningGoals.join(' · ')}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 align-top">
                      <span className="font-mono text-slate-800 block tabular-nums">
                        {sub.mobileWhatsapp}
                      </span>
                      <span className="text-slate-500 block">
                        {sub.city}, {sub.state}
                      </span>
                    </td>
                    <td className="py-3.5 align-top">
                      <span className="font-medium text-slate-900 block">
                        {sub.paymentStatus}
                      </span>
                      <span className="text-slate-500 block">{sub.paymentMethod}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
