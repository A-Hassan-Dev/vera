import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type StoneType, type StoneSetting } from '@/stores/configStore';
import { Diamond, Check, Settings2, Gem, GripHorizontal, AlignJustify, GripVertical, Circle, Disc, X } from 'lucide-react';

const stoneTypes: { type: StoneType; label: string; color: string }[] = [
  { type: 'diamond', label: 'Diamond', color: '#E8E8F0' },
  { type: 'sapphire', label: 'Sapphire', color: '#2040A0' },
  { type: 'ruby', label: 'Ruby', color: '#C02020' },
  { type: 'emerald', label: 'Emerald', color: '#20A040' },
];

const settings: { id: StoneSetting; label: string; icon: any }[] = [
  { id: 'none', label: 'Without', icon: X },
  { id: 'solitaire_smooth', label: 'Smooth Conversion', icon: Circle },
  { id: 'pave', label: 'Pavé', icon: GripHorizontal },
  { id: 'rail', label: 'Rail Setting', icon: AlignJustify },
  { id: 'smooth', label: 'Smooth Stone', icon: Disc },
  { id: 'across', label: 'Smooth Across', icon: GripVertical },
  { id: 'channel_side', label: 'Channel Side', icon: AlignJustify },
  { id: 'free', label: 'Free Layout', icon: Gem },
  { id: 'tension', label: 'Tension', icon: Circle },
  { id: 'canal_around', label: 'Canal Around', icon: Circle },
];

export default function StoneSection() {
  const { t } = useTranslation();
  const { ring1, ring2, selectedRing, updateActiveRing, sameSettings, setSameSettings } = useConfigStore();

  const current = selectedRing === 'ring2' ? ring2 : ring1;
  const stones = current.stones;

  const update = (patch: Partial<typeof stones>) => {
    updateActiveRing({ stones: { ...stones, ...patch } });
  };

  // Helper to calculate total gems (visual count)
  const gemCount = stones.setting === 'none' ? 0 : stones.count;

  return (
    <div className="space-y-6 h-full relative">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          {t('5. Stone')}
          <span className="text-secondary-foreground text-xs px-2 py-1 bg-secondary rounded-full flex items-center gap-1">
            <Diamond size={10} className="fill-current text-blue-400" /> {gemCount}
          </span>
        </h3>
      </div>

      {/* Top Checkbox */}
      <div className="flex items-center gap-2 pb-2">
        <input
          type="checkbox"
          checked={sameSettings}
          onChange={(e) => setSameSettings(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm font-medium">Use the same settings for both rings</label>
      </div>

      {/* Stone Type Selection (Gem Material) */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gemstone</label>
        <div className="grid grid-cols-4 gap-2">
          {stoneTypes.map((s) => (
            <button
              key={s.type}
              onClick={() => update({ type: s.type })}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${stones.type === s.type
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-card hover:border-primary/50'
                }`}
            >
              <div
                className="w-6 h-6 rounded-full border border-gray-200 shadow-inner mb-1"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[10px] font-medium">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Setting Type Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Setting Style</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {settings.map((s) => {
            const Icon = s.icon;
            const isSelected = stones.setting === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  // If selecting none, auto-set count to 0? No, just render 0. 
                  // If selecting pavé, maybe specific logic.
                  update({ setting: s.id, enabled: s.id !== 'none' });
                }}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all gap-2 text-center h-full ${isSelected
                    ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
                  }`}
              >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold leading-tight">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls (Count / Size) - Only if enabled */}
      {stones.setting !== 'none' && (
        <div className="space-y-4 pt-4 border-t border-border animate-in slide-in-from-bottom-2">

          {/* Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Number of Stones</label>
              <span className="text-sm font-bold text-primary">{stones.count}</span>
            </div>
            <input
              type="range"
              min={1}
              max={stones.setting === 'pave' ? 50 : 20}
              step={1}
              value={stones.count}
              onChange={(e) => update({ count: parseInt(e.target.value) })}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Stone Size</label>
              <span className="text-sm font-bold text-primary">{stones.size.toFixed(2)} ct</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.20}
              step={0.01}
              value={stones.size}
              onChange={(e) => update({ size: parseFloat(e.target.value) })}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
