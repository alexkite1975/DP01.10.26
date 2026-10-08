/**
 * Automated Verification Script: .DDD Binary Parser & Thermal OCR Processing
 */

import {
  parseRawDddBinary,
  generateSyntheticDddBuffer,
  extractElementaryFiles,
  TACHO_EF_TAGS
} from '../src/services/dddParserService';

import {
  classifyShiftUpload,
  validateDriverDisputeRequest
} from '../src/services/tachoImageProcessingService';

function runTests() {
  console.log('===========================================================');
  console.log('🧪 RUNNING TACHO-SCAN AI .DDD & OCR COMPREHENSIVE TESTS');
  console.log('===========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 1: ELEMENTARY FILE BINARY EXTRACTION
  // -------------------------------------------------------------
  console.log('\n--- 1. Elementary File Binary Tag Extraction ---');
  const bufferCompliant = generateSyntheticDddBuffer('COMPLIANT');
  assert(bufferCompliant.length > 100, 'Synthetic .DDD buffer generated successfully', `length: ${bufferCompliant.length}`);

  const efs = extractElementaryFiles(bufferCompliant);
  assert(efs.length >= 5, 'Extracted at least 5 standard Elementary Files', `found: ${efs.length}`);

  const hasIdEf = efs.some((e) => e.tag === TACHO_EF_TAGS.EF_IDENTIFICATION);
  assert(hasIdEf, 'Identified EF_IDENTIFICATION (0x0520)');

  const hasActEf = efs.some((e) => e.tag === TACHO_EF_TAGS.EF_DRIVER_ACTIVITY_DATA);
  assert(hasActEf, 'Identified EF_DRIVER_ACTIVITY_DATA (0x0504)');

  const hasVehEf = efs.some((e) => e.tag === TACHO_EF_TAGS.EF_VEHICLES_USED);
  assert(hasVehEf, 'Identified EF_VEHICLES_USED (0x0505)');

  // -------------------------------------------------------------
  // TEST SUITE 2: COMPLIANT SHIFT BINARY DECODING
  // -------------------------------------------------------------
  console.log('\n--- 2. Compliant Shift Binary Decoding ---');
  const parsedCompliant = parseRawDddBinary(bufferCompliant, 'test_compliant.DDD');

  assert(parsedCompliant.driverCardNumber.includes('9021482019'), 'Driver card number decoded', parsedCompliant.driverCardNumber);
  assert(parsedCompliant.driverName.includes('KITE'), 'Driver surname decoded', parsedCompliant.driverName);
  assert(parsedCompliant.vehicleReg.includes('GB26 HGV'), 'Vehicle registration decoded', parsedCompliant.vehicleReg);
  assert(parsedCompliant.activities.length === 7, '7 activity blocks extracted', `count: ${parsedCompliant.activities.length}`);
  assert(parsedCompliant.wtdCompliant === true, 'Shift is 100% compliant under EU 561/2006');
  assert(parsedCompliant.detailedInfringements?.length === 0, 'Zero infringements detected');
  assert(parsedCompliant.distanceDrivenKm === 430, 'Odometer distance calculated (413280 - 412850 = 430 km)', `got: ${parsedCompliant.distanceDrivenKm}`);

  // -------------------------------------------------------------
  // TEST SUITE 3: INFRINGING SHIFT (CONTINUOUS DRIVE OVER 4.5H)
  // -------------------------------------------------------------
  console.log('\n--- 3. Continuous Drive Infringement Detection ---');
  const bufferInfringing = generateSyntheticDddBuffer('INFRINGING');
  const parsedInfringing = parseRawDddBinary(bufferInfringing, 'test_infringing.DDD');

  assert(parsedInfringing.wtdCompliant === false, 'Non-compliant shift correctly flagged');
  assert(parsedInfringing.detailedInfringements?.length === 1, 'Exactly 1 infringement detected');
  assert(parsedInfringing.detailedInfringements?.[0]?.ruleReference === 'EC 561/2006 Art. 7', 'Infringement cited as EC 561/2006 Art. 7');
  assert(parsedInfringing.detailedInfringements?.[0]?.durationMinutesOver === 24, '24 minutes over 4.5h limit identified', `got: ${parsedInfringing.detailedInfringements?.[0]?.durationMinutesOver}`);

  // -------------------------------------------------------------
  // TEST SUITE 4: END-OF-SHIFT VS MID-SHIFT CLASSIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 4. End-of-Shift vs Mid-Shift Ground Truth Classification ---');
  const endOfShiftOcr = '--- 24H DAILY DRIVER CARD PRINTOUT --- KITE ALEXANDER VEHICLE: GB26 HGV DAILY SUMMARY TOTAL DISTANCE: 430 KM CARD WITHDRAWAL 19:29 UTC';
  const midShiftOcr = '--- VEHICLE MID-DAY CHECKPOINT --- CURRENT ACTIVITY: REST 00:45 CARD INSERTED SLOT 1';

  const classEnd = classifyShiftUpload(endOfShiftOcr, parsedCompliant.activities);
  assert(classEnd.type === 'END_OF_SHIFT', 'Classified 24h printout as END_OF_SHIFT');
  assert(classEnd.isGroundTruth === true, 'End-of-shift marked as Authoritative Ground Truth');
  assert(classEnd.supersedesPriorMidShift === true, 'End-of-shift supersedes prior mid-shift');

  const classMid = classifyShiftUpload(midShiftOcr, [{ activityType: 'DRIVING', timeStart: '08:00', timeEnd: '12:00', durationMinutes: 240 }]);
  assert(classMid.type === 'MID_SHIFT', 'Classified interim checkpoint as MID_SHIFT');
  assert(classMid.isGroundTruth === false, 'Mid-shift marked as NOT ground truth');

  // -------------------------------------------------------------
  // TEST SUITE 5: DRIVER DISPUTE VALIDATION RULE
  // -------------------------------------------------------------
  console.log('\n--- 5. Driver OCR Dispute Validation ---');
  const disputeWithoutMacro = validateDriverDisputeRequest('ODOMETER_KM', 708638, 708940, undefined);
  assert(disputeWithoutMacro.isAccepted === false, 'Dispute rejected without optical macro photo');
  assert(disputeWithoutMacro.status === 'REJECTED_NO_MACRO', 'Status is REJECTED_NO_MACRO');

  const disputeWithMacro = validateDriverDisputeRequest('ODOMETER_KM', 708638, 708940, 'data:image/jpeg;base64,mockMacroPhotoBytes');
  assert(disputeWithMacro.isAccepted === true, 'Dispute accepted with verified optical macro photo');
  assert(disputeWithMacro.status === 'ACCEPTED_PROVED', 'Status is ACCEPTED_PROVED');

  console.log('\n===========================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
