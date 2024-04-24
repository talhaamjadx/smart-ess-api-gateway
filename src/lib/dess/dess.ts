import { hashSha1, transferUriStr } from '../utils';
import { api, COMPANY_KEY, createAuthApiRequest } from './dess-api.lib';
import {
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
  devcode: '2334',
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
    action: 'authSource',
    usr: username,
    source: '1',
    'company-key': COMPANY_KEY,
  };
  let uriStr = transferUriStr(params);
  let sign = hashSha1(`${salt}${pwdSha1}&${uriStr}`);
  return await api
    .get('', {
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
    action: 'webQueryDeviceEnergyFlowEs',
    ...sharedRequestParams,
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
  });
}

export async function querySPDeviceLastData(
  auth: DessAuthParams,
): Promise<QuerySpdeviceLastData> {
  return createAuthApiRequest(auth, {
    action: 'querySPDeviceLastData',
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
    action: 'queryDeviceCtrlValue',
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
    action: 'queryDeviceParsEs',
    ...sharedRequestParams,
    i18n: 'en_US',
    pn: appConfig.dess.device.pn,
    sn: appConfig.dess.device.sn,
  });
}
