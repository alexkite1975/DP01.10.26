import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, Sparkles } from 'lucide-react';

/**
 * Universal UK HGV Height Utility & Auto-Converter
 * Converts bidirectionally between Metric (meters) and Imperial (feet & inches).
 * Standardizes statutory DVSA & bridge clearance height displays across the platform.
 */

// Convert meters to formatted UK feet & inches string (e.g. 4.20m -> 13' 9")
export function metersToFeetInches(meters: number | null | undefined): string {
  if (meters === null || meters === undefined || isNaN(meters) || meters <= 0) {
    return `0' 0"`;
  }
  const totalInches = meters * 39.3700787;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  if (inches === 12) {
    return `${feet + 1}' 0"`;
  }
  return `${feet}' ${inches}"`;
}

// Convert feet and inches to meters (e.g. 13 ft 9 in -> 4.19m / 4.20m)
export function feetInchesToMeters(feet: number, inches: number): number {
  const safeFeet = Math.max(0, isNaN(feet) ? 0 : feet);
  const safeInches = Math.max(0, Math.min(11.99, isNaN(inches) ? 0 : inches));
  const totalInches = safeFeet * 12 + safeInches;
  const meters = totalInches * 0.0254;
  return Math.round(meters * 100) / 100;
}

// Always format height in BOTH metric and feet/inches
export function formatHeightBoth(
  meters: number | null | undefined,
  style: 'parens' | 'slash' | 'badge' = 'parens'
): string {
  if (meters === null || meters === undefined || isNaN(meters) || meters <= 0) {
    return '0.00m (0\' 0")';
  }
  const metricStr = `${meters.toFixed(2)}m`;
  const imperialStr = metersToFeetInches(meters);

  if (style === 'slash') {
    return `${metricStr} / ${imperialStr}`;
  }
  if (style === 'badge') {
    return `${metricStr} [${imperialStr}]`;
  }
  return `${metricStr} (${imperialStr})`;
}

