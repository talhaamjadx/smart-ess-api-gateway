import * as dess from '../lib/dess/dess';
import { appConfig } from '../config';
import { state } from '../state';

export async function performAuth() {
  console.log('performAuth');
  const auth = await dess.authUser(
    appConfig.dess.auth.username,
    appConfig.dess.auth.passwordHash || appConfig.dess.auth.password,
    !!appConfig.dess.auth.passwordHash,
  );
  console.log('performAuth:success', auth.uid);
  state.auth = auth;
  return auth;
}
