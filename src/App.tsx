/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PROGRAMS,
  INITIAL_SUBMISSIONS,
  CONFIRMATION_MESSAGE,
  SUBMISSIONS_STORAGE_KEY,
  WEBHOOK_STORAGE_KEY,
  ProgramId,
  EnrollmentSubmission
} from './utils/enrollmentLogic';
import { EnrollmentForm } from './components/EnrollmentForm';
import { ProgramCatalog } from './components/ProgramCatalog';
import { GoogleFormGuide } from './components/GoogleFormGuide';
import { SubmissionsDirectory } from './components/SubmissionsDirectory';

type ActiveTab = 'form' | 'guide' | 'programs' | 'submissions';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramId>('nursery-class-8');

  const [submissions, setSubmissions] = useState<EnrollmentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SUBMISSIONS;
  });

  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState<string>(() => {
    try {
      return (
        localStorage.getItem(WEBHOOK_STORAGE_KEY) ||
        (import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string) ||
        ''
      );
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // ignore storage errors
    }
  }, [submissions]);

  const handleSaveWebhookUrl = (url: string) => {
    setSheetsWebhookUrl(url);
    try {
      localStorage.setItem(WEBHOOK_STORAGE_KEY, url);
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmissionComplete = (newSub: EnrollmentSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    if (sheetsWebhookUrl && sheetsWebhookUrl.trim().startsWith('https://script.google.com/')) {
      fetch(sheetsWebhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newSub)
      }).catch(() => {
        // Non-blocking background sync to Google Sheets
      });
    }
  };

  const handleChooseProgramAndEnroll = (programId: ProgramId) => {
    setSelectedProgramId(programId);
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('form');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            Edu Saptarish
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'form' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Enrollment Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'guide' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Google Form Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('programs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'programs' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Programs & Fees
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('submissions')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'submissions' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Enrollments ({submissions.length})
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('form');
                const formEl = document.getElementById('workspace-main');
                formEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Enrollment
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Educational Hero Section */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-[#0284C7] font-semibold">Edu Saptarish – Learn, Speak, Grow!</span>
                    <span aria-hidden="true">·</span>
                    <span>Mode: Live Online Classes</span>
                    <span aria-hidden="true">·</span>
                    <span>All 11 Mandatory Fields Included</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-slate-900 mt-3 leading-[1.15] tracking-tight text-balance">
                    Live Online English & Communication Enrollment Studio
                  </h1>

                  <p className="text-base text-slate-600 mt-4 leading-relaxed max-w-2xl">
                    Register directly using our interactive 11-point Google Enrollment Form or follow our step-by-step Google Forms blueprint & 1-click Google Apps Script to deploy this exact form in your own Google Workspace.
                  </p>
                </div>

                {/* Interactive Workspace Mode Switcher */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div
                    role="tablist"
                    aria-label="Workspace View Switcher"
                    className="grid grid-cols-2 sm:inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'form'}
                      onClick={() => setActiveTab('form')}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === 'form'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      1. Enrollment Form
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'guide'}
                      onClick={() => setActiveTab('guide')}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === 'guide'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      2. Google Form Guide
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'programs'}
                      onClick={() => setActiveTab('programs')}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === 'programs'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      3. Programs & Fees
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'submissions'}
                      onClick={() => setActiveTab('submissions')}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === 'submissions'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      4. Responses ({submissions.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Program Fee Matrix Card */}
              <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-xl p-6 flex flex-col justify-between border border-slate-800">
                <div>
                  <div className="flex items-center justify-between text-xs text-sky-300 font-medium pb-3 border-b border-slate-800">
                    <span>Official Tuition Rates</span>
                    <span>Mode: Live Online Classes</span>
                  </div>
                  <div className="divide-y divide-slate-800/80 mt-2">
                    {PROGRAMS.map((prog) => (
                      <div
                        key={prog.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {prog.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {prog.audience}
                          </div>
                        </div>
                        <div className="font-mono text-sm font-bold text-sky-400 tabular-nums shrink-0">
                          {prog.formattedFee}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 block mb-0.5">Learning Goals Covered:</span>
                  Spoken English · Grammar · Public Speaking · Confidence Building · Professional Communication
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Workspace Section */}
        <section id="workspace-main" className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          {activeTab === 'form' && (
            <EnrollmentForm
              selectedProgramId={selectedProgramId}
              onSelectProgram={setSelectedProgramId}
              onSubmissionComplete={handleSubmissionComplete}
              onNavigateToSubmissions={() => setActiveTab('submissions')}
            />
          )}

          {activeTab === 'guide' && <GoogleFormGuide />}

          {activeTab === 'programs' && (
            <ProgramCatalog
              selectedProgramId={selectedProgramId}
              onChooseProgramAndEnroll={handleChooseProgramAndEnroll}
            />
          )}

          {activeTab === 'submissions' && (
            <SubmissionsDirectory
              submissions={submissions}
              onNewEnrollment={() => setActiveTab('form')}
              sheetsWebhookUrl={sheetsWebhookUrl}
              onSaveWebhookUrl={handleSaveWebhookUrl}
            />
          )}
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900 font-display">
              Edu Saptarish – Learn, Speak, Grow!
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Mode: Live Online Classes</span>
          </div>
          <div className="max-w-xl sm:text-right">
            Confirmation Message: “{CONFIRMATION_MESSAGE}”
          </div>
        </div>
      </footer>
    </div>
  );
}
