export interface OvernightExpenseClaim {
  id: string;
  date: string;
  locationName: string;
  motorway: string;
  vehicleReg: string;
  parkingCostGbp: number;
  paymentMethod: 'SNAP_ACCOUNT' | 'COMPANY_CARD' | 'FUEL_CARD' | 'CASH_EXPENSE';
  snapBookingRef?: string;
  foodVoucherIncluded: boolean;
  foodVoucherAmountGbp: number;
  hmrcTaxAllowanceGbp: number; // Standard £34.90 per night tax-free allowance
  receiptUrl?: string;
  status: 'LOGGED' | 'EXPORTED_TO_PAYROLL' | 'REIMBURSED';
}

export const HMRC_NIGHTLY_SUBSISTENCE_RATE_GBP = 34.90;

export const INITIAL_EXPENSE_CLAIMS: OvernightExpenseClaim[] = [
  {
    id: 'exp-001',
    date: '2026-09-24',
    locationName: 'Tebay Services (M6 J38)',
    motorway: 'M6 J38',
    vehicleReg: 'GN21 JKM',
    parkingCostGbp: 33.00,
    paymentMethod: 'SNAP_ACCOUNT',
    snapBookingRef: 'SNAP-TB-98214',
    foodVoucherIncluded: true,
    foodVoucherAmountGbp: 14.00,
    hmrcTaxAllowanceGbp: 34.90,
    status: 'EXPORTED_TO_PAYROLL'
  },
  {
    id: 'exp-002',
    date: '2026-09-25',
    locationName: 'Formula Services Ellesmere Port (M53 J8)',
    motorway: 'M53 J8',
    vehicleReg: 'GN21 JKM',
    parkingCostGbp: 31.00,
    paymentMethod: 'SNAP_ACCOUNT',
    snapBookingRef: 'SNAP-FS-44109',
    foodVoucherIncluded: true,
    foodVoucherAmountGbp: 12.00,
    hmrcTaxAllowanceGbp: 34.90,
    status: 'EXPORTED_TO_PAYROLL'
  },
  {
    id: 'exp-003',
    date: '2026-09-26',
    locationName: 'Rugby Services (M6 J1)',
    motorway: 'M6 J1',
    vehicleReg: 'GN21 JKM',
    parkingCostGbp: 34.00,
    paymentMethod: 'SNAP_ACCOUNT',
    snapBookingRef: 'SNAP-RG-77123',
    foodVoucherIncluded: true,
    foodVoucherAmountGbp: 10.00,
    hmrcTaxAllowanceGbp: 34.90,
    status: 'LOGGED'
  }
];

export function calculateMonthlyTaxSavings(claims: OvernightExpenseClaim[]): {
  totalNights: number;
  totalParkingPaid: number;
  totalHmrcTaxAllowance: number;
  estimatedDriverTaxSavings: number; // e.g. at 20% or 40% income tax
} {
  const totalNights = claims.length;
  const totalParkingPaid = claims.reduce((acc, c) => acc + c.parkingCostGbp, 0);
  const totalHmrcTaxAllowance = claims.reduce((acc, c) => acc + c.hmrcTaxAllowanceGbp, 0);
  // Tax savings calculated at standard 20% basic rate + 8% NI = 28% total relief
  const estimatedDriverTaxSavings = Number((totalHmrcTaxAllowance * 0.28).toFixed(2));

  return {
    totalNights,
    totalParkingPaid,
    totalHmrcTaxAllowance,
    estimatedDriverTaxSavings
  };
}
