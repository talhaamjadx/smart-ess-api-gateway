import {
  DessAuthResponseData,
  DessAuthResponseDataMap,
} from './lib/dess/dess-api.types';

export const state: {
  auth: DessAuthResponseData | null;
  authIssued: number | null;
  authMap: Map<string, DessAuthResponseDataMap>;
} = {
  auth: null,
  authIssued: null,
  authMap: new Map<string, DessAuthResponseDataMap>(),
};
