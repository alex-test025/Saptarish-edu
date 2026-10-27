import React, { useState } from 'react';
import {
  PROGRAMS,
  LEARNING_GOALS,
  CLASS_TIMINGS,
  STUDENT_CLASSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  CONFIRMATION_MESSAGE,
  ProgramId,
  EnrollmentFormData,
  EnrollmentSubmission,
  ValidationErrors,
  getProgramById,
  calculateFeeSummary,
  validateEnrollmentForm
} from '../utils/enrollmentLogic';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  MailCheck
} from 'lucide-react';

interface EnrollmentFormProps {
  selectedProgramId: ProgramId;
  onSelectProgram: (id: ProgramId) => void;
  onSubmissionComplete: (submission: EnrollmentSubmission) => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  selectedProgramId,
  onSelectProgram,
  onSubmissionComplete
}) => {
  const [formData, setFormData] = useState<EnrollmentFormData>({
    participantName: '',
    age: '',
    studentClass: 'Class 5',
    parentGuardianName: '',
    mobileWhatsapp: '',
    email: '',
    city: '',
    state: '',
    programId: selectedProgramId,
    preferredTiming: CLASS_TIMINGS[2],
    learningGoals: ['Spoken English', 'Confidence Building'],
    paymentMethod: PAYMENT_METHODS[0],
    paymentStatus: PAYMENT_STATUSES[0],
    transactionReference: '',
    consentAccepted: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<EnrollmentSubmission | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  React.useEffect(() => {
    const prog = getProgramById(selectedProgramId);
    setFormData((prev) => ({
      ...prev,
      programId: selectedProgramId,
      studentClass: prog.isStudentTrack
        ? prev.studentClass === 'Not Applicable (Adult Learner)'
          ? 'Class 5'
          : prev.studentClass
        : 'Not Applicable (Adult Learner)'
    }));
  }, [selectedProgramId]);

  const currentProgram = getProgramById(formData.programId);
  const feeSummary = calculateFeeSummary(formData.programId);

  const handleProgramChange = (programId: ProgramId) => {
    onSelectProgram(programId);
    const prog = getProgramById(programId);
    setFormData((prev) => ({
      ...prev,
      programId,
      studentClass: prog.isStudentTrack
        ? prev.studentClass === 'Not Applicable (Adult Learner)'
          ? 'Class 5'
          : prev.studentClass
        : 'Not Applicable (Adult Learner)'
    }));
    if (errors.programId || errors.studentClass || errors.parentGuardianName) {
      setErrors((prev) => ({
        ...prev,
        programId: undefined,
        studentClass: undefined,
        parentGuardianName: undefined
      }));
    }
  };

  const toggleLearningGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.learningGoals.includes(goal);
      const updated = exists
        ? prev.learningGoals.filter((g) => g !== goal)
        : [...prev.learningGoals, goal];
      return { ...prev, learningGoals: updated };
    });
    if (errors.learningGoals) {
      setErrors((prev) => ({ ...prev, learningGoals: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEnrollmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const newSubmission: EnrollmentSubmission = {
      ...formData,
      id: `ES-2026-${Math.floor(1050 + Math.random() * 8900)}`,
      submittedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      programName: currentProgram.name,
      monthlyFee: currentProgram.monthlyFee,
      mode: 'Live Online Classes'
    };

    setErrors({});
    setSubmittedRecord(newSubmission);
    onSubmissionComplete(newSubmission);
    document.getElementById('workspace-main')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setErrors({});
    setFormData({
      participantName: '',
      age: '',
      studentClass: currentProgram.isStudentTrack ? 'Class 5' : 'Not Applicable (Adult Learner)',
      parentGuardianName: '',
      mobileWhatsapp: '',
      email: '',
      city: '',
      state: '',
      programId: selectedProgramId,
      preferredTiming: CLASS_TIMINGS[2],
      learningGoals: ['Spoken English', 'Confidence Building'],
      paymentMethod: PAYMENT_METHODS[0],
      paymentStatus: PAYMENT_STATUSES[0],
      transactionReference: '',
      consentAccepted: false
    });
  };

  const handleCopyReceipt = () => {
    if (!submittedRecord) return;
    const receiptText = [
      `EDU SAPTARISH – LEARN, SPEAK, GROW!`,
      `Enrollment Confirmation Receipt (${submittedRecord.id})`,
      `Mode: ${submittedRecord.mode}`,
      `Student / Participant Name: ${submittedRecord.participantName}`,
      `Age & Class: ${submittedRecord.age} Years (${submittedRecord.studentClass})`,
      submittedRecord.parentGuardianName
        ? `Parent / Guardian Name: ${submittedRecord.parentGuardianName}`
        : null,
      `Email ID: ${submittedRecord.email}`,
      `Contact Details: ${submittedRecord.mobileWhatsapp} (${submittedRecord.city}, ${submittedRecord.state})`,
      `Selected Course: ${submittedRecord.programName} — ₹${submittedRecord.monthlyFee.toLocaleString('en-IN')}/month`,
      `Preferred Timing: ${submittedRecord.preferredTiming}`,
      `Learning Goals: ${submittedRecord.learningGoals.join(', ')}`,
      `Payment: ${submittedRecord.paymentMethod} (${submittedRecord.paymentStatus})`,
      `Confirmation: ${CONFIRMATION_MESSAGE}`
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard?.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  if (submittedRecord) {
    return (
      <div
        data-testid="enrollment-confirmation"
        className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 max-w-3xl mx-auto"
      >
        <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-emerald-700 mb-1">
              Enrollment Confirmed · Reference {submittedRecord.id} · Mode: {submittedRecord.mode}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Thank You for Enrolling!
            </h2>
            <p
              data-testid="confirmation-message-text"
              className="mt-3 text-base md:text-lg font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-4 leading-relaxed"
            >
              “{CONFIRMATION_MESSAGE}”
            </p>
          </div>
        </div>

        <div className="my-5 p-4 rounded-lg bg-sky-50/70 border border-sky-200 flex items-start gap-3 text-xs text-slate-700">
          <MailCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">Confirmation Email Sent:</strong> Your enrollment details (Student Name, Email ID, Contact Details, and Selected Course) have been recorded and a confirmation copy is sent to <span className="font-mono font-semibold text-slate-900">{submittedRecord.email}</span>.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 border-b border-slate-200 text-sm">
          <div>
            <span className="text-slate-500 block">Student / Participant Name</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {submittedRecord.participantName}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Age & Class</span>
            <span className="font-semibold text-slate-900 mt-0.5 block tabular-nums">
              {submittedRecord.age} Years · {submittedRecord.studentClass}
            </span>
          </div>
          {submittedRecord.parentGuardianName && (
            <div>
              <span className="text-slate-500 block">Parent / Guardian Name</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {submittedRecord.parentGuardianName}
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-500 block">Email ID</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {submittedRecord.email}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Contact Details</span>
            <span className="font-semibold text-slate-900 mt-0.5 block tabular-nums">
              {submittedRecord.mobileWhatsapp} · {submittedRecord.city}, {submittedRecord.state}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Selected Course & Monthly Fee</span>
            <span className="font-semibold text-[#0284C7] mt-0.5 block tabular-nums">
              {submittedRecord.programName} · ₹{submittedRecord.monthlyFee.toLocaleString('en-IN')} / month
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 block">Preferred Live Online Timing</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {submittedRecord.preferredTiming}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 block">Selected Learning Goals</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {submittedRecord.learningGoals.join(' · ')}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-500 block">Payment Method & Status</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">
              {submittedRecord.paymentMethod} · {submittedRecord.paymentStatus}
            </span>
          </div>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Submit Another Enrollment
          </button>

          <button
            type="button"
            onClick={handleCopyReceipt}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedReceipt ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedReceipt ? 'Receipt Copied' : 'Copy Confirmation Summary'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Structured 11-Field Google Enrollment Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Edu Saptarish Live Online Enrollment Form"
        className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        {/* Form Top Banner */}
        <div className="bg-[#0F172A] text-white p-6 md:p-8 border-b border-slate-800">
          <div className="text-xs text-sky-300 font-medium tracking-wide">
            Official Admission Form · Mode: Live Online Classes
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">
            Edu Saptarish – Learn, Speak, Grow!
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed max-w-2xl">
            Complete the enrollment form below to register for interactive live online classes in Spoken English, Grammar, Public Speaking, Confidence Building, and Professional Communication.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Please review the highlighted fields before submitting:</p>
                <p className="mt-1 text-xs text-red-700">{Object.values(errors)[0]}</p>
              </div>
            </div>
          )}

          {/* SECTION 01: Field 7 (Select Program) */}
          <section aria-labelledby="section-program-heading" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 id="section-program-heading" className="text-lg font-semibold text-slate-900">
                01. Select Program
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the learner track. Monthly tuition fees update automatically based on your selection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="radiogroup" aria-label="Select Program">
              {PROGRAMS.map((prog) => {
                const isSelected = formData.programId === prog.id;
                return (
                  <label
                    key={prog.id}
                    className={`relative flex flex-col justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-[#0284C7] bg-sky-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="programId"
                          value={prog.id}
                          checked={isSelected}
                          onChange={() => handleProgramChange(prog.id)}
                          className="w-4 h-4 text-[#0284C7] focus:ring-[#0284C7]"
                        />
                        <span className="font-semibold text-sm text-slate-900">{prog.name}</span>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#0284C7] tabular-nums shrink-0">
                        {prog.formattedFee}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 pl-6">
                      {prog.audience} · Live Online
                    </p>
                  </label>
                );
              })}
            </div>
          </section>

          {/* SECTION 02: Fields 1, 2, 3 (Participant & Guardian Details) */}
          <section aria-labelledby="section-participant-heading" className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 id="section-participant-heading" className="text-lg font-semibold text-slate-900">
                02. Student / Participant & Guardian Details
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                For Nursery to Class 8 students, both Class and Parent/Guardian Name are mandatory.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 1: Student/Participant Name */}
              <div className="sm:col-span-2">
                <label htmlFor="participantName" className="block text-sm font-medium text-slate-800 mb-1.5">
                  1. Student / Participant Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="participantName"
                  name="participantName"
                  type="text"
                  required
                  placeholder="Enter full name of student or participant"
                  value={formData.participantName}
                  onChange={(e) => {
                    setFormData({ ...formData, participantName: e.target.value });
                    if (errors.participantName) setErrors({ ...errors, participantName: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.participantName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.participantName && (
                  <p className="text-xs text-red-600 mt-1">{errors.participantName}</p>
                )}
              </div>

              {/* Field 2A: Age */}
              <div>
                <label htmlFor="participantAge" className="block text-sm font-medium text-slate-800 mb-1.5">
                  2A. Participant Age (Years) <span className="text-red-600">*</span>
                </label>
                <input
                  id="participantAge"
                  name="age"
                  type="number"
                  min={3}
                  max={90}
                  required
                  placeholder="e.g., 10 or 32"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.age ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
              </div>

              {/* Field 2B: Class (for students) */}
              <div>
                <label htmlFor="studentClass" className="block text-sm font-medium text-slate-800 mb-1.5">
                  2B. Current Class (for students){' '}
                  {currentProgram.isStudentTrack && <span className="text-red-600">*</span>}
                </label>
                <select
                  id="studentClass"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={(e) => {
                    setFormData({ ...formData, studentClass: e.target.value });
                    if (errors.studentClass) setErrors({ ...errors, studentClass: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.studentClass ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  {STUDENT_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {errors.studentClass && (
                  <p className="text-xs text-red-600 mt-1">{errors.studentClass}</p>
                )}
              </div>

              {/* Field 3: Parent/Guardian Name (for children) */}
              <div className="sm:col-span-2">
                <label htmlFor="parentGuardianName" className="block text-sm font-medium text-slate-800 mb-1.5">
                  3. Parent / Guardian Name (for children){' '}
                  {currentProgram.isStudentTrack ? (
                    <span className="text-red-600">*</span>
                  ) : (
                    <span className="text-xs font-normal text-slate-500">(Optional for adult tracks)</span>
                  )}
                </label>
                <input
                  id="parentGuardianName"
                  name="parentGuardianName"
                  type="text"
                  placeholder={
                    currentProgram.isStudentTrack
                      ? 'Enter Parent or Guardian full name'
                      : 'Optional for Homemakers, Working & Business Professionals'
                  }
                  value={formData.parentGuardianName}
                  onChange={(e) => {
                    setFormData({ ...formData, parentGuardianName: e.target.value });
                    if (errors.parentGuardianName)
                      setErrors({ ...errors, parentGuardianName: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.parentGuardianName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.parentGuardianName && (
                  <p className="text-xs text-red-600 mt-1">{errors.parentGuardianName}</p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 03: Fields 4, 5, 6 (Contact & Location) */}
          <section aria-labelledby="section-contact-heading" className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 id="section-contact-heading" className="text-lg font-semibold text-slate-900">
                03. Contact & Location Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your enrollment confirmation and live online class schedules will be sent to your Email and WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 4: Mobile/WhatsApp Number */}
              <div>
                <label htmlFor="mobileWhatsapp" className="block text-sm font-medium text-slate-800 mb-1.5">
                  4. Mobile / WhatsApp Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="mobileWhatsapp"
                  name="mobileWhatsapp"
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formData.mobileWhatsapp}
                  onChange={(e) => {
                    setFormData({ ...formData, mobileWhatsapp: e.target.value });
                    if (errors.mobileWhatsapp) setErrors({ ...errors, mobileWhatsapp: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.mobileWhatsapp ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.mobileWhatsapp && (
                  <p className="text-xs text-red-600 mt-1">{errors.mobileWhatsapp}</p>
                )}
              </div>

              {/* Field 5: Email Address */}
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-slate-800 mb-1.5">
                  5. Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="emailAddress"
                  name="email"
                  type="email"
                  required
                  placeholder="learner@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.email ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Field 6A: City */}
              <div>
                <label htmlFor="cityInput" className="block text-sm font-medium text-slate-800 mb-1.5">
                  6A. City <span className="text-red-600">*</span>
                </label>
                <input
                  id="cityInput"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g., Mumbai, Bengaluru, Delhi"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.city ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>

              {/* Field 6B: State */}
              <div>
                <label htmlFor="stateInput" className="block text-sm font-medium text-slate-800 mb-1.5">
                  6B. State <span className="text-red-600">*</span>
                </label>
                <input
                  id="stateInput"
                  name="state"
                  type="text"
                  required
                  placeholder="e.g., Maharashtra, Karnataka"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    if (errors.state) setErrors({ ...errors, state: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] ${
                    errors.state ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>
            </div>
          </section>

          {/* SECTION 04: Fields 8 & 9 (Timing & Learning Goals) */}
          <section aria-labelledby="section-learning-heading" className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 id="section-learning-heading" className="text-lg font-semibold text-slate-900">
                04. Class Schedule & Learning Goals
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All cohorts are conducted via Live Online Classes with active speaking practice.
              </p>
            </div>

            {/* Field 8: Preferred Class Timing */}
            <div>
              <label htmlFor="preferredTiming" className="block text-sm font-medium text-slate-800 mb-1.5">
                8. Preferred Class Timing (IST) <span className="text-red-600">*</span>
              </label>
              <select
                id="preferredTiming"
                name="preferredTiming"
                value={formData.preferredTiming}
                onChange={(e) => {
                  setFormData({ ...formData, preferredTiming: e.target.value });
                  if (errors.preferredTiming) setErrors({ ...errors, preferredTiming: undefined });
                }}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
              >
                {CLASS_TIMINGS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.preferredTiming && (
                <p className="text-xs text-red-600 mt-1">{errors.preferredTiming}</p>
              )}
            </div>

            {/* Field 9: Learning Goals */}
            <div>
              <span className="block text-sm font-medium text-slate-800 mb-2">
                9. Learning Goals (Select all that apply) <span className="text-red-600">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEARNING_GOALS.map((goal) => {
                  const checked = formData.learningGoals.includes(goal);
                  return (
                    <label
                      key={goal}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-colors ${
                        checked
                          ? 'border-[#0284C7] bg-sky-50/40 font-medium text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLearningGoal(goal)}
                        className="w-4 h-4 rounded text-[#0284C7] focus:ring-[#0284C7]"
                      />
                      <span>{goal}</span>
                    </label>
                  );
                })}
              </div>
              {errors.learningGoals && (
                <p className="text-xs text-red-600 mt-1.5">{errors.learningGoals}</p>
              )}
            </div>
          </section>

          {/* SECTION 05: Fields 10 & 11 (Payment Method, Payment Status & Consent Checkbox) */}
          <section aria-labelledby="section-payment-heading" className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 id="section-payment-heading" className="text-lg font-semibold text-slate-900">
                05. Preferred Payment & Enrollment Consent
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your preferred payment method, current status, and accept the enrollment consent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 10A: Preferred Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-800 mb-1.5">
                  10A. Preferred Payment Method <span className="text-red-600">*</span>
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => {
                    setFormData({ ...formData, paymentMethod: e.target.value });
                    if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: undefined });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 10B: Payment Status */}
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-slate-800 mb-1.5">
                  10B. Payment Status <span className="text-red-600">*</span>
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) => {
                    setFormData({ ...formData, paymentStatus: e.target.value });
                    if (errors.paymentStatus) setErrors({ ...errors, paymentStatus: undefined });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="transactionReference" className="block text-sm font-medium text-slate-800 mb-1.5">
                  UPI / Transaction Reference ID{' '}
                  <span className="text-xs font-normal text-slate-500">(Optional if payment is pending)</span>
                </label>
                <input
                  id="transactionReference"
                  name="transactionReference"
                  type="text"
                  placeholder="Enter UTR / Transaction ID if already paid"
                  value={formData.transactionReference}
                  onChange={(e) =>
                    setFormData({ ...formData, transactionReference: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                />
              </div>
            </div>

            {/* Field 11: Consent Checkbox */}
            <div className="pt-2">
              <label
                htmlFor="consentCheckbox"
                className={`flex items-start gap-3.5 p-4 rounded-lg border cursor-pointer transition-colors ${
                  errors.consentAccepted
                    ? 'border-red-400 bg-red-50/40'
                    : formData.consentAccepted
                    ? 'border-[#0284C7] bg-sky-50/30'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <input
                  id="consentCheckbox"
                  name="consentAccepted"
                  type="checkbox"
                  checked={formData.consentAccepted}
                  onChange={(e) => {
                    setFormData({ ...formData, consentAccepted: e.target.checked });
                    if (errors.consentAccepted) setErrors({ ...errors, consentAccepted: undefined });
                  }}
                  className="w-4 h-4 mt-1 rounded text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">11. Enrollment Consent:</strong> I confirm that the information provided above is accurate. I understand that classes are conducted in <strong>Live Online Classes</strong> mode and consent to Edu Saptarish contacting me via Phone, WhatsApp, or Email regarding batch schedules and enrollment formalities. <span className="text-red-600">*</span>
                </span>
              </label>
              {errors.consentAccepted && (
                <p className="text-xs text-red-600 mt-1.5">{errors.consentAccepted}</p>
              )}
            </div>
          </section>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Selected Track: <strong className="text-slate-800">{currentProgram.name}</strong> · Monthly Tuition:{' '}
              <strong className="text-[#0284C7] font-mono tabular-nums">{feeSummary.formattedMonthly}/month</strong>
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Submit Enrollment Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Right 4 Columns: Live Tuition Summary & Official Fee Structure */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              Live Tuition Summary · Mode: Live Online
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {currentProgram.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {currentProgram.scheduleSummary}
            </p>
          </div>

          <div className="py-4 border-y border-slate-200 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Monthly Tuition Fee</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {feeSummary.formattedMonthly} / month
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Registration / Material Fee</span>
              <span className="font-mono text-emerald-700 font-medium tabular-nums">
                ₹0 (Included)
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-900">Total Monthly Payable</span>
              <span
                data-testid="summary-monthly-fee"
                className="font-mono text-lg font-bold text-[#0284C7] tabular-nums"
              >
                {feeSummary.formattedTotal}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-2">
              Curriculum Highlights for {currentProgram.name}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {currentProgram.keyModules.map((mod) => (
                <li key={mod} className="flex items-start gap-2">
                  <span className="text-[#0284C7] font-bold">·</span>
                  <span>{mod}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official Fee Structure Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <h4 className="text-sm font-semibold text-slate-900">
            Official Monthly Fee Structure
          </h4>
          <p className="text-xs text-slate-500">
            Mode of Instruction: Live Online Classes
          </p>
          <div className="divide-y divide-slate-100 text-xs pt-1">
            {PROGRAMS.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-700 font-medium">{p.name}</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {p.formattedFee}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
