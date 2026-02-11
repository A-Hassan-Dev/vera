import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/stores/configStore';

const tabs = [
  { key: 'profile', num: 1 },
  { key: 'sizes', num: 2 },
  { key: 'preciousMetal', num: 3 },
  { key: 'grooveEdge', num: 4 },
  { key: 'stone', num: 5 },
  { key: 'engraving', num: 6 },
];

export default function Stepper() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useConfigStore();

  return (
    <div className="flex gap-1 p-2 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(i)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === i
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            activeTab === i
              ? 'bg-primary-foreground text-primary'
              : 'bg-muted text-muted-foreground'
          }`}>
            {tab.num}
          </span>
          <span className="hidden sm:inline">{t(tab.key)}</span>
        </button>
      ))}
    </div>
  );
}
