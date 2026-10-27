/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PROGRAMS,
  CONFIRMATION_MESSAGE,
  DEFAULT_SHEETS_WEBHOOK_URL,
  OWNER_EMAIL,
  ProgramId,
  EnrollmentSubmission
} from './utils/enrollmentLogic';
import { EnrollmentForm } from './components/EnrollmentForm';
import { ProgramCatalog } from './components/ProgramCatalog';

type ActiveView = 'form' | 'programs';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('form');
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramId>('nursery-class-8');

  // Clear any legacy locally stored student records on mount
  useEffect(() => {
    try {
      localStorage.removeItem('edu_saptarish_submissions_v1');
      localStorage.removeItem('edu_saptarish_sheets_webhook_v1');
      localStorage.removeItem('edu_saptarish_sheets_webhook_v2');
      localStorage.removeItem('edu_saptarish_owner_whatsapp_v1');
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSubmissionComplete = (newSub: EnrollmentSubmission) => {
    const webhookUrl = (
      (import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string) ||
      DEFAULT_SHEETS_WEBHOOK_URL
    ).trim();

    // 1. Primary Dispatch: Google Apps Script Web App (Saves to Google Sheet, updates Master CSV in Google Drive, emails Owner + replies to Customer)
    if (webhookUrl.startsWith('https://script.google.com/')) {
      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newSub)
      }).catch(() => {
        // Non-blocking background dispatch
      });
    }

    // 2. Redundant Direct Email Dispatch to anjalikasaraswat901@gmail.com with Customer Autoresponse
    fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `[Edu Saptarish Enrollment] ${newSub.participantName} - ${newSub.programName} (${newSub.id})`,
        _replyto: newSub.email,
        _autoresponse: `${CONFIRMATION_MESSAGE} — Student: ${newSub.participantName} | Selected Course: ${newSub.programName} (₹${newSub.monthlyFee}/month) | Contact: ${newSub.mobileWhatsapp}`,
        Enrollment_ID: newSub.id,
        Submitted_At: newSub.submittedAt,
        Student_Participant_Name: newSub.participantName,
        Age: newSub.age,
        Class: newSub.studentClass,
        Parent_Guardian_Name: newSub.parentGuardianName || 'N/A',
        Mobile_WhatsApp: newSub.mobileWhatsapp,
        Email_ID: newSub.email,
        City_State: `${newSub.city}, ${newSub.state}`,
        Selected_Course: `${newSub.programName} (₹${newSub.monthlyFee}/month)`,
        Preferred_Class_Timing: newSub.preferredTiming,
        Learning_Goals: newSub.learningGoals.join(', '),
        Payment_Method: newSub.paymentMethod,
        Payment_Status: newSub.paymentStatus,
        Transaction_Reference: newSub.transactionReference || 'N/A',
        Mode: newSub.mode
      })
    }).catch(() => {
      // Non-blocking background email backup
    });
  };

  const handleChooseProgramAndEnroll = (programId: ProgramId) => {
    setSelectedProgramId(programId);
    setActiveView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract (Customer-Only Navigation) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('form');
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
              onClick={() => setActiveView('form')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'form' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Enrollment Form
            </button>
            <button
              type="button"
              onClick={() => setActiveView('programs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'programs' ? 'text-[#0284C7] font-semibold underline underline-offset-8' : ''
              }`}
            >
              Programs & Fees
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('programs');
                window.scrollTo({ top: 450, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Learning Goals
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('form');
                document.getElementById('workspace-main')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Class Timings
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveView('form');
                document.getElementById('workspace-main')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Enroll Now
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
                    <span>Interactive Small Batches</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-slate-900 mt-3 leading-[1.15] tracking-tight text-balance">
                    Live Online English & Communication Enrollment Form
                  </h1>

                  <p className="text-base text-slate-600 mt-4 leading-relaxed max-w-2xl">
                    Enroll in mentor-led live online classes designed for school students (Nursery to Class 8), homemakers, working professionals, and business leaders. Fill out your details below to register your seat.
                  </p>
                </div>

                {/* Clean Customer View Switcher */}
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <div
                    role="tablist"
                    aria-label="Enrollment Portal Views"
                    className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeView === 'form'}
                      onClick={() => setActiveView('form')}
                      className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeView === 'form'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Enrollment Form
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeView === 'programs'}
                      onClick={() => setActiveView('programs')}
                      className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        activeView === 'programs'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Program Details & Fees
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

        {/* Active Section */}
        <section id="workspace-main" className="max-w-7xl mx-auto px-6 py-8 md:py-10">
          {activeView === 'form' ? (
            <EnrollmentForm
              selectedProgramId={selectedProgramId}
              onSelectProgram={setSelectedProgramId}
              onSubmissionComplete={handleSubmissionComplete}
            />
          ) : (
            <ProgramCatalog
              selectedProgramId={selectedProgramId}
              onChooseProgramAndEnroll={handleChooseProgramAndEnroll}
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
            “{CONFIRMATION_MESSAGE}”
          </div>
        </div>
      </footer>
    </div>
  );
}
