import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type GrooveType, type EdgeStyle } from '@/stores/configStore';

const grooveTypes: { type: GrooveType; label: string }[] = [
  { type: 'none', label: 'none' },
  { type: 'U', label: 'uGroove' },
  { type: 'V', label: 'vGroove' },
  { type: 'shadow', label: 'shadowGroove' },
  { type: 'wave', label: 'waveGroove' },
];

const edgeStyles: { style: EdgeStyle; label: string }[] = [
  { style: 'rounded', label: 'rounded' },
  { style: 'flat', label: 'flat' },
  { style: 'beveled', label: 'beveled' },
  { style: 'comfort', label: 'comfort' },
];

export default function GrooveSection() {
  const { t } = useTranslation();
  const { ring1, ring2, selectedRing, updateActiveRing } = useConfigStore();

  const current = selectedRing === 'ring2' ? ring2 : ring1;

  return (
    <div className="animate-fade-in space-y-6">
      <h3 className="font-display text-lg font-semibold">{t('grooveEdge')}</h3>

      {/* Groove Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('grooveType')}</label>
        <div className="grid grid-cols-3 gap-2">
          {grooveTypes.map((g) => (
            <button
              key={g.type}
              onClick={() => updateActiveRing({ groove: { ...current.groove, type: g.type } })}
              className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                current.groove.type === g.type
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50'
              }`}
            >
              {t(g.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Groove sliders (when groove is not none) */}
      {current.groove.type !== 'none' && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('position')}: {current.groove.position.toFixed(2)}</label>
            <input
              type="range" min={0} max={1} step={0.05}
              value={current.groove.position}
              onChange={(e) => updateActiveRing({ groove: { ...current.groove, position: parseFloat(e.target.value) } })}
              className="w-full accent-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('width')}: {current.groove.width.toFixed(2)} mm</label>
            <input
              type="range" min={0.1} max={1} step={0.05}
              value={current.groove.width}
              onChange={(e) => updateActiveRing({ groove: { ...current.groove, width: parseFloat(e.target.value) } })}
              className="w-full accent-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t('depth')}: {current.groove.depth.toFixed(2)} mm</label>
            <input
              type="range" min={0.05} max={0.5} step={0.05}
              value={current.groove.depth}
              onChange={(e) => updateActiveRing({ groove: { ...current.groove, depth: parseFloat(e.target.value) } })}
              className="w-full accent-primary"
            />
          </div>
        </>
      )}

      {/* Edge Style */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('edgeStyle')}</label>
        <div className="grid grid-cols-2 gap-2">
          {edgeStyles.map((e) => (
            <button
              key={e.style}
              onClick={() => updateActiveRing({ edgeStyle: e.style })}
              className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                current.edgeStyle === e.style
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50'
              }`}
            >
              {t(e.label)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
