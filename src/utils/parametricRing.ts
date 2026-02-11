
import * as THREE from 'three';
import type { ProfileType, EdgeStyle, PartitionConfig, SurfaceFinish } from '@/stores/configStore';

// Profile cross-section curves - each returns array of Vector2 points for LatheGeometry
// These define the outer contour of the ring band
// Profile cross-section curves - each returns array of Vector2 points for LatheGeometry
// These define the outer contour of the ring band
export function getProfileCurve(
  profile: ProfileType,
  width: number,
  height: number,
  edgeStyle: EdgeStyle,
  groove: any, // Added groove config
  waveOffset: number = 0 // Offset for wave effect
): THREE.Vector2[] {
  const hw = width / 2;
  const hh = height / 2;
  const points: THREE.Vector2[] = [];
  const steps = 64; // Increased resolution for smoother curves relative to grooves

  // Edge rounding factor
  const edgeR = edgeStyle === 'rounded' ? 0.3 :
    edgeStyle === 'beveled' ? 0.15 :
      edgeStyle === 'comfort' ? 0.4 : 0;

  // Helper to apply groove to a y-value
  // Groove position 0.5 is center. 0 is left edge, 1 is right edge.
  const applyGroove = (t: number, x: number, y: number): number => {
    if (!groove || groove.type === 'none') return y;

    const groovePos = groove.position; // 0..1
    // Scale groove width/depth to units
    const gw = groove.width * 0.1;
    const gd = groove.depth * 0.1;

    // Groove center x with wave offset:
    const gcx = -hw + groovePos * width + waveOffset;

    // Shadow Groove: Subtle, soft, wider
    if (groove.type === 'shadow') {
      // Shadow is wider but very shallow. Smooth curve.
      const shadowWidth = gw * 1.5;
      const shadowDepth = gd * 0.5; // Very subtle
      if (x > gcx - shadowWidth / 2 && x < gcx + shadowWidth / 2) {
        const dist = (x - gcx) / (shadowWidth / 2); // -1 to 1
        const falloff = Math.cos(dist * Math.PI / 2); // 1 at center, 0 at edges
        return Math.max(y - shadowDepth * falloff, hh * 0.2);
      }
      return y;
    }

    if (x > gcx - gw / 2 && x < gcx + gw / 2) {
      // Deepen y for groove
      if (groove.type === 'V') {
        const dist = Math.abs(x - gcx);
        const depth = gd * (1 - dist / (gw / 2));
        return Math.max(y - depth, hh * 0.2);
      }
      // Default U/Square (and Wave uses this profile but shifts position)
      return Math.max(y - gd, hh * 0.2);
    }
    return y;
  };

  switch (profile) {
    case 'P1': // Flat
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P2': // Dome / D-shape
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh + Math.sin(t * Math.PI) * hh * 0.4;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P3': // Court / comfort fit
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh + Math.sin(t * Math.PI) * hh * 0.6;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P4': // Flat with slight curve
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh + Math.sin(t * Math.PI) * hh * 0.15;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P5': // Concave
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh - Math.sin(t * Math.PI) * hh * 0.3;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P6': // Knife edge
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        const peak = 1 - Math.abs(t - 0.5) * 2;
        let y = hh + peak * hh * 0.8;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P7': // Beveled edge - Flat top with angled sides
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh;
        if (t < 0.15) {
          y = hh * 0.7 + (t / 0.15) * hh * 0.3;
        } else if (t > 0.85) {
          y = hh * 0.7 + ((1 - t) / 0.15) * hh * 0.3;
        } else {
          y = hh;
        }
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    case 'P8': // Euro shank
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = -hw + t * width;
        let y = hh + Math.sin(t * Math.PI) * hh * 0.25;
        y = applyGroove(t, x, y);
        points.push(new THREE.Vector2(x, y));
      }
      break;
    default: // P9-P12 variations
      {
        const variant = parseInt(profile.replace('P', '')) - 8;
        const curveFactor = 0.1 + variant * 0.12;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = -hw + t * width;
          let y = hh + Math.sin(t * Math.PI) * hh * curveFactor;
          y = applyGroove(t, x, y);
          points.push(new THREE.Vector2(x, y));
        }
      }
      break;
  }

  // Apply edge rounding
  if (edgeR > 0 && points.length > 2) {
    const first = points[0];
    const last = points[points.length - 1];
    first.y *= (1 - edgeR * 0.3);
    last.y *= (1 - edgeR * 0.3);
  }

  return points;
}

