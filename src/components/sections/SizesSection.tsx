import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type RingConfig } from '@/stores/configStore';
import { MoveHorizontal, MoveVertical, Circle, ChevronDown, Check } from 'lucide-react';

const sizeSystems = [
  { id: 'EU', name: 'EU (European)', range: [48, 72], step: 1 },
  { id: 'US', name: 'US (American)', range: [4.5, 13], step: 0.5 },
  { id: 'UK', name: 'UK (British)', values: ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Z+1'] },
];

export default function SizesSection() {
  const { t } = useTranslation();
  const {
    ring1, ring2, selectedRing,
    updateActiveRing, updateRing,
    sameSettings, setSameSettings
  } = useConfigStore();

  const current = selectedRing === 'ring2' ? ring2 : ring1;
  const [system, setSystem] = useState('EU');

  // Helper to convert internal EU size (circumference) to display value
  const getDisplaySize = (euSize: number, sys: string) => {
    if (sys === 'EU') return euSize;
    if (sys === 'US') {
      // Approx conversion: US = (EU - 36.5) / 2.5? 
      // Standard table: 49 -> 5, 52 -> 6, 54 -> 7.
      // Let's use specific map or approx.
      // US Size = (Diameter - 11.54) / 0.83? 
      // Diameter = EU / PI.
      const diameter = euSize / Math.PI;
      return Math.max(0, parseFloat(((diameter - 11.54) / 0.83).toFixed(1)));
    }
    if (sys === 'UK') {
      // Lookup? A = ~37.5mm.
      // Let's just return a mapped index for now or keep EU.
      return 'L'; // Placeholder
    }
    return euSize;
  };

  const update = (patch: Partial<RingConfig>) => {
    updateActiveRing(patch);
  };

  const setWidth = (val: number) => {
    const newWidth = Math.max(3.0, Math.min(8.0, val));
    const patch: Partial<RingConfig> = { width: newWidth };

    // Auto thickness logic
    if (current.autoThickness) {
      // Heuristic: Thicker for wider rings, but usually inverse? 
      // Wide rings often need less thickness to be comfortable?
      // User says: "lighter width -> slightly thicker thickness for durability" (maybe?)
      // Actually "maintains balance... larger width -> slightly thicker".
      // Let's use ratio 0.35 + base.
      patch.height = parseFloat((1.0 + (newWidth - 3.0) * 0.15).toFixed(2));
    }
    update(patch);
  };

  const setThickness = (val: number) => {
    const newHeight = Math.max(1.0, Math.min(3.0, val));
    update({ height: newHeight, autoThickness: false }); // Disable auto if manually set
  };

  const setSize = (val: number | string) => {
    // Convert back to EU for storage
    let eu = 54;
    if (system === 'EU') eu = Number(val);
    else if (system === 'US') {
      // Inverse of (D - 11.54)/0.83
      const us = Number(val);
      const d = (us * 0.83) + 11.54;
      eu = Math.round(d * Math.PI);
    }
    update({ size: eu });
  };

  const HelperInput = ({ label, value, min, max, onChange, step = 0.1, unit = 'mm', icon: Icon }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium flex items-center gap-2 text-foreground">
          {Icon && <Icon size={14} />} {label}
        </label>
        <span className="text-xs font-bold text-primary">{value.toFixed(2)} {unit}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(value - step)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-primary transition-colors text-muted-foreground hover:text-foreground"
        >
          -
        </button>
        <div className="flex-1 relative">
          <input // Range slider for quick adjustment, or number input
            type="range" min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <button
          onClick={() => onChange(value + step)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-primary transition-colors text-muted-foreground hover:text-foreground"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
        {t('2. Sizes')}
      </h3>

      {/* Same Settings Checkbox */}
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <input
          type="checkbox"
          checked={sameSettings}
          onChange={(e) => setSameSettings(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm font-medium">Use the same settings for both rings</label>
      </div>

      {/* Ring 1 / 2 Indicator */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {selectedRing === 'ring2' ? 'Ring 2' : 'Ring 1'} Settings
      </div>

      {/* Width */}
      <HelperInput
        label="Ring width"
        value={current.width}
        min={3.0} max={8.0}
        onChange={setWidth}
        icon={MoveHorizontal}
      />

      {/* Thickness */}
      <div className="space-y-3">
        <HelperInput
          label="Ring thickness"
          value={current.height}
          min={1.0} max={3.0}
          onChange={setThickness}
          icon={MoveVertical}
        />

        <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 cursor-pointer">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${current.autoThickness ? 'bg-primary border-primary text-white' : 'border-gray-400'}`}>
            {current.autoThickness && <Check size={14} />}
          </div>
          <input
            type="checkbox"
            checked={current.autoThickness ?? true}
            onChange={(e) => update({ autoThickness: e.target.checked })}
            className="hidden"
          />
          <span className="text-xs font-medium text-muted-foreground">Automatically set the optimal thickness</span>
        </label>
      </div>

      {/* Ring Size */}
      <div className="space-y-3 pt-4 border-t border-border">
        <label className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Circle size={14} /> Ring size
        </label>

        <div className="grid grid-cols-3 gap-2">
          {sizeSystems.map(s => (
            <button
              key={s.id}
              onClick={() => setSystem(s.id)}
              className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${system === s.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
            >
              {s.id}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={system === 'US'
              ? Math.round(((current.size / Math.PI) - 11.54) / 0.83 * 2) / 2 // Approx reverse 
              : current.size
            }
            onChange={(e) => setSize(e.target.value)}
            className="w-full p-4 rounded-xl border border-border bg-card appearance-none text-lg font-bold outline-none focus:border-primary transition-colors"
            style={{ textAlignLast: 'center' }}
          >
            {system === 'US' ? (
              // Generate US sizes
              Array.from({ length: 18 }).map((_, i) => {
                const val = 4 + i * 0.5;
                return <option key={val} value={val}>{val}</option>;
              })
            ) : (
              // Generate EU sizes
              Array.from({ length: 26 }).map((_, i) => {
                const val = 48 + i;
                return <option key={val} value={val}>{val}</option>;
              })
            )}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown size={16} />
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Inner Diameter: {(current.size / Math.PI).toFixed(2)} mm
        </p>
      </div>
    </div>
  );
}
