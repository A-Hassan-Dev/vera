import { create } from 'zustand';

export type ProfileType = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'P10' | 'P11' | 'P12' | 'P13' | 'P14' | 'P15';
export type MetalType = 'gold' | 'platinum' | 'palladium';
export type MetalColor = 'yellow' | 'white' | 'rose';
export type Karat = 8 | 9 | 14 | 18;
export type GrooveType = 'none' | 'U' | 'V' | 'shadow' | 'wave';
export type EdgeStyle = 'rounded' | 'flat' | 'beveled' | 'comfort';
export type StoneType = 'diamond' | 'sapphire' | 'ruby' | 'emerald';
export type StonePattern = 'single' | 'row' | 'channel' | 'pave'; // Deprecated in favor of StoneSetting? Keep for backward compat?
// New granular settings
export type StoneSetting =
  | 'none'
  | 'solitaire_smooth'
  | 'pave'
  | 'rail'
  | 'smooth'
  | 'across'
  | 'across_second'
  | 'channel_side'
  | 'free'
  | 'tension'
  | 'tension_diagonal'
  | 'canal_around'
  | 'canal_diagonal';

export type EngravingType = 'laser' | 'diamond';
export type EngravingPosition = 'inside' | 'outside';
export type EngravingFont = 'font1' | 'font2' | 'font3' | 'font4' | 'font5'; // Generic for now
export type SelectedRing = 'ring1' | 'ring2' | 'pair';

export type SurfaceFinish =
  | 'polished'
  | 'matte'
  | 'vertical_matte'
  | 'diagonal_matte'
  | 'ice_matte'
  | 'sand_coarse'
  | 'sand_fine'
  | 'hammered_polished'
  | 'hammered_matte'
  | 'milled';

export type PartitionShape = 'straight' | 'diagonal' | 'wave';

export interface Groove {
  type: GrooveType;
  position: number;
  width: number;
  depth: number;
}

export interface StoneConfig {
  enabled: boolean;
  type: StoneType;
  setting: StoneSetting;
  count: number;
  size: number;
}

export interface EngravingConfig {
  enabled: boolean;
  text: string;
  type: EngravingType;
  font: EngravingFont;
  position: EngravingPosition;
  isHandwriting: boolean;
  isFingerprint: boolean;
  isGraphics: boolean;
}

export interface MetalConfig {
  type: MetalType;
  karat: Karat;
  color: MetalColor;
  finish: SurfaceFinish;
}

export interface SegmentConfig {
  metal: MetalType;
  color: MetalColor;
  karat: Karat;
  finish: SurfaceFinish;
}

export interface PartitionConfig {
  count: 1 | 2 | 3;
  ratio: string; // "1:1", "1:2:1", etc.
  shape: PartitionShape;
}

export interface RingConfig {
  id: number;
  profile: ProfileType;
  size: number;
  width: number;
  height: number;
  metal: MetalConfig; // Keep for backward compat or base settings
  partition: PartitionConfig;
  segments: SegmentConfig[];
  groove: Groove;
  edgeStyle: EdgeStyle;
  stones: StoneConfig;
  engraving: EngravingConfig;
  autoThickness: boolean;
}

export const defaultRing = (id: number): RingConfig => ({
  id,
  profile: 'P7',
  size: id === 1 ? 62 : 54,
  width: id === 1 ? 5.5 : 4.0,
  height: 1.8,
  autoThickness: true,
  metal: { type: 'gold', karat: 18, color: 'yellow', finish: 'polished' },
  partition: { count: 1, ratio: '1', shape: 'straight' },
  segments: [
    { metal: 'gold', color: 'yellow', karat: 18, finish: 'polished' }
  ],
  groove: { type: 'U', position: 0.5, width: 0.2, depth: 0.1 },
  edgeStyle: 'beveled',
  stones: { enabled: false, type: 'diamond', setting: 'none', count: 1, size: 0.05 },
  engraving: {
    enabled: false,
    text: '',
    type: 'laser',
    position: 'inside',
    font: 'font1',
    isHandwriting: false,
    isFingerprint: false,
    isGraphics: false
  },
});

interface ConfigStore {
  ring1: RingConfig;
  ring2: RingConfig;
  ring1Visible: boolean;
  ring2Visible: boolean;
  selectedRing: SelectedRing;
  sameSettings: boolean;
  activeTab: number;
  expertMode: boolean;
  theme: 'light' | 'dark';
  isPreviewMode: boolean;

  setSelectedRing: (r: SelectedRing) => void;
  setSameSettings: (v: boolean) => void;
  setActiveTab: (t: number) => void;
  setExpertMode: (v: boolean) => void;
  setRing1Visible: (v: boolean) => void;
  setRing2Visible: (v: boolean) => void;
  setTheme: (t: 'light' | 'dark') => void;
  setPreviewMode: (v: boolean) => void;

  updateRing: (ringId: 1 | 2, updates: Partial<RingConfig>) => void;
  updateActiveRing: (updates: Partial<RingConfig>) => void;
  resetConfig: () => void;
  loadConfig: (config: { ring1: RingConfig; ring2: RingConfig }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  ring1: defaultRing(1),
  ring2: defaultRing(2),
  ring1Visible: true,
  ring2Visible: true,
  selectedRing: 'pair',
  sameSettings: false,
  activeTab: 0,
  expertMode: false,
  theme: 'light',
  isPreviewMode: false,

  setSelectedRing: (r) => set({ selectedRing: r }),
  setSameSettings: (v) => set({ sameSettings: v }),
  setActiveTab: (t) => set({ activeTab: t }),
  setExpertMode: (v) => set({ expertMode: v }),
  setRing1Visible: (v) => set({ ring1Visible: v }),
  setRing2Visible: (v) => set({ ring2Visible: v }),
  setTheme: (t) => set({ theme: t }),
  setPreviewMode: (v) => set({ isPreviewMode: v }),

  updateRing: (ringId, updates) => {
    const key = ringId === 1 ? 'ring1' : 'ring2';
    set((state) => ({ [key]: { ...state[key], ...updates } }));
  },

  updateActiveRing: (updates) => {
    const { selectedRing, sameSettings } = get();
    if (sameSettings || selectedRing === 'pair') {
      set((state) => ({
        ring1: { ...state.ring1, ...updates },
        ring2: { ...state.ring2, ...updates },
      }));
    } else if (selectedRing === 'ring1') {
      set((state) => ({ ring1: { ...state.ring1, ...updates } }));
    } else {
      set((state) => ({ ring2: { ...state.ring2, ...updates } }));
    }
  },

  resetConfig: () => set({
    ring1: defaultRing(1),
    ring2: defaultRing(2),
    sameSettings: true,
    selectedRing: 'pair',
    activeTab: 0,
  }),

  loadConfig: (config) => set({
    ring1: config.ring1,
    ring2: config.ring2,
  }),
}));
