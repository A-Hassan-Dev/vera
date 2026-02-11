import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/stores/configStore';
import Stepper from './Stepper';
import ProfileSection from './sections/ProfileSection';
import SizesSection from './sections/SizesSection';
import MetalSection from './sections/MetalSection';
import GrooveSection from './sections/GrooveSection';
import StoneSection from './sections/StoneSection';
import EngravingSection from './sections/EngravingSection';
import BottomActions from './BottomActions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sections = [
  ProfileSection,
  SizesSection,
  MetalSection,
  GrooveSection,
  StoneSection,
  EngravingSection,
];

export default function ConfigPanel() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, sameSettings, setSameSettings } = useConfigStore();

  const ActiveSection = sections[activeTab];

  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-sm">
      <Stepper />

      {/* Same settings checkbox */}
      <div className="px-8 py-5 border-b border-border bg-secondary/30">
        <label className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={sameSettings}
              onChange={(e) => setSameSettings(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 transition-all checked:bg-primary checked:border-primary hover:border-primary/50"
            />
            <svg
              className="absolute h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">{t('sameSettings')}</span>
        </label>
      </div>

      {/* Active section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-xl mx-auto h-full p-8">
          <ActiveSection />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between p-8 bg-card border-t border-border">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-border text-foreground hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" /> {t('previous')}
        </button>
        <button
          onClick={() => setActiveTab(Math.min(5, activeTab + 1))}
          disabled={activeTab === 5}
          className="flex items-center gap-2 px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
        >
          {t('next')} <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <BottomActions />
    </div>
  );
}
