import React, { useState } from 'react';
import {
  CONFIRMATION_MESSAGE,
  generateGoogleAppsScript
} from '../utils/enrollmentLogic';
import { Copy, Check, CheckSquare, Square, FileCode2 } from 'lucide-react';

interface StepSpec {
  stepNumber: string;
  title: string;
  summary: string;
  googleFormAction: string;
  fieldsIncluded: {
    fieldNum: string;
    label: string;
    questionType: string;
    required: string;
    details: string;
  }[];
}

const GOOGLE_FORM_STEPS: StepSpec[] = [
  {
    stepNumber: '01',
    title: 'Create Form & Configure Header Description',
    summary: 'Open forms.google.com, start a Blank Form, and paste the official Edu Saptarish title, live online mode, and monthly fee table in the Form Description.',
    googleFormAction: 'Go to forms.google.com → Click "+ Blank form" → Set Form Title & Description',
    fieldsIncluded: [
      {
        fieldNum: 'Header',
        label: 'Edu Saptarish – Learn, Speak, Grow! | Live Online Classes Enrollment Form',
        questionType: 'Form Title & Description',
        required: 'Yes',
        details: 'List Mode: Live Online Classes and fees: Nursery to Class 8 (₹4,000/mo), Homemakers (₹5,000/mo), Working Professionals (₹5,000/mo), Business Professionals (₹5,000/mo).'
      }
    ]
  },
  {
    stepNumber: '02',
    title: 'Section 1: Student / Participant & Guardian Profile (Fields 1–3)',
    summary: 'Add the first three questions to capture the learner’s full name, age/school class, and parent/guardian name for school children.',
    googleFormAction: 'Add 3 "Short answer" questions in Section 1',
    fieldsIncluded: [
      {
        fieldNum: 'Field 1',
        label: 'Student / Participant Name',
        questionType: 'Short answer',
        required: 'Required',
        details: 'Captures the full legal or preferred name of the student or adult participant.'
      },
      {
        fieldNum: 'Field 2',
        label: 'Age and Class (for students)',
        questionType: 'Short answer (or Dropdown for Class)',
        required: 'Required',
        details: 'Add description: "Enter Age in years, plus Class (Nursery to Class 8) if enrolling a school student."'
      },
      {
        fieldNum: 'Field 3',
        label: 'Parent / Guardian Name (for children)',
        questionType: 'Short answer',
        required: 'Required for Nursery–Class 8',
        details: 'Add description: "Mandatory for Nursery to Class 8 students; adult learners may enter N/A."'
      }
    ]
  },
  {
    stepNumber: '03',
    title: 'Section 2: Contact & Location Information (Fields 4–6)',
    summary: 'Collect verified WhatsApp/Mobile number, Email address, and City/State with Google Forms response validation enabled.',
    googleFormAction: 'Click "Add section" → Add 3 "Short answer" questions with Response Validation',
    fieldsIncluded: [
      {
        fieldNum: 'Field 4',
        label: 'Mobile / WhatsApp Number',
        questionType: 'Short answer + Regex Validation',
        required: 'Required',
        details: 'Click ⋮ (three dots) → Response validation → Regular expression → Matches → ^(\\+91[\\-\\s]?)?[6-9]\\d{9}$'
      },
      {
        fieldNum: 'Field 5',
        label: 'Email Address',
        questionType: 'Short answer + Email Validation',
        required: 'Required',
        details: 'Click ⋮ → Response validation → Text → Email (or enable "Collect email addresses" in Settings).'
      },
      {
        fieldNum: 'Field 6',
        label: 'City and State',
        questionType: 'Short answer',
        required: 'Required',
        details: 'Example helper text: "Bengaluru, Karnataka" or "Pune, Maharashtra".'
      }
    ]
  },
  {
    stepNumber: '04',
    title: 'Section 3: Program, Class Timing & Learning Goals (Fields 7–9)',
    summary: 'Configure the 4 tuition programs, preferred IST live online batch timings, and the 5 communication learning goals.',
    googleFormAction: 'Click "Add section" → Add Multiple Choice, Dropdown, and Checkboxes',
    fieldsIncluded: [
      {
        fieldNum: 'Field 7',
        label: 'Select Program',
        questionType: 'Multiple choice',
        required: 'Required',
        details: 'Options: (1) Nursery to Class 8 — ₹4,000 per month | (2) Homemakers — ₹5,000 per month | (3) Working Professionals — ₹5,000 per month | (4) Business Professionals — ₹5,000 per month'
      },
      {
        fieldNum: 'Field 8',
        label: 'Preferred Class Timing',
        questionType: 'Dropdown',
        required: 'Required',
        details: 'Options: Morning (07:30–08:30 AM), Mid-Morning (10:30–11:30 AM), Afternoon School (04:00–05:00 PM), Evening (06:00–07:00 PM), Late Evening (08:30–09:30 PM), Weekend Intensive.'
      },
      {
        fieldNum: 'Field 9',
        label: 'Learning Goals',
        questionType: 'Checkboxes (Multi-select)',
        required: 'Required',
        details: 'Options: Spoken English | Grammar | Public Speaking | Confidence Building | Professional Communication'
      }
    ]
  },
  {
    stepNumber: '05',
    title: 'Section 4: Payment Details & Consent Checkbox (Fields 10–11)',
    summary: 'Add Preferred Payment Method, Payment Status, and the mandatory Enrollment Consent Checkbox.',
    googleFormAction: 'Click "Add section" → Add Multiple Choice & Required Checkbox',
    fieldsIncluded: [
      {
        fieldNum: 'Field 10',
        label: 'Preferred Payment Method and Payment Status',
        questionType: 'Multiple choice (or 2 paired questions)',
        required: 'Required',
        details: 'Payment Methods: UPI (GPay/PhonePe/Paytm), Net Banking, Card, QR. Statuses: Paid – Transaction Completed | Pending – Request Payment Link on WhatsApp | Book Demo First.'
      },
      {
        fieldNum: 'Field 11',
        label: 'Consent Checkbox',
        questionType: 'Checkboxes (Single option marked Required)',
        required: 'Required',
        details: 'Option text: "I confirm the above details are accurate and consent to Edu Saptarish contacting me regarding Live Online Classes, schedules, and enrollment."'
      }
    ]
  },
  {
    stepNumber: '06',
    title: 'Configure Visual Theme & Confirmation Message',
    summary: 'Apply an educational color theme and paste the official Edu Saptarish confirmation message in Form Settings.',
    googleFormAction: 'Click "Settings" tab → "Presentation" → Edit "Confirmation message" → Click Save',
    fieldsIncluded: [
      {
        fieldNum: 'Settings',
        label: 'Official Confirmation Message',
        questionType: 'Presentation Setting',
        required: 'Yes',
        details: CONFIRMATION_MESSAGE
      }
    ]
  }
];

