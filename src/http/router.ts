import { server } from './server';
import * as dess from '../lib/dess/dess';
import {
  queryDeviceList,
  resolveTargetOptions,
  setDeviceParsEs,
  TargetOptions,
} from '../lib/dess/dess';
import { ResponseDessHttpSettings } from './responses';
import {
  QUERY_DEVICE_CONTROL_ID,
  QueryDeviceStatus,
} from '../lib/dess/dess-api.types';
import {
  authRenewCheck,
  formatAuthData,
  performAuth,
} from '../actions/auth-service';
import { register } from '../metrics/prom';
import { controllerGetData } from './controllers/query-data.controller';

server.get('/auth', async function handler(request, reply) {
  const auth =
    request.query['force'] === 'true'
      ? await performAuth()
      : await authRenewCheck();
  reply.send({
    auth,
  });
});

server.get('/devices', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  const response = await queryDeviceList(auth, {
    status: request.query['status'],
  });
  reply.send(response.device);
});

server.get('/data', async function handler(request, reply) {
  const payload = await controllerGetData(request.query);

  reply.send(payload);
});

server.get('/settings', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  const target: TargetOptions = resolveTargetOptions({
    pn: request.query['pn'],
    sn: request.query['sn'],
    devcode: request.query['devcode'],
    devaddr: request.query['devaddr'],
  });
  const settings = await Promise.all(
    Object.values(QUERY_DEVICE_CONTROL_ID).map((id) =>
      dess.queryDeviceCtrlValue(auth, id, target),
    ),
  );
  const payload: ResponseDessHttpSettings = {
    settings,
  };

  reply.send(payload);
});

server.get('/settings-set', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  console.log(request.query);
  const target: TargetOptions = resolveTargetOptions({
    pn: request.query['pn'],
    sn: request.query['sn'],
    devcode: request.query['devcode'],
    devaddr: request.query['devaddr'],
  });
  const payload = await setDeviceParsEs(
    auth,
    request.query['id'],
    request.query['value'],
    target,
  );
  reply.send(payload);
});

server.get('/metrics', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  const response = await queryDeviceList(auth, {
    status: request.query['status'],
  });
  for (const item of response.device) {
    if (item.status !== QueryDeviceStatus.OFFLINE) {
      await controllerGetData({
        devaddr: item.devaddr.toString(),
        devcode: item.devcode.toString(),
        sn: item.sn,
        pn: item.pn,
        name: item.devalias,
      });
    }
  }
  reply.send(await register.metrics());
});

server.get('/load-power-stats', async function handler(request: any, reply) {
  try {
    const pn = process.env.DESS_DEVICE_PN || '';
    const sn = process.env.DESS_DEVICE_SN || '';
    const devcode = process.env.DESS_DEVICE_DEV_CODE || '';
    const devaddr = process.env.DESS_DEVICE_DEV_ADDR || '';
    const i18n = process.env.DESS_I18N || 'en_US';
    const parameter = request.query?.parameter || 'LOAD_ACTIVE_POWER';
    const chartStatus = false;
    const date = request.query?.date || new Date().toISOString().split('T')[0];
    const { publicStats } = await import('../lib/dess/dess');
    const auth = formatAuthData(await authRenewCheck());
    const loadPowerData = await publicStats(
      pn,
      sn,
      devcode,
      devaddr,
      i18n,
      parameter,
      chartStatus,
      date,
      auth,
    );
    reply.send(loadPowerData);
  } catch (error) {
    reply.status(500).send({
      error: 'Failed to get load power stats',
      details: error?.message || error,
    });
  }
});
