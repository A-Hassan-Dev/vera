import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import RingModel from './RingModel';
import { useConfigStore } from '@/stores/configStore';
import { calculateRingPrice, formatPrice } from '@/utils/pricing';
import { useTranslation } from 'react-i18next';

export default function ThreeViewer() {
  const { ring1, ring2, ring1Visible, ring2Visible, selectedRing, setSelectedRing } = useConfigStore();
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const price1 = calculateRingPrice(ring1);
  const price2 = calculateRingPrice(ring2);
  const total = (ring1Visible ? price1 : 0) + (ring2Visible ? price2 : 0);

  const bothVisible = ring1Visible && ring2Visible;

  return (
    <div className="flex flex-col h-full">
      {/* Ring selection */}
      <div className="flex gap-2 p-3 justify-center">
        {ring1Visible && (
          <button
            onClick={() => setSelectedRing('ring1')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedRing === 'ring1'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
          >
            {t('ring1')}
          </button>
        )}
        {bothVisible && (
          <button
            onClick={() => setSelectedRing('pair')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedRing === 'pair'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
          >
            {t('ringPair')}
          </button>
        )}
        {ring2Visible && (
          <button
            onClick={() => setSelectedRing('ring2')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedRing === 'ring2'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
          >
            {t('ring2')}
          </button>
        )}
      </div>

      {/* 3D Canvas - Professional jewelry photography setup */}
      <div className="flex-1 min-h-[300px] ring-canvas-container rounded-lg overflow-hidden mx-3" style={{ background: '#ffffff' }}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 2, 12], fov: 28 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1
          }}
          shadows
        >
          <color attach="background" args={['#ffffff']} />
          <Suspense fallback={null}>
            {/* Studio lighting setup for photorealistic jewelry */}

            {/* Hemisphere light - soft ambient fill */}
            <hemisphereLight args={['#ffffff', '#e0e0e0', 1.0]} />

            {/* Main key light - Balanced highlights */}
            <directionalLight
              position={[5, 10, 5]}
              intensity={2.5}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0001}
            />

            {/* Side fill light */}
            <directionalLight position={[-5, 5, 5]} intensity={1.2} color="#ffffff" />

            {/* Back rim light */}
            <directionalLight position={[0, 5, -5]} intensity={1.5} color="#ffffff" />

            {/* Front sparkle */}
            <pointLight position={[0, 2, 8]} intensity={1.0} distance={20} />

            {ring1Visible && (
              <RingModel
                config={ring1}
                positionX={bothVisible ? -1.7 : 0}
                positionZ={0}
                rotationX={Math.PI / 2} // Stand up vertical
                rotationY={bothVisible ? -0.1 : Math.PI / 4} // Very slight angle
              />
            )}
            {ring2Visible && (
              <RingModel
                config={ring2}
                positionX={bothVisible ? 1.7 : 0}
                positionZ={0}
                rotationX={Math.PI / 2}
                rotationY={bothVisible ? 0.1 : Math.PI / 4} // Very slight angle
              />
            )}

            {/* Enhanced contact shadows */}
            <ContactShadows
              position={[0, -1.1, 0]}
              opacity={0.5}
              scale={20}
              blur={2}
              far={4}
              resolution={512}
              color="#000000"
            />

            {/* Studio HDRI */}
            <Environment preset="city" environmentIntensity={0.8} />

            <OrbitControls
              enablePan={false}
              minDistance={4}
              maxDistance={15}
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Price display */}
      <div className="p-3 space-y-1 text-sm">
        {ring1Visible && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('ring1')}</span>
            <span className="text-foreground font-medium">{formatPrice(price1)}</span>
          </div>
        )}
        {ring2Visible && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('ring2')}</span>
            <span className="text-foreground font-medium">{formatPrice(price2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-1 border-t border-border">
          <span className="text-foreground font-semibold">{t('totalPrice')}</span>
          <span className="text-primary font-bold text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
