import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, Clone, Center, Text } from '@react-three/drei';
import { createRingGeometry, getMetalMaterial } from '@/utils/parametricRing';
import type { RingConfig, EngravingConfig } from '@/stores/configStore';

interface RingModelProps {
  config: RingConfig;
  positionX?: number;
  positionZ?: number;
  rotationY?: number;
  rotationX?: number;
}


// Shared material for all stones to improve performance and fix type errors
const stoneMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",
  metalness: 0.0,
  roughness: 0.0,
  transmission: 0.98,
  ior: 2.42,
  thickness: 0.5,
  transparent: true,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
});

/*
 * Diamond/Stone component with realistic brilliance
 */
function StoneMesh({ position, rotation, scale, material }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
  material: THREE.Material;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation ? new THREE.Euler(...rotation) : undefined}
      scale={[scale, scale, scale]}
      material={material}
      castShadow
    >
      <octahedronGeometry args={[1, 2]} />
    </mesh>
  );
}

function RingEngraving({ config, size, height }: { config: EngravingConfig; size: number; height: number }) {
  if (!config.enabled || !config.text) return null;

  // Use default safer font for now to prevent loading artifacts
  const color = config.type === 'diamond' ? '#ffffff' : '#222222';

  // Calculate inner radius scaling with safety
  const scale = 0.1;
  const rawRadius = (size / (2 * Math.PI));
  const radius = (isNaN(rawRadius) ? 54 / (2 * Math.PI) : rawRadius) * scale;
  const thickness = (isNaN(height) ? 1.8 : height) * scale;

  // Place text slightly closer to center to float clearly in the hole
  // Using depthTest=false allows it to appear "on top" of the inner visual surface without clipping
  const innerRadius = (radius - thickness / 2) - 0.005;

  return (
    <group rotation={[0, 0, 0]}>
      <Text
        fontSize={0.06} // Very small and crisp
        maxWidth={radius * 1.5}
        lineHeight={1}
        letterSpacing={0.05}
        textAlign="center"
        color={color}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, innerRadius]}
        rotation={[0, Math.PI, 0]}
        material-toneMapped={false}
        renderOrder={100}
        material-depthTest={false}
      >
        {config.text}
      </Text>
    </group>
  );
}

/**
 * Photorealistic Wedding Band Ring Model
 */
