import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/stores/configStore';
import { Globe, Settings, Sun, Moon, Maximize } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'nl', label: 'NL' },
  { code: 'fr', label: 'FR' },
  { code: 'tr', label: 'TR' },
];

export default function TopBar() {
  const { i18n, t } = useTranslation();
  const { expertMode, setExpertMode } = useConfigStore();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">V</span>
        </div>
        <h1 className="font-display text-lg font-semibold text-foreground tracking-tight">
          {t('appName')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switch */}
        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${i18n.language === lang.code
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => useConfigStore.getState().setTheme(useConfigStore.getState().theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle Theme"
        >
          {useConfigStore.getState().theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Fullscreen Preview */}
        <button
          onClick={() => useConfigStore.getState().setPreviewMode(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Maximize size={14} /> View
        </button>
      </div>
    </header>
  );
}
