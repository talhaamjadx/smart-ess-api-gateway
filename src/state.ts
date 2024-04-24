import { DessAuthResponseData } from './lib/dess/dess-api.types';

export const state: {
  auth: DessAuthResponseData | null;
  authIssued: number | null;
} = {
  auth: null,
  authIssued: null,
};
