import React, { useEffect } from 'react';
import '@/utils/i18n';
import TopBar from '@/components/TopBar';
import ThreeViewer from '@/components/ThreeViewer';
import ConfigPanel from '@/components/ConfigPanel';
import { useConfigStore } from '@/stores/configStore';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const {
    ring1Visible, ring2Visible, setRing1Visible, setRing2Visible,
    theme, isPreviewMode
  } = useConfigStore();
  const { t } = useTranslation();

  // Apply theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load shared config from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (decoded.r1 && decoded.r2) {
          useConfigStore.getState().loadConfig({ ring1: decoded.r1, ring2: decoded.r2 });
        }
      } catch {
        // Invalid config, ignore
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden animate-fade-in transition-colors duration-300">
      {!isPreviewMode && <TopBar />}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left panel - 3D Viewer */}
        <div className={`flex flex-col transition-all duration-500 ease-in-out relative ${isPreviewMode ? 'w-full' : 'w-1/2 min-w-[400px]'}`}>

          {/* Ring visibility controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setRing1Visible(!ring1Visible)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border border-border ${ring1Visible ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
            >
              {ring1Visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {t('ring1')}
            </button>
            <button
              onClick={() => setRing2Visible(!ring2Visible)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border border-border ${ring2Visible ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
            >
              {ring2Visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {t('ring2')}
            </button>
          </div>

          {/* Preview Mode Exit Button */}
          {isPreviewMode && (
            <button
              onClick={() => useConfigStore.getState().setPreviewMode(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md transition-all"
            >
              Exit Fullscreen
            </button>
          )}

          <ThreeViewer />
        </div>

        {/* Right panel - Config */}
        <div className={`flex-1 overflow-hidden relative z-0 bg-card transition-all duration-500 ease-in-out ${isPreviewMode ? 'translate-x-full absolute right-0 w-0' : 'translate-x-0'}`}>
          <ConfigPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
