export interface VoltagePoint {
  level: number;
  value: number;
}

export const VOLTAGE_POINTS_BASE = 48;
export const VOLTAGE_POINTS_LIFEPO4: VoltagePoint[] = [
  {
    level: 100,
    value: 54.4,
  },
  {
    level: 90,
    value: 53.6,
  },
  {
    level: 80,
    value: 53.1,
  },
  {
    level: 70,
    value: 52.8,
  },
  {
    level: 60,
    value: 52.3,
  },
  {
    level: 50,
    value: 52.2,
  },
  {
    level: 40,
    value: 52,
  },
  {
    level: 30,
    value: 51.5,
  },
  {
    level: 20,
    value: 52.2,
  },
  {
    level: 10,
    value: 48,
  },
  {
    level: 0,
    value: 40,
  },
];

export function getPercentByVoltage(
  value: number,
  batteryVoltage = VOLTAGE_POINTS_BASE,
  points: VoltagePoint[] = VOLTAGE_POINTS_LIFEPO4,
) {
  const currentPoints = points.map((i) => ({
    ...i,
    value: (i.value * batteryVoltage) / VOLTAGE_POINTS_BASE,
  }));
  const max = currentPoints[0];
  const min = currentPoints[currentPoints.length - 1];
  const point =
    currentPoints.find((p) => p.value <= value) ||
    (value > max.value ? max : min);
  const level = currentPoints.indexOf(point);
  const next = currentPoints[level - 1];
  if (next) {
    const pointsValueDiff = Math.abs(next.value - point.value);
    const pointsLevelDiff = Math.abs(next.level - point.level);
    const currentValueDiff = value - point.value;
    const diffCoefficient = currentValueDiff / pointsValueDiff;
    return point.level + diffCoefficient * pointsLevelDiff;
  } else {
    return point?.level;
  }
}
