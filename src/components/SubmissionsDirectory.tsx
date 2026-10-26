import React, { useState } from 'react';
import {
  EnrollmentSubmission,
  PROGRAMS,
  ProgramId,
  generateGoogleSheetsWebhookScript
} from '../utils/enrollmentLogic';
import { Download, Search, Plus, Copy, Check, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';

interface SubmissionsDirectoryProps {
  submissions: EnrollmentSubmission[];
  onNewEnrollment: () => void;
  sheetsWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
}

export const SubmissionsDirectory: React.FC<SubmissionsDirectoryProps> = ({
  submissions,
  onNewEnrollment,
  sheetsWebhookUrl,
  onSaveWebhookUrl
}) => {
  const [filterProgram, setFilterProgram] = useState<'all' | ProgramId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [webhookInput, setWebhookInput] = useState(sheetsWebhookUrl);
  const [savedBanner, setSavedBanner] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const webhookScript = generateGoogleSheetsWebhookScript();

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

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(webhookInput.trim());
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleCopyWebhookScript = () => {
    navigator.clipboard?.writeText(webhookScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Where to See Responses & Google Sheets Live Sync Guide */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="text-xs font-medium text-[#0284C7]">
              Admin Response Center · Google Sheets & Website Sync
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              Where & How to View Your Student Enrollment Responses
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
              Depending on whether students fill out your <strong>Google Form</strong> or this <strong>Vercel Website</strong>, here are the three places where you can view and export every response:
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowScriptModal((prev) => !prev)}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0284C7]" />
            {showScriptModal ? 'Hide Google Sheets Setup Script' : 'View Google Sheets Connector Script'}
            {showScriptModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-mono font-bold text-[#0284C7]">01. On This Page (Instant Roster)</span>
            <h3 className="text-sm font-bold text-slate-900">
              4. Responses Tab & CSV Download
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every test or live enrollment submitted in this browser is saved automatically in the table below. Click <strong>Download CSV</strong> anytime to open the roster in Excel or Google Sheets.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-mono font-bold text-[#0284C7]">02. Inside Google Forms</span>
            <h3 className="text-sm font-bold text-slate-900">
              Responses Tab → Link to Sheets
            </h3>
            <p className="text-slate-600 leading-relaxed">
              When using a Google Form created at <strong>forms.google.com</strong>, open your form editor, click the <strong>Responses</strong> tab at the top, and click <strong>Link to Sheets</strong> to view all submissions in Google Drive.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
            <span className="font-mono font-bold text-[#0284C7]">03. Vercel Website → Google Sheets</span>
            <h3 className="text-sm font-bold text-slate-900">
              Connect Your Google Sheet Webhook
            </h3>
            <p className="text-slate-600 leading-relaxed">
              So students submitting from their own phones on your Vercel link appear in your Google Sheet automatically, paste your Google Apps Script Web App URL below.
            </p>
          </div>
        </div>

        {/* Google Sheets Webhook URL Connector */}
        <form onSubmit={handleSaveWebhook} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="flex-1">
            <label htmlFor="sheetsWebhookInput" className="block text-xs font-semibold text-slate-800 mb-1.5">
              Google Sheets Web App URL (Optional — Auto-saves every Vercel website submission into your Google Sheet)
            </label>
            <input
              id="sheetsWebhookInput"
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {savedBanner ? 'Webhook Saved!' : 'Save Google Sheet URL'}
          </button>
        </form>

        {showScriptModal && (
          <div className="bg-[#0F172A] text-white rounded-lg p-5 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold">
                  Google Sheets Auto-Receiver Script (For Your Vercel Website)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Open <strong>sheets.new</strong> → click <strong>Extensions → Apps Script</strong> → paste this script → click <strong>Deploy → New deployment (Web app, Access: Anyone)</strong> → paste the Web App URL above!
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyWebhookScript}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedScript ? 'Copied Script' : 'Copy Sheets Script'}
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-200 overflow-x-auto max-h-64 p-3 rounded bg-slate-950 border border-slate-800 leading-relaxed">
              {webhookScript}
            </pre>
          </div>
        )}
      </div>

      {/* Submissions Roster Table */}
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
