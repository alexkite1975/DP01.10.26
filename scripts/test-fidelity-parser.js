const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync(path.join(__dirname, '../public/real_driver_card.DDD'));

function decodeAscii(b) {
  return Buffer.from(b).toString('ascii').replace(/[^\x20-\x7E]/g, '').trim();
}

let offset = 0;
const efs = {};

while (offset + 5 <= buf.length) {
  const tag = (buf[offset] << 8) | buf[offset + 1];
  const len = (buf[offset + 3] << 8) | buf[offset + 4];
  efs[tag] = buf.subarray(offset + 5, offset + 5 + len);
  offset += 5 + len;
}

// 1. EF_IDENTIFICATION
const idData = efs[0x0520];
let cardNumber = '';
let driverSurname = '';
let driverFirstNames = '';
let dob = '';
let issuingAuth = '';

if (idData && idData.length >= 137) {
  cardNumber = decodeAscii(idData.subarray(1, 17));
  issuingAuth = decodeAscii(idData.subarray(18, 53));
  driverSurname = decodeAscii(idData.subarray(66, 101));
  driverFirstNames = decodeAscii(idData.subarray(102, 137));
  const bcdYear = idData[137].toString(16).padStart(2, '0') + idData[138].toString(16).padStart(2, '0');
  const bcdMonth = idData[139].toString(16).padStart(2, '0');
  const bcdDay = idData[140].toString(16).padStart(2, '0');
  dob = `${bcdDay}/${bcdMonth}/${bcdYear}`;
}

// 2. EF_DRIVING_LICENCE_INFO
const licData = efs[0x0521];
let licenceNumber = '';
if (licData && licData.length >= 53) {
  licenceNumber = decodeAscii(licData.subarray(37, 53));
}

// 3. EF_VEHICLES_USED
const vehData = efs[0x0505];
let latestVrn = 'UNKNOWN';
let latestOdoStart = 0;
let latestOdoEnd = 0;
let latestDate = '';
const vehiclesList = [];

if (vehData && vehData.length >= 33) {
  let latestEpoch = 0;
  for (let r = 2; r + 31 <= vehData.length; r += 31) {
    const odoStart = (vehData[r] << 16) | (vehData[r + 1] << 8) | vehData[r + 2];
    const odoEnd = (vehData[r + 3] << 16) | (vehData[r + 4] << 8) | vehData[r + 5];
    const firstUse = vehData.readUInt32BE(r + 6);
    const lastUse = vehData.readUInt32BE(r + 10);
    const vrn = decodeAscii(vehData.subarray(r + 16, r + 29));
    if (vrn && lastUse > 0) {
      vehiclesList.push({ vrn, odoStart, odoEnd, firstUse, lastUse, distKm: odoEnd - odoStart });
      if (lastUse > latestEpoch && odoEnd > 0) {
        latestEpoch = lastUse;
        latestVrn = vrn;
        latestOdoStart = odoStart;
        latestOdoEnd = odoEnd;
        latestDate = new Date(lastUse * 1000).toISOString().slice(0, 10);
      }
    }
  }
}

// 4. EF_DRIVER_ACTIVITY_DATA
const actData = efs[0x0504];
const dailyShifts = [];

