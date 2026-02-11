import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type MetalType, type MetalColor, type Karat, type SurfaceFinish, type SegmentConfig } from '@/stores/configStore';
import { Check, ChevronDown, X } from 'lucide-react';

const finishes: { id: SurfaceFinish; label: string }[] = [
  { id: 'polished', label: 'Polished' },
  { id: 'matte', label: 'Matte' },
  { id: 'vertical_matte', label: 'Vertical Matte' },
  { id: 'diagonal_matte', label: 'Diagonal Matte' },
  { id: 'ice_matte', label: 'Ice Matte' },
  { id: 'sand_coarse', label: 'Sand Matte (Coarse)' },
  { id: 'sand_fine', label: 'Sand Matte (Fine)' },
  { id: 'hammered_polished', label: 'Hammered Polished' },
  { id: 'hammered_matte', label: 'Hammered Matte' },
  { id: 'milled', label: 'Milled' },
];

const metals = [
  { type: 'gold', color: 'yellow', label: 'Yellow Gold', hex: '#FFD700' },
  { type: 'gold', color: 'white', label: 'White Gold', hex: '#E8E8E0' },
  { type: 'gold', color: 'rose', label: 'Rose Gold', hex: '#E8A090' },
  { type: 'platinum', color: 'white', label: 'Platinum', hex: '#E5E4E2' },
  { type: 'palladium', color: 'white', label: 'Palladium', hex: '#CCC9C0' },
];

const karats: Karat[] = [8, 9, 14, 18];

const ratios = {
  2: ['1:1', '1:2', '1:3', '2:1', '3:1'],
  3: ['1:1:1', '1:2:1', '2:1:2', '1:3:1', '3:1:1']
};

