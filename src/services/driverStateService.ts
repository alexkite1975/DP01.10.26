import { DriverVehicleProfile, LearnedTrailerProfile, RouteStop, OptimizedRoutePlan } from '../types';
import { trailerFleetService } from './trailerFleetService';
import { SAMPLE_MULTI_DROP_ROUTES, recalculateRouteProgression } from './routeOptimizerService';

export type DriverFlowStep =
  | 'HOME_LAUNCHER'
  | 'VEHICLE_SELECT'
  | 'TRAILER_HITCH'
  | 'TRAILER_DISAMBIGUATION'
  | 'MANIFEST_UPLOAD'
  | 'DRIVING_EN_ROUTE'
  | 'AT_DEPOT_GATE'
  | 'POD_SIGN'
  | 'SHIFT_SUMMARY'
  // Sub-views from Launcher
  | 'VIEW_TACHO'
  | 'VIEW_WORK'
  | 'VIEW_PAY'
  | 'VIEW_TRAILER_LOOKUP';

export interface ActiveShiftContext {
  shiftId: string;
  driverName: string;
  vehicleReg: string;
  vehicleCategory: string;
  vehicleHeightMeters: number;
  trailerNumber?: string;
  trailerCompany?: string;
  trailerHeightMeters?: number;
  trailerMotValid: boolean;
  routePlan: OptimizedRoutePlan;
  currentStopIndex: number;
  shiftStartTime: string;
  drivingMinutesElapsed: number;
  maxContinuousDriveMinutes: number;
  currentHazardAlert?: {
    type: 'LOW_BRIDGE' | 'NARROW_LANE' | 'GATE_DELAY';
    message: string;
    clearanceCm?: number;
  };
}

export interface DisambiguationChoice {
  companyId: string;
  companyName: string;
  trailerNumber: string;
  trailerType: string;
  heightMeters: number;
  motStatus: 'VALID' | 'DUE_SOON' | 'EXPIRED';
  lastBrakeTestEfficiency: number;
  primaryColor: string;
}

const STORAGE_KEY_FLOW_STATE = 'drivepartners_flow_state_v1';
const STORAGE_KEY_SHIFT_CONTEXT = 'drivepartners_shift_ctx_v1';

class DriverStateService {
  private currentStep: DriverFlowStep = 'HOME_LAUNCHER';
  private shiftContext: ActiveShiftContext | null = null;
  private disambiguationOptions: DisambiguationChoice[] = [];

  constructor() {
    this.loadPersistedState();
  }

  private loadPersistedState() {
    try {
      const savedStep = localStorage.getItem(STORAGE_KEY_FLOW_STATE);
      if (savedStep) {
        this.currentStep = savedStep as DriverFlowStep;
      }
      const savedCtx = localStorage.getItem(STORAGE_KEY_SHIFT_CONTEXT);
      if (savedCtx) {
        this.shiftContext = JSON.parse(savedCtx);
      }
    } catch (_e) {
      // Fallback
    }
  }

  private persistState() {
    try {
      localStorage.setItem(STORAGE_KEY_FLOW_STATE, this.currentStep);
      if (this.shiftContext) {
        localStorage.setItem(STORAGE_KEY_SHIFT_CONTEXT, JSON.stringify(this.shiftContext));
      } else {
        localStorage.removeItem(STORAGE_KEY_SHIFT_CONTEXT);
      }
    } catch (_e) {
      // Fallback
    }
  }

  public getStep(): DriverFlowStep {
    return this.currentStep;
  }

  public setStep(step: DriverFlowStep) {
    this.currentStep = step;
    this.persistState();
  }

  public getShiftContext(): ActiveShiftContext | null {
    return this.shiftContext;
  }

  public getDisambiguationOptions(): DisambiguationChoice[] {
    return this.disambiguationOptions;
  }

  /**
   * Start a brand new shift wizard
   */
  public startNewShift() {
    this.currentStep = 'VEHICLE_SELECT';
    this.persistState();
  }

