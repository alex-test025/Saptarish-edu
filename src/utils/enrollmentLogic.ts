export type ProgramId =
  | 'nursery-class-8'
  | 'homemakers'
  | 'working-professionals'
  | 'business-professionals';

export interface ProgramOption {
  id: ProgramId;
  name: string;
  monthlyFee: number;
  formattedFee: string;
  audience: string;
  isStudentTrack: boolean;
  scheduleSummary: string;
  keyModules: string[];
}

export const PROGRAMS: ProgramOption[] = [
  {
    id: 'nursery-class-8',
    name: 'Nursery to Class 8',
    monthlyFee: 4000,
    formattedFee: '₹4,000 / month',
    audience: 'School Students (Ages 3–14)',
    isStudentTrack: true,
    scheduleSummary: 'Live Online · 5 Days/Week · Interactive Small Batches',
    keyModules: [
      'Phonics & Early Reading Foundation',
      'Applied Grammar & Sentence Structure',
      'Show-and-Tell & Stage Confidence',
      'Conversational Fluency & Vocabulary'
    ]
  },
  {
    id: 'homemakers',
    name: 'Homemakers',
    monthlyFee: 5000,
    formattedFee: '₹5,000 / month',
    audience: 'Homemakers & Parents',
    isStudentTrack: false,
    scheduleSummary: 'Live Online · Flexible Morning/Afternoon Slots · Practical Conversation',
    keyModules: [
      'Everyday Conversational English',
      'Parent-Teacher Meeting & Social Etiquette',
      'Pronunciation & Grammar Refinement',
      'Hesitation Removal & Self-Expression'
    ]
  },
  {
    id: 'working-professionals',
    name: 'Working Professionals',
    monthlyFee: 5000,
    formattedFee: '₹5,000 / month',
    audience: 'Corporate & Career Professionals',
    isStudentTrack: false,
    scheduleSummary: 'Live Online · Early Morning / Evening / Weekend Cohorts',
    keyModules: [
      'Executive Presence & Meeting Articulation',
      'Interview Readiness & Career Pitching',
      'Email & Cross-Functional Communication',
      'Impromptu Speaking & Presentation Fluency'
    ]
  },
  {
    id: 'business-professionals',
    name: 'Business Professionals',
    monthlyFee: 5000,
    formattedFee: '₹5,000 / month',
    audience: 'Entrepreneurs, Founders & Client Leaders',
    isStudentTrack: false,
    scheduleSummary: 'Live Online · Customized Executive Timings · 1-on-1 & Peer Labs',
    keyModules: [
      'Client Pitching & High-Stakes Negotiation',
      'Keynote & Public Speaking Mastery',
      'Cross-Cultural Business Diplomacy',
      'Persuasive Storytelling & Brand Voice'
    ]
  }
];

export const LEARNING_GOALS = [
  'Spoken English',
  'Grammar',
  'Public Speaking',
  'Confidence Building',
  'Professional Communication'
] as const;

export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const CLASS_TIMINGS = [
  'Morning Batch (07:30 AM – 08:30 AM IST)',
  'Mid-Morning Batch (10:30 AM – 11:30 AM IST)',
  'Afternoon School Batch (04:00 PM – 05:00 PM IST)',
  'Evening Batch (06:00 PM – 07:00 PM IST)',
  'Late Evening Professional Batch (08:30 PM – 09:30 PM IST)',
  'Weekend Intensive Batch (Sat & Sun, 10:00 AM – 12:00 PM IST)'
] as const;

export const STUDENT_CLASSES = [
  'Nursery',
  'LKG / UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Not Applicable (Adult Learner)'
] as const;

export const PAYMENT_METHODS = [
  'UPI (Google Pay / PhonePe / Paytm)',
  'Net Banking (NEFT / IMPS)',
  'Credit / Debit Card',
  'Bank QR Transfer'
] as const;

export const PAYMENT_STATUSES = [
  'Paid – Transaction Completed',
  'Pending – Request Payment Link on WhatsApp',
  'Book Demo / Counseling Call First'
] as const;

export const CONFIRMATION_MESSAGE =
  'Thank you for choosing Edu Saptarish! Our team will contact you soon regarding enrollment and class schedules.';

export interface EnrollmentFormData {
  participantName: string;
  age: string;
  studentClass: string;
  parentGuardianName: string;
  mobileWhatsapp: string;
  email: string;
  city: string;
  state: string;
  programId: ProgramId;
  preferredTiming: string;
  learningGoals: string[];
  paymentMethod: string;
  paymentStatus: string;
  transactionReference?: string;
  consentAccepted: boolean;
}

