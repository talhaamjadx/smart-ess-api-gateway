import { appConfig } from '../config';

export interface VoltagePoint {
  level: number;
  value: number;
}

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
].map((i) => ({
  ...i,
  value: (i.value * appConfig.dess.device.batteryVoltage) / 48,
}));

export function getPercentByVoltage(
  value: number,
  points: VoltagePoint[] = VOLTAGE_POINTS_LIFEPO4,
) {
  const max = points[0];
  const min = points[points.length - 1];
  const point =
    points.find((p) => p.value <= value) || (value > max.value ? max : min);
  const level = points.indexOf(point);
  const next = points[level - 1];
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
