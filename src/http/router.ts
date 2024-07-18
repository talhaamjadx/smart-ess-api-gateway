import { server } from './server';
import * as dess from '../lib/dess/dess';
import { setDeviceParsEs } from '../lib/dess/dess';
import { ResponseDessHttpData, ResponseDessHttpSettings } from './responses';
import {
  ParameterPrefix,
  QUERY_DEVICE_CONTROL_ID,
} from '../lib/dess/dess-api.types';
import {
  authRenewCheck,
  formatAuthData,
  performAuth,
} from '../actions/auth-service';
import { getPercentByVoltage } from '../lib/voltage-point.utils';

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

  const getParameter = (prefix: ParameterPrefix, parameter: string) =>
    querySPDeviceLastData.pars[prefix].find((i) => i.id === parameter)?.val;

  const bt_battery_voltage = getParameter(
    ParameterPrefix.BATTERY,
    'bt_battery_voltage',
  );
  const bt_charger_source_priority = getParameter(
    ParameterPrefix.BATTERY,
    'bt_charger_source_priority',
  );
  const bt_battery_status = getParameter(
    ParameterPrefix.BATTERY,
    'bt_battery_status',
  );
  const bt_battery_charging_current = getParameter(
    ParameterPrefix.BATTERY,
    'bt_battery_charging_current',
  );
  const bt_battery_discharge_current = getParameter(
    ParameterPrefix.BATTERY,
    'bt_battery_discharge_current',
  );

  const solar_pv_voltage = getParameter(ParameterPrefix.PV, 'pv_input_voltage');
  const solar_grid_in_voltage = getParameter(
    ParameterPrefix.GRID,
    'gd_ac_input_voltage',
  );
  const solar_pv_power = getParameter(ParameterPrefix.PV, 'pv_output_power');
  const output_source_priority = getParameter(
    ParameterPrefix.BC,
    'bc_output_source_priority',
  );
  const battery_real_level = getPercentByVoltage(
    Number(bt_battery_voltage),
  ).toFixed(1);
  const payload: ResponseDessHttpData = {
    webQueryDeviceEnergyFlowEs,
    querySPDeviceLastData,
    queryDeviceParsEs,
    formattedData: {
      battery_voltage: bt_battery_voltage,
      battery_status: bt_battery_status,
      battery_charging_current: bt_battery_charging_current,
      battery_discharge_current: bt_battery_discharge_current,
      battery_charger_source_priority: bt_charger_source_priority,
      solar_pv_voltage,
      solar_grid_in_voltage,
      solar_pv_power,
      output_source_priority,
      battery_real_level,
    },
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
