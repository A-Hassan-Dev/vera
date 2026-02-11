import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/stores/configStore';
import { calculateRingPrice, formatPrice } from '@/utils/pricing';
import { RotateCcw, Save, Download, FileText, Share2, X } from 'lucide-react';
import jsPDF from 'jspdf';

export default function BottomActions() {
  const { t } = useTranslation();
  const store = useConfigStore();
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleReset = () => {
    store.resetConfig();
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    const configs = JSON.parse(localStorage.getItem('ringConfigs') || '{}');
    configs[saveName] = { ring1: store.ring1, ring2: store.ring2, savedAt: new Date().toISOString() };
    localStorage.setItem('ringConfigs', JSON.stringify(configs));
    setSaveName('');
    setShowSaveLoad(false);
  };

  const handleLoad = (name: string) => {
    const configs = JSON.parse(localStorage.getItem('ringConfigs') || '{}');
    if (configs[name]) {
      store.loadConfig(configs[name]);
      setShowSaveLoad(false);
    }
  };

  const handleDelete = (name: string) => {
    const configs = JSON.parse(localStorage.getItem('ringConfigs') || '{}');
    delete configs[name];
    localStorage.setItem('ringConfigs', JSON.stringify(configs));
    setShowSaveLoad(false);
    setTimeout(() => setShowSaveLoad(true), 50);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Aura 3D Ring Configuration', 20, 20);
    doc.setFontSize(12);

    const addRingInfo = (ring: typeof store.ring1, y: number) => {
      doc.text(`Profile: ${ring.profile}`, 20, y);
      doc.text(`Size: ${ring.size} | Width: ${ring.width}mm | Height: ${ring.height}mm`, 20, y + 8);
      doc.text(`Metal: ${ring.metal.type} ${ring.metal.karat}K ${ring.metal.color}`, 20, y + 16);
      doc.text(`Edge: ${ring.edgeStyle} | Groove: ${ring.groove.type}`, 20, y + 24);
      doc.text(`Stones: ${ring.stones.enabled ? `${ring.stones.count}x ${ring.stones.type}` : 'None'}`, 20, y + 32);
      doc.text(`Engraving: ${ring.engraving.enabled ? ring.engraving.text : 'None'}`, 20, y + 40);
      doc.text(`Price: ${formatPrice(calculateRingPrice(ring))}`, 20, y + 48);
    };

    doc.setFontSize(14);
    doc.text('Ring 1', 20, 40);
    doc.setFontSize(11);
    addRingInfo(store.ring1, 50);

    doc.setFontSize(14);
    doc.text('Ring 2', 20, 110);
    doc.setFontSize(11);
    addRingInfo(store.ring2, 120);

    const total = calculateRingPrice(store.ring1) + calculateRingPrice(store.ring2);
    doc.setFontSize(14);
    doc.text(`Total: ${formatPrice(total)}`, 20, 185);

    doc.save('ring-configuration.pdf');
  };

  const handleShare = () => {
    const config = { r1: store.ring1, r2: store.ring2 };
    const encoded = btoa(JSON.stringify(config));
    const url = `${window.location.origin}?config=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const savedConfigs = JSON.parse(localStorage.getItem('ringConfigs') || '{}');

  return (
    <>
      <div className="flex flex-wrap gap-2 p-3 border-t border-border">
        <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> {t('reset')}
        </button>
        <button onClick={() => setShowSaveLoad(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
          <Save className="w-3.5 h-3.5" /> {t('loadSave')}
        </button>
        <button onClick={handlePDF} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
          <FileText className="w-3.5 h-3.5" /> {t('printPdf')}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-accent transition-colors">
          <Share2 className="w-3.5 h-3.5" /> {t('share')}
        </button>
      </div>

      {/* Save/Load Modal */}
      {showSaveLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg font-semibold">{t('loadSave')}</h3>
              <button onClick={() => setShowSaveLoad(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Save */}
            <div className="flex gap-2">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder={t('configName')}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-accent transition-colors">
                {t('save')}
              </button>
            </div>

            {/* Saved list */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{t('savedConfigs')}</h4>
              {Object.keys(savedConfigs).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('noSavedConfigs')}</p>
              ) : (
                Object.entries(savedConfigs).map(([name, config]: [string, any]) => (
                  <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                    <span className="text-sm text-foreground">{name}</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleLoad(name)} className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-accent">
                        <Download className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(name)} className="px-2 py-1 text-xs rounded bg-destructive/20 text-destructive hover:bg-destructive/30">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
