import { publicStats } from './lib/dess/dess';
import dotenv from 'dotenv';
import { performAuth } from './actions/auth-service';

// Load environment variables
dotenv.config();

async function getLoadPowerStats() {
  try {
    const pn = process.env.DESS_DEVICE_PN || '';
    const sn = process.env.DESS_DEVICE_SN || '';
    const devcode = process.env.DESS_DEVICE_DEV_CODE || '';
    const devaddr = process.env.DESS_DEVICE_DEV_ADDR || '';
    const i18n = process.env.DESS_I18N || 'en_US';
    const parameter = 'LOAD_ACTIVE_POWER';
    const chartStatus = false;
    const date = '2025-05-13';
    const auth = await performAuth();
    const loadPowerData = await publicStats(
      pn,
      sn,
      devcode,
      devaddr,
      i18n,
      parameter,
      chartStatus,
      date,
      auth,
    );
    console.log(loadPowerData);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}

getLoadPowerStats();
