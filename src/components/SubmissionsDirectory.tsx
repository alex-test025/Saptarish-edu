import React, { useState } from 'react';
import {
  OWNER_EMAIL,
  generateGoogleSheetsWebhookScript
} from '../utils/enrollmentLogic';
import {
  Copy,
  Check,
  ShieldCheck,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

interface SubmissionsDirectoryProps {
  onNewEnrollment: () => void;
  sheetsWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => void;
  ownerWhatsapp: string;
  onSaveOwnerWhatsapp: (phone: string) => void;
}

export const SubmissionsDirectory: React.FC<SubmissionsDirectoryProps> = ({
  onNewEnrollment,
  sheetsWebhookUrl,
  onSaveWebhookUrl,
  ownerWhatsapp,
  onSaveOwnerWhatsapp
}) => {
  const [webhookInput, setWebhookInput] = useState(sheetsWebhookUrl);
  const [whatsappInput, setWhatsappInput] = useState(ownerWhatsapp);
  const [savedBanner, setSavedBanner] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const webhookScript = generateGoogleSheetsWebhookScript();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWebhookUrl(webhookInput.trim());
    onSaveOwnerWhatsapp(whatsappInput.trim());
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleCopyWebhookScript = () => {
    navigator.clipboard?.writeText(webhookScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Confidential Data Protection Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 text-[#0284C7]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0284C7]">
                Strict Data Privacy Enabled · Zero Public Student Records
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                Confidential Owner Notification & CSV Delivery Center
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-3xl">
                To protect student privacy, <strong>no student names, contact numbers, or enrollment counts are displayed publicly on this website</strong>. Instead, every submission is delivered privately to the owner (<span className="font-mono font-semibold text-slate-900">{OWNER_EMAIL}</span>) with full CSV data, total students enrolled count, and all 11 form fields.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNewEnrollment}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Go to Enrollment Form
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Confidential Channels Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Mail className="w-4 h-4 text-[#0284C7]" />
              <span>1. Instant Gmail + CSV Attachment</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every time a student submits the form, an automated email is sent to <strong className="font-mono text-slate-900">{OWNER_EMAIL}</strong> containing:
            </p>
            <ul className="space-y-1 text-slate-700 pt-1">
              <li>· <strong>Total No. of Students Enrolled</strong> so far</li>
              <li>· All 11 fields of the new student</li>
              <li>· Attached master <strong>.csv file</strong> of all students</li>
            </ul>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <FileSpreadsheet className="w-4 h-4 text-[#0284C7]" />
              <span>2. Private Google Sheet Log</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Your connected Google Sheet automatically appends each student in real time. Only <strong className="font-mono text-slate-900">{OWNER_EMAIL}</strong> can open or download the Google Sheet inside Google Drive.
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <MessageSquare className="w-4 h-4 text-[#0284C7]" />
              <span>3. Direct WhatsApp Summary + CSV</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              On submission confirmation, a formatted WhatsApp dispatch containing all 11 student fields and inline CSV row can be sent directly to your WhatsApp number.
            </p>
          </div>
        </div>

        {/* Owner Endpoint Configuration Form */}
        <form onSubmit={handleSaveSettings} className="pt-4 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label htmlFor="ownerEmailReadonly" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Authorized Owner Gmail (Locked for Privacy)
              </label>
              <input
                id="ownerEmailReadonly"
                type="email"
                readOnly
                value={OWNER_EMAIL}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-200 bg-slate-100 text-slate-700 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-5">
              <label htmlFor="sheetsWebhookInput" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Connected Google Sheets & Gmail Web App URL
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

            <div className="md:col-span-3">
              <label htmlFor="ownerWhatsappInput" className="block text-xs font-semibold text-slate-800 mb-1.5">
                Owner WhatsApp Number (Optional)
              </label>
              <input
                id="ownerWhatsappInput"
                type="tel"
                placeholder="e.g., +91 9876543210"
                value={whatsappInput}
                onChange={(e) => setWhatsappInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {savedBanner ? 'Owner Notification Settings Saved!' : 'Save Notification Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Step-by-Step Upgrade Instructions for Google Apps Script (Gmail + CSV + Total Enrolled Count) */}
      <div className="bg-[#0F172A] text-white rounded-xl p-6 md:p-8 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs text-sky-300 font-medium">
              Complete Google Apps Script · Emails {OWNER_EMAIL} with CSV & Total Student Count
            </div>
            <h3 className="text-xl font-bold mt-1">
              Paste This Script in Your Google Sheet to Receive Automatic Gmail + CSV Alerts
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              This script saves every submission into your private Google Sheet, counts the total number of students enrolled, and emails <strong className="text-white font-mono">{OWNER_EMAIL}</strong> with all student details and the complete <strong>edu-saptarish-all-enrollments.csv</strong> file attached.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyWebhookScript}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedScript ? 'Copied Script!' : 'Copy Gmail + CSV Apps Script'}
          </button>
        </div>

        {/* 4 Clear Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Step 01</span>
            <p className="mt-1 text-slate-200 font-medium">Open Your Google Sheet</p>
            <p className="mt-1 text-slate-400">
              In your Google Sheet, click <strong>Extensions → Apps Script</strong> from the top menu.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Step 02</span>
            <p className="mt-1 text-slate-200 font-medium">Paste & Save Code.gs</p>
            <p className="mt-1 text-slate-400">
              Replace the code in <code className="text-sky-300">Code.gs</code> with the script below and click the <strong>Save</strong> icon.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Step 03</span>
            <p className="mt-1 text-slate-200 font-medium">Deploy as Web App</p>
            <p className="mt-1 text-slate-400">
              Click <strong>Deploy → New deployment</strong> (Type: <strong>Web app</strong>, Execute as: <strong>Me</strong>, Access: <strong>Anyone</strong>).
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="font-mono text-sky-400 font-bold">Step 04</span>
            <p className="mt-1 text-slate-200 font-medium">Authorize Gmail & Sheets</p>
            <p className="mt-1 text-slate-400">
              Click <strong>Authorize access</strong> so Google Apps Script can email <code className="text-sky-300">{OWNER_EMAIL}</code> on every submission.
            </p>
          </div>
        </div>

        <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
          {webhookScript}
        </pre>
      </div>
    </div>
  );
};
