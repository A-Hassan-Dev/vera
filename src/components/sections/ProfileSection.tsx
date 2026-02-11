import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore, type ProfileType } from '@/stores/configStore';

const profiles: ProfileType[] = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15'];

const profileLabels: Record<string, string> = {
  P1: 'Flat',
  P2: 'Dome',
  P3: 'Court',
  P4: 'Slight Curve',
  P5: 'Concave',
  P6: 'Knife Edge',
  P7: 'Beveled',
  P8: 'Euro Shank',
  P9: 'Classic',
  P10: 'Modern',
  P11: 'Elegant',
  P12: 'Bold',
  P13: 'Signature',
  P14: 'Royal',
  P15: 'Artistic',
};

// Simple SVG profile previews
function ProfileSVG({ profile }: { profile: ProfileType }) {
  const paths: Record<string, string> = {
    P1: 'M10,30 L50,30',
    P2: 'M10,30 Q30,10 50,30',
    P3: 'M10,30 Q30,5 50,30',
    P4: 'M10,30 Q30,22 50,30',
    P5: 'M10,25 Q30,35 50,25',
    P6: 'M10,30 L30,10 L50,30',
    P7: 'M10,30 L18,20 L42,20 L50,30',
    P8: 'M10,30 Q20,22 30,20 Q40,22 50,30',
    P9: 'M10,30 Q30,15 50,30',
    P10: 'M10,30 Q30,18 50,30',
    P11: 'M10,30 Q30,12 50,30',
    P12: 'M10,30 Q20,10 30,10 Q40,10 50,30',
    P13: 'M10,25 Q15,10 30,30 Q45,10 50,25',
    P14: 'M10,30 L20,15 L30,25 L40,15 L50,30',
    P15: 'M10,30 C10,10 50,10 50,30',
  };

  return (
    <svg viewBox="0 0 60 40" className="w-full h-10">
      <path
        d={paths[profile] || paths.P1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ProfileSection() {
  const { t } = useTranslation();
  const { ring1, ring2, selectedRing, sameSettings, updateActiveRing } = useConfigStore();

  const currentProfile = selectedRing === 'ring2' ? ring2.profile : ring1.profile;

  return (
    <div className="animate-fade-in">
      <h3 className="font-display text-lg font-semibold mb-4">{t('profile')}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {profiles.map((p) => (
          <button
            key={p}
            onClick={() => updateActiveRing({ profile: p })}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:border-primary/50 ${currentProfile === p
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
          >
            <ProfileSVG profile={p} />
            <span className="text-xs font-medium">{profileLabels[p]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
