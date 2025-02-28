import client from 'prom-client';

export const register = new client.Registry();

export const gauge = new client.Gauge({
  name: 'sn_metric',
  help: 'metric_help',
  labelNames: ['sn', 'sensor'],
});
register.registerMetric(gauge);
