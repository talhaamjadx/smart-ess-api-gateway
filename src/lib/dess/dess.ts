import { hashSha1, transferUriStr } from '../utils';
import {
  api,
  COMPANY_KEY,
  createAuthApiRemoteRequest,
  createAuthApiRequest,
} from './dess-api.lib';
import {
  DESS_QUERY_ACTION,
  DessAuthParams,
  DessAuthResponseData,
  QUERY_DEVICE_CONTROL_ID,
  QueryDeviceCtrlValue,
  QueryDeviceParsEs,
  QuerySpdeviceLastData,
  WebQueryDeviceEnergyFlowEs,
} from './dess-api.types';
import { appConfig } from '../../config';

const sharedRequestParams = {
  source: '1',
  devcode: appConfig.dess.device.devcode,
  devaddr: '1',
};

export async function authUser(
  username: string,
  password: string,
  hashedPassword = false,
): Promise<DessAuthResponseData> {
  const salt = new Date().getTime().toString();
  const pwdSha1 = hashedPassword ? password : hashSha1(password);
  const params = {
    action: DESS_QUERY_ACTION.AUTH_SOURCE,
    usr: username,
    source: '1',
    'company-key': COMPANY_KEY,
  };
  let uriStr = transferUriStr(params);
  let sign = hashSha1(`${salt}${pwdSha1}&${uriStr}`);
  return await api
    .get('/public/', {
      params: {
        sign,
        salt,
        ...params,
      },
    })
    .then((r) => {
      return r.data.dat;
    });
}

export async function webQueryDeviceEnergyFlowEs(
  auth: DessAuthParams,
): Promise<WebQueryDeviceEnergyFlowEs> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.WEB_QUERY_DEVICE_ENERGY_FLOW_ES,
    ...sharedRequestParams,
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
  });
}

export async function querySPDeviceLastData(
  auth: DessAuthParams,
): Promise<QuerySpdeviceLastData> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_SPDEVICE_LAST_DATA,
    ...sharedRequestParams,
    i18n: 'en_US',
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
  });
}

export async function queryDeviceCtrlValue(
  auth: DessAuthParams,
  id: QUERY_DEVICE_CONTROL_ID = QUERY_DEVICE_CONTROL_ID.bse_output_source_priority,
): Promise<QueryDeviceCtrlValue> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_DEVICE_CTRL_VALUE,
    ...sharedRequestParams,
    i18n: 'en_US',
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
    id,
  });
}

export async function queryDeviceParsEs(
  auth: DessAuthParams,
): Promise<QueryDeviceParsEs> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_DEVICE_PARS_ES,
    ...sharedRequestParams,
    i18n: 'en_US',
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
  });
}
export async function setDeviceParsEs(
  auth: DessAuthParams,
  id: QUERY_DEVICE_CONTROL_ID = QUERY_DEVICE_CONTROL_ID.bse_output_source_priority,
  value: string,
): Promise<QueryDeviceParsEs> {
  return createAuthApiRemoteRequest(auth, {
    action: DESS_QUERY_ACTION.CTRL_DEVICE,
    ...sharedRequestParams,
    i18n: 'en_US',
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
    id,
    val: value,
  });
}