// Parse freeform height input string in either metric or imperial and auto-convert
export function parseAndConvertHeight(rawInput: string): {
  meters: number;
  feet: number;
  inches: number;
  feetInchesFormatted: string;
  sourceUnit: 'METRIC' | 'IMPERIAL';
} | null {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const str = rawInput.trim().toLowerCase();

  // Pattern 1: Imperial like 13' 9", 13ft 9in, 13'9, 13-9, 13 9
  const imperialMatch = str.match(/(\d+)\s*(?:'|ft|feet|\s)\s*(\d+(?:\.\d+)?)\s*(?:"|in|inches)?/i);
  if (imperialMatch) {
    const feet = parseInt(imperialMatch[1], 10);
    const inches = parseFloat(imperialMatch[2]);
    const meters = feetInchesToMeters(feet, inches);
    return {
      meters,
      feet,
      inches: Math.round(inches),
      feetInchesFormatted: `${feet}' ${Math.round(inches)}"`,
      sourceUnit: 'IMPERIAL'
    };
  }

  // Pattern 2: Feet only like 14ft or 14'
  const feetOnlyMatch = str.match(/^(\d+(?:\.\d+)?)\s*(?:'|ft|feet)$/i);
  if (feetOnlyMatch) {
    const totalFeet = parseFloat(feetOnlyMatch[1]);
    const feet = Math.floor(totalFeet);
    const inches = Math.round((totalFeet % 1) * 12);
    const meters = feetInchesToMeters(feet, inches);
    return {
      meters,
      feet,
      inches,
      feetInchesFormatted: `${feet}' ${inches}"`,
      sourceUnit: 'IMPERIAL'
    };
  }

  // Pattern 3: Metric like 4.20m, 4.2m, 4.2, 4200mm
  const mmMatch = str.match(/^(\d{4,5})\s*mm$/i);
  if (mmMatch) {
    const meters = Math.round((parseInt(mmMatch[1], 10) / 1000) * 100) / 100;
    const totalInches = meters * 39.3700787;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return {
      meters,
      feet,
      inches,
      feetInchesFormatted: `${feet}' ${inches}"`,
      sourceUnit: 'METRIC'
    };
  }

  const metricMatch = str.match(/^(\d+(?:\.\d+)?)\s*(?:m|meters)?$/i);
  if (metricMatch) {
    const meters = parseFloat(metricMatch[1]);
    if (meters > 0 && meters < 10) {
      const totalInches = meters * 39.3700787;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return {
        meters,
        feet,
        inches,
        feetInchesFormatted: `${feet}' ${inches}"`,
        sourceUnit: 'METRIC'
      };
    }
  }

  return null;
}

// UK Standard HGV Trailer Height Presets
export const UK_HGV_HEIGHT_PRESETS = [
  { label: 'Standard Curtainsider', meters: 4.20, imperial: `13' 9"` },
  { label: 'Box / Refrigerated', meters: 4.45, imperial: `14' 7"` },
  { label: 'High Cube Trailer', meters: 4.65, imperial: `15' 3"` },
  { label: 'Double Decker HGV', meters: 4.88, imperial: `16' 0"` },
  { label: 'Euro Low Clearance', meters: 4.00, imperial: `13' 1"` }
];

interface DualHeightInputProps {
  valueMeters: number;
  onChange: (meters: number) => void;
  label?: string;
  helperText?: string;
  minMeters?: number;
  maxMeters?: number;
  theme?: 'dark' | 'light';
  showPresets?: boolean;
}

/**
 * DualHeightInput Component
 * Provides synchronized side-by-side Metric (Meters) and Imperial (Feet & Inches) inputs.
 * Typing in either unit automatically converts and updates the other in real time.
 */
export const DualHeightInput: React.FC<DualHeightInputProps> = ({
  valueMeters,
  onChange,
  label = 'Vehicle / Trailer Height',
  helperText = 'Entering either metric or feet automatically updates both units for safe bridge clearance.',
  minMeters = 2.5,
  maxMeters = 5.2,
  theme = 'dark',
  showPresets = true
}) => {
  // Internal state for meters input and imperial inputs
  const [metricInput, setMetricInput] = useState<string>(valueMeters.toFixed(2));
  
  // Calculate feet and inches from current valueMeters
  const totalInches = (valueMeters || 4.20) * 39.3700787;
  const initFeet = Math.floor(totalInches / 12);
  const initInches = Math.round(totalInches % 12);

  const [feetInput, setFeetInput] = useState<number>(initFeet);
  const [inchesInput, setInchesInput] = useState<number>(initInches);

  // Sync external changes
  useEffect(() => {
    setMetricInput(valueMeters.toFixed(2));
    const inchesTotal = valueMeters * 39.3700787;
    setFeetInput(Math.floor(inchesTotal / 12));
    setInchesInput(Math.round(inchesTotal % 12));
  }, [valueMeters]);

  // Handle Metric Input change -> automatically converts to feet & inches
  const handleMetricChange = (valStr: string) => {
    setMetricInput(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && parsed > 0) {
      const clamped = Math.max(minMeters, Math.min(maxMeters, parsed));
      const inchesTotal = clamped * 39.3700787;
      setFeetInput(Math.floor(inchesTotal / 12));
      setInchesInput(Math.round(inchesTotal % 12));
      onChange(clamped);
    }
  };

  // Handle Feet Input change -> automatically converts to meters
  const handleFeetChange = (newFeet: number) => {
    const f = Math.max(0, isNaN(newFeet) ? 0 : newFeet);
    setFeetInput(f);
    const convertedMeters = feetInchesToMeters(f, inchesInput);
    setMetricInput(convertedMeters.toFixed(2));
    onChange(convertedMeters);
  };

  // Handle Inches Input change -> automatically converts to meters
  const handleInchesChange = (newInches: number) => {
    let safeInches = isNaN(newInches) ? 0 : newInches;
    let safeFeet = feetInput;

    // Handle rollover if user enters 12 or more inches
    if (safeInches >= 12) {
      safeFeet += Math.floor(safeInches / 12);
      safeInches = safeInches % 12;
      setFeetInput(safeFeet);
    } else if (safeInches < 0) {
      safeInches = 0;
    }

    setInchesInput(safeInches);
    const convertedMeters = feetInchesToMeters(safeFeet, safeInches);
    setMetricInput(convertedMeters.toFixed(2));
    onChange(convertedMeters);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`space-y-2.5 p-3.5 rounded-2xl border ${
      isDark
        ? 'bg-slate-900/90 border-slate-800 text-slate-100'
        : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* Header Label & Synchronized Badge */}
      <div className="flex items-center justify-between gap-2">
        <label className={`text-xs font-bold uppercase tracking-wider ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Check className="w-3 h-3" /> Metric &amp; Feet Synced
        </span>
      </div>

      {/* Linked Dual Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* 1. Metric Input (Meters) */}
        <div>
          <span className={`text-[11px] font-bold block mb-1 ${
            isDark ? 'text-cyan-400' : 'text-cyan-700'
          }`}>
            Metric (Meters)
          </span>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.05"
              min={minMeters}
              max={maxMeters}
              value={metricInput}
              onChange={(e) => handleMetricChange(e.target.value)}
              className={`w-full font-mono font-bold text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-9 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-slate-900 shadow-sm'
              }`}
              placeholder="e.g. 4.20"
            />
            <span className="absolute right-3 text-xs font-mono font-bold text-slate-400 pointer-events-none">
              m
            </span>
          </div>
        </div>

        {/* Sync Indicator Icon */}
        <div className="hidden sm:flex items-center justify-center -mb-5 pointer-events-none">
          {/* subtle alignment */}
        </div>

        {/* 2. Imperial Input (Feet & Inches) */}
        <div>
          <span className={`text-[11px] font-bold block mb-1 ${
            isDark ? 'text-amber-400' : 'text-amber-700'
          }`}>
            Imperial (Feet &amp; Inches)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative flex items-center">
              <input
                type="number"
                min="8"
                max="18"
                value={feetInput}
                onChange={(e) => handleFeetChange(parseInt(e.target.value, 10) || 0)}
                className={`w-full font-mono font-bold text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 pr-9 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                }`}
                placeholder="13"
              />
              <span className="absolute right-3 text-xs font-mono font-bold text-slate-400 pointer-events-none">
                ft
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="11"
                value={inchesInput}
                onChange={(e) => handleInchesChange(parseInt(e.target.value, 10) || 0)}
                className={`w-full font-mono font-bold text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 pr-9 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white'
                    : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                }`}
                placeholder="9"
              />
              <span className="absolute right-3 text-xs font-mono font-bold text-slate-400 pointer-events-none">
                in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Formatted Live Display & Preset Quick Select */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-400">Total Clearance Height:</span>
          <strong className="text-white text-sm">
            {formatHeightBoth(valueMeters)}
          </strong>
        </div>

        {showPresets && (
          <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
            <span className="text-slate-500 mr-1 hidden sm:inline">Presets:</span>
            {UK_HGV_HEIGHT_PRESETS.map((preset) => (
              <button
                key={preset.meters}
                type="button"
                onClick={() => {
                  onChange(preset.meters);
                  setMetricInput(preset.meters.toFixed(2));
                  const inchesTotal = preset.meters * 39.3700787;
                  setFeetInput(Math.floor(inchesTotal / 12));
                  setInchesInput(Math.round(inchesTotal % 12));
                }}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  Math.abs(valueMeters - preset.meters) < 0.02
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                }`}
                title={preset.label}
              >
                {preset.meters}m ({preset.imperial})
              </button>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};
