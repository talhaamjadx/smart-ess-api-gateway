export interface DessAuthParams {
  token: string;
  secret: string;
}

export interface DessAuthResponseData {
  secret: string;
  expire: number;
  token: string;
  role: number;
  usr: string;
  uid: number;
}

export interface WebQueryDeviceEnergyFlowEs {
  brand: number;
  status: number;
  date: string;
  bt_status: BtStatus[];
  pv_status: PvStatus[];
  gd_status: GdStatus[];
  bc_status: BcStatus[];
  ol_status: OlStatus[];
  we_status: WeStatus[];
  mi_status: any[];
  mt_status: any[];
  wp_status: any[];
}

export interface BtStatus {
  par: string;
  val: string;
  unit?: string;
  status: number;
}

export interface PvStatus {
  par: string;
  val: string;
  unit: string;
  status: number;
}

export interface GdStatus {
  par: string;
  val: string;
  status: number;
}

export interface BcStatus {
  par: string;
  val: string;
  unit: string;
  status: number;
}

export interface OlStatus {
  par: string;
  val: string;
  status: number;
}

export interface WeStatus {
  par: string;
  val: string;
  status: number;
}

export interface QuerySpdeviceLastData {
  gts: string;
  pars: Pars;
}

export interface Pars {
  gd_: Gd[];
  pv_: Pv[];
  bt_: Bt[];
  bc_: Bc[];
}

export interface Gd {
  id: string;
  par: string;
  val: string;
  unit: string;
}

export interface Pv {
  id: string;
  par: string;
  val: string;
  unit: string;
}

export interface Bt {
  id: string;
  par: string;
  val: string;
  unit: string;
}

export interface Bc {
  id: string;
  par: string;
  val: string;
  unit: string;
}

export interface QueryDeviceCtrlValue {
  id: string;
  name: string;
  val: string;
}

export interface QueryDeviceParsEs {
  err: number;
  desc: string;
  dat: Dat;
}

export interface Dat {
  parameter: Parameter[];
}

export interface Parameter {
  par: string;
  name: string;
  val: string;
  unit: string;
}

export enum QUERY_DEVICE_CONTROL_ID {
  bse_output_source_priority = 'bse_output_source_priority',
  bat_max_charging_current = 'bat_max_charging_current',
  bat_ac_charging_current = 'bat_ac_charging_current',
  bat_battery_cut_off_voltage = 'bat_battery_cut_off_voltage',
  bat_charging_bulk_voltage = 'bat_charging_bulk_voltage',
  bat_charging_float_voltage = 'bat_charging_float_voltage',
}

export enum DESS_QUERY_ACTION {
  AUTH_SOURCE = 'authSource',
  WEB_QUERY_DEVICE_ENERGY_FLOW_ES = 'webQueryDeviceEnergyFlowEs',
  QUERY_SPDEVICE_LAST_DATA = 'querySPDeviceLastData',
  QUERY_DEVICE_CTRL_VALUE = 'queryDeviceCtrlValue',
  QUERY_DEVICE_PARS_ES = 'queryDeviceParsEs',
  CTRL_DEVICE = 'ctrlDevice',
}

export interface FormattedResponseData {
  battery_voltage: string;
  battery_status: string;
  battery_charger_source_priority: string;
  battery_charging_current: string;
  battery_discharge_current: string;
  solar_grid_in_voltage: string;
  solar_pv_voltage: string;
  solar_pv_power: string;
  output_source_priority: string;
  battery_real_level: string;
}

export enum ParameterPrefix {
  BATTERY = 'bt_',
  PV = 'pv_',
  GRID = 'gd_',
  BC = 'bc_',
}