export default function MetalSection() {
  const { t } = useTranslation();
  const { ring1, ring2, selectedRing, updateActiveRing, sameSettings, setSameSettings } = useConfigStore();
  const current = selectedRing === 'ring2' ? ring2 : ring1;

  const [showPartitionPopup, setShowPartitionPopup] = useState(false);
  const [activeSegmentIdx, setActiveSegmentIdx] = useState<number | null>(null);

  // Initialize segments if missing
  useEffect(() => {
    if (!current.segments || current.segments.length !== current.partition.count) {
      const newSegments: SegmentConfig[] = Array(current.partition.count).fill(null).map((_, i) =>
        current.segments?.[i] || {
          metal: 'gold',
          color: 'yellow',
          karat: 18,
          finish: 'polished'
        }
      );
      updateActiveRing({ segments: newSegments });
    }
  }, [current.partition.count]);

  const setPartitionCount = (count: 1 | 2 | 3) => {
    updateActiveRing({ partition: { ...current.partition, count } });
    // Reset/Expand segments logic is handled by effect or can be explicit here
    // Let's rely on effect for safety or do it here for immediacy
    const newSegments: SegmentConfig[] = Array(count).fill(null).map((_, i) =>
      current.segments?.[i] || { metal: 'gold', color: 'yellow', karat: 18, finish: 'polished' }
    );
    updateActiveRing({ partition: { ...current.partition, count }, segments: newSegments });

    if (count > 1) {
      setShowPartitionPopup(true);
    }
  };

  const updateSegment = (index: number, updates: Partial<SegmentConfig>) => {
    const newSegments = [...current.segments];
    newSegments[index] = { ...newSegments[index], ...updates };
    updateActiveRing({ segments: newSegments });
  };

  return (
    <div className="space-y-6 relative h-full">
      <h3 className="font-display text-lg font-semibold">{t('3. Precious Metal')}</h3>

      {/* Top Checkbox */}
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <input
          type="checkbox"
          checked={sameSettings}
          onChange={(e) => setSameSettings(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="text-sm font-medium">Use the same settings for both rings</label>
      </div>

      {/* Partition Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Partition</label>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setPartitionCount(num as 1 | 2 | 3)}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${current.partition.count === num
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border bg-card hover:border-primary/50'
                }`}
            >
              {/* Simple illustrative icons */}
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden relative">
                {num === 1 && <div className="w-full h-full bg-yellow-200/50" />}
                {num === 2 && (
                  <div className="flex w-full h-full">
                    <div className="w-1/2 bg-gray-300" />
                    <div className="w-1/2 bg-yellow-200" />
                  </div>
                )}
                {num === 3 && (
                  <div className="flex w-full h-full">
                    <div className="w-1/3 bg-gray-300" />
                    <div className="w-1/3 bg-yellow-200" />
                    <div className="w-1/3 bg-gray-300" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold">
                {num === 1 ? 'Single' : num === 2 ? 'Two-Tone' : 'Tri-Color'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Segments Configuration */}
      <div className="space-y-6">
        {current.segments?.map((seg, idx) => (
          <div key={idx} className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">Segment {idx + 1}</span>
              <div
                className="w-6 h-6 rounded-full border border-gray-200 shadow-inner"
                style={{ backgroundColor: metals.find(m => m.type === seg.metal && m.color === seg.color)?.hex }}
              />
            </div>

            {/* Metal & Color Dropdown */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Material</label>
              <select
                className="w-full p-2 rounded-lg border bg-background text-sm"
                value={`${seg.metal}|${seg.color}`}
                onChange={(e) => {
                  const [m, c] = e.target.value.split('|');
                  updateSegment(idx, { metal: m as any, color: c as any });
                }}
              >
                {metals.map(opt => (
                  <option key={`${opt.type}-${opt.color}`} value={`${opt.type}|${opt.color}`}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Surface Dropdown */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Surface</label>
              <select
                className="w-full p-2 rounded-lg border bg-background text-sm"
                value={seg.finish}
                onChange={(e) => updateSegment(idx, { finish: e.target.value as any })}
              >
                {finishes.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Karat Buttons */}
            {seg.metal === 'gold' && (
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Fineness</label>
                <div className="flex gap-2">
                  {karats.map(k => (
                    <button
                      key={k}
                      onClick={() => updateSegment(idx, { karat: k })}
                      className={`flex-1 py-1 px-2 rounded-md text-xs font-bold transition-colors ${seg.karat === k
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                    >
                      {k}kt
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Extra Button */}
      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors text-sm font-medium">
        Choose different surface
      </button>

      {/* Partition Popup Overlay */}
      {showPartitionPopup && current.partition.count > 1 && (
        <div className="absolute inset-x-0 bottom-0 top-20 bg-background/95 backdrop-blur-sm z-20 flex flex-col p-4 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg">Partition Style</h4>
            <button onClick={() => setShowPartitionPopup(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto pb-20">
            {/* Ratios */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">Ratio</span>
              <div className="grid grid-cols-3 gap-3">
                {(ratios[current.partition.count as 2 | 3] || []).map(r => (
                  <button
                    key={r}
                    onClick={() => updateActiveRing({ partition: { ...current.partition, ratio: r } })}
                    className={`p-3 rounded-xl border text-sm font-bold ${current.partition.ratio === r ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    {r}
                    {/* Visual rep of ratio */}
                    <div className="h-2 w-full mt-2 rounded-full overflow-hidden flex">
                      {r.split(':').map((part, i) => (
                        <div
                          key={i}
                          style={{ flex: part, backgroundColor: i % 2 === 0 ? '#ddd' : '#fae080' }}
                          className="h-full"
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shapes */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">Shape</span>
              <div className="grid grid-cols-2 gap-3">
                {['straight', 'diagonal', 'wave'].map(s => (
                  <button
                    key={s}
                    onClick={() => updateActiveRing({ partition: { ...current.partition, shape: s as any } })}
                    className={`p-4 rounded-xl border text-sm capitalize ${current.partition.shape === s ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPartitionPopup(false)}
            className="mt-auto w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