  /**
   * Step 1: Select or confirm vehicle reg
   */
  public confirmVehicle(vehicleReg: string, vehicleCategory = '44t Articulated Tractor') {
    this.shiftContext = {
      shiftId: `shf-${Date.now()}`,
      driverName: 'Alex Morgan',
      vehicleReg: vehicleReg.toUpperCase().trim(),
      vehicleCategory,
      vehicleHeightMeters: 4.0, // standard tractor unit
      trailerMotValid: true,
      routePlan: SAMPLE_MULTI_DROP_ROUTES[0],
      currentStopIndex: 0,
      shiftStartTime: new Date().toISOString(),
      drivingMinutesElapsed: 185, // 3h 05m elapsed
      maxContinuousDriveMinutes: 270 // 4h 30m limit
    };
    this.currentStep = 'TRAILER_HITCH';
    this.persistState();
  }

  /**
   * Step 2: Check trailer hitch
   * Returns: 'NO_TRAILER' | 'EXACT_MATCH' | 'DISAMBIGUATION_NEEDED' | 'NEW_TRAILER'
   */
  public submitTrailerNumber(trailerNumber: string): {
    status: 'NO_TRAILER' | 'EXACT_MATCH' | 'DISAMBIGUATION_NEEDED' | 'NEW_TRAILER';
    profile?: LearnedTrailerProfile;
    duplicates?: DisambiguationChoice[];
  } {
    const cleanNum = trailerNumber.trim().toUpperCase();
    if (!cleanNum || cleanNum === 'NONE' || cleanNum === 'NO') {
      if (this.shiftContext) {
        this.shiftContext.trailerNumber = undefined;
        this.shiftContext.trailerCompany = undefined;
        this.shiftContext.vehicleHeightMeters = 4.0;
      }
      this.currentStep = 'MANIFEST_UPLOAD';
      this.persistState();
      return { status: 'NO_TRAILER' };
    }

    // Search trailer database
    const matching = trailerFleetService.findTrailersByNumber(cleanNum);

    if (matching.length > 1) {
      // Multiple fleets use this trailer number (e.g. 1042 Stobart vs DHL vs Maritime)
      this.disambiguationOptions = matching.map(t => ({
        companyId: t.companyId,
        companyName: t.companyName,
        trailerNumber: t.trailerNumber,
        trailerType: t.trailerType,
        heightMeters: t.heightMeters,
        motStatus: t.motStatus || 'VALID',
        lastBrakeTestEfficiency: t.lastBrakeEfficiencyPercent || 58,
        primaryColor: t.companyId.includes('stobart')
          ? '#16a34a'
          : t.companyId.includes('dhl')
          ? '#eab308'
          : '#2563eb'
      }));
      this.currentStep = 'TRAILER_DISAMBIGUATION';
      this.persistState();
      return {
        status: 'DISAMBIGUATION_NEEDED',
        duplicates: this.disambiguationOptions
      };
    } else if (matching.length === 1) {
      // Single exact match
      const t = matching[0];
      this.applyMatchedTrailer(t);
      this.currentStep = 'MANIFEST_UPLOAD';
      this.persistState();
      return { status: 'EXACT_MATCH', profile: t };
    } else {
      // Unknown trailer number: fallback to standard 4.45m
      if (this.shiftContext) {
        this.shiftContext.trailerNumber = cleanNum;
        this.shiftContext.trailerCompany = 'Fleet General';
        this.shiftContext.vehicleHeightMeters = 4.45;
        this.shiftContext.trailerHeightMeters = 4.45;
      }
      this.currentStep = 'MANIFEST_UPLOAD';
      this.persistState();
      return { status: 'NEW_TRAILER' };
    }
  }

