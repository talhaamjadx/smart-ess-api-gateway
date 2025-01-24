import {
  FormattedResponseData,
  QueryDeviceCtrlValue,
  QueryDeviceParsEs,
  QuerySpdeviceLastData,
  WebQueryDeviceEnergyFlowEs,
} from '../lib/dess/dess-api.types';
import { TargetOptions } from '../lib/dess/dess';

export interface ResponseDessHttpData {
  target: TargetOptions;
  webQueryDeviceEnergyFlowEs: WebQueryDeviceEnergyFlowEs;
  querySPDeviceLastData: QuerySpdeviceLastData;
  queryDeviceParsEs: QueryDeviceParsEs;
  formattedData: FormattedResponseData;
}

export interface ResponseDessHttpSettings {
  settings: QueryDeviceCtrlValue[];
}
