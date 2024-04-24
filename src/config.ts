import { config } from 'dotenv-flow';

const env = config().parsed;
export const appConfig = {
  dess: {
    auth: {
      username: env.DESS_AUTH_USERNAME,
      password: env.DESS_AUTH_PASSWORD || null,
      passwordHash: env.DESS_AUTH_PASSWORD_HASH || null,
    },
    device: {
      pn: env.DESS_DEVICE_PN,
      sn: env.DESS_DEVICE_SN,
    },
  },
};
