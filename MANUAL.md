Manual of integration is pretty simple.

Step 1
Install docker engine https://docs.docker.com/engine/install/

Step 2
Create directory
Copy docker-compose.yml from repo https://github.com/Antoxa1081/smart-ess-api-gateway/blob/main/docker-compose.yml
```yaml
version: "3.9"

services:
  app:
    image: antoxa1081/smart-ess-api-gateway
    restart: unless-stopped
    ports:
      - "8000:3000"
    volumes:
      - ./.env:/src/app/.env
```

Step 3
Create `.env` file via your text editor contains:
```
DESS_AUTH_USERNAME=your_smart_ess_account_login
# You need to choose one of the options: 
# plain password (DESS_AUTH_PASSWORD) 
# or hash (DESS_AUTH_PASSWORD_HASH)
# both not allowed

DESS_AUTH_PASSWORD=plain_password
# OR
DESS_AUTH_PASSWORD_HASH=sha1password # sha1 hash from plain_password

DESS_DEVICE_PN=Q0000000000000 #your PN  (for example)
DESS_DEVICE_SN=55555555555555 #your SN  (for example)
DESS_DEVICE_DEVCODE=2428 #your protocol ID  (for example)
DESS_DEVICE_DEVADDR=5 #your protocol devadress (for example)
DEVICE_BATTERY_VOLTAGE=48 #your battery voltage used for percentage sensor calculations
```

Step 4
Run in directory context terminal `docker compose up -d`
Service will be exposed on working port 8000

Try `curl http://localhost:8000/data` or `curl http://localhost:8000/devices?status=0`

Step 5

Depending of your HA installation method (docker container of supervised HAOS)
Open your HA `configuration.yaml` https://www.home-assistant.io/docs/configuration/

Next we are interested in creating sensors that take data from HTTP requests from our gateway.

This feature in HA is implemented by the rest sensor module.
https://www.home-assistant.io/integrations/sensor.rest/

Add this config data to your `configuration.yaml`
Replace URL `http://localhost:8000` with yours (if you changed origin or port)
```yaml
rest:
  - resource: "http://localhost:8000/data"
    sensor:
      - name: "solar_inverter_pv_output_power"
        unique_id: "solar_inverter_pv_output_power"
        value_template: "{{ value_json.formattedData.solar_pv_power }}"
        device_class: power
        unit_of_measurement: "W"

      - name: "solar_inverter_load_active_power"
        value_template: "{{ value_json.webQueryDeviceEnergyFlowEs.bc_status|selectattr('par', 'equalto', 'load_active_power')|map(attribute='val')|first|float }}"
        device_class: power
        unit_of_measurement: "kW"

      - name: "solar_inverter_gd_grid_voltage"
        value_template: "{{ value_json.formattedData.solar_grid_in_voltage }}"
        device_class: voltage
        unit_of_measurement: "V"

      - name: "solar_inverter_pv_voltage"
        value_template: "{{ value_json.formattedData.solar_pv_voltage }}"
        device_class: voltage
        unit_of_measurement: "V"

      - name: "solar_inverter_pv_input_current"
        value_template: "{{ 0 }}"
        device_class: current
        unit_of_measurement: "A"

      - name: "solar_inverter_bt_discharge_current"
        value_template: "{{ value_json.formattedData.battery_discharge_current }}"
        device_class: current
        unit_of_measurement: "A"

      - name: "solar_inverter_bt_battery_voltage"
        value_template: "{{ value_json.formattedData.battery_voltage }}"
        device_class: voltage
        unit_of_measurement: "V"


      - name: "solar_inverter_bt_real_level"
        value_template: "{{ value_json.formattedData.battery_real_level }}"
        device_class: battery
        unit_of_measurement: "%"


      - name: "solar_inverter_bt_charging_current"
        value_template: "{{ value_json.formattedData.battery_charging_current }}"
        device_class: current
        unit_of_measurement: "A"

      - name: "solar_inverter_priority"
        value_template: "{{ value_json.formattedData.output_source_priority }}"
        device_class: enum

      - name: "solar_inverter_battery_status"
        value_template: "{{ value_json.formattedData.battery_status }}"
        device_class: enum

      - name: "solar_inverter_battery_charger_source_priority"
        value_template: "{{ value_json.formattedData.battery_charger_source_priority }}"
        device_class: enum

rest_command:
  solar_inverter_set_output_priority:
    url: "http://localhost:8000/settings-set?id=los_output_source_priority&value={{ source_type_index }}" # Utility, Solar, SBU
  solar_inverter_change_priority_usb:
    url: "http://localhost:8000/settings-set?id=los_output_source_priority&value=0"
  solar_inverter_change_priority_sol:
    url: "http://localhost:8000/settings-set?id=los_output_source_priority&value=1"
  solar_inverter_change_priority_sbu:
    url: "http://localhost:8000/settings-set?id=los_output_source_priority&value=2"



  solar_inverter_set_charge_utility_current:
    url: "http://localhost:8000/settings-set?id=bat_max_utility_charge_current&value={{ charge_current }}"
  solar_inverter_charge_utility_current_fast:
    url: "http://localhost:8000/settings-set?id=bat_max_utility_charge_current&value=30"
  solar_inverter_charge_utility_current_default:
    url: "http://localhost:8000/settings-set?id=bat_max_utility_charge_current&value=20"
  solar_inverter_charge_utility_current_slow:
    url: "http://localhost:8000/settings-set?id=bat_max_utility_charge_current&value=10"


  solar_inverter_set_charger_priority:
    url: "http://localhost:8000/settings-set?id=bat_charger_source_priority&value={{ charger_priority_index }}" # Solar priority, Solar and mains, Solar only
```

Restart your HA instance after config changes.
Check your config entities in HA UI, they must be created by rest integration and match the name of the conditions in the configuration.

Step 6

If you want to integrate with Power Usage Dashboard

Energy sensor config (for Energy dashboard) before [2024.7.0](https://github.com/Olen/homeassistant-plant/releases/tag/v2024.7.0)

```yaml
sensor:
  - platform: integration
    source: sensor.solar_inverter_pv_output_power
    name: solar_energy_produce
    round: 2
    method: trapezoidal
    unit_time: h

  - platform: integration
    source: sensor.solar_inverter_battery_power_in
    name: solar_battery_energy_in
    round: 2
    method: trapezoidal
    unit_time: h

  - platform: integration
    source: sensor.solar_inverter_battery_power_out
    name: solar_battery_energy_out
    round: 2
    method: trapezoidal
    unit_time: h
```

Energy sensor config after [2024.7.0](https://github.com/Olen/homeassistant-plant/releases/tag/v2024.7.0)

```
sensor:
  - platform: integration
    source: sensor.solar_inverter_pv_output_power
    name: solar_energy_produce
    round: 2
    unit_time: h
    max_sub_interval:
      minutes: 5

  - platform: integration
    source: sensor.solar_inverter_battery_power_in
    name: solar_battery_energy_in
    round: 2
    unit_time: h
    max_sub_interval:
      minutes: 5

  - platform: integration
    source: sensor.solar_inverter_battery_power_out
    name: solar_battery_energy_out
    round: 2
    unit_time: h
    max_sub_interval:
      minutes: 5
```
Then add this sensor to energy dashboard settings.


<img src="https://github.com/user-attachments/assets/70ac8281-8f55-4b37-9d6b-dfbf73a03afd" width=20% height=20%>
