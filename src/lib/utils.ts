import crypto from 'crypto';
import qs from 'querystring';

export function hashSha1(data: string) {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
}

export function transferUriStr(obj: Record<string, string>) {
  return qs
    .stringify(obj)
    .replace(/%20/g, '+')
    .replace(/%2B/g, '+')
    .replace(/%3A/g, ':')
    .replace(/%2C/g, ',')
    .replace(/%40/g, '@')
    .replace(/%24/g, '$')
    .replace(/%26/g, '&')
    .replace(/%3D/g, '=')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')');
}