export interface ValidationErrors {
  participantName?: string;
  age?: string;
  studentClass?: string;
  parentGuardianName?: string;
  mobileWhatsapp?: string;
  email?: string;
  city?: string;
  state?: string;
  programId?: string;
  preferredTiming?: string;
  learningGoals?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  consentAccepted?: string;
}

export interface EnrollmentSubmission extends EnrollmentFormData {
  id: string;
  submittedAt: string;
  programName: string;
  monthlyFee: number;
  mode: 'Live Online Classes';
}

export function getProgramById(id: ProgramId): ProgramOption {
  const found = PROGRAMS.find((p) => p.id === id);
  return found ?? PROGRAMS[0];
}

export function calculateFeeSummary(programId: ProgramId): {
  monthlyFee: number;
  formattedMonthly: string;
  registrationFee: number;
  totalDueNow: number;
  formattedTotal: string;
} {
  const program = getProgramById(programId);
  const monthlyFee = program.monthlyFee;
  const registrationFee = 0; // Zero hidden admission surcharge
  const totalDueNow = monthlyFee + registrationFee;
  const formattedMonthly = `₹${monthlyFee.toLocaleString('en-IN')}`;
  const formattedTotal = `₹${totalDueNow.toLocaleString('en-IN')}`;
  return {
    monthlyFee,
    formattedMonthly,
    registrationFee,
    totalDueNow,
    formattedTotal
  };
}