if (actData && actData.length >= 14) {
  for (let i = 0; i + 14 <= actData.length; i++) {
    const epoch = actData.readUInt32BE(i);
    const d = new Date(epoch * 1000);
    if (d.getFullYear() >= 2025 && d.getFullYear() <= 2027 && d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0) {
      const distanceKm = (actData[i + 6] << 8) | actData[i + 7];
      const recordLength = (actData[i - 2] << 8) | actData[i - 1];
      const activities = [];

      let prevMin = 0;
      let prevAct = 'REST';
      let driveM = 0, workM = 0, restM = 0, poaM = 0;

      for (let a = i + 8; a + 2 <= i + recordLength && a + 2 <= actData.length; a += 2) {
        const word = (actData[a] << 8) | actData[a + 1];
        const actBits = (word >> 12) & 3;
        const minuteOfDay = word & 0x07ff;
        if (minuteOfDay > 1440) break;

        const actType = actBits === 3 ? 'DRIVING' : actBits === 2 ? 'WORK' : actBits === 1 ? 'AVAILABILITY' : 'REST';
        const dur = minuteOfDay - prevMin;
        if (dur > 0) {
          const sH = Math.floor(prevMin / 60).toString().padStart(2, '0');
          const sM = (prevMin % 60).toString().padStart(2, '0');
          const eH = Math.floor(minuteOfDay / 60).toString().padStart(2, '0');
          const eM = (minuteOfDay % 60).toString().padStart(2, '0');
          activities.push({
            timeStart: `${sH}:${sM}`,
            timeEnd: `${eH}:${eM}`,
            durationMinutes: dur,
            activityType: prevAct,
            speedKmh: prevAct === 'DRIVING' ? 84 : 0
          });
          if (prevAct === 'DRIVING') driveM += dur;
          else if (prevAct === 'WORK') workM += dur;
          else if (prevAct === 'AVAILABILITY') poaM += dur;
          else restM += dur;
        }
        prevMin = minuteOfDay;
        prevAct = actType;
      }

      if (prevMin < 1440) {
        const dur = 1440 - prevMin;
        const sH = Math.floor(prevMin / 60).toString().padStart(2, '0');
        const sM = (prevMin % 60).toString().padStart(2, '0');
        activities.push({
          timeStart: `${sH}:${sM}`,
          timeEnd: '24:00',
          durationMinutes: dur,
          activityType: prevAct,
          speedKmh: 0
        });
        if (prevAct === 'DRIVING') driveM += dur;
        else if (prevAct === 'WORK') workM += dur;
        else if (prevAct === 'AVAILABILITY') poaM += dur;
        else restM += dur;
      }

      dailyShifts.push({
        date: d.toISOString().slice(0, 10),
        distanceKm,
        driveMinutes: driveM,
        workMinutes: workM,
        restMinutes: restM,
        poaMinutes: poaM,
        activities
      });
    }
  }
}

// Find latest shift with non-zero driving/work
const activeShifts = dailyShifts.filter(s => s.driveMinutes > 0 || s.workMinutes > 0);
const latestShift = activeShifts.length > 0 ? activeShifts[activeShifts.length - 1] : dailyShifts[dailyShifts.length - 1];

console.log('========================================================');
console.log('✅ HIGH-FIDELITY TACHOGRAPH CARD PARSER:');
console.log('========================================================');
console.log('Driver Full Name:   ', `${driverFirstNames} ${driverSurname}`);
console.log('Card Number:        ', cardNumber);
console.log('Licence Number:     ', licenceNumber);
console.log('Date of Birth:      ', dob);
console.log('Issuing Authority:  ', issuingAuth, '(United Kingdom - DVLA)');
console.log('Latest Vehicle Reg: ', latestVrn);
console.log('Odometer Range:     ', latestOdoStart, '->', latestOdoEnd, '(', latestOdoEnd - latestOdoStart, 'km )');
console.log('Total Vehicles Logged:', vehiclesList.length);
console.log('Total Days Logged:  ', dailyShifts.length);
console.log('\n--- LATEST SHIFT RECORD (' + latestShift.date + ') ---');
console.log('Distance:           ', latestShift.distanceKm, 'km (', Math.round(latestShift.distanceKm * 0.621371), 'miles )');
console.log('Driving Time:       ', Math.floor(latestShift.driveMinutes / 60) + 'h ' + (latestShift.driveMinutes % 60) + 'm');
console.log('Other Work Time:    ', Math.floor(latestShift.workMinutes / 60) + 'h ' + (latestShift.workMinutes % 60) + 'm');
console.log('Rest Time:          ', Math.floor(latestShift.restMinutes / 60) + 'h ' + (latestShift.restMinutes % 60) + 'm');
console.log('POA Time:           ', Math.floor(latestShift.poaMinutes / 60) + 'h ' + (latestShift.poaMinutes % 60) + 'm');
console.log('Total Shift Hours:  ', ((latestShift.driveMinutes + latestShift.workMinutes + latestShift.poaMinutes) / 60).toFixed(1) + ' hrs');
console.log('Activities Count:   ', latestShift.activities.length);
console.log('========================================================');
