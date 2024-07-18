import {
  FormattedResponseData,
  QueryDeviceCtrlValue,
  QueryDeviceParsEs,
  QuerySpdeviceLastData,
  WebQueryDeviceEnergyFlowEs,
} from '../lib/dess/dess-api.types';

export interface ResponseDessHttpData {
  webQueryDeviceEnergyFlowEs: WebQueryDeviceEnergyFlowEs;
  querySPDeviceLastData: QuerySpdeviceLastData;
  queryDeviceParsEs: QueryDeviceParsEs;
  formattedData: FormattedResponseData;
}

export interface ResponseDessHttpSettings {
  settings: QueryDeviceCtrlValue[];
}