export function validateEnrollmentForm(data: EnrollmentFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  const program = getProgramById(data.programId);

  if (!data.participantName || data.participantName.trim().length < 2) {
    errors.participantName = 'Please enter the full name of the student or participant.';
  }

  const parsedAge = Number(data.age);
  if (!data.age || Number.isNaN(parsedAge) || parsedAge < 3 || parsedAge > 90) {
    errors.age = 'Please enter a valid age between 3 and 90 years.';
  }

  if (program.isStudentTrack) {
    if (!data.studentClass || data.studentClass.trim() === '' || data.studentClass === 'Not Applicable (Adult Learner)') {
      errors.studentClass = 'Please select the current school class (Nursery to Class 8).';
    }
    if (!data.parentGuardianName || data.parentGuardianName.trim().length < 2) {
      errors.parentGuardianName = 'Parent or Guardian name is required for Nursery to Class 8 students.';
    }
  } else if (parsedAge > 0 && parsedAge < 18) {
    if (!data.parentGuardianName || data.parentGuardianName.trim().length < 2) {
      errors.parentGuardianName = 'Parent or Guardian name is required for participants under 18.';
    }
  }

  const cleanedPhone = (data.mobileWhatsapp || '').replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
    errors.mobileWhatsapp = 'Please enter a valid 10-digit Indian Mobile / WhatsApp number.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }

  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'Please enter your state.';
  }

  if (!data.programId) {
    errors.programId = 'Please select an enrollment program.';
  }

  if (!data.preferredTiming || data.preferredTiming.trim() === '') {
    errors.preferredTiming = 'Please choose a preferred live online class timing.';
  }

  if (!Array.isArray(data.learningGoals) || data.learningGoals.length === 0) {
    errors.learningGoals = 'Please select at least one learning goal.';
  }

  if (!data.paymentMethod || data.paymentMethod.trim() === '') {
    errors.paymentMethod = 'Please select a preferred payment method.';
  }

  if (!data.paymentStatus || data.paymentStatus.trim() === '') {
    errors.paymentStatus = 'Please select your current payment status.';
  }

  if (!data.consentAccepted) {
    errors.consentAccepted =
      'Please confirm your consent to enroll in Live Online Classes with Edu Saptarish.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateGoogleAppsScript(): string {
  return `/**
 * Edu Saptarish – Learn, Speak, Grow!
 * Automated Google Enrollment Form Generator (Google Apps Script)
 *
 * HOW TO RUN:
 * 1. Open https://script.google.com and click "New Project"
 * 2. Paste this entire code into Code.gs and click Save
 * 3. Click "Run" -> Select "createEduSaptarishEnrollmentForm"
 * 4. Authorize permissions when prompted, then check the Execution Log for your live Form URLs!
 */
function createEduSaptarishEnrollmentForm() {
  var form = FormApp.create('Edu Saptarish – Learn, Speak, Grow! | Live Online Classes Enrollment Form');

  form.setDescription(
    'Welcome to Edu Saptarish – Learn, Speak, Grow!\\n' +
    'Mode of Instruction: Live Online Classes (Interactive Small Cohorts & Personalized Coaching)\\n\\n' +
    'Program Fee Structure:\\n' +
    '• Nursery to Class 8: ₹4,000 per month\\n' +
    '• Homemakers: ₹5,000 per month\\n' +
    '• Working Professionals: ₹5,000 per month\\n' +
    '• Business Professionals: ₹5,000 per month\\n\\n' +
    'Please complete all sections below to register your seat.'
  );

  form.setCollectEmail(true);
  form.setConfirmationMessage(
    '${CONFIRMATION_MESSAGE}'
  );

  // SECTION 1: Participant & Guardian Profile
  form.addSectionHeaderItem()
    .setTitle('Section 1: Student / Participant Details')
    .setHelpText('Provide accurate learner details for enrollment records and batch placement.');

  // 1. Student/Participant Name
  form.addTextItem()
    .setTitle('1. Student / Participant Full Name')
    .setRequired(true);

  // 2. Age and Class (for students)
  form.addTextItem()
    .setTitle('2. Age and Current Class (Specify Age for all; mention Class if Nursery to Class 8)')
    .setHelpText('Example: "10 years, Class 5" (for school students) or "32 years, N/A" (for adult learners)')
    .setRequired(true);

  // 3. Parent/Guardian Name (for children)
  form.addTextItem()
    .setTitle('3. Parent / Guardian Full Name (Mandatory for Nursery to Class 8 students)')
    .setHelpText('Leave blank or write N/A if enrolling as an adult participant.')
    .setRequired(false);

  // SECTION 2: Contact & Location Information
  form.addPageBreakItem()
    .setTitle('Section 2: Contact & Location Details')
    .setHelpText('Class links, schedule updates, and mentor feedback will be shared via WhatsApp and Email.');

  // 4. Mobile/WhatsApp Number
  var phoneValidation = FormApp.createTextValidation()
    .setHelpText('Please enter a valid 10-digit Mobile / WhatsApp number.')
    .requireTextMatchesPattern('^(\\\\+91[\\\\-\\\\s]?)?[6-9]\\\\d{9}$')
    .build();

  form.addTextItem()
    .setTitle('4. Mobile / WhatsApp Number')
    .setHelpText('Enter your active 10-digit WhatsApp number for live class links.')
    .setValidation(phoneValidation)
    .setRequired(true);

  // 5. Email Address
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .build();

  form.addTextItem()
    .setTitle('5. Email Address')
    .setValidation(emailValidation)
    .setRequired(true);

  // 6. City and State
  form.addTextItem()
    .setTitle('6. City and State')
    .setHelpText('Example: Bengaluru, Karnataka')
    .setRequired(true);

  // SECTION 3: Program Selection, Timing & Learning Goals
  form.addPageBreakItem()
    .setTitle('Section 3: Program Selection & Learning Preferences (Mode: Live Online Classes)')
    .setHelpText('Choose your track, preferred batch slot, and communication goals.');

  // 7. Select Program
  var programItem = form.addMultipleChoiceItem();
  programItem.setTitle('7. Select Program (Mode: Live Online Classes)')
    .setChoices([
      programItem.createChoice('Nursery to Class 8 — ₹4,000 per month'),
      programItem.createChoice('Homemakers — ₹5,000 per month'),
      programItem.createChoice('Working Professionals — ₹5,000 per month'),
      programItem.createChoice('Business Professionals — ₹5,000 per month')
    ])
    .setRequired(true);

  // 8. Preferred Class Timing
  var timingItem = form.addListItem();
  timingItem.setTitle('8. Preferred Class Timing (IST)')
    .setChoices([
      timingItem.createChoice('Morning Batch (07:30 AM – 08:30 AM IST)'),
      timingItem.createChoice('Mid-Morning Batch (10:30 AM – 11:30 AM IST)'),
      timingItem.createChoice('Afternoon School Batch (04:00 PM – 05:00 PM IST)'),
      timingItem.createChoice('Evening Batch (06:00 PM – 07:00 PM IST)'),
      timingItem.createChoice('Late Evening Professional Batch (08:30 PM – 09:30 PM IST)'),
      timingItem.createChoice('Weekend Intensive Batch (Sat & Sun, 10:00 AM – 12:00 PM IST)')
    ])
    .setRequired(true);

  // 9. Learning Goals
  var goalsItem = form.addCheckboxItem();
  goalsItem.setTitle('9. Learning Goals (Select all that apply)')
    .setChoices([
      goalsItem.createChoice('Spoken English'),
      goalsItem.createChoice('Grammar'),
      goalsItem.createChoice('Public Speaking'),
      goalsItem.createChoice('Confidence Building'),
      goalsItem.createChoice('Professional Communication')
    ])
    .setRequired(true);

  // SECTION 4: Fee Payment & Enrollment Consent
  form.addPageBreakItem()
    .setTitle('Section 4: Payment Details & Enrollment Consent')
    .setHelpText('Select your preferred payment mode and confirm enrollment terms.');

  // 10A. Preferred Payment Method
  var paymentMethodItem = form.addMultipleChoiceItem();
  paymentMethodItem.setTitle('10A. Preferred Payment Method')
    .setChoices([
      paymentMethodItem.createChoice('UPI (Google Pay / PhonePe / Paytm)'),
      paymentMethodItem.createChoice('Net Banking (NEFT / IMPS)'),
      paymentMethodItem.createChoice('Credit / Debit Card'),
      paymentMethodItem.createChoice('Bank QR Transfer')
    ])
    .setRequired(true);

  // 10B. Payment Status
  var paymentStatusItem = form.addMultipleChoiceItem();
  paymentStatusItem.setTitle('10B. Payment Status')
    .setChoices([
      paymentStatusItem.createChoice('Paid – Transaction Completed'),
      paymentStatusItem.createChoice('Pending – Request Payment Link on WhatsApp'),
      paymentStatusItem.createChoice('Book Demo / Counseling Call First')
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Transaction Reference / UTR Number (Optional if Pending)')
    .setRequired(false);

  // 11. Consent Checkbox
  var consentItem = form.addCheckboxItem();
  consentItem.setTitle('11. Enrollment & Communication Consent')
    .setChoices([
      consentItem.createChoice('I confirm that the details provided above are accurate, and I consent to Edu Saptarish contacting me via Phone/WhatsApp/Email regarding Live Online Classes, schedules, and fee enrollment.')
    ])
    .setRequired(true);

  Logger.log('Published Live Form URL: ' + form.getPublishedUrl());
  Logger.log('Form Editor URL: ' + form.getEditUrl());
}`;
}

