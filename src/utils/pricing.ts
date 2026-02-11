import type { RingConfig } from '@/stores/configStore';

// Metal prices per gram (EUR)
const metalPrices: Record<string, number> = {
  'gold-14': 35,
  'gold-18': 48,
  'platinum-14': 55,
  'platinum-18': 55,
  'palladium-14': 42,
  'palladium-18': 42,
};

// Stone prices per stone (EUR)
const stonePrices: Record<string, number> = {
  diamond: 120,
  sapphire: 80,
  ruby: 90,
  emerald: 85,
};

const ENGRAVING_COST = 35;
const GROOVE_COST: Record<string, number> = {
  none: 0,
  U: 15,
  V: 15,
  shadow: 25,
  wave: 35,
};

export function calculateWeight(ring: RingConfig): number {
  // Approximate ring weight in grams from dimensions
  const circumference = ring.size * Math.PI / 10; // approximate inner circ in cm
  const crossSection = ring.width * ring.height; // mm²
  const volume = circumference * crossSection * 0.01; // rough cm³
  const density = ring.metal.type === 'gold' ? 15.5 :
    ring.metal.type === 'platinum' ? 21.4 : 12.0;
  return volume * density;
}

export function calculateRingPrice(ring: RingConfig): number {
  const weight = calculateWeight(ring);
  const metalKey = `${ring.metal.type}-${ring.metal.karat}`;
  const metalCost = weight * (metalPrices[metalKey] || 35);

  let stoneCost = 0;
  if (ring.stones.enabled) {
    const pricePerStone = (stonePrices[ring.stones.type] || 100) * (ring.stones.size / 0.05);
    stoneCost = pricePerStone * ring.stones.count;
  }

  const grooveCost = GROOVE_COST[ring.groove.type] || 0;
  const engravingCost = ring.engraving.enabled ? ENGRAVING_COST : 0;

  return Math.round(metalCost + stoneCost + grooveCost + engravingCost);
}

export function formatPrice(price: number): string {
  return `€ ${price.toLocaleString('en-US')}`;
}
