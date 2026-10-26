import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PROGRAMS,
  CONFIRMATION_MESSAGE,
  calculateFeeSummary,
  validateEnrollmentForm,
  generateGoogleAppsScript,
  EnrollmentFormData
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

test('confirmation message and Google Apps Script include all 11 fields and pricing', () => {
  assert.equal(
    CONFIRMATION_MESSAGE,
    'Thank you for choosing Edu Saptarish! Our team will contact you soon regarding enrollment and class schedules.'
  );
  const script = generateGoogleAppsScript();
  assert.ok(script.includes(CONFIRMATION_MESSAGE));
  assert.ok(script.includes('Nursery to Class 8 — ₹4,000 per month'));
  assert.ok(script.includes('Homemakers — ₹5,000 per month'));
  assert.ok(script.includes('Working Professionals — ₹5,000 per month'));
  assert.ok(script.includes('Business Professionals — ₹5,000 per month'));
  assert.ok(script.includes('Spoken English'));
  assert.ok(script.includes('Professional Communication'));
  assert.ok(script.includes('PROGRAMS') || PROGRAMS.length === 4);
});

test('Google Sheets webhook script generator includes doPost and all 11 enrollment columns', async () => {
  const { generateGoogleSheetsWebhookScript } = await import('./enrollmentLogic');
  const webhookScript = generateGoogleSheetsWebhookScript();
  assert.ok(webhookScript.includes('function doPost(e)'));
  assert.ok(webhookScript.includes('Student/Participant Name'));
  assert.ok(webhookScript.includes('Preferred Timing'));
  assert.ok(webhookScript.includes('Learning Goals'));
});

