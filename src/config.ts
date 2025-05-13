import { config } from 'dotenv-flow';

if (process.env.NODE_ENV !== 'production') {
  config(); // Load from local .env* files
}

// Define appConfig from process.env (always available on Render)
export const appConfig = {
  dess: {
    auth: {
      username: process.env.DESS_AUTH_USERNAME,
      password: process.env.DESS_AUTH_PASSWORD || null,
      passwordHash: process.env.DESS_AUTH_PASSWORD_HASH || null,
    },
    device: {
      pn: process.env.DESS_DEVICE_PN,
      sn: process.env.DESS_DEVICE_SN,
      devcode: process.env.DESS_DEVICE_DEVCODE,
      devaddress: process.env.DESS_DEVICE_DEVADDR,
      batteryVoltage: Number(process.env.DEVICE_BATTERY_VOLTAGE ?? '48'),
    },
  },
};
