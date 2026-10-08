import * as fs from 'fs';
import * as path from 'path';
import { parseRawDddBinary } from '../src/services/dddParserService';

const dddPath = path.join(__dirname, '../public/real_driver_card.DDD');
console.log('Loading real driver card file:', dddPath);

const buffer = fs.readFileSync(dddPath);
console.log(`Read ${buffer.length} bytes.`);

const parsed = parseRawDddBinary(buffer, 'real_driver_card.DDD');

const fmt = (m?: number) => m !== undefined ? `${Math.floor(m / 60)}h ${(m % 60).toString().padStart(2, '0')}m (${m} mins)` : 'N/A';

console.log('\n======================================================');
console.log('📊 REAL UK DRIVER CARD PARSER RESULTS:');
console.log('======================================================');
console.log('Driver Name:        ', parsed.driverName);
console.log('Card Number:        ', parsed.driverCardNumber);
console.log('Licence Number:     ', parsed.cardMetadata?.drivingLicenceNumber || 'N/A');
console.log('Member State:       ', parsed.cardMetadata?.issuingMemberState || 'N/A');
console.log('Vehicle Reg:        ', parsed.vehicleReg);
console.log('Total Driving Time: ', fmt(parsed.hoursSummary?.drivingMinutes));
console.log('Total Work Time:    ', fmt(parsed.hoursSummary?.workingMinutes));
console.log('Total Rest Time:    ', fmt(parsed.hoursSummary?.restMinutes));
console.log('Total POA Time:     ', fmt(parsed.hoursSummary?.poaMinutes));
console.log('Estimated Shift Pay:', `£${parsed.hoursSummary?.estimatedPayGbp?.toFixed(2)}`);
console.log('Distance Driven:    ', parsed.distanceDrivenKm, 'km (', Math.round((parsed.distanceDrivenKm || 0) * 0.621371), 'miles )');
console.log('Odometer Start:     ', parsed.odometerStartKm, 'km');
console.log('Odometer End:       ', parsed.odometerEndKm, 'km');
console.log('WTD Compliant:      ', parsed.wtdCompliant);
console.log('Detailed Infringements: ', parsed.detailedInfringements?.length || 0);
if (parsed.detailedInfringements && parsed.detailedInfringements.length > 0) {
    console.log(JSON.stringify(parsed.detailedInfringements, null, 2));
}
console.log('Activity Records:   ', parsed.activities.length);
console.log('\nFirst 5 activities:');
console.log(parsed.activities.slice(0, 5));
console.log('\nLast 5 activities:');
console.log(parsed.activities.slice(-5));
console.log('======================================================\n');
