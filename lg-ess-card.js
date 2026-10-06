/**
 * LG ESS Solar Power Flow & Control Card for Home Assistant Lovelace
 * Official Home Assistant Energy Dashboard Style Flow Lines & Theme Integration
 * Author: buktahula
 * Repository: https://github.com/buktahula/lg-ess-card
 * License: MIT
 */

const CARD_VERSION = "1.2.0";
const CARD_LOGO = "data:image/png;base64,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";
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

class LgEssCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._initialized = false;
    this._showStrings = false;
    this._isGridSelling = false;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
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
    this._initialized = false;
    if (this._hass) {
      this._firstRender();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this._firstRender();
    } else {
      this._update();
    }
  }

  connectedCallback() {
    if (this._hass && !this._initialized) {
      this._firstRender();
    }
  }

  _getEntityState(key) {
    if (!this._hass) return null;
    // 1. Explicit user overrides in config
    if (this._config.entities && this._config.entities[key]) {
      const eid = this._config.entities[key];
      return this._hass.states[eid] || null;
    }
    if (this._config[key]) {
      const eid = this._config[key];
      return this._hass.states[eid] || null;
    }
    if (this._config[`${key}_entity`]) {
      const eid = this._config[`${key}_entity`];
      return this._hass.states[eid] || null;
    }
    // 2. Auto-discovery via candidates
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

  _firstRender() {
    if (!this._hass || !this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          /* Official Home Assistant Energy Dashboard Colors & Fallbacks */
          --solar-color: var(--energy-solar-color, #ff9800);
          --batt-in-color: var(--energy-battery-in-color, #f06292);
          --batt-out-color: var(--energy-battery-out-color, #4db6ac);
          --grid-buy-color: var(--energy-grid-consumption-color, #488fc2);
          --grid-sell-color: var(--energy-grid-return-color, #8353d1);
          --house-color: var(--energy-house-color, #38bdf8);

          /* UI Contrast & Theme Variables */
          --card-radius: var(--ha-card-border-radius, 16px);
          --node-surface: var(--card-background-color, #22222a);
          --surface-elevated: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
          --surface-border: var(--divider-color, rgba(255, 255, 255, 0.14));
          --flow-inactive: var(--energy-line-inactive-color, rgba(200, 205, 225, 0.28));
          --text-high: var(--primary-text-color, #f8fafc);
          --text-med: var(--secondary-text-color, #94a3b8);
          --text-muted: var(--disabled-text-color, #64748b);
        }

        ha-card {
          border-radius: var(--card-radius);
          box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0, 0, 0, 0.25));
          background: var(--ha-card-background, var(--card-background-color, #1a1a20));
          color: var(--text-high);
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
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          flex-shrink: 0;
        }

        .title-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text-high);
          margin: 0;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface-elevated);
          border: 1px solid var(--surface-border);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-med);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        /* Energy Flow Container (100% Symmetrical Coordinates) */
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

        /* Node Elements */
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

        /* 100% Solid Opaque Node Circles with Glow */
        .circle {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          box-sizing: border-box;
          border: 2.5px solid var(--surface-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          background-color: var(--node-surface, #22222a);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        /* 1. Solar Node */
        .node-solar .circle.solar-active {
          border-color: var(--solar-color);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(255, 152, 0, 0.12), rgba(255, 152, 0, 0.12));
          box-shadow: 0 0 14px rgba(255, 152, 0, 0.4);
        }

        .node-solar .circle.solar-idle {
          border-color: rgba(255, 152, 0, 0.35);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(255, 152, 0, 0.05), rgba(255, 152, 0, 0.05));
        }

        /* 2. Grid Node */
        .node-grid .circle.selling {
          border-color: var(--grid-sell-color);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(131, 83, 209, 0.12), rgba(131, 83, 209, 0.12));
          box-shadow: 0 0 14px rgba(131, 83, 209, 0.4);
        }

        .node-grid .circle.buying {
          border-color: var(--grid-buy-color);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(72, 143, 194, 0.12), rgba(72, 143, 194, 0.12));
          box-shadow: 0 0 14px rgba(72, 143, 194, 0.4);
        }

        .node-grid .circle.grid-idle {
          border-color: rgba(72, 143, 194, 0.35);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(72, 143, 194, 0.05), rgba(72, 143, 194, 0.05));
        }

        /* 3. House Node - 100% Symmetrical 76px Size, Border & Glow */
        .node-house .circle.house-active,
        .node-house .circle {
          border-color: var(--house-color, #38bdf8);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(56, 189, 248, 0.12), rgba(56, 189, 248, 0.12));
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        .node-house .circle.house-idle {
          border-color: rgba(56, 189, 248, 0.35);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(56, 189, 248, 0.05), rgba(56, 189, 248, 0.05));
          box-shadow: none;
        }

        /* 4. Battery Node */
        .node-batt .circle.charging {
          border-color: var(--batt-in-color);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(240, 98, 146, 0.12), rgba(240, 98, 146, 0.12));
          box-shadow: 0 0 14px rgba(240, 98, 146, 0.4);
        }

        .node-batt .circle.discharging {
          border-color: var(--batt-out-color);
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(77, 182, 172, 0.12), rgba(77, 182, 172, 0.12));
          box-shadow: 0 0 14px rgba(77, 182, 172, 0.4);
        }

        .node-batt .circle.batt-idle {
          border-color: #10b981;
          background-color: var(--node-surface, #22222a);
          background-image: linear-gradient(rgba(16, 185, 129, 0.10), rgba(16, 185, 129, 0.10));
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
        }

        .node-icon {
          width: 22px;
          height: 22px;
          fill: currentColor;
          margin-bottom: 2px;
        }

        .val {
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
          color: var(--text-high);
        }

        .label {
          color: var(--text-med);
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
          color: var(--solar-color);
        }

        .node-grid .label {
          color: var(--text-med);
        }

        .node-house .label {
          color: var(--house-color, #38bdf8);
        }

        .node-batt .label {
          color: #10b981;
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

        .battery-in {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--batt-in-color);
        }

        .battery-out {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--batt-out-color);
        }

        .battery-idle {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .return {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--grid-sell-color);
        }

        .consumption {
          display: inline-flex;
          align-items: center;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--grid-buy-color);
        }

        .grid-idle {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .small-arrow {
          width: 12px;
          height: 12px;
          fill: currentColor;
          margin-right: 2px;
        }

        /* SVG Flow Lines (Tucked right at circle borders, zero gap, zero inside) */
        path.flow-line {
          fill: none;
          stroke: var(--flow-inactive);
          stroke-width: 1.8;
          vector-effect: non-scaling-stroke;
          stroke-linecap: round;
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
        }

        path.flow-line.active {
          stroke-width: 2.5;
        }

        path.flow-line.active.solar {
          stroke: var(--solar-color);
        }

        path.flow-line.active.return {
          stroke: var(--grid-sell-color);
        }

        path.flow-line.active.battery-solar {
          stroke: var(--batt-in-color);
        }

        path.flow-line.active.battery-house {
          stroke: var(--batt-out-color);
        }

        path.flow-line.active.grid {
          stroke: var(--grid-buy-color);
        }

        path.flow-line.active.battery-to-grid {
          stroke: var(--grid-sell-color);
        }

        path.flow-line.active.battery-from-grid {
          stroke: var(--grid-buy-color);
        }

        /* Moving Particle Dots */
        circle.flow-dot {
          vector-effect: non-scaling-stroke;
          stroke: none;
        }

        circle.flow-dot.solar {
          fill: var(--solar-color);
        }

        circle.flow-dot.return {
          fill: var(--grid-sell-color);
        }

        circle.flow-dot.battery-solar {
          fill: var(--batt-in-color);
        }

        circle.flow-dot.battery-house {
          fill: var(--batt-out-color);
        }

        circle.flow-dot.grid {
          fill: var(--grid-buy-color);
        }

        circle.flow-dot.battery-to-grid {
          fill: var(--grid-sell-color);
        }

        circle.flow-dot.battery-from-grid {
          fill: var(--grid-buy-color);
        }

        /* Collapsible Strings Drawer */
        .strings-drawer {
          background: var(--surface-elevated);
          border-radius: 12px;
          padding: 10px 14px;
          margin-top: 14px;
          border: 1px solid var(--surface-border);
        }

        .strings-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          color: var(--text-med);
        }

        .strings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .string-card {
          background: var(--surface-elevated);
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid var(--surface-border);
          border-left: 3.5px solid var(--solar-color);
        }

        .string-name {
          font-size: 0.7rem;
          color: var(--text-med);
          font-weight: 600;
        }

        .string-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-high);
          margin-top: 2px;
        }

        .string-volt {
          font-size: 0.68rem;
          color: var(--text-med);
        }

        /* KPI Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .stat-card {
          background: var(--surface-elevated);
          border: 1px solid var(--surface-border);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.1);
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
          font-size: 0.75rem;
          font-weight: 800;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-med);
        }

        .stat-desc {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-high);
          margin-top: 2px;
        }

        .daily-chips {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .chip {
          background: var(--surface-elevated);
          border: 1px solid var(--surface-border);
          border-radius: 8px;
          padding: 6px 8px;
          text-align: center;
          border-top: 2.5px solid var(--chip-border, var(--surface-border));
        }

        .chip-lbl {
          font-size: 0.65rem;
          color: var(--text-med);
          font-weight: 600;
        }

        .chip-val {
          font-size: 0.78rem;
          font-weight: 700;
          margin-top: 2px;
        }

        /* Controls Bar */
        .controls-bar {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-ctrl {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--surface-elevated);
          border: 1px solid var(--surface-border);
          color: var(--text-high);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .btn-ctrl:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .btn-ctrl.active-blue {
          background: rgba(56, 189, 248, 0.18);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .btn-ctrl.active-amber {
          background: rgba(245, 158, 11, 0.18);
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
              <img src="${CARD_LOGO}" alt="LG ESS Logo" width="32" height="32" />
            </div>
            <h2 class="card-title" id="card-title">${this._config.title}</h2>
          </div>
          <div class="status-pill">
            <span class="status-dot" id="status-dot"></span>
            <span id="status-opmode">Normal • 50.0 Hz</span>
          </div>
        </div>

        <!-- Official Home Assistant Energy Distribution Visualizer (100% Symmetrical) -->
        <div class="flow-container">
          <svg class="flow-svg" viewBox="0 0 465 300">
            <!-- Inactive Connecting Lines (Terminating right at circle borders) -->
            <path class="flow-line" d="M 115,150 L 350,150" />
            <path class="flow-line" d="M 220,211 C 220,174 150,160 116,160" />
            <path class="flow-line" d="M 245,211 C 245,174 315,160 349,160" />
            <path class="flow-line" d="M 220,89 C 220,126 150,140 116,140" />
            <path class="flow-line" d="M 245,89 C 245,126 315,140 349,140" />
            <path class="flow-line" d="M 232.5,90 L 232.5,210" />

            <!-- Active Flow Paths -->
            <!-- Solar to Battery (Vertical: down) -->
            <path id="path-solar-batt" class="flow-line battery-solar"
                  d="M 232.5,90 L 232.5,210" />

            <!-- Solar to Grid (Curved: Solar to Grid) -->
            <path id="path-solar-grid" class="flow-line return"
                  d="M 220,89 C 220,126 150,140 116,140" />

            <!-- Solar to Home (Curved: Solar to Home) -->
            <path id="path-solar-home" class="flow-line solar"
                  d="M 245,89 C 245,126 315,140 349,140" />

            <!-- Battery to Home (Curved: Battery to Home) -->
            <path id="path-batt-home" class="flow-line battery-house"
                  d="M 245,211 C 245,174 315,160 349,160" />

            <!-- Battery to Grid / Grid to Battery -->
            <path id="path-batt-grid" class="flow-line battery-to-grid"
                  d="M 220,211 C 220,174 150,160 116,160" />

            <!-- Grid to Home (Horizontal) -->
            <path id="path-grid-home" class="flow-line grid"
                  d="M 115,150 L 350,150" />

            <!-- Animated Motion Dots (SMIL Persistent in DOM - Never resets on state update!) -->
            <circle id="dot-solar-grid" r="4.5" class="flow-dot return" style="display: none;">
              <animateMotion id="anim-solar-grid" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-solar-grid" xlink:href="#path-solar-grid"/>
              </animateMotion>
            </circle>

            <circle id="dot-solar-home" r="4.5" class="flow-dot solar" style="display: none;">
              <animateMotion id="anim-solar-home" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-solar-home" xlink:href="#path-solar-home"/>
              </animateMotion>
            </circle>

            <circle id="dot-solar-batt" r="4.5" class="flow-dot battery-solar" style="display: none;">
              <animateMotion id="anim-solar-batt" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-solar-batt" xlink:href="#path-solar-batt"/>
              </animateMotion>
            </circle>

            <circle id="dot-batt-home" r="4.5" class="flow-dot battery-house" style="display: none;">
              <animateMotion id="anim-batt-home" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-batt-home" xlink:href="#path-batt-home"/>
              </animateMotion>
            </circle>

            <circle id="dot-batt-grid-in" r="4.5" class="flow-dot battery-from-grid" style="display: none;">
              <animateMotion id="anim-batt-grid-in" dur="3s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#path-batt-grid" xlink:href="#path-batt-grid"/>
              </animateMotion>
            </circle>

            <circle id="dot-batt-grid-out" r="4.5" class="flow-dot battery-to-grid" style="display: none;">
              <animateMotion id="anim-batt-grid-out" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-batt-grid" xlink:href="#path-batt-grid"/>
              </animateMotion>
            </circle>

            <circle id="dot-grid-home" r="4.5" class="flow-dot grid" style="display: none;">
              <animateMotion id="anim-grid-home" dur="3s" repeatCount="indefinite" calcMode="linear">
                <mpath href="#path-grid-home" xlink:href="#path-grid-home"/>
              </animateMotion>
            </circle>
          </svg>

          <!-- 1. Node Solar (Top Center: 50%, 18%) -->
          <div class="node node-solar" id="node-solar">
            <span class="label" id="lbl-solar">Solar</span>
            <div class="circle" id="circle-solar">
              <svg class="node-icon" viewBox="0 0 24 24" style="color: var(--solar-color);">
                <path d="M12 2L14.39 5.42C13.65 5.15 12.84 5 12 5C11.16 5 10.35 5.15 9.61 5.42L12 2M12 7A5 5 0 0 1 17 12A5 5 0 0 1 12 17A5 5 0 0 1 7 12A5 5 0 0 1 12 7M12 9A3 3 0 0 0 9 12A3 3 0 0 0 12 15A3 3 0 0 0 15 12A3 3 0 0 0 12 9Z" />
              </svg>
              <span class="val" id="val-solar">0.00 kW</span>
            </div>
          </div>

          <!-- 2. Node Grid (Left: 17%, 50%) -->
          <div class="node node-grid" id="node-grid">
            <div class="circle" id="circle-grid">
              <svg class="node-icon" id="icon-grid" viewBox="0 0 24 24" style="color: var(--text-med);">
                <path d="M8.29,6.29L12,2.59L15.71,6.29L14.29,7.71L13,6.41V9.3L15.78,11H18V13H15.93L17.93,18H20V20H17.8L19.8,22H17.15L15.35,20H8.65L6.85,22H4.2L6.2,20H4V18H6.07L8.07,13H6V11H8.22L11,9.3V6.41L9.71,7.71L8.29,6.29M11,11.15L8.85,12.5H15.15L13,11.15V11H11V11.15M8.38,14.5L6.98,18H17.02L15.62,14.5H8.38Z"/>
              </svg>
              <span id="val-grid"><span class="grid-idle">0.00 kW</span></span>
            </div>
            <span class="label" id="lbl-grid">Netz</span>
          </div>

          <!-- 3. Node Home (Right: 83%, 50%) -->
          <div class="node node-house" id="node-house">
            <div class="circle" id="circle-house">
              <svg class="node-icon" viewBox="0 0 24 24" style="color: var(--house-color, #38bdf8);">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
              </svg>
              <span class="val" id="val-house">0.00 kW</span>
            </div>
            <span class="label" id="lbl-house">Verbrauch</span>
          </div>

          <!-- 4. Node Battery (Bottom Center: 50%, 82%) -->
          <div class="node node-batt" id="node-batt">
            <div class="circle" id="circle-batt">
              <div class="battery-soc" id="soc-group-batt" style="color: #10b981;">
                <svg id="soc-icon-batt" viewBox="0 0 24 24">
                  <path d="M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.4 22 18 21.4 18 20.67V5.33C18 4.6 17.4 4 16.67 4Z"/>
                </svg>
                <span id="soc-batt">0%</span>
              </div>
              <span id="val-batt"><span class="battery-idle" style="color: #10b981;">0.00 kW</span></span>
            </div>
            <span class="label" id="lbl-batt">Batterie</span>
          </div>
        </div>

        <!-- Optional: PV Strings Drawer -->
        ${this._config.show_strings !== false ? `
          <div class="strings-drawer" id="strings-drawer">
            <div class="strings-toggle" id="strings-toggle">
              <span>☀️ PV Strings (<span id="strings-count">2</span> Stränge)</span>
              <span id="strings-arrow">${this._showStrings ? '▲ Schließen' : '▼ Details'}</span>
            </div>
            <div class="strings-grid" id="strings-grid" style="display: ${this._showStrings ? 'grid' : 'none'};">
              <div class="string-card">
                <div class="string-name">String 1</div>
                <div class="string-val" id="str1-p">0.00 kW</div>
                <div class="string-volt" id="str1-v"></div>
              </div>
              <div class="string-card">
                <div class="string-name">String 2</div>
                <div class="string-val" id="str2-p">0.00 kW</div>
                <div class="string-volt" id="str2-v"></div>
              </div>
              <div class="string-card" id="str3-card" style="display: none;">
                <div class="string-name">String 3</div>
                <div class="string-val" id="str3-p">0.00 kW</div>
                <div class="string-volt" id="str3-v"></div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Optional: KPI Tagesstatistiken -->
        ${this._config.show_stats !== false ? `
          <div class="stats-grid">
            <div class="stat-card" id="stat-autarky">
              <div class="gauge-ring">
                <svg class="gauge-svg" width="48" height="48" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="3.5" />
                  <path id="autarky-path" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" />
                </svg>
                <div class="gauge-text" id="autarky-text" style="color: #10b981;">0%</div>
              </div>
              <div class="stat-info">
                <span class="stat-label">Autarkie heute</span>
                <span class="stat-desc" id="autarky-desc">Netzbezug ⚡</span>
              </div>
            </div>

            <div class="stat-card" id="stat-selfcons">
              <div class="gauge-ring">
                <svg class="gauge-svg" width="48" height="48" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="3.5" />
                  <path id="selfcons-path" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--batt-out-color)" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" />
                </svg>
                <div class="gauge-text" id="selfcons-text" style="color: var(--batt-out-color);">0%</div>
              </div>
              <div class="stat-info">
                <span class="stat-label">Eigenverbrauch</span>
                <span class="stat-desc" id="selfcons-desc">0.0% genutzt</span>
              </div>
            </div>
          </div>

          <div class="daily-chips">
            <div class="chip" style="--chip-border: var(--solar-color);">
              <div class="chip-lbl">Erzeugung</div>
              <div class="chip-val" id="chip-pv" style="color: var(--solar-color);">0.0 kWh</div>
            </div>
            <div class="chip" style="--chip-border: var(--house-color, #38bdf8);">
              <div class="chip-lbl">Verbrauch</div>
              <div class="chip-val" id="chip-house" style="color: var(--house-color, #38bdf8);">0.0 kWh</div>
            </div>
            <div class="chip" style="--chip-border: var(--grid-sell-color);">
              <div class="chip-lbl">Einspeisung</div>
              <div class="chip-val" id="chip-sell" style="color: var(--grid-sell-color);">0.0 kWh</div>
            </div>
            <div class="chip" style="--chip-border: var(--grid-buy-color);">
              <div class="chip-lbl">Netzbezug</div>
              <div class="chip-val" id="chip-buy" style="color: var(--grid-buy-color);">0.0 kWh</div>
            </div>
          </div>
        ` : ''}

        <!-- Optional: Quick Controls Bar -->
        ${this._config.show_controls !== false ? `
          <div class="controls-bar">
            <div class="btn-ctrl" id="btn-winter">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2V6L10 4L8.5 5.5L12 9L15.5 5.5L14 4L12 6V2M12 15L8.5 18.5L10 20L12 18V22H12L12 18L14 20L15.5 18.5L12 15M2 12H6L4 10L5.5 8.5L9 12L5.5 15.5L4 14L6 12H2M15 12L18.5 8.5L20 10L18 12H22V12H18L20 14L18.5 15.5L15 12Z"/>
              </svg>
              <span id="btn-winter-text">Wintermodus AUS</span>
            </div>

            <div class="btn-ctrl" id="btn-fastcharge">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 15H6L13 1V9H18L11 23V15Z"/>
              </svg>
              <span id="btn-fastcharge-text">Schnellladung AUS</span>
            </div>
          </div>
        ` : ''}
      </ha-card>
    `;

    // Attach Event Listeners ONCE
    this.shadowRoot.getElementById("node-solar")?.addEventListener("click", () => this._fireMoreInfo("pv_total"));
    this.shadowRoot.getElementById("node-batt")?.addEventListener("click", () => this._fireMoreInfo("battery_soc"));
    this.shadowRoot.getElementById("node-grid")?.addEventListener("click", () => this._fireMoreInfo(this._isGridSelling ? "grid_sell" : "grid_buy"));
    this.shadowRoot.getElementById("node-house")?.addEventListener("click", () => this._fireMoreInfo("house_consumption"));
    this.shadowRoot.getElementById("stat-autarky")?.addEventListener("click", () => this._fireMoreInfo("autarky"));
    this.shadowRoot.getElementById("stat-selfcons")?.addEventListener("click", () => this._fireMoreInfo("self_consumption"));

    this.shadowRoot.getElementById("strings-toggle")?.addEventListener("click", () => {
      this._showStrings = !this._showStrings;
      const grid = this.shadowRoot.getElementById("strings-grid");
      const arrow = this.shadowRoot.getElementById("strings-arrow");
      if (grid) grid.style.display = this._showStrings ? "grid" : "none";
      if (arrow) arrow.textContent = this._showStrings ? "▲ Schließen" : "▼ Details";
    });

    this.shadowRoot.getElementById("btn-winter")?.addEventListener("click", () => this._toggleSwitch("switch_winter_mode"));
    this.shadowRoot.getElementById("btn-fastcharge")?.addEventListener("click", () => this._toggleSwitch("switch_fastcharge"));

    this._initialized = true;
    this._update();
  }

  _update() {
    if (!this._hass || !this.shadowRoot || !this._initialized) return;

    // Title
    const titleEl = this.shadowRoot.getElementById("card-title");
    if (titleEl && this._config.title) titleEl.textContent = this._config.title;

    // Live Power Values (in kW)
    const pvPower = this._getNumericValue("pv_total");
    const gridBuy = this._getNumericValue("grid_buy");
    const gridSell = this._getNumericValue("grid_sell");
    const battCharge = this._getNumericValue("battery_charge");
    const battDischarge = this._getNumericValue("battery_discharge");
    const housePower = this._getNumericValue("house_consumption");

    // Battery & Status
    const soc = Math.round(this._getNumericValue("battery_soc", 0));
    const opMode = this._getEntityState("operation_mode")?.state || "Normal";
    const gridFreq = this._getNumericValue("grid_frequency", 50.0);

    // Daily KPIs
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
    this._isGridSelling = isGridSelling;
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

    // Animation Duration Calculation based on flow volume
    const maxPower = Math.max(pvPower, housePower, gridBuy, gridSell, battCharge, battDischarge, 1.0);
    const getDuration = (flowKw) => {
      const norm = Math.min(1.0, Math.max(0.0, flowKw / (maxPower * 0.9)));
      return (6.0 - norm * 4.6).toFixed(2);
    };

    const allowAnim = this._config.animation !== false;

    // 1. Header Updates
    const dotEl = this.shadowRoot.getElementById("status-dot");
    if (dotEl) {
      dotEl.style.background = activeState ? "#10b981" : "#ef4444";
      dotEl.style.boxShadow = `0 0 8px ${activeState ? "#10b981" : "#ef4444"}`;
    }
    const opModeEl = this.shadowRoot.getElementById("status-opmode");
    if (opModeEl) opModeEl.textContent = `${opMode} • ${gridFreq.toFixed(1)} Hz`;

    // 2. SVG Flow Lines Active Classes
    const setPathActive = (id, activeClass, isActive) => {
      const el = this.shadowRoot.getElementById(id);
      if (el) {
        el.setAttribute("class", `flow-line ${activeClass} ${isActive ? 'active' : ''}`);
      }
    };
    setPathActive("path-solar-batt", "battery-solar", hasSolarToBattery);
    setPathActive("path-solar-grid", "return", hasSolarToGrid);
    setPathActive("path-solar-home", "solar", hasSolarToHome);
    setPathActive("path-batt-home", "battery-house", hasBatteryToHome);
    setPathActive("path-batt-grid", hasBatteryToGrid ? "battery-to-grid" : "battery-from-grid", hasBatteryToGrid || hasBatteryFromGrid);
    setPathActive("path-grid-home", "grid", hasGridToHome);

    // 3. Persistent SVG Motion Dots (Only update dur & visibility, NEVER restart DOM animation)
    const updateDot = (dotId, animId, isActive, flowKw) => {
      const dot = this.shadowRoot.getElementById(dotId);
      const anim = this.shadowRoot.getElementById(animId);
      if (!dot || !anim) return;
      if (allowAnim && isActive) {
        dot.style.display = "";
        const durStr = `${getDuration(flowKw)}s`;
        if (anim.getAttribute("dur") !== durStr) {
          anim.setAttribute("dur", durStr);
        }
      } else {
        dot.style.display = "none";
      }
    };
    updateDot("dot-solar-grid", "anim-solar-grid", hasSolarToGrid, solarToGrid);
    updateDot("dot-solar-home", "anim-solar-home", hasSolarToHome, solarToHome);
    updateDot("dot-solar-batt", "anim-solar-batt", hasSolarToBattery, solarToBattery);
    updateDot("dot-batt-home", "anim-batt-home", hasBatteryToHome, batteryToHome);
    updateDot("dot-batt-grid-in", "anim-batt-grid-in", hasBatteryFromGrid, gridToBattery);
    updateDot("dot-batt-grid-out", "anim-batt-grid-out", hasBatteryToGrid, batteryToGrid);
    updateDot("dot-grid-home", "anim-grid-home", hasGridToHome, gridToHome);

    // 4. Node Solar Updates
    const cSolar = this.shadowRoot.getElementById("circle-solar");
    if (cSolar) cSolar.className = `circle ${isSolarActive ? 'solar-active' : 'solar-idle'}`;
    const valSolar = this.shadowRoot.getElementById("val-solar");
    if (valSolar) valSolar.textContent = this._formatPower(pvPower);

    // 5. Node Grid Updates
    const cGrid = this.shadowRoot.getElementById("circle-grid");
    if (cGrid) cGrid.className = `circle ${isGridSelling ? 'selling' : isGridBuying ? 'buying' : 'grid-idle'}`;
    const iconGrid = this.shadowRoot.getElementById("icon-grid");
    if (iconGrid) iconGrid.style.color = isGridSelling ? 'var(--grid-sell-color)' : isGridBuying ? 'var(--grid-buy-color)' : 'var(--text-med)';
    const lblGrid = this.shadowRoot.getElementById("lbl-grid");
    if (lblGrid) {
      lblGrid.textContent = isGridSelling ? 'Einspeisung' : 'Netz';
      lblGrid.style.color = isGridSelling ? 'var(--grid-sell-color)' : isGridBuying ? 'var(--grid-buy-color)' : 'var(--text-med)';
    }
    const valGrid = this.shadowRoot.getElementById("val-grid");
    if (valGrid) {
      if (isGridSelling) {
        valGrid.innerHTML = `<span class="return"><svg class="small-arrow" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/></svg>${this._formatPower(gridSell)}</span>`;
      } else if (isGridBuying) {
        valGrid.innerHTML = `<span class="consumption"><svg class="small-arrow" viewBox="0 0 24 24"><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/></svg>${this._formatPower(gridBuy)}</span>`;
      } else {
        valGrid.innerHTML = `<span class="grid-idle">${this._formatPower(0)}</span>`;
      }
    }

    // 6. Node House Updates
    const isHouseActive = housePower > 0.02;
    const cHouse = this.shadowRoot.getElementById("circle-house");
    if (cHouse) cHouse.className = `circle ${isHouseActive ? 'house-active' : 'house-idle'}`;
    const valHouse = this.shadowRoot.getElementById("val-house");
    if (valHouse) valHouse.textContent = this._formatPower(housePower);

    // 7. Node Battery Updates
    const cBatt = this.shadowRoot.getElementById("circle-batt");
    if (cBatt) cBatt.className = `circle ${isBattCharging ? 'charging' : isBattDischarging ? 'discharging' : 'batt-idle'}`;
    const socGroup = this.shadowRoot.getElementById("soc-group-batt");
    if (socGroup) socGroup.style.color = isBattCharging ? 'var(--batt-in-color)' : isBattDischarging ? 'var(--batt-out-color)' : '#10b981';
    const socIcon = this.shadowRoot.getElementById("soc-icon-batt");
    if (socIcon) socIcon.innerHTML = this._getBatteryIcon(soc, isBattCharging);
    const socText = this.shadowRoot.getElementById("soc-batt");
    if (socText) socText.textContent = `${soc}%`;
    const lblBatt = this.shadowRoot.getElementById("lbl-batt");
    if (lblBatt) lblBatt.style.color = isBattCharging ? 'var(--batt-in-color)' : isBattDischarging ? 'var(--batt-out-color)' : '#10b981';
    const valBatt = this.shadowRoot.getElementById("val-batt");
    if (valBatt) {
      if (isBattCharging) {
        valBatt.innerHTML = `<span class="battery-in"><svg class="small-arrow" viewBox="0 0 24 24"><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"/></svg>${this._formatPower(battCharge)}</span>`;
      } else if (isBattDischarging) {
        valBatt.innerHTML = `<span class="battery-out"><svg class="small-arrow" viewBox="0 0 24 24"><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"/></svg>${this._formatPower(battDischarge)}</span>`;
      } else {
        valBatt.innerHTML = `<span class="battery-idle" style="color: #10b981;">${this._formatPower(0)}</span>`;
      }
    }

    // 8. PV Strings Updates
    if (this._config.show_strings !== false) {
      const pv1P = this._getNumericValue("pv1");
      const pv1V = this._getNumericValue("pv1_voltage");
      const pv2P = this._getNumericValue("pv2");
      const pv2V = this._getNumericValue("pv2_voltage");
      const pv3P = this._getNumericValue("pv3");
      const pv3V = this._getNumericValue("pv3_voltage");
      const hasPv3 = pv3P > 0 || pv3V > 0 || this._getEntityState("pv3") !== null;

      const strCount = this.shadowRoot.getElementById("strings-count");
      if (strCount) strCount.textContent = hasPv3 ? "3" : "2";

      const str1P = this.shadowRoot.getElementById("str1-p");
      if (str1P) str1P.textContent = this._formatPower(pv1P);
      const str1V = this.shadowRoot.getElementById("str1-v");
      if (str1V) str1V.textContent = pv1V > 0 ? `${pv1V.toFixed(1)} V` : "";

      const str2P = this.shadowRoot.getElementById("str2-p");
      if (str2P) str2P.textContent = this._formatPower(pv2P);
      const str2V = this.shadowRoot.getElementById("str2-v");
      if (str2V) str2V.textContent = pv2V > 0 ? `${pv2V.toFixed(1)} V` : "";

      const str3Card = this.shadowRoot.getElementById("str3-card");
      if (str3Card) {
        str3Card.style.display = hasPv3 ? "" : "none";
        const str3P = this.shadowRoot.getElementById("str3-p");
        if (str3P) str3P.textContent = this._formatPower(pv3P);
        const str3V = this.shadowRoot.getElementById("str3-v");
        if (str3V) str3V.textContent = pv3V > 0 ? `${pv3V.toFixed(1)} V` : "";
      }
    }

    // 9. KPI Stats Updates
    if (this._config.show_stats !== false) {
      const autarkyPath = this.shadowRoot.getElementById("autarky-path");
      if (autarkyPath) autarkyPath.setAttribute("stroke-dasharray", `${Math.min(100, Math.max(0, autarky))}, 100`);
      const autarkyText = this.shadowRoot.getElementById("autarky-text");
      if (autarkyText) autarkyText.textContent = `${Math.round(autarky)}%`;
      const autarkyDesc = this.shadowRoot.getElementById("autarky-desc");
      if (autarkyDesc) autarkyDesc.textContent = autarky >= 80 ? 'Sehr hoch 🌟' : autarky >= 50 ? 'Gut 🌿' : 'Netzbezug ⚡';

      const selfconsPath = this.shadowRoot.getElementById("selfcons-path");
      if (selfconsPath) selfconsPath.setAttribute("stroke-dasharray", `${Math.min(100, Math.max(0, selfCons))}, 100`);
      const selfconsText = this.shadowRoot.getElementById("selfcons-text");
      if (selfconsText) selfconsText.textContent = `${Math.round(selfCons)}%`;
      const selfconsDesc = this.shadowRoot.getElementById("selfcons-desc");
      if (selfconsDesc) selfconsDesc.textContent = `${selfCons.toFixed(1)}% genutzt`;

      const chipPv = this.shadowRoot.getElementById("chip-pv");
      if (chipPv) chipPv.textContent = this._formatEnergy(dailyPv);
      const chipHouse = this.shadowRoot.getElementById("chip-house");
      if (chipHouse) chipHouse.textContent = this._formatEnergy(dailyHouse);
      const chipSell = this.shadowRoot.getElementById("chip-sell");
      if (chipSell) chipSell.textContent = this._formatEnergy(dailyGridSell);
      const chipBuy = this.shadowRoot.getElementById("chip-buy");
      if (chipBuy) chipBuy.textContent = this._formatEnergy(dailyGridBuy);
    }

    // 10. Controls Updates
    if (this._config.show_controls !== false) {
      const btnWinter = this.shadowRoot.getElementById("btn-winter");
      if (btnWinter) btnWinter.className = `btn-ctrl ${winterModeState ? 'active-blue' : ''}`;
      const btnWinterText = this.shadowRoot.getElementById("btn-winter-text");
      if (btnWinterText) btnWinterText.textContent = `Wintermodus ${winterModeState ? 'AN' : 'AUS'}`;

      const btnFast = this.shadowRoot.getElementById("btn-fastcharge");
      if (btnFast) btnFast.className = `btn-ctrl ${fastchargeState ? 'active-amber' : ''}`;
      const btnFastText = this.shadowRoot.getElementById("btn-fastcharge-text");
      if (btnFastText) btnFastText.textContent = `Schnellladung ${fastchargeState ? 'AN' : 'AUS'}`;
    }
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
    this._rendered = false;
  }

  setConfig(config) {
    this._config = config || {};
    if (!this._rendered) {
      this._render();
    } else {
      this._updateInputs();
    }
  }

  set hass(hass) {
    this._hass = hass;
  }

  _valueChanged(ev) {
    if (!this._config) return;
    const target = ev.target;
    const field = target.dataset.config;
    if (!field) return;

    const value = target.type === "checkbox" ? target.checked : target.value;
    if (this._config[field] === value) return;

    const newConfig = {
      ...this._config,
      [field]: value,
    };
    this._config = newConfig;

    const event = new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: newConfig },
    });
    this.dispatchEvent(event);
  }

  _updateInputs() {
    const root = this.shadowRoot;
    if (!root) return;
    const inpTitle = root.getElementById("inp-title");
    if (inpTitle && document.activeElement !== inpTitle) {
      inpTitle.value = this._config.title ?? "LG ESS Solar";
    }
    const inpUnit = root.getElementById("inp-unit");
    if (inpUnit) {
      inpUnit.value = this._config.power_unit || "kW";
    }
    const chkStrings = root.getElementById("chk-strings");
    if (chkStrings) {
      chkStrings.checked = this._config.show_strings !== false;
    }
    const chkStats = root.getElementById("chk-stats");
    if (chkStats) {
      chkStats.checked = this._config.show_stats !== false;
    }
    const chkControls = root.getElementById("chk-controls");
    if (chkControls) {
      chkControls.checked = this._config.show_controls !== false;
    }
    const chkAnim = root.getElementById("chk-anim");
    if (chkAnim) {
      chkAnim.checked = this._config.animation !== false;
    }
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
          user-select: none;
        }
        .checkbox-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      </style>
      <div class="editor-form">
        <div class="form-row">
          <label for="inp-title">Kartentitel</label>
          <input type="text" id="inp-title" data-config="title" value="${this._config.title || 'LG ESS Solar'}" />
        </div>
        <div class="form-row">
          <label for="inp-unit">Leistungseinheit</label>
          <select id="inp-unit" data-config="power_unit">
            <option value="kW" ${this._config.power_unit === 'kW' ? 'selected' : ''}>kW (Kilowatt)</option>
            <option value="W" ${this._config.power_unit === 'W' ? 'selected' : ''}>W (Watt)</option>
          </select>
        </div>
        <label class="checkbox-row">
          <input type="checkbox" id="chk-strings" data-config="show_strings" ${this._config.show_strings !== false ? 'checked' : ''} />
          <span>PV-Strings Detailschublade anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" id="chk-stats" data-config="show_stats" ${this._config.show_stats !== false ? 'checked' : ''} />
          <span>Tagesstatistiken (Autarkie & Eigenverbrauch) anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" id="chk-controls" data-config="show_controls" ${this._config.show_controls !== false ? 'checked' : ''} />
          <span>Schalterleiste (Wintermodus & Schnellladung) anzeigen</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" id="chk-anim" data-config="animation" ${this._config.animation !== false ? 'checked' : ''} />
          <span>Animierte Energiefluss-Punkte anzeigen</span>
        </label>
      </div>
    `;

    this.shadowRoot.querySelectorAll("input, select").forEach((elem) => {
      elem.addEventListener("change", (ev) => this._valueChanged(ev));
      if (elem.type === "text") {
        elem.addEventListener("input", (ev) => this._valueChanged(ev));
      }
    });

    this._rendered = true;
  }
}

customElements.define("lg-ess-card", LgEssCard);
customElements.define("lg-ess-card-editor", LgEssCardEditor);
