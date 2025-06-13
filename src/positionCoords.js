import { mapFieldCoords } from './fieldMap';

export const POSITION_ZONES = {
  Goalkeeper: { y: 100, xStart: 20, xEnd: 60 },
  'Center Back': { y: 75, xStart: -13, xEnd: 92 },
  'Full Back': { y: 86, xStart: -77, xEnd: 92 },
  'Wing Back': { y: 63, xStart:-95, xEnd: 98 },
  'Defensive Midfielder': { y: 60, xStart: 20, xEnd: 60 },
  'Central Midfielder': { y: 50, xStart: -8, xEnd: 70 },
  'Attacking Midfielder': { y: 38, xStart: 11, xEnd: 70 },
  Winger: { y: 25, xStart: -17, xEnd: 90 },
  Striker: { y: 16, xStart: 30, xEnd: 50 }
};

export function generateDynamicPositionCoords(position, count) {
  const zone = POSITION_ZONES[position];
  if (!zone) return Array(count).fill(mapFieldCoords(50, 50));

  const { y, xStart, xEnd } = zone;
  const spacing = (xEnd - xStart) / Math.max(count); 

  return Array.from({ length: count }, (_, index) => {
    const x = xStart + spacing * (index + 1);
    return mapFieldCoords(x, y );
  });
}
