import * as dess from '../lib/dess/dess';
import { appConfig } from '../config';
import { state } from '../state';
import { DessAuthResponseData } from '../lib/dess/dess-api.types';

export async function performAuth() {
  console.log('performAuth');
  const auth = await dess.authUser(
    appConfig.dess.auth.username,
    appConfig.dess.auth.passwordHash || appConfig.dess.auth.password,
    !!appConfig.dess.auth.passwordHash,
  );
  console.log('performAuth:success', auth.uid);
  state.auth = auth;
  state.authIssued = new Date().getTime();
  return auth;
}

export async function authRenewCheck() {
  if (state.authIssued === null) return performAuth();
  const diff = new Date().getTime() - state.authIssued;
  if (state.auth.expire * 1000 - diff <= 60 * 1000 * 60) {
    console.log('authRenewCheck');
    return performAuth();
  }
  return state.auth;
}

export async function authWatchManager() {
  await performAuth();
  setInterval(() => {
    authRenewCheck();
  }, 10_000);
}

export function formatAuthData(auth: DessAuthResponseData) {
  return {
    token: auth.token,
    secret: auth.secret,
  };
}
