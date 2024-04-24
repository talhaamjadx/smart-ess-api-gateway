import axios from 'axios';

import { hashSha1, transferUriStr } from '../utils';
import { DESS_QUERY_ACTION, DessAuthParams } from './dess-api.types';

export const COMPANY_KEY = 'bnrl_frRFjEz8Mkn';

export function generateSign(
  salt: string,
  secret: string,
  token: string,
  params: Record<string, string>,
) {
  let uriStr = transferUriStr(params);
  return hashSha1(`${salt}${secret}${token}&${uriStr}`);
}

export function generateParamsSign(
  token: string,
  secret: string,
  params: Record<string, string>,
) {
  const salt = new Date().getTime().toString();
  return { salt, sign: generateSign(salt, secret, token, params) };
}

export const api = axios.create({
  baseURL: 'https://web.dessmonitor.com',
});

export async function createApiRequest(
  path: string,
  auth: DessAuthParams,
  requestParams: Record<string, string>,
) {
  const { token, secret } = auth;
  const { sign, salt } = generateParamsSign(token, secret, requestParams);
  return await api
    .get(path, {
      params: {
        sign,
        salt,
        token,
        ...requestParams,
      },
    })
    .then((r) => {
      if (r.data.err !== 0) {
        throw r.data;
      } else {
        return r.data.dat;
      }
    });
}

export async function createAuthApiRequest(
  auth: DessAuthParams,
  requestParams: Record<string, string>,
) {
  return createApiRequest('/public/', auth, requestParams);
}

export async function createAuthApiRemoteRequest(
  auth: DessAuthParams,
  requestParams: Record<
    | string
    | 'action'
    | 'pn'
    | 'sn'
    | 'id'
    | 'val'
    | 'i18n'
    | 'source'
    | 'devcode'
    | 'devaddr',
    string | DESS_QUERY_ACTION
  >,
) {
  return createApiRequest('/remote/', auth, requestParams);
}