export const GoogleFormGuide: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>(['01']);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const appsScriptCode = generateGoogleAppsScript();

  const toggleStep = (stepNumber: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formDescriptionTemplate = `Welcome to Edu Saptarish – Learn, Speak, Grow!
Mode of Instruction: Live Online Classes

Program Fee Structure:
• Nursery to Class 8: ₹4,000 per month
• Homemakers: ₹5,000 per month
• Working Professionals: ₹5,000 per month
• Business Professionals: ₹5,000 per month

Learning Goals Covered:
Spoken English · Grammar · Public Speaking · Confidence Building · Professional Communication`;

  return (
    <div className="space-y-10">
      {/* Intro & Quick Copy Blocks */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-slate-500">
              Step-by-Step Google Forms Blueprint · Manual Setup & Automated Script
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              How to Create Your Google Enrollment Form in 6 Steps
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Follow the structured guide below to build the form manually in Google Forms, or copy the automated Google Apps Script at the bottom of this page to generate the entire 11-field form in your Google Drive in 15 seconds.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shrink-0">
            <div className="text-xs text-slate-500">Setup Checklist Progress</div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
              {completedSteps.length} / {GOOGLE_FORM_STEPS.length} Steps Completed
            </div>
          </div>
        </div>

        {/* Ready-to-Paste Copy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  1. Copyable Google Form Header & Description
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('desc', formDescriptionTemplate)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedKey === 'desc' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedKey === 'desc' ? 'Copied' : 'Copy Description'}
                </button>
              </div>
              <pre className="mt-3 text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded border border-slate-200">
                {formDescriptionTemplate}
              </pre>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  2. Copyable Confirmation Message (Settings → Presentation)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyText('confirm', CONFIRMATION_MESSAGE)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedKey === 'confirm' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedKey === 'confirm' ? 'Copied' : 'Copy Message'}
                </button>
              </div>
              <div className="mt-3 text-sm font-medium text-slate-900 bg-white p-4 rounded border border-slate-200 leading-relaxed">
                “{CONFIRMATION_MESSAGE}”
              </div>
              <p className="text-xs text-slate-500 mt-3">
                In Google Forms: Open the <strong>Settings</strong> tab → expand <strong>Presentation</strong> → click <strong>Edit</strong> next to Confirmation message → paste the text above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Blueprint */}
      <div className="space-y-4">
        {GOOGLE_FORM_STEPS.map((step) => {
          const isDone = completedSteps.includes(step.stepNumber);
          return (
            <div
              key={step.stepNumber}
              className={`bg-white border rounded-xl p-6 transition-colors ${
                isDone ? 'border-emerald-300' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.stepNumber)}
                    aria-label={`Mark Step ${step.stepNumber} complete`}
                    className="mt-0.5 text-slate-500 hover:text-[#0284C7] transition-colors cursor-pointer"
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-mono text-slate-500">
                      Step {step.stepNumber} · {step.googleFormAction}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{step.summary}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStep(step.stepNumber)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isDone ? 'Completed' : 'Mark Step Done'}
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4 font-semibold w-24">Field #</th>
                      <th className="py-2 pr-4 font-semibold w-56">Question Title</th>
                      <th className="py-2 pr-4 font-semibold w-48">Google Form Type</th>
                      <th className="py-2 pr-4 font-semibold w-32">Validation</th>
                      <th className="py-2 font-semibold">Configuration & Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {step.fieldsIncluded.map((f) => (
                      <tr key={f.fieldNum}>
                        <td className="py-3 pr-4 font-mono font-semibold text-slate-900 align-top">
                          {f.fieldNum}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-900 align-top">
                          {f.label}
                        </td>
                        <td className="py-3 pr-4 text-[#0284C7] font-medium align-top">
                          {f.questionType}
                        </td>
                        <td className="py-3 pr-4 align-top">{f.required}</td>
                        <td className="py-3 text-slate-600 align-top leading-relaxed">
                          {f.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Automated 1-Click Google Apps Script Generator */}
      <div className="bg-[#0F172A] text-white rounded-xl p-6 md:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-sky-300 font-medium">
                Instant Automation · Google Apps Script
              </div>
              <h3 className="text-xl font-bold mt-0.5">
                Auto-Generate This Entire Google Form in 15 Seconds
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Paste this script at <strong>script.google.com</strong> and click Run to automatically build the complete 11-field Edu Saptarish Google Form in your Google Drive.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopyText('script', appsScriptCode)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedKey === 'script' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copiedKey === 'script' ? 'Apps Script Copied!' : 'Copy Google Apps Script'}
          </button>
        </div>

        <pre className="mt-5 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
          {appsScriptCode}
        </pre>
      </div>
    </div>
  );
};
