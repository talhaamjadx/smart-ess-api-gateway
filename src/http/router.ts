import { server } from './server';
import * as dess from '../lib/dess/dess';
import { setDeviceParsEs } from '../lib/dess/dess';
import { ResponseDessHttpData, ResponseDessHttpSettings } from './responses';
import { QUERY_DEVICE_CONTROL_ID } from '../lib/dess/dess-api.types';
import {
  authRenewCheck,
  formatAuthData,
  performAuth,
} from '../actions/auth-service';

server.get('/auth', async function handler(request, reply) {
  const auth =
    request.query['force'] === 'true'
      ? await performAuth()
      : await authRenewCheck();
  reply.send({
    auth,
  });
});

server.get('/data', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  const [webQueryDeviceEnergyFlowEs, querySPDeviceLastData, queryDeviceParsEs] =
    await Promise.all([
      dess.webQueryDeviceEnergyFlowEs(auth),
      dess.querySPDeviceLastData(auth),
      dess.queryDeviceParsEs(auth),
    ]);
  const payload: ResponseDessHttpData = {
    webQueryDeviceEnergyFlowEs,
    querySPDeviceLastData,
    queryDeviceParsEs,
  };

  reply.send(payload);
});

server.get('/settings', async function handler(request, reply) {
  const auth = formatAuthData(await authRenewCheck());
  const settings = await Promise.all(
    Object.values(QUERY_DEVICE_CONTROL_ID).map((id) =>
      dess.queryDeviceCtrlValue(auth, id),
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
  const payload = await setDeviceParsEs(
    auth,
    request.query['id'],
    request.query['value'],
  );
  reply.send(payload);
});
