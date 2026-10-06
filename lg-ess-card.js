/**
 * LG ESS Solar Power Flow & Control Card for Home Assistant Lovelace
 * Official Home Assistant Energy Dashboard Style Flow Lines & Theme Integration
 * Author: buktahula
 * Repository: https://github.com/buktahula/lg-ess-card
 * License: MIT
 */

const CARD_VERSION = "1.1.1";
console.info(
  `%c LG-ESS-CARD %c v${CARD_VERSION} `,
  "color: white; background: #ff9800; font-weight: 700; border-radius: 3px 0 0 3px;",
  "color: #ff9800; background: #fff3e0; font-weight: 700; border-radius: 0 3px 3px 0;"
);

// Register card with Home Assistant Card Picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "lg-ess-card",
  name: "LG ESS Solar Card",
  description: "Elegante Energiefluss-Visualisierung im original Home Assistant Energy-Dashboard Stil mit Batterieanzeige & Schnellsteuerung für LG ESS Wechselrichter.",
  preview: true,
  documentationURL: "https://github.com/buktahula/lg-ess-card",
});

const DEFAULT_ENTITY_PAIRS = {
  grid_buy: ["sensor.actual_grid_buy", "sensor.aktueller_netzbezug"],
  grid_sell: ["sensor.actual_grid_sell", "sensor.aktuelle_netzeinspeisung"],
  pv_total: ["sensor.actual_generation_pv_full", "sensor.aktuelle_pv_erzeugung_gesamt"],
  pv1: ["sensor.actual_generation_pv_1", "sensor.aktuelle_pv_erzeugung_string_1"],
  pv2: ["sensor.actual_generation_pv_2", "sensor.aktuelle_pv_erzeugung_string_2"],
  pv3: ["sensor.actual_generation_pv_3", "sensor.aktuelle_pv_erzeugung_string_3"],
  pv1_voltage: ["sensor.pv1_voltage", "sensor.pv_string_1_spannung"],
  pv2_voltage: ["sensor.pv2_voltage", "sensor.pv_string_2_spannung"],
  pv3_voltage: ["sensor.pv3_voltage", "sensor.pv_string_3_spannung"],
  battery_charge: ["sensor.actual_battery_charge", "sensor.aktuelle_batterieladung"],
  battery_discharge: ["sensor.actual_battery_discharge", "sensor.aktuelle_batterientladung"],
  house_consumption: ["sensor.actual_consuming_house", "sensor.aktueller_hausverbrauch"],
  battery_soc: ["sensor.battery_load_percent", "sensor.batterie_ladestand"],
  battery_status: ["sensor.battery_status", "sensor.batteriestatus"],
  operation_mode: ["sensor.operation_mode", "sensor.betriebsmodus"],
  grid_frequency: ["sensor.grid_freq", "sensor.netzfrequenz"],
  daily_grid_buy: ["sensor.daily_grid_buy", "sensor.tagesnetzbezug"],
  daily_grid_sell: ["sensor.energy_sell_today", "sensor.tagesnetzeinspeisung"],
  daily_pv: ["sensor.energy_generation_today", "sensor.tages_solarerzeugung"],
  daily_house: ["sensor.daily_verbrauch_gesamt", "sensor.tages_hausverbrauch_gesamt"],
  autarky: ["sensor.solaredge_calculated_self_sufficiency", "sensor.autarkie_grad_heute"],
  self_consumption: ["sensor.energy_day_self_consumption_rate", "sensor.eigenverbrauchsrate_heute"],
  switch_winter_mode: ["switch.winter_mode", "switch.lgess_switch_winter_mode"],
  switch_fastcharge: ["switch.fastcharge", "switch.lgess_switch_fastcharge"],
  switch_active: ["switch.active", "switch.lgess_switch_active"],
};

const CIRCLE_CIRCUMFERENCE = 238.76104; // 2 * PI * 38 (HA Energy Home Circle standard)

class LgEssCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._showStrings = false;
  }

  setConfig(config) {
    this._config = {
      title: "LG ESS Solar",
      power_unit: "kW", // "kW" or "W"
      energy_unit: "kWh",
      show_strings: true,
      show_controls: true,
      show_stats: true,
      animation: true,
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _getEntityState(key) {
    if (!this._hass) return null;
    // 1. Explicit user override
    if (this._config.entities && this._config.entities[key]) {
      const eid = this._config.entities[key];
      return this._hass.states[eid] || null;
    }
    // 2. Auto-discovery
    const candidates = DEFAULT_ENTITY_PAIRS[key] || [];
    for (const eid of candidates) {
      if (this._hass.states[eid]) {
        return this._hass.states[eid];
      }
    }
    return null;
  }

  _getNumericValue(key, defaultVal = 0.0) {
    const s = this._getEntityState(key);
    if (!s || s.state === undefined || s.state === "unavailable" || s.state === "unknown") {
      return defaultVal;
    }
    const parsed = parseFloat(s.state);
    return isNaN(parsed) ? defaultVal : parsed;
  }

  _formatPower(valInKw, forceUnit = null) {
    const unit = forceUnit || this._config.power_unit || "kW";
    if (unit === "W") {
      const watts = valInKw > 50 ? valInKw : valInKw * 1000;
      return `${Math.round(watts)} W`;
    }
    const kw = valInKw > 50 ? valInKw / 1000 : valInKw;
    return `${kw.toFixed(2)} kW`;
  }

  _formatEnergy(val) {
    if (val > 1000) {
      return `${(val / 1000).toFixed(1)} kWh`;
    }
    return `${val.toFixed(1)} kWh`;
  }

  _fireMoreInfo(key) {
    const s = this._getEntityState(key);
    if (!s) return;
    const event = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId: s.entity_id },
    });
    this.dispatchEvent(event);
  }

  _toggleSwitch(key) {
    const s = this._getEntityState(key);
    if (!s || !this._hass) return;
    this._hass.callService("switch", "toggle", { entity_id: s.entity_id });
  }

  _getBatteryIcon(soc, isCharging) {
    if (isCharging) {
      return `<path d="M11 20V13H8L13 3V10H16L11 20M15 4H14V2H10V4H9C7.9 4 7 4.9 7 6V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V6C17 4.9 16.1 4 15 4Z"/>`;
    }
    if (soc <= 10) {
      return `<path d="M13 14H11V8H13M13 18H11V16H13M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>`;
    }
    if (soc <= 30) {
      return `<path d="M16 20H8V17H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>`;
    }
    if (soc <= 60) {
      return `<path d="M16 20H8V13H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>`;
    }
    if (soc <= 85) {
      return `<path d="M16 20H8V9H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>`;
    }
    return `<path d="M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>`;
  }

  _render() {
    if (!this._hass || !this.shadowRoot) return;

    // Live Power Values (in kW)
    const pvPower = this._getNumericValue("pv_total");
    const gridBuy = this._getNumericValue("grid_buy");
    const gridSell = this._getNumericValue("grid_sell");
    const battCharge = this._getNumericValue("battery_charge");
    const battDischarge = this._getNumericValue("battery_discharge");
    const housePower = this._getNumericValue("house_consumption");

    // Battery
    const soc = Math.round(this._getNumericValue("battery_soc", 0));
    const opMode = this._getEntityState("operation_mode")?.state || "Normal";
    const gridFreq = this._getNumericValue("grid_frequency", 50.0);

    // Daily Energy & KPIs
    const autarky = this._getNumericValue("autarky", 0);
    const selfCons = this._getNumericValue("self_consumption", 0);
    const dailyPv = this._getNumericValue("daily_pv", 0);
    const dailyGridSell = this._getNumericValue("daily_grid_sell", 0);
    const dailyGridBuy = this._getNumericValue("daily_grid_buy", 0);
    const dailyHouse = this._getNumericValue("daily_house", 0);

    // Switches
    const winterModeState = this._getEntityState("switch_winter_mode")?.state === "on";
    const fastchargeState = this._getEntityState("switch_fastcharge")?.state === "on";
    const activeState = this._getEntityState("switch_active")?.state !== "off";

    // Flows Breakdown (in kW)
    const isSolarActive = pvPower > 0.02;
    const isGridBuying = gridBuy > 0.02;
    const isGridSelling = gridSell > 0.02;
    const isBattCharging = battCharge > 0.02;
    const isBattDischarging = battDischarge > 0.02;

    const solarToGrid = isGridSelling ? gridSell : 0;
    const solarToBattery = isBattCharging ? Math.min(pvPower, battCharge) : 0;
    const solarToHome = isSolarActive
      ? Math.max(0, Math.min(housePower, pvPower - solarToBattery - solarToGrid))
      : 0;

    const batteryToHome = isBattDischarging ? battDischarge : 0;
    const batteryToGrid = isBattDischarging && isGridSelling
      ? Math.max(0, Math.min(battDischarge, gridSell - Math.min(pvPower, gridSell)))
      : 0;
    const gridToBattery = isBattCharging ? Math.max(0, battCharge - pvPower) : 0;
    const gridToHome = isGridBuying ? Math.max(0, gridBuy - gridToBattery) : 0;

    const hasSolarToGrid = solarToGrid > 0.02;
    const hasSolarToHome = solarToHome > 0.02;
    const hasSolarToBattery = solarToBattery > 0.02;
    const hasBatteryToHome = batteryToHome > 0.02;
    const hasBatteryToGrid = batteryToGrid > 0.02;
    const hasBatteryFromGrid = gridToBattery > 0.02;
    const hasGridToHome = gridToHome > 0.02;

    // Home Circle Source Mix (Arcs Calculation)
    const usedSolar = solarToHome;
    const usedBattery = batteryToHome;
    const usedGrid = gridToHome;
    const ringTotal = usedSolar + usedBattery + usedGrid;

    let solarArc = 0;
    let battArc = 0;
    let gridArc = 0;
    const hasRing = ringTotal > 0.02;

    if (hasRing) {
      solarArc = (usedSolar / ringTotal) * CIRCLE_CIRCUMFERENCE;
      battArc = (usedBattery / ringTotal) * CIRCLE_CIRCUMFERENCE;
      gridArc = (usedGrid / ringTotal) * CIRCLE_CIRCUMFERENCE;
    }

    // Animation Duration Calculation based on flow volume
    const maxPower = Math.max(pvPower, housePower, gridBuy, gridSell, battCharge, battDischarge, 1.0);
    const getDuration = (flowKw) => {
      const norm = Math.min(1.0, Math.max(0.0, flowKw / (maxPower * 0.9)));
      return (6.0 - norm * 4.6).toFixed(2);
    };

    const allowAnim = this._config.animation !== false;

    // PV Strings data
    const pv1P = this._getNumericValue("pv1");
    const pv1V = this._getNumericValue("pv1_voltage");
    const pv2P = this._getNumericValue("pv2");
    const pv2V = this._getNumericValue("pv2_voltage");
    const pv3P = this._getNumericValue("pv3");
    const pv3V = this._getNumericValue("pv3_voltage");
    const hasPv3 = pv3P > 0 || pv3V > 0 || this._getEntityState("pv3") !== null;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          /* Official Home Assistant Energy Dashboard Colors & Theme CSS Variables */
          --energy-solar-color: var(--energy-solar-color, #ff9800);
          --energy-battery-in-color: var(--energy-battery-in-color, #f06292);
          --energy-battery-out-color: var(--energy-battery-out-color, #4db6ac);
          --energy-grid-consumption-color: var(--energy-grid-consumption-color, #5a6fe8);
          --energy-grid-return-color: var(--energy-grid-return-color, #488fc2);
          --card-radius: var(--ha-card-border-radius, 16px);
        }

        ha-card {
          border-radius: var(--card-radius);
          box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0, 0, 0, 0.2));
          background: var(--ha-card-background, var(--card-background-color, #1e1e24));
          color: var(--primary-text-color, #f3f4f6);
          padding: 18px 20px;
          overflow: hidden;
          font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
          position: relative;
        }

        /* Header */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--energy-solar-color), #d97706);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--primary-text-color, #fff);
          margin: 0;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--secondary-background-color, rgba(255, 255, 255, 0.08));
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary-text-color, #9ca3af);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${activeState ? "var(--energy-grid-return-color, #10b981)" : "#ef4444"};
          box-shadow: 0 0 8px ${activeState ? "var(--energy-grid-return-color, #10b981)" : "#ef4444"};
        }

        /* ============================================================== */
        /* Energy Flow Container (100% Symmetrical Absolute Coordinates)  */
        /* ============================================================== */
        .flow-container {
          position: relative;
          width: 100%;
          max-width: 460px;
          margin: 6px auto 10px auto;
          aspect-ratio: 1.55 / 1;
          min-height: 270px;
        }

        svg.flow-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Node Elements (Centered via Translate) */
        .node {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .node:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        /* Perfectly Symmetrical Percentage Placements */
        .node-solar {
          top: 18%;
          left: 50%;
        }

        .node-batt {
          top: 82%;
          left: 50%;
        }

        .node-grid {
          top: 50%;
          left: 17%;
        }

        .node-house {
          top: 50%;
          left: 83%;
        }

        .circle {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          box-sizing: border-box;
          border: 2.5px solid var(--divider-color, rgba(255, 255, 255, 0.12));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          background: var(--ha-card-background, var(--card-background-color, #1e1e24));
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .node-solar .circle {
          border-color: var(--energy-solar-color);
          ${isSolarActive ? "box-shadow: 0 0 14px rgba(255, 152, 0, 0.35);" : ""}
        }

        .circle.selling {
          border-color: var(--energy-grid-return-color);
          box-shadow: 0 0 14px rgba(72, 143, 194, 0.35);
        }

        .circle.buying {
          border-color: var(--energy-grid-consumption-color);
          box-shadow: 0 0 14px rgba(90, 111, 232, 0.35);
        }

        .circle.charging {
          border-color: var(--energy-battery-in-color);
          box-shadow: 0 0 14px rgba(240, 98, 146, 0.35);
        }

        .circle.discharging {
          border-color: var(--energy-battery-out-color);
          box-shadow: 0 0 14px rgba(77, 182, 172, 0.35);
        }

        .node-house .circle {
          border-width: 0;
        }

        .node-house .circle.border {
          border-width: 2.5px;
          border-color: var(--divider-color, rgba(255, 255, 255, 0.12));
        }

        /* Home Multi-Arc Ring */
        .circle svg.circle-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .circle-ring circle {
          fill: none;
          stroke-width: 3.5px;
          transition: stroke-dashoffset 0.4s ease, stroke-dasharray 0.4s ease;
        }

        .circle-ring circle.solar {
          stroke: var(--energy-solar-color);
        }

        .circle-ring circle.battery {
          stroke: var(--energy-battery-out-color);
        }

        .circle-ring circle.grid {
          stroke: var(--energy-grid-consumption-color);
        }

        .node-icon {
          width: 22px;
          height: 22px;
          fill: currentColor;
          margin-bottom: 2px;
        }

        .val {
          font-size: 0.8rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
        }

        .label {
          color: var(--secondary-text-color, #9ca3af);
          font-size: 0.72rem;
          font-weight: 700;
          height: 18px;
          margin-top: 4px;
          letter-spacing: 0.04em;
          text-align: center;
          text-transform: uppercase;
        }

        .node-solar .label {
          margin-top: 0;
          margin-bottom: 4px;
          order: -1;
        }

        .battery-soc {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .battery-soc svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .battery-in, .return {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
        }

        .battery-in {
          color: var(--energy-battery-in-color);
        }

        .battery-out {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--energy-battery-out-color);
        }

        .battery-idle {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--secondary-text-color, #9ca3af);
        }

        .return {
          color: var(--energy-grid-return-color);
        }

        .consumption {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--energy-grid-consumption-color);
        }

        .small-arrow {
          width: 12px;
          height: 12px;
          fill: currentColor;
          margin-right: 2px;
        }

        /* SVG Paths */
        path {
          fill: none;
          stroke: var(--divider-color, rgba(255, 255, 255, 0.12));
          stroke-width: 1.5;
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }

        path.active.solar {
          stroke: var(--energy-solar-color);
          stroke-width: 2.2;
        }

        path.active.return {
          stroke: var(--energy-grid-return-color);
          stroke-width: 2.2;
        }

        path.active.battery-solar {
          stroke: var(--energy-battery-in-color);
          stroke-width: 2.2;
        }

        path.active.battery-house {
          stroke: var(--energy-battery-out-color);
          stroke-width: 2.2;
        }

        path.active.grid {
          stroke: var(--energy-grid-consumption-color);
          stroke-width: 2.2;
        }

        path.active.battery-to-grid {
          stroke: var(--energy-grid-return-color);
          stroke-width: 2.2;
        }

        path.active.battery-from-grid {
          stroke: var(--energy-grid-consumption-color);
          stroke-width: 2.2;
        }

        /* Moving Particle Dots */
        circle.solar {
          stroke-width: 4;
          stroke: var(--energy-solar-color);
          fill: var(--energy-solar-color);
        }

        circle.return {
          stroke-width: 4;
          stroke: var(--energy-grid-return-color);
          fill: var(--energy-grid-return-color);
        }

        circle.battery-solar {
          stroke-width: 4;
          stroke: var(--energy-battery-in-color);
          fill: var(--energy-battery-in-color);
        }

        circle.battery-house {
          stroke-width: 4;
          stroke: var(--energy-battery-out-color);
          fill: var(--energy-battery-out-color);
        }

        circle.grid {
          stroke-width: 4;
          stroke: var(--energy-grid-consumption-color);
          fill: var(--energy-grid-consumption-color);
        }

        circle.battery-to-grid {
          stroke-width: 4;
          stroke: var(--energy-grid-return-color);
          fill: var(--energy-grid-return-color);
        }

        circle.battery-from-grid {
          stroke-width: 4;
          stroke: var(--energy-grid-consumption-color);
          fill: var(--energy-grid-consumption-color);
        }

        /* Collapsible Strings Drawer */
        .strings-drawer {
          background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
          border-radius: 12px;
          padding: 10px 14px;
          margin-top: 14px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        }

        .strings-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          color: var(--secondary-text-color, #9ca3af);
        }

        .strings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .string-card {
          background: rgba(0, 0, 0, 0.18);
          padding: 8px 10px;
          border-radius: 8px;
          border-left: 3px solid var(--energy-solar-color);
        }

        .string-name {
          font-size: 0.7rem;
          color: var(--secondary-text-color, #9ca3af);
          font-weight: 600;
        }

        .string-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--primary-text-color, #fff);
          margin-top: 2px;
        }

        .string-volt {
          font-size: 0.68rem;
          color: var(--secondary-text-color, #6b7280);
        }

        /* KPI Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .stat-card {
          background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .gauge-ring {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .gauge-svg {
          transform: rotate(-90deg);
        }

        .gauge-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--secondary-text-color, #9ca3af);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .stat-desc {
          font-size: 0.75rem;
          color: var(--primary-text-color, #fff);
          margin-top: 2px;
        }

        /* Daily Totals Chips */
        .daily-chips {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 12px;
        }

        .chip {
          background: rgba(0, 0, 0, 0.18);
          border-radius: 8px;
          padding: 6px 8px;
          text-align: center;
          border-top: 2.5px solid var(--chip-border, var(--divider-color));
        }

        .chip-lbl {
          font-size: 0.65rem;
          color: var(--secondary-text-color, #9ca3af);
          font-weight: 600;
        }

        .chip-val {
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 2px;
        }

        /* Quick Controls Bar */
        .controls-bar {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-ctrl {
          flex: 1;
          background: var(--secondary-background-color, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
          color: var(--primary-text-color, #fff);
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }

        .btn-ctrl:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-ctrl.active-blue {
          background: rgba(56, 189, 248, 0.15);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .btn-ctrl.active-amber {
          background: rgba(245, 158, 11, 0.15);
          border-color: #f59e0b;
          color: #f59e0b;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      </style>

      <ha-card>
        <!-- Header -->
        <div class="card-header">
          <div class="title-group">
            <div class="title-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,16.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/>
              </svg>
            </div>
            <h2 class="card-title">${this._config.title}</h2>
          </div>
          <div class="status-pill">
            <span class="status-dot"></span>
            <span>${opMode} • ${gridFreq.toFixed(1)} Hz</span>
          </div>
        </div>

        <!-- Official Home Assistant Energy Distribution Visualizer (100% Symmetrical) -->
        <div class="flow-container">
          <svg class="flow-svg" viewBox="0 0 100 100">
            <!-- Inactive Subtle Lines -->
            <path d="M 28,50 L 72,50" />
            <path d="M 44,71 C 44,56 34,56 28,56" />
            <path d="M 56,71 C 56,56 66,56 72,56" />
            <path d="M 44,29 C 44,44 34,44 28,44" />
            <path d="M 56,29 C 56,44 66,44 72,44" />
            <path d="M 50,29 L 50,71" />

            <!-- Active Paths -->
            <!-- Solar to Battery (Vertical) -->
            <path id="path-solar-batt" class="battery-solar ${hasSolarToBattery ? 'active' : ''}"
                  d="M 50,29 L 50,71" vector-effect="non-scaling-stroke" />

            <!-- Solar to Grid (Curved) -->
            <path id="path-solar-grid" class="return ${hasSolarToGrid ? 'active' : ''}"
                  d="M 44,29 C 44,44 34,44 28,44" vector-effect="non-scaling-stroke" />

            <!-- Solar to Home (Curved) -->
            <path id="path-solar-home" class="solar ${hasSolarToHome ? 'active' : ''}"
                  d="M 56,29 C 56,44 66,44 72,44" vector-effect="non-scaling-stroke" />

            <!-- Battery to Home (Curved) -->
            <path id="path-batt-home" class="battery-house ${hasBatteryToHome ? 'active' : ''}"
                  d="M 56,71 C 56,56 66,56 72,56" vector-effect="non-scaling-stroke" />

            <!-- Battery to Grid / Grid to Battery -->
            <path id="path-batt-grid" class="${hasBatteryToGrid ? 'battery-to-grid active' : hasBatteryFromGrid ? 'battery-from-grid active' : ''}"
                  d="M 44,71 C 44,56 34,56 28,56" vector-effect="non-scaling-stroke" />

            <!-- Grid to Home (Horizontal) -->
            <path id="path-grid-home" class="grid ${hasGridToHome ? 'active' : ''}"
                  d="M 28,50 L 72,50" vector-effect="non-scaling-stroke" />

            <!-- Animated Motion Dots -->
            ${allowAnim && hasSolarToGrid ? `
              <circle r="1" class="return" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToGrid)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-grid" xlink:href="#path-solar-grid"/>
                </animateMotion>
              </circle>
              <circle r="1" class="return" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToGrid)}s" begin="-${(getDuration(solarToGrid) / 2).toFixed(2)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-grid" xlink:href="#path-solar-grid"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasSolarToHome ? `
              <circle r="1" class="solar" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToHome)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-home" xlink:href="#path-solar-home"/>
                </animateMotion>
              </circle>
              <circle r="1" class="solar" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToHome)}s" begin="-${(getDuration(solarToHome) / 2).toFixed(2)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-home" xlink:href="#path-solar-home"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasSolarToBattery ? `
              <circle r="1" class="battery-solar" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToBattery)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-batt" xlink:href="#path-solar-batt"/>
                </animateMotion>
              </circle>
              <circle r="1" class="battery-solar" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(solarToBattery)}s" begin="-${(getDuration(solarToBattery) / 2).toFixed(2)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-solar-batt" xlink:href="#path-solar-batt"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasBatteryToHome ? `
              <circle r="1" class="battery-house" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(batteryToHome)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-batt-home" xlink:href="#path-batt-home"/>
                </animateMotion>
              </circle>
              <circle r="1" class="battery-house" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(batteryToHome)}s" begin="-${(getDuration(batteryToHome) / 2).toFixed(2)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-batt-home" xlink:href="#path-batt-home"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasBatteryFromGrid ? `
              <circle r="1" class="battery-from-grid" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(gridToBattery)}s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                  <mpath href="#path-batt-grid" xlink:href="#path-batt-grid"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasBatteryToGrid ? `
              <circle r="1" class="battery-to-grid" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(batteryToGrid)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-batt-grid" xlink:href="#path-batt-grid"/>
                </animateMotion>
              </circle>
            ` : ''}

            ${allowAnim && hasGridToHome ? `
              <circle r="1" class="grid" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(gridToHome)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-grid-home" xlink:href="#path-grid-home"/>
                </animateMotion>
              </circle>
              <circle r="1" class="grid" vector-effect="non-scaling-stroke">
                <animateMotion dur="${getDuration(gridToHome)}s" begin="-${(getDuration(gridToHome) / 2).toFixed(2)}s" repeatCount="indefinite" calcMode="linear">
                  <mpath href="#path-grid-home" xlink:href="#path-grid-home"/>
                </animateMotion>
              </circle>
            ` : ''}
          </svg>

          <!-- 1. Node Solar (Top Center: 50%, 18%) -->
          <div class="node node-solar" id="node-solar">
            <span class="label">Solar</span>
            <div class="circle" style="color: var(--energy-solar-color);">
              <svg class="node-icon" viewBox="0 0 24 24">
                <path d="M12 2L14.39 5.42C13.65 5.15 12.84 5 12 5C11.16 5 10.35 5.15 9.61 5.42L12 2M12 7A5 5 0 0 1 17 12A5 5 0 0 1 12 17A5 5 0 0 1 7 12A5 5 0 0 1 12 7M12 9A3 3 0 0 0 9 12A3 3 0 0 0 12 15A3 3 0 0 0 15 12A3 3 0 0 0 12 9Z" />
              </svg>
              <span class="val">${this._formatPower(pvPower)}</span>
            </div>
          </div>

          <!-- 2. Node Grid (Left: 17%, 50%) -->
          <div class="node node-grid" id="node-grid">
            <div class="circle ${isGridSelling ? 'selling' : isGridBuying ? 'buying' : ''}">
              <svg class="node-icon" viewBox="0 0 24 24" style="color: ${isGridSelling ? 'var(--energy-grid-return-color)' : isGridBuying ? 'var(--energy-grid-consumption-color)' : 'inherit'};">
                <path d="M8.29,6.29L12,2.59L15.71,6.29L14.29,7.71L13,6.41V9.3L15.78,11H18V13H15.93L17.93,18H20V20H17.8L19.8,22H17.15L15.35,20H8.65L6.85,22H4.2L6.2,20H4V18H6.07L8.07,13H6V11H8.22L11,9.3V6.41L9.71,7.71L8.29,6.29M11,11.15L8.85,12.5H15.15L13,11.15V11H11V11.15M8.38,14.5L6.98,18H17.02L15.62,14.5H8.38Z"/>
              </svg>
              ${isGridSelling ? `
                <span class="return">
                  <svg class="small-arrow" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/></svg>
                  ${this._formatPower(gridSell)}
                </span>
              ` : ''}
              <span class="consumption">
                ${isGridBuying ? `
                  <svg class="small-arrow" viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/></svg>
                ` : ''}
                ${this._formatPower(gridBuy)}
              </span>
            </div>
            <span class="label">${isGridSelling ? 'Einspeisung' : 'Netz'}</span>
          </div>

          <!-- 3. Node Home (Right: 83%, 50%) -->
          <div class="node node-house" id="node-house">
            <div class="circle ${hasRing ? '' : 'border'}">
              <svg class="node-icon" viewBox="0 0 24 24" style="color: var(--primary-text-color);">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
              <span class="val">${this._formatPower(housePower)}</span>

              ${hasRing ? `
                <svg class="circle-ring" viewBox="0 0 80 80">
                  ${solarArc > 0 ? `
                    <circle
                      class="solar"
                      cx="40"
                      cy="40"
                      r="38"
                      stroke-dasharray="${solarArc.toFixed(2)} ${(CIRCLE_CIRCUMFERENCE - solarArc).toFixed(2)}"
                      stroke-dashoffset="-${(CIRCLE_CIRCUMFERENCE - solarArc).toFixed(2)}"
                      shape-rendering="geometricPrecision"
                    />
                  ` : ''}
                  ${battArc > 0 ? `
                    <circle
                      class="battery"
                      cx="40"
                      cy="40"
                      r="38"
                      stroke-dasharray="${battArc.toFixed(2)} ${(CIRCLE_CIRCUMFERENCE - battArc).toFixed(2)}"
                      stroke-dashoffset="-${(CIRCLE_CIRCUMFERENCE - battArc - (solarArc || 0)).toFixed(2)}"
                      shape-rendering="geometricPrecision"
                    />
                  ` : ''}
                  ${gridArc > 0 ? `
                    <circle
                      class="grid"
                      cx="40"
                      cy="40"
                      r="38"
                      stroke-dasharray="${gridArc.toFixed(2)} ${(CIRCLE_CIRCUMFERENCE - gridArc).toFixed(2)}"
                      stroke-dashoffset="0"
                      shape-rendering="geometricPrecision"
                    />
                  ` : ''}
                </svg>
              ` : ''}
            </div>
            <span class="label">Verbrauch</span>
          </div>

          <!-- 4. Node Battery (Bottom Center: 50%, 82%) -->
          <div class="node node-batt" id="node-batt">
            <div class="circle ${isBattCharging ? 'charging' : isBattDischarging ? 'discharging' : ''}">
              <div class="battery-soc" style="color: ${isBattCharging ? 'var(--energy-battery-in-color)' : isBattDischarging ? 'var(--energy-battery-out-color)' : 'inherit'};">
                <svg viewBox="0 0 24 24">
                  ${this._getBatteryIcon(soc, isBattCharging)}
                </svg>
                <span>${soc}%</span>
              </div>
              ${isBattCharging ? `
                <span class="battery-in">
                  <svg class="small-arrow" viewBox="0 0 24 24"><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"/></svg>
                  ${this._formatPower(battCharge)}
                </span>
              ` : ''}
              ${isBattDischarging ? `
                <span class="battery-out">
                  <svg class="small-arrow" viewBox="0 0 24 24"><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"/></svg>
                  ${this._formatPower(battDischarge)}
                </span>
              ` : ''}
              ${!isBattCharging && !isBattDischarging ? `
                <span class="battery-idle">0.00 kW</span>
              ` : ''}
            </div>
            <span class="label">Batterie</span>
          </div>
        </div>

        <!-- Optional: PV Strings Drawer -->
        ${this._config.show_strings ? `
          <div class="strings-drawer">
            <div class="strings-toggle" id="strings-toggle">
              <span>☀️ PV Strings (${hasPv3 ? '3' : '2'} Stränge)</span>
              <span>${this._showStrings ? '▲ Schließen' : '▼ Details'}</span>
            </div>
            ${this._showStrings ? `
              <div class="strings-grid">
                <div class="string-card">
                  <div class="string-name">String 1</div>
                  <div class="string-val">${this._formatPower(pv1P)}</div>
                  <div class="string-volt">${pv1V > 0 ? pv1V.toFixed(1) + ' V' : ''}</div>
                </div>
                <div class="string-card">
                  <div class="string-name">String 2</div>
                  <div class="string-val">${this._formatPower(pv2P)}</div>
                  <div class="string-volt">${pv2V > 0 ? pv2V.toFixed(1) + ' V' : ''}</div>
                </div>
                ${hasPv3 ? `
                  <div class="string-card">
                    <div class="string-name">String 3</div>
                    <div class="string-val">${this._formatPower(pv3P)}</div>
                    <div class="string-volt">${pv3V > 0 ? pv3V.toFixed(1) + ' V' : ''}</div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Optional: KPI Tagesstatistiken (Autarkie & Eigenverbrauch) -->
        ${this._config.show_stats ? `
          <div class="stats-grid">
            <!-- Autarkiegrad Ring -->
            <div class="stat-card" id="stat-autarky">
              <div class="gauge-ring">
                <svg class="gauge-svg" width="48" height="48" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--energy-grid-return-color, #10b981)" stroke-width="3.5" stroke-dasharray="${Math.min(100, Math.max(0, autarky))}, 100" stroke-linecap="round" />
                </svg>
                <div class="gauge-text" style="color: var(--energy-grid-return-color, #10b981);">${Math.round(autarky)}%</div>
              </div>
              <div class="stat-info">
                <span class="stat-label">Autarkie heute</span>
                <span class="stat-desc">${autarky >= 80 ? 'Sehr hoch 🌟' : autarky >= 50 ? 'Gut 🌿' : 'Netzbezug ⚡'}</span>
              </div>
            </div>

            <!-- Eigenverbrauchsrate Ring -->
            <div class="stat-card" id="stat-selfcons">
              <div class="gauge-ring">
                <svg class="gauge-svg" width="48" height="48" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--energy-battery-out-color, #4db6ac)" stroke-width="3.5" stroke-dasharray="${Math.min(100, Math.max(0, selfCons))}, 100" stroke-linecap="round" />
                </svg>
                <div class="gauge-text" style="color: var(--energy-battery-out-color, #4db6ac);">${Math.round(selfCons)}%</div>
              </div>
              <div class="stat-info">
                <span class="stat-label">Eigenverbrauch</span>
                <span class="stat-desc">${selfCons.toFixed(1)}% genutzt</span>
              </div>
            </div>
          </div>

          <!-- Daily Totals Chips -->
          <div class="daily-chips">
            <div class="chip" style="--chip-border: var(--energy-solar-color);">
              <div class="chip-lbl">Erzeugung</div>
              <div class="chip-val" style="color: var(--energy-solar-color);">${this._formatEnergy(dailyPv)}</div>
            </div>
            <div class="chip" style="--chip-border: var(--primary-color, #0284c7);">
              <div class="chip-lbl">Verbrauch</div>
              <div class="chip-val" style="color: var(--primary-color, #38bdf8);">${this._formatEnergy(dailyHouse)}</div>
            </div>
            <div class="chip" style="--chip-border: var(--energy-grid-return-color);">
              <div class="chip-lbl">Einspeisung</div>
              <div class="chip-val" style="color: var(--energy-grid-return-color);">${this._formatEnergy(dailyGridSell)}</div>
            </div>
            <div class="chip" style="--chip-border: var(--energy-grid-consumption-color);">
              <div class="chip-lbl">Netzbezug</div>
              <div class="chip-val" style="color: var(--energy-grid-consumption-color);">${this._formatEnergy(dailyGridBuy)}</div>
            </div>
          </div>
        ` : ''}

        <!-- Optional: Quick Controls Bar -->
        ${this._config.show_controls ? `
          <div class="controls-bar">
            <!-- Wintermodus -->
            <div class="btn-ctrl ${winterModeState ? 'active-blue' : ''}" id="btn-winter">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2V6L10 4L8.5 5.5L12 9L15.5 5.5L14 4L12 6V2M12 15L8.5 18.5L10 20L12 18V22H12L12 18L14 20L15.5 18.5L12 15M2 12H6L4 10L5.5 8.5L9 12L5.5 15.5L4 14L6 12H2M15 12L18.5 8.5L20 10L18 12H22V12H18L20 14L18.5 15.5L15 12Z"/>
              </svg>
              <span>Wintermodus ${winterModeState ? 'AN' : 'AUS'}</span>
            </div>

            <!-- Schnellladung -->
            <div class="btn-ctrl ${fastchargeState ? 'active-amber' : ''}" id="btn-fastcharge">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 15H6L13 1V9H18L11 23V15Z"/>
              </svg>
              <span>Schnellladung ${fastchargeState ? 'AN' : 'AUS'}</span>
            </div>
          </div>
        ` : ''}
      </ha-card>
    `;

    // Attach Event Listeners
    this.shadowRoot.getElementById("node-solar")?.addEventListener("click", () => this._fireMoreInfo("pv_total"));
    this.shadowRoot.getElementById("node-batt")?.addEventListener("click", () => this._fireMoreInfo("battery_soc"));
    this.shadowRoot.getElementById("node-grid")?.addEventListener("click", () => this._fireMoreInfo(isGridSelling ? "grid_sell" : "grid_buy"));
    this.shadowRoot.getElementById("node-house")?.addEventListener("click", () => this._fireMoreInfo("house_consumption"));
    this.shadowRoot.getElementById("stat-autarky")?.addEventListener("click", () => this._fireMoreInfo("autarky"));
    this.shadowRoot.getElementById("stat-selfcons")?.addEventListener("click", () => this._fireMoreInfo("self_consumption"));

    this.shadowRoot.getElementById("strings-toggle")?.addEventListener("click", () => {
      this._showStrings = !this._showStrings;
      this._render();
    });

    this.shadowRoot.getElementById("btn-winter")?.addEventListener("click", () => this._toggleSwitch("switch_winter_mode"));
    this.shadowRoot.getElementById("btn-fastcharge")?.addEventListener("click", () => this._toggleSwitch("switch_fastcharge"));
  }

  getCardSize() {
    return 6;
  }

  static getConfigElement() {
    return document.createElement("lg-ess-card-editor");
  }

  static getStubConfig() {
    return {
      title: "LG ESS Solar",
      power_unit: "kW",
      show_strings: true,
      show_stats: true,
      show_controls: true,
      animation: true,
    };
  }
}

// Config Editor Component
class LgEssCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  _valueChanged(ev) {
    if (!this._config) return;
    const target = ev.target;
    const field = target.configValue;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const newConfig = { ...this._config, [field]: value };
    const event = new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: newConfig },
    });
    this.dispatchEvent(event);
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 12px 0;
          font-family: inherit;
        }
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-row label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--secondary-text-color, #9ca3af);
        }
        .form-row input, .form-row select {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid var(--divider-color, rgba(255,255,255,0.15));
          background: var(--secondary-background-color, rgba(255,255,255,0.06));
          color: var(--primary-text-color, #fff);
          font-size: 0.9rem;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          cursor: pointer;
        }
      </style>
      <div class="editor-form">
        <div class="form-row">
          <label>Kartentitel</label>
          <input type="text" .value="${this._config.title || 'LG ESS Solar'}" .configValue="${'title'}" id="inp-title" />
        </div>
        <div class="form-row">
          <label>Leistungseinheit</label>
          <select .configValue="${'power_unit'}" id="inp-unit">
            <option value="kW" ${this._config.power_unit === 'kW' ? 'selected' : ''}>kW (Kilowatt)</option>
            <option value="W" ${this._config.power_unit === 'W' ? 'selected' : ''}>W (Watt)</option>
          </select>
        </div>
        <label class="checkbox-row">
          <input type="checkbox" ?checked="${this._config.show_strings !== false}" .configValue="${'show_strings'}" id="chk-strings" />
          <span>PV-Strings Detailschublade anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" ?checked="${this._config.show_stats !== false}" .configValue="${'show_stats'}" id="chk-stats" />
          <span>Tagesstatistiken (Autarkie & Eigenverbrauch) anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" ?checked="${this._config.show_controls !== false}" .configValue="${'show_controls'}" id="chk-controls" />
          <span>Schalterleiste (Wintermodus & Schnellladung) anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" ?checked="${this._config.animation !== false}" .configValue="${'animation'}" id="chk-anim" />
          <span>Animierte Energiefluss-Punkte anzeigen</span>
        </label>
      </div>
    `;

    this.shadowRoot.querySelectorAll("input, select").forEach((elem) => {
      elem.addEventListener("change", (ev) => this._valueChanged(ev));
    });
  }
}

customElements.define("lg-ess-card", LgEssCard);
customElements.define("lg-ess-card-editor", LgEssCardEditor);
