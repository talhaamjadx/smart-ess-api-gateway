import { server } from './server';
import * as dess from '../lib/dess/dess';
import { state } from '../state';
import { ResponseDessHttpData, ResponseDessHttpSettings } from './responses';
import { QUERY_DEVICE_CONTROL_ID } from '../lib/dess/dess-api.types';
import { performAuth } from '../actions/auth-service';

server.get('/auth', async function handler(request, reply) {
  const auth = await performAuth();
  reply.send({
    auth,
  });
});

server.get('/data', async function handler(request, reply) {
  if (!state.auth) {
    reply.callNotFound();
  }
  const auth = {
    token: state.auth.token,
    secret: state.auth.secret,
  };
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
  if (!state.auth) {
    reply.callNotFound();
  }
  const auth = {
    token: state.auth.token,
    secret: state.auth.secret,
  };
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
