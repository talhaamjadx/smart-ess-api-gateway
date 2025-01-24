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
  devaddr: appConfig.dess.device.devaddress,
};

export interface TargetOptions {
  pn?: string;
  sn?: string;
  devcode?: string;
  devaddr?: string;
}

export function resolveTargetOptions(target?: TargetOptions) {
  return {
    pn: target?.pn ?? appConfig.dess.device.pn,
    sn: target?.sn ?? appConfig.dess.device.sn,
    devcode: target?.devcode ?? sharedRequestParams.devcode,
    devaddr: target?.devaddr ?? sharedRequestParams.devaddr,
    source: '1',
  };
}

export async function authUser(
  username: string,
  password: string,
  hashedPassword = false,
): Promise<DessAuthResponseData> {
  const salt = new Date().getTime().toString();
  const pwdSha1 = hashedPassword ? password : hashSha1(password);
  console.log('user:pwdSha1', pwdSha1);
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
  target: TargetOptions,
): Promise<WebQueryDeviceEnergyFlowEs> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.WEB_QUERY_DEVICE_ENERGY_FLOW_ES,
    ...target,
  });
}

export async function querySPDeviceLastData(
  auth: DessAuthParams,
  target: TargetOptions,
): Promise<QuerySpdeviceLastData> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_SPDEVICE_LAST_DATA,
    i18n: 'en_US',
    ...target,
  });
}

export async function queryDeviceCtrlValue(
  auth: DessAuthParams,
  id: QUERY_DEVICE_CONTROL_ID = QUERY_DEVICE_CONTROL_ID.bse_output_source_priority,
  target: TargetOptions,
): Promise<QueryDeviceCtrlValue> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_DEVICE_CTRL_VALUE,
    i18n: 'en_US',
    ...target,
    id,
  });
}

export async function queryDeviceParsEs(
  auth: DessAuthParams,
  target: TargetOptions,
): Promise<QueryDeviceParsEs> {
  return createAuthApiRequest(auth, {
    action: DESS_QUERY_ACTION.QUERY_DEVICE_PARS_ES,
    i18n: 'en_US',
    ...target,
  });
}

export async function setDeviceParsEs(
  auth: DessAuthParams,
  id: QUERY_DEVICE_CONTROL_ID = QUERY_DEVICE_CONTROL_ID.bse_output_source_priority,
  value: string,
  target: TargetOptions,
): Promise<QueryDeviceParsEs> {
  return createAuthApiRemoteRequest(auth, {
    action: DESS_QUERY_ACTION.CTRL_DEVICE,
    i18n: 'en_US',
    id,
    val: value,
    ...target,
  });
}
