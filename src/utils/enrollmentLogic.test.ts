import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROGRAMS,
  OWNER_EMAIL,
  CONFIRMATION_MESSAGE,
  CUSTOMER_REPLY_GREETING,
  calculateFeeSummary,
  validateEnrollmentForm,
  generateGoogleSheetsWebhookScript,
  formatSubmissionAsCsvRow,
  EnrollmentFormData,
  EnrollmentSubmission
} from './enrollmentLogic';

test('program fee calculations match Edu Saptarish pricing exactly', () => {
  const studentSummary = calculateFeeSummary('nursery-class-8');
  assert.equal(studentSummary.monthlyFee, 4000);
  assert.equal(studentSummary.formattedMonthly, '₹4,000');

  const homemakerSummary = calculateFeeSummary('homemakers');
  assert.equal(homemakerSummary.monthlyFee, 5000);
  assert.equal(homemakerSummary.formattedMonthly, '₹5,000');

  const workingSummary = calculateFeeSummary('working-professionals');
  assert.equal(workingSummary.monthlyFee, 5000);

  const businessSummary = calculateFeeSummary('business-professionals');
  assert.equal(businessSummary.monthlyFee, 5000);
});

test('validates Nursery to Class 8 student enrollment requiring class and parent name', () => {
  const incompleteStudentForm: EnrollmentFormData = {
    participantName: 'Riya Verma',
    age: '10',
    studentClass: '',
    parentGuardianName: '',
    mobileWhatsapp: '9876543210',
    email: 'parent.verma@example.com',
    city: 'Jaipur',
    state: 'Rajasthan',
    programId: 'nursery-class-8',
    preferredTiming: 'Afternoon School Batch (04:00 PM – 05:00 PM IST)',
    learningGoals: ['Spoken English', 'Grammar'],
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Paid – Transaction Completed',
    consentAccepted: true
  };

  const result1 = validateEnrollmentForm(incompleteStudentForm);
  assert.equal(result1.isValid, false);
  assert.ok(result1.errors.studentClass);
  assert.ok(result1.errors.parentGuardianName);

  const validStudentForm: EnrollmentFormData = {
    ...incompleteStudentForm,
    studentClass: 'Class 5',
    parentGuardianName: 'Anil Verma'
  };
  const result2 = validateEnrollmentForm(validStudentForm);
  assert.equal(result2.isValid, true);
  assert.equal(Object.keys(result2.errors).length, 0);
});

test('validates adult learner enrollment without requiring parent name', () => {
  const validAdultForm: EnrollmentFormData = {
    participantName: 'Priya Krishnan',
    age: '31',
    studentClass: 'Not Applicable (Adult Learner)',
    parentGuardianName: '',
    mobileWhatsapp: '+91 9812345678',
    email: 'priya.k@example.com',
    city: 'Chennai',
    state: 'Tamil Nadu',
    programId: 'business-professionals',
    preferredTiming: 'Late Evening Professional Batch (08:30 PM – 09:30 PM IST)',
    learningGoals: ['Professional Communication', 'Public Speaking'],
    paymentMethod: 'Net Banking (NEFT / IMPS)',
    paymentStatus: 'Pending – Request Payment Link on WhatsApp',
    consentAccepted: true
  };

  const result = validateEnrollmentForm(validAdultForm);
  assert.equal(result.isValid, true);
});

test('rejects invalid phone, email, empty learning goals, and unchecked consent', () => {
  const invalidForm: EnrollmentFormData = {
    participantName: 'A',
    age: '1',
    studentClass: 'Not Applicable (Adult Learner)',
    parentGuardianName: '',
    mobileWhatsapp: '12345',
    email: 'invalid-email',
    city: '',
    state: '',
    programId: 'working-professionals',
    preferredTiming: '',
    learningGoals: [],
    paymentMethod: '',
    paymentStatus: '',
    consentAccepted: false
  };

  const result = validateEnrollmentForm(invalidForm);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.participantName);
  assert.ok(result.errors.age);
  assert.ok(result.errors.mobileWhatsapp);
  assert.ok(result.errors.email);
  assert.ok(result.errors.city);
  assert.ok(result.errors.state);
  assert.ok(result.errors.preferredTiming);
  assert.ok(result.errors.learningGoals);
  assert.ok(result.errors.paymentMethod);
  assert.ok(result.errors.paymentStatus);
  assert.ok(result.errors.consentAccepted);
});

test('Google Sheets & Drive CSV script emails owner anjalikasaraswat901@gmail.com and sends customer confirmation reply', () => {
  assert.equal(OWNER_EMAIL, 'anjalikasaraswat901@gmail.com');
  assert.ok(CONFIRMATION_MESSAGE.includes(CUSTOMER_REPLY_GREETING));
  assert.equal(PROGRAMS.length, 4);

  const webhookScript = generateGoogleSheetsWebhookScript();
  assert.ok(webhookScript.includes('anjalikasaraswat901@gmail.com'));
  assert.ok(webhookScript.includes('Edu_Saptarish_Enrollments_Summary.csv'));
  assert.ok(webhookScript.includes('DriveApp.createFile'));
  assert.ok(webhookScript.includes('Thank you for choosing Edu Saptarish! Our team will contact you soon'));
  assert.ok(webhookScript.includes('Selected Course / Program:'));

  const sampleSubmission: EnrollmentSubmission = {
    id: 'ES-2026-5001',
    submittedAt: '27 Oct 2026, 08:00 PM',
    participantName: 'Kavya Nair',
    age: '11',
    studentClass: 'Class 6',
    parentGuardianName: 'Suresh Nair',
    mobileWhatsapp: '+91 9876543210',
    email: 'suresh.nair@example.com',
    city: 'Kochi',
    state: 'Kerala',
    programId: 'nursery-class-8',
    programName: 'Nursery to Class 8',
    monthlyFee: 4000,
    preferredTiming: 'Afternoon School Batch (04:00 PM – 05:00 PM IST)',
    learningGoals: ['Spoken English', 'Confidence Building'],
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Paid – Transaction Completed',
    transactionReference: 'UPI-112233',
    consentAccepted: true,
    mode: 'Live Online Classes'
  };

  const csvRow = formatSubmissionAsCsvRow(sampleSubmission);
  assert.ok(csvRow.includes('"ES-2026-5001"'));
  assert.ok(csvRow.includes('"Kavya Nair"'));
});
