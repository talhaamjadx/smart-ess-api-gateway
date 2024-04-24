import { DessAuthResponseData } from './lib/dess/dess-api.types';

export const state: {
  auth: DessAuthResponseData | null;
} = {
  auth: null,
};