export default function RingModel({
  config,
  positionX = 0,
  positionZ = 0,
  rotationY = Math.PI / 6,
  rotationX = 0
}: RingModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material Logic
  // Map segments to materials
  // If segments is undefined (legacy), fallback to single metal config
  const segments = config.segments && config.segments.length > 0
    ? config.segments
    : [{ metal: config.metal.type, color: config.metal.color, finish: config.metal.finish || 'polished' }];

  const materials = useMemo(() => {
    return segments.map((seg) => {
      const props = getMetalMaterial(seg.metal, seg.color, seg.finish);
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(props.color),
        metalness: props.metalness,
        roughness: props.roughness,
        clearcoat: props.clearcoat,
        reflectivity: 0.8,
        envMapIntensity: 1.0,
        side: THREE.DoubleSide
      });
    });
  }, [segments]);

  // Use a single material if only 1, or array if multiple
  const meshMaterial = materials.length === 1 ? materials[0] : materials;

  // Calculate geometry parameters
  // 1. Size -> Inner Radius
  // 2. Width -> Band width
  // 3. Height -> Radial thickness

  const geometry = useMemo(() => {
    return createRingGeometry(
      config.profile,
      config.size,
      config.width,
      config.height,
      config.edgeStyle,
      config.groove,
      config.partition // Pass partition config
    );
  }, [config.profile, config.size, config.width, config.height, config.edgeStyle, config.groove, config.partition]);

  // Stone positions logic
  const stonePositions = useMemo(() => {
    if (!config.stones.enabled || config.stones.setting === 'none' || config.stones.count === 0) return [];

    const positions: { position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = [];
    const count = config.stones.count;
    const settings = config.stones.setting;

    // Ring geometry details
    const radius = (config.size / (2 * Math.PI)) * 0.1; // scale 0.1
    const yOffset = radius + (config.height * 0.1) / 2; // on top surface

    // 1. Solitaire / Smooth Stone (Single large)
    if (settings === 'smooth' || settings === 'tension' || settings === 'solitaire_smooth') {
      // Typically 1 stone, usually larger
      // If count > 1, maybe arrange them? But 'smooth' implies solitaire.
      // Let's respect 'count' but 'smooth' effectively behaves like single or simple row if count > 1
      const effectiveCount = Math.max(1, count);
      // Simple row logic for now if > 1
      const spread = 0.2; // roughly 10-15 degrees total

      for (let i = 0; i < effectiveCount; i++) {
        const t = effectiveCount === 1 ? 0 : (i / (effectiveCount - 1) - 0.5) * spread;
        const angle = t + Math.PI / 2; // Top is PI/2
        const x = Math.cos(angle) * (radius * 1.05); // slightly above
        const z = -Math.sin(angle) * (radius * 1.05); // z is depth? No in 3L torus, ring is in XZ plane?
        // parametricRing generates: r*cosT, p.x, r*sinT. y is up?
        // positions.push(r * cosT, p.x, r * sinT);
        // So Ring axis is Y-axis?
        // r*cosT is X, r*sinT is Z. Y is p.x (width).
        // So ring lies flat on XZ plane?
        // No, verify createRingGeometry.
        // theta loop 0..2PI. 
        // positions.push(r * cosT, p.x, r * sinT);
        // p.x is width (along Y axis of world?), r*cosT (X), r*sinT (Z).
        // Yes, ring is laying flat in XZ plane, extruded in Y.
        // Stones should be on the OUTER surface, so at distance R from center in XZ plane.

        // Let's place stones at angle 0 (Right side) or PI/2 (Top)?
        // Usually top is -Z or +Z? Let's use 0 for now (X axis).

        const a = (i - (effectiveCount - 1) / 2) * 0.15; // angle offset
        const r = radius + (config.height * 0.1) * 0.5; // Surface radius

        const px = Math.cos(a) * r;
        const pz = Math.sin(a) * r;

        positions.push({
          position: [px, 0, pz], // Y=0 (centered in width)
          rotation: [0, -a, 0], // Rotate to face out
          scale: 1.0
        });
      }
    }
    // 2. Rail / Channel / Across (Linear Row)
    else if (settings === 'rail' || settings === 'channel_side' || settings === 'across' || settings === 'across_second') {
      const spacing = 0.12; // Angle spacing
      for (let i = 0; i < count; i++) {
        // Center around 0
        const a = (i - (count - 1) / 2) * spacing;
        const r = radius + (config.height * 0.1) * 0.5; // Surface

        positions.push({
          position: [Math.cos(a) * r, 0, Math.sin(a) * r],
          rotation: [0, -a, 0],
          scale: 0.8 // Slightly smaller for rail
        });
      }
    }
    // 3. Pave (Grid / Staggered)
    else if (settings === 'pave') {
      // 3 rows?
      const rows = 3;
      const stonesPerRow = Math.ceil(count / rows);
      const width = config.width * 0.1;
      const rowSpacing = width * 0.3;
      const angleSpacing = 0.1;

      let created = 0;
      for (let r = 0; r < rows; r++) {
        const yOff = (r - 1) * rowSpacing; // -spacing, 0, +spacing
        for (let c = 0; c < stonesPerRow; c++) {
          if (created >= count) break;

          const a = (c - (stonesPerRow - 1) / 2) * angleSpacing;
          // Stagger offset?
          const stagger = (r % 2 === 0) ? 0 : angleSpacing * 0.5;
          const finalA = a + stagger;

          const rad = radius + (config.height * 0.1) * 0.5;

          positions.push({
            position: [Math.cos(finalA) * rad, yOff, Math.sin(finalA) * rad],
            rotation: [0, -finalA, 0],
            scale: 0.6 // Small stones
          });
          created++;
        }
      }
    }
    // Fallback / Free / Others
    else {
      // Default linear
      const spacing = 0.15;
      for (let i = 0; i < count; i++) {
        const a = (i - (count - 1) / 2) * spacing;
        const r = radius + (config.height * 0.1) * 0.5;
        positions.push({
          position: [Math.cos(a) * r, 0, Math.sin(a) * r],
          rotation: [0, -a, 0],
          scale: 1.0
        });
      }
    }

    return positions;
  }, [config.stones, config.size, config.width, config.height]);

  // Gem Material (Diamond-like)
  const gemMaterial = useMemo(() => {
    const color = config.stones.type === 'ruby' ? 0xff0000 :
      config.stones.type === 'sapphire' ? 0x0000ff :
        config.stones.type === 'emerald' ? 0x00ff00 : 0xffffff;

    return new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0,
      roughness: 0,
      transmission: 0.95, // Glass-like
      opacity: 1,
      transparent: true,
      ior: 2.4, // Diamond IOR
      side: THREE.FrontSide,
      clearcoat: 1.0,
      toneMapped: false,
    });
  }, [config.stones.type]);

  return (
    <group ref={groupRef} position={[positionX, 0, positionZ]} rotation={[rotationX, rotationY, 0]}>
      {/* Parametric Geometry Mesh */}
      <mesh
        geometry={geometry}
        material={meshMaterial}
        castShadow
        receiveShadow
        rotation={[0, 0, 0]}
      />

      {/* Stones */}
      <group>
        {stonePositions.map((stone, i) => (
          <StoneMesh
            key={i}
            position={stone.position}
            rotation={stone.rotation}
            scale={stone.scale * config.stones.size * 1.5} // Apply base stone size
            material={gemMaterial}
          />
        ))}
      </group>

      {/* Engraving */}
      <RingEngraving
        config={config.engraving}
        size={config.size}
        height={config.height}
      />
    </group>
  );
}