// Create ring geometry using lathe/torus approach
export function createRingGeometry(
  profile: ProfileType,
  ringSize: number,
  widthMm: number,
  heightMm: number,
  edgeStyle: EdgeStyle,
  groove?: any, // Added groove param
  partition?: PartitionConfig // Added partition config
): THREE.BufferGeometry {
  // Convert ring size to inner radius (European ring size ≈ inner circumference in mm)
  const innerRadius = ringSize / (2 * Math.PI);
  // Scale to Three.js units (1 unit ≈ 10mm)
  const scale = 0.1;
  const radius = innerRadius * scale;
  const width = widthMm * scale;
  const height = heightMm * scale;

  // Create the ring shape by revolving the cross-section
  const segments = 120; // High resolution

  // We need to generate profile points dynamically if 'wave' is enabled
  const isWave = groove && groove.type === 'wave';

  let staticProfilePoints: THREE.Vector2[] | null = null;
  if (!isWave) {
    staticProfilePoints = getProfileCurve(profile, width, height, edgeStyle, groove || { type: 'none' });
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // 1. Generate Vertices
  // We store all vertices in linear order: segments * ringSegments
  // But ringSegments might vary in 'wave' mode if profile point count changes? 
  // getProfileCurve always returns same number of points (steps=64 -> 65 points).

  // We need to capture ringSegments from the first call to know stride
  let ringSegments = (staticProfilePoints || getProfileCurve(profile, width, height, edgeStyle, groove)).length;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);

    let currentProfilePoints: THREE.Vector2[];
    if (isWave) {
      const waveOffset = Math.sin(theta * 6) * (width * 0.25);
      currentProfilePoints = getProfileCurve(profile, width, height, edgeStyle, groove, waveOffset);
    } else {
      currentProfilePoints = staticProfilePoints!;
    }

    // Safety check if dynamic profile changes length (shouldn't happen with current impl)
    if (currentProfilePoints.length !== ringSegments) {
      // fallback or error handling? ideally assume fixed length
    }

    for (let j = 0; j < ringSegments; j++) {
      const p = currentProfilePoints[j];
      const r = radius + p.y;

      positions.push(r * cosT, p.x, r * sinT);

      const nx = cosT * p.y / (Math.abs(p.y) + 0.001);
      const nz = sinT * p.y / (Math.abs(p.y) + 0.001);
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      normals.push(nx / len, 0, nz / len);

      uvs.push(i / segments, j / (ringSegments - 1));
    }
  }

  // 2. Determine Partitions
  // Parse ratio "1:2:1" -> [0.25, 0.75, 1.0] boundaries
  const getPartitionRanges = (ratioStr: string): number[] => {
    const parts = ratioStr.split(':').map(Number);
    const total = parts.reduce((a, b) => a + b, 0);
    let acc = 0;
    return parts.map(p => {
      acc += p;
      return acc / total;
    });
  };

  const partitionRanges = partition ? getPartitionRanges(partition.ratio) : [1.0];
  const numPartitions = partition ? partition.count : 1;

  // Helper to check which partition a face belongs to
  // Face defined by center coordinates (u, v)
  const getPartitionIndex = (u: number, v: number): number => {
    if (numPartitions === 1) return 0;

    // Correct approach: check if v < Boundary[k](u)
    for (let k = 0; k < partitionRanges.length; k++) {
      let boundary = partitionRanges[k];

      if (partition?.shape === 'diagonal') {
        // Diagonal boundary shifts based on u (circumference)
        // The factor 1.0 determines the steepness of the diagonal.
        // (u - 0.5) makes it centered, so boundary shifts from -0.5 to +0.5 relative to its base value.
        boundary += (u - 0.5) * 1.0;
      } else if (partition?.shape === 'wave') {
        // Wave boundary shifts based on u (circumference)
        // Math.sin(u * Math.PI * 6) creates 3 full waves around the ring (6 half-waves).
        // 0.1 is the amplitude of the wave.
        boundary += Math.sin(u * Math.PI * 6) * 0.1;
      }

      // Check if the v-coordinate (along the profile) falls within this partition's range
      // We need to clamp v to [0,1] for comparison with boundary
      if (v < boundary) return k;
    }
    return numPartitions - 1; // Fallback for the last partition
  };

  const geom = new THREE.BufferGeometry();

  // 3. Generate Indices grouped by Material
  // We iterate per material group
  for (let m = 0; m < numPartitions; m++) {
    const start = indices.length;

    for (let i = 0; i < segments; i++) { // Iterate over circumference segments
      for (let j = 0; j < ringSegments - 1; j++) { // Iterate over profile segments
        // Calculate face center u,v for partition assignment
        // u is normalized circumference position, v is normalized profile position
        const u = (i + 0.5) / segments;
        const v = (j + 0.5) / (ringSegments - 1);

        if (getPartitionIndex(u, v) === m) {
          // Vertices for a quad (two triangles)
          // a -- c
          // |    |
          // b -- d
          const a = i * ringSegments + j;
          const b = (i + 1) * ringSegments + j;
          const c = a + 1;
          const d = b + 1;

          indices.push(a, b, c);
          indices.push(c, b, d);
        }
      }
    }

    const count = indices.length - start;
    if (count > 0) {
      geom.addGroup(start, count, m);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

// Helper for finish properties
export function getFinishProperties(finish: SurfaceFinish): { roughness: number; metalness: number; clearcoat: number; bumpScale?: number } {
  switch (finish) {
    case 'matte': return { roughness: 0.35, metalness: 1.0, clearcoat: 0.0 };
    case 'ice_matte': return { roughness: 0.5, metalness: 0.9, clearcoat: 0.0 };
    case 'sand_coarse': return { roughness: 0.7, metalness: 0.8, clearcoat: 0.0 };
    case 'sand_fine': return { roughness: 0.4, metalness: 0.9, clearcoat: 0.0 };
    case 'hammered_polished': return { roughness: 0.15, metalness: 1.0, clearcoat: 0.0 };
    case 'hammered_matte': return { roughness: 0.5, metalness: 0.9, clearcoat: 0.0 };
    case 'polished':
    default: return { roughness: 0.15, metalness: 1.0, clearcoat: 0.0 }; // Removed clearcoat, increased roughness for solid gold look
  }
}

// Metal material properties
export function getMetalMaterial(
  metalType: string,
  metalColor: string,
  finish: SurfaceFinish = 'polished'
): { color: string; metalness: number; roughness: number; clearcoat: number } {
  const colors: Record<string, Record<string, string>> = {
    gold: {
      yellow: '#FFC840', // Richer, warmer yellow gold (less green/pale)
      white: '#E6E6E6',  // Bright white gold
      rose: '#EFA88E',   // Soft rose
    },
    platinum: {
      yellow: '#D9D9D9',
      white: '#D9D9D9',
      rose: '#D9D9D9',
    },
    palladium: {
      yellow: '#C4C4C4',
      white: '#C4C4C4',
      rose: '#C4C4C4',
    },
  };

  const props = getFinishProperties(finish);

  return {
    color: colors[metalType]?.[metalColor] || '#FFC840',
    metalness: props.metalness,
    roughness: props.roughness,
    clearcoat: props.clearcoat,
  };
}