export const INITIAL_SUBMISSIONS: EnrollmentSubmission[] = [
  {
    id: 'ES-2026-1041',
    submittedAt: '26 Oct 2026, 09:15 AM',
    participantName: 'Aarav Sharma',
    age: '11',
    studentClass: 'Class 6',
    parentGuardianName: 'Rohit Sharma',
    mobileWhatsapp: '+91 9845012345',
    email: 'rohit.sharma.parent@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    programId: 'nursery-class-8',
    programName: 'Nursery to Class 8',
    monthlyFee: 4000,
    preferredTiming: 'Afternoon School Batch (04:00 PM – 05:00 PM IST)',
    learningGoals: ['Spoken English', 'Grammar', 'Public Speaking', 'Confidence Building'],
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Paid – Transaction Completed',
    transactionReference: 'UPI-629910482192',
    consentAccepted: true,
    mode: 'Live Online Classes'
  },
  {
    id: 'ES-2026-1042',
    submittedAt: '26 Oct 2026, 09:32 AM',
    participantName: 'Meera Deshmukh',
    age: '34',
    studentClass: 'Not Applicable (Adult Learner)',
    parentGuardianName: '',
    mobileWhatsapp: '+91 9820154321',
    email: 'meera.deshmukh@example.com',
    city: 'Pune',
    state: 'Maharashtra',
    programId: 'homemakers',
    programName: 'Homemakers',
    monthlyFee: 5000,
    preferredTiming: 'Mid-Morning Batch (10:30 AM – 11:30 AM IST)',
    learningGoals: ['Spoken English', 'Confidence Building', 'Public Speaking'],
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Pending – Request Payment Link on WhatsApp',
    transactionReference: '',
    consentAccepted: true,
    mode: 'Live Online Classes'
  },
  {
    id: 'ES-2026-1043',
    submittedAt: '26 Oct 2026, 09:44 AM',
    participantName: 'Vikramaditya Nair',
    age: '29',
    studentClass: 'Not Applicable (Adult Learner)',
    parentGuardianName: '',
    mobileWhatsapp: '+91 9711223344',
    email: 'vikram.nair@example.com',
    city: 'Hyderabad',
    state: 'Telangana',
    programId: 'working-professionals',
    programName: 'Working Professionals',
    monthlyFee: 5000,
    preferredTiming: 'Late Evening Professional Batch (08:30 PM – 09:30 PM IST)',
    learningGoals: ['Professional Communication', 'Public Speaking', 'Confidence Building'],
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid – Transaction Completed',
    transactionReference: 'TXN-88392011',
    consentAccepted: true,
    mode: 'Live Online Classes'
  }
];