  /**
   * Driver picked operator from disambiguation dialog
   */
  public selectDisambiguatedOperator(companyId: string, trailerNumber: string) {
    const exact = trailerFleetService.findExactTrailer(companyId, trailerNumber);
    if (exact) {
      this.applyMatchedTrailer(exact);
    } else {
      const choice = this.disambiguationOptions.find(o => o.companyId === companyId);
      if (choice && this.shiftContext) {
        this.shiftContext.trailerNumber = choice.trailerNumber;
        this.shiftContext.trailerCompany = choice.companyName;
        this.shiftContext.vehicleHeightMeters = choice.heightMeters;
        this.shiftContext.trailerHeightMeters = choice.heightMeters;
        this.shiftContext.trailerMotValid = choice.motStatus !== 'EXPIRED';
      }
    }
    this.currentStep = 'MANIFEST_UPLOAD';
    this.persistState();
  }

  private applyMatchedTrailer(t: LearnedTrailerProfile) {
    if (!this.shiftContext) return;
    this.shiftContext.trailerNumber = t.trailerNumber;
    this.shiftContext.trailerCompany = t.companyName;
    this.shiftContext.vehicleHeightMeters = t.heightMeters;
    this.shiftContext.trailerHeightMeters = t.heightMeters;
    this.shiftContext.trailerMotValid = t.motStatus !== 'EXPIRED';

    // Check potential bridge hazards for this height
    if (t.heightMeters >= 4.60) {
      this.shiftContext.currentHazardAlert = {
        type: 'LOW_BRIDGE',
        message: `High-Cube trailer hitched (${t.heightMeters}m). A428 bridge corridor checked. Stay in centre lane under bridges.`,
        clearanceCm: Math.round((4.85 - t.heightMeters) * 100)
      };
    }
  }

  /**
   * Step 3: Confirm manifest / paperwork
   */
  public confirmManifest(routePlan = SAMPLE_MULTI_DROP_ROUTES[0]) {
    if (!this.shiftContext) return;
    this.shiftContext.routePlan = routePlan;
    this.shiftContext.currentStopIndex = 0;
    this.currentStep = 'DRIVING_EN_ROUTE';
    this.persistState();
  }

  /**
   * Driver arrived at the site gate
   */
  public arriveAtGate() {
    this.currentStep = 'AT_DEPOT_GATE';
    this.persistState();
  }

  /**
   * Receiver ready to sign e-POD
   */
  public openPodSign() {
    this.currentStep = 'POD_SIGN';
    this.persistState();
  }

  /**
   * Confirm digital e-POD signature and dynamic forward ETA update
   */
  public confirmPodSignature(signatoryName: string) {
    if (!this.shiftContext) return;
    const currentStop = this.shiftContext.routePlan.stops[this.shiftContext.currentStopIndex];
    const nowTimeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (currentStop) {
      currentStop.status = 'COMPLETED';
      currentStop.ePodSignatory = signatoryName || 'Duty Receiver';
      currentStop.completedAt = nowTimeStr;
    }

    // Recalculate remaining stops
    this.shiftContext.routePlan = recalculateRouteProgression(
      this.shiftContext.routePlan,
      currentStop?.id || '',
      nowTimeStr,
      signatoryName
    );

    // Advance to next stop
    if (this.shiftContext.currentStopIndex + 1 < this.shiftContext.routePlan.stops.length) {
      this.shiftContext.currentStopIndex += 1;
      this.currentStep = 'DRIVING_EN_ROUTE';
    } else {
      // All stops complete!
      this.currentStep = 'SHIFT_SUMMARY';
    }
    this.persistState();
  }

  /**
   * Finish shift and return to launcher
   */
  public finishShift() {
    this.shiftContext = null;
    this.currentStep = 'HOME_LAUNCHER';
    this.persistState();
  }

  /**
   * Cancel or reset shift
   */
  public resetToLauncher() {
    this.shiftContext = null;
    this.currentStep = 'HOME_LAUNCHER';
    this.persistState();
  }
}

export const driverStateService = new DriverStateService();
