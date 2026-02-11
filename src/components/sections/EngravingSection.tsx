import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type EngravingConfig, type EngravingType, type EngravingFont } from '@/stores/configStore';
import { Type, PenTool, Sparkles, Fingerprint, Image as ImageIcon, Heart, Infinity as InfinityIcon, Divide } from 'lucide-react';

const fonts: { id: EngravingFont; name: string; style: string }[] = [
  { id: 'font1', name: 'Roboto', style: 'font-sans' },
  { id: 'font2', name: 'Great Vibes', style: 'font-serif italic' }, // Script-ish simulation
  { id: 'font3', name: 'Cinzel', style: 'font-serif uppercase' },
  { id: 'font4', name: 'Playfair', style: 'font-serif' },
  { id: 'font5', name: 'Montez', style: 'font-cursive' },
];

const symbols = [
  { label: '♥', char: '♥', icon: Heart },
  { label: '∞', char: '∞', icon: InfinityIcon },
  { label: '&', char: '&', icon: Divide }, // Ampersand placeholder
  { label: '★', char: '★', icon: Sparkles },
];

export default function EngravingSection() {
  const { t } = useTranslation();
  const {
    ring1, ring2, selectedRing,
    updateActiveRing, updateRing,
    sameSettings, setSameSettings
  } = useConfigStore();

  const current = selectedRing === 'ring2' ? ring2 : ring1;
  const engraving = current.engraving;

  // Local state for active input focus to know where to insert symbols?
  // Or just always append to active ring's text.
  const [activeInput, setActiveInput] = useState<'ring1' | 'ring2'>(selectedRing === 'ring2' ? 'ring2' : 'ring1');

  const update = (patch: Partial<EngravingConfig>) => {
    updateActiveRing({ engraving: { ...engraving, ...patch } });
  };

  const addSymbol = (char: string) => {
    if (sameSettings) {
      // Append to both
      const newText = ring1.engraving.text + char;
      updateActiveRing({ engraving: { ...ring1.engraving, text: newText } });
    } else {
      // Append to specific ring
      if (selectedRing === 'pair') {
        // Heuristic: append to the last focused input or both?
        // Let's assume user is editing one.
        // For simplicity, let's just use the current selectedRing context if not pair, 
        // but if pair, we show TWO inputs.
        // We need a clearer way to target.
        // Let's create a helper "updateText(ringId, text)"
      }

      // Actually, if pair is selected and not same settings, show two inputs.
      // Symbols should theoretically act on the focused input.
      // But tracking focus is hard.
      // Let's just append to both for now or active one.
      // Better: Simple buttons next to each input? Too cluttered.
      // Let's just append to the *currently selected ring* if single.
      // If pair + distinct: Maybe symbol buttons add to Ring 1? Or both?
      // Let's stick to updating `current` ring text.
      const newText = current.engraving.text + char;
      update({ text: newText });
    }
  };

  const updateSpecificRing = (id: 1 | 2, text: string) => {
    const target = id === 1 ? ring1 : ring2;
    updateRing(id, { engraving: { ...target.engraving, text } });
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
        {t('6. Engraving')}
        {engraving.enabled && <span className="w-2 h-2 rounded-full bg-green-500" />}
      </h3>

      {/* Same Settings Checkbox */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <input
          type="checkbox"
          checked={sameSettings}
          onChange={(e) => setSameSettings(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm font-medium">Use the same settings for both rings</label>
      </div>

      {/* Engraving Type Tabs */}
      <div className="flex bg-secondary p-1 rounded-xl">
        <button
          onClick={() => update({ type: 'laser', enabled: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${engraving.type === 'laser'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Type size={14} /> Laser
        </button>
        <button
          onClick={() => update({ type: 'diamond', enabled: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${engraving.type === 'diamond'
              ? 'bg-background shadow text-blue-500'
              : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          <Sparkles size={14} /> Diamond
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {(!sameSettings && selectedRing === 'pair') ? (
          // Two inputs for pair
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Ring 1 Text</label>
              <textarea
                value={ring1.engraving.text}
                onChange={(e) => updateSpecificRing(1, e.target.value)}
                onFocus={() => {
                  if (selectedRing !== 'ring1') useConfigStore.getState().setSelectedRing('ring1');
                }}
                placeholder="Enter text..."
                className="w-full p-3 rounded-xl border bg-card/50 text-sm min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Ring 2 Text</label>
              <textarea
                value={ring2.engraving.text}
                onChange={(e) => updateSpecificRing(2, e.target.value)}
                onFocus={() => {
                  if (selectedRing !== 'ring2') useConfigStore.getState().setSelectedRing('ring2');
                }}
                placeholder="Enter text..."
                className="w-full p-3 rounded-xl border bg-card/50 text-sm min-h-[80px]"
              />
            </div>
          </>
        ) : (
          // Single input (Shared or Single Ring)
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground">Engraving Text</label>
            <textarea
              value={current.engraving.text}
              onChange={(e) => update({ text: e.target.value, enabled: e.target.value.length > 0 })}
              placeholder="Enter text..."
              className="w-full p-3 rounded-xl border bg-card/50 text-sm min-h-[80px]"
            />
          </div>
        )}
      </div>

      {/* Symbols */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Symbols</span>
        <div className="flex gap-2">
          {symbols.map(s => (
            <button
              key={s.label}
              onClick={() => addSymbol(s.char)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-lg text-primary"
              title={`Add ${s.label}`}
            >
              {s.char}
            </button>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Font</span>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map(f => (
            <button
              key={f.id}
              onClick={() => update({ font: f.id })}
              className={`p-3 rounded-xl border text-left transition-all ${engraving.font === f.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border bg-card hover:border-primary/30'
                }`}
            >
              <span className={`block text-lg ${f.style}`}>Abc 123</span>
              <span className="text-[10px] text-muted-foreground uppercase">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3 pt-4 border-t border-border">
        <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/20 cursor-pointer">
          <input
            type="checkbox"
            checked={engraving.isHandwriting}
            onChange={(e) => update({ isHandwriting: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary"
          />
          <PenTool size={16} />
          <span className="text-sm font-medium">Handwriting</span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/20 cursor-pointer">
          <input
            type="checkbox"
            checked={engraving.isFingerprint}
            onChange={(e) => update({ isFingerprint: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary"
          />
          <Fingerprint size={16} />
          <span className="text-sm font-medium">Fingerprint</span>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/20 cursor-pointer">
          <input
            type="checkbox"
            checked={engraving.isGraphics}
            onChange={(e) => update({ isGraphics: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary"
          />
          <ImageIcon size={16} />
          <span className="text-sm font-medium">Graphics</span>
        </label>
      </div>

    </div>
  );
}
