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

export const OWNER_EMAIL = 'anjalikasaraswat901@gmail.com';

export const DEFAULT_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwvYteM3fk2uI3eT2SfeHwjqKSb-2r-EoF8ecdzU6qC_5CKJ1_SJnlnIIJwa7SlJugAw/exec';

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

export const CUSTOMER_REPLY_GREETING =
  'Thank you for choosing Edu Saptarish! Our team will contact you soon';

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
  const registrationFee = 0;
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
    if (
      !data.studentClass ||
      data.studentClass.trim() === '' ||
      data.studentClass === 'Not Applicable (Adult Learner)'
    ) {
      errors.studentClass = 'Please select the current school class (Nursery to Class 8).';
    }
    if (!data.parentGuardianName || data.parentGuardianName.trim().length < 2) {
      errors.parentGuardianName =
        'Parent or Guardian name is required for Nursery to Class 8 students.';
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

export function formatSubmissionAsCsvRow(sub: EnrollmentSubmission): string {
  const headers = [
    'Enrollment ID',
    'Submitted At',
    'Student/Participant Name',
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
    'Transaction Ref',
    'Mode'
  ];

  const values = [
    sub.id,
    sub.submittedAt,
    sub.participantName,
    sub.age,
    sub.studentClass,
    sub.parentGuardianName || 'N/A',
    sub.mobileWhatsapp,
    sub.email,
    sub.city,
    sub.state,
    sub.programName,
    String(sub.monthlyFee),
    sub.preferredTiming,
    sub.learningGoals.join('; '),
    sub.paymentMethod,
    sub.paymentStatus,
    sub.transactionReference || 'N/A',
    sub.mode
  ];

  const escapedValues = values.map((v) => `"${String(v).replace(/"/g, '""')}"`);
  return `${headers.join(',')}\n${escapedValues.join(',')}`;
}

export function generateGoogleSheetsWebhookScript(): string {
  return `/**
 * Edu Saptarish – Learn, Speak, Grow!
 * Complete Automated Google Sheet + Google Drive CSV + Owner & Customer Email Script
 *
 * WHAT THIS SCRIPT DOES AUTOMATICALLY ON EVERY FORM SUBMISSION:
 * 1. Saves the student's 11-field record into your Google Sheet in Google Drive.
 * 2. Creates/Updates "Edu_Saptarish_Enrollments_Summary.csv" in your Google Drive.
 * 3. Sends an Email to Owner (${OWNER_EMAIL}) with all student details, Total Enrolled count, and the Master CSV attachment.
 * 4. Sends an Confirmation Reply Email to the Customer (data.email) saying:
 *    "${CUSTOMER_REPLY_GREETING}" along with their Student Name, Email ID, Contact Details, and Selected Course.
 */
var OWNER_EMAIL = '${OWNER_EMAIL}';
var MASTER_CSV_FILENAME = 'Edu_Saptarish_Enrollments_Summary.csv';

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    'Enrollment ID', 'Submitted At', 'Student/Participant Name', 'Age', 'Class',
    'Parent/Guardian Name', 'Mobile/WhatsApp', 'Email', 'City', 'State',
    'Program', 'Monthly Fee (INR)', 'Preferred Timing', 'Learning Goals',
    'Payment Method', 'Payment Status', 'Transaction Ref', 'Mode'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var data = JSON.parse(e.postData.contents);
  var newRow = [
    data.id || '',
    data.submittedAt || new Date().toLocaleString('en-IN'),
    data.participantName || '',
    data.age || '',
    data.studentClass || '',
    data.parentGuardianName || 'N/A',
    data.mobileWhatsapp || '',
    data.email || '',
    data.city || '',
    data.state || '',
    data.programName || '',
    data.monthlyFee || '',
    data.preferredTiming || '',
    Array.isArray(data.learningGoals) ? data.learningGoals.join('; ') : (data.learningGoals || ''),
    data.paymentMethod || '',
    data.paymentStatus || '',
    data.transactionReference || 'N/A',
    data.mode || 'Live Online Classes'
  ];

  // 1. Save row in Google Sheet (in your Google Drive)
  sheet.appendRow(newRow);
  var totalStudentsEnrolled = Math.max(1, sheet.getLastRow() - 1);

  // Build Complete CSV Content of All Enrolled Students
  var allValues = sheet.getDataRange().getValues();
  var csvLines = [];
  var totalMonthlyTuition = 0;

  for (var i = 0; i < allValues.length; i++) {
    var row = allValues[i];
    if (i > 0 && !isNaN(Number(row[11]))) {
      totalMonthlyTuition += Number(row[11]);
    }
    var escapedRow = row.map(function(cell) {
      return '"' + String(cell).replace(/"/g, '""') + '"';
    });
    csvLines.push(escapedRow.join(','));
  }

  var fullCsvString = csvLines.join('\\n');

  // 2. Save / Update Master CSV File in Google Drive
  try {
    var existingFiles = DriveApp.getFilesByName(MASTER_CSV_FILENAME);
    if (existingFiles.hasNext()) {
      existingFiles.next().setContent(fullCsvString);
    } else {
      DriveApp.createFile(MASTER_CSV_FILENAME, fullCsvString, MimeType.CSV);
    }
  } catch (driveErr) {
    // Continues even if DriveApp scope is not yet authorized
  }

  // 3. Send Owner Notification Email + CSV Attachment to ${OWNER_EMAIL}
  var ownerSubject = '[Edu Saptarish] New Enrollment #' + totalStudentsEnrolled + ': ' + data.participantName + ' (' + data.programName + ')';
  var ownerBody = [
    'New Student Enrollment Submitted on Edu Saptarish – Learn, Speak, Grow!',
    '',
    '• Total Students Enrolled So Far: ' + totalStudentsEnrolled,
    '• Total Monthly Fee Committed: ₹' + totalMonthlyTuition.toLocaleString('en-IN') + ' / month',
    '',
    '--- SUBMITTED STUDENT DETAILS ---',
    '• Enrollment ID: ' + (data.id || ''),
    '• Student / Participant Name: ' + (data.participantName || ''),
    '• Age & Class: ' + (data.age || '') + ' Years | ' + (data.studentClass || ''),
    '• Parent / Guardian Name: ' + (data.parentGuardianName || 'N/A'),
    '• Mobile / WhatsApp Number: ' + (data.mobileWhatsapp || ''),
    '• Email ID: ' + (data.email || ''),
    '• City & State: ' + (data.city || '') + ', ' + (data.state || ''),
    '• Selected Course / Program: ' + (data.programName || '') + ' (₹' + (data.monthlyFee || '') + '/month)',
    '• Preferred Class Timing: ' + (data.preferredTiming || ''),
    '• Learning Goals: ' + (Array.isArray(data.learningGoals) ? data.learningGoals.join(', ') : ''),
    '• Payment Method & Status: ' + (data.paymentMethod || '') + ' | ' + (data.paymentStatus || ''),
    '• Mode: Live Online Classes'
  ].join('\\n');

  var csvBlob = Utilities.newBlob(fullCsvString, 'text/csv', MASTER_CSV_FILENAME);

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    replyTo: data.email || OWNER_EMAIL,
    subject: ownerSubject,
    body: ownerBody,
    attachments: [csvBlob]
  });

  // 4. Send Auto-Reply Confirmation Email to Customer (data.email)
  if (data.email && String(data.email).indexOf('@') !== -1) {
    var customerSubject = 'Thank you for choosing Edu Saptarish! – Enrollment Confirmation (' + (data.id || '') + ')';
    var customerBody = [
      'Dear ' + (data.participantName || 'Learner') + ',',
      '',
      '${CONFIRMATION_MESSAGE}',
      '',
      'Here is a summary of the enrollment details you submitted:',
      '--------------------------------------------------',
      '• Reference ID: ' + (data.id || ''),
      '• Student / Participant Name: ' + (data.participantName || ''),
      '• Age & Class: ' + (data.age || '') + ' Years (' + (data.studentClass || '') + ')',
      data.parentGuardianName ? ('• Parent / Guardian Name: ' + data.parentGuardianName) : null,
      '• Email ID: ' + (data.email || ''),
      '• Contact / WhatsApp Number: ' + (data.mobileWhatsapp || ''),
      '• City & State: ' + (data.city || '') + ', ' + (data.state || ''),
      '• Selected Course / Program: ' + (data.programName || '') + ' (₹' + (data.monthlyFee || '') + ' per month)',
      '• Mode of Classes: Live Online Classes',
      '• Preferred Class Timing: ' + (data.preferredTiming || ''),
      '• Selected Learning Goals: ' + (Array.isArray(data.learningGoals) ? data.learningGoals.join(', ') : ''),
      '• Payment Method & Status: ' + (data.paymentMethod || '') + ' (' + (data.paymentStatus || '') + ')',
      '--------------------------------------------------',
      '',
      'Warm regards,',
      'Team Edu Saptarish – Learn, Speak, Grow!'
    ].filter(Boolean).join('\\n');

    MailApp.sendEmail({
      to: String(data.email).trim(),
      replyTo: OWNER_EMAIL,
      subject: customerSubject,
      body: customerBody
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    id: data.id,
    totalStudentsEnrolled: totalStudentsEnrolled
  })).setMimeType(ContentService.MimeType.JSON);
}`;
}
