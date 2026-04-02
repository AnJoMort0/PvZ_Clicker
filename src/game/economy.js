import { MIN_PASSIVE_INTERVAL_MS, SKY_SUN_VALUE } from '../config/gameData.js';

export function scaleCost(cost, factor = 1) {
  return Math.ceil(cost * factor);
}

export function canAfford(state, cost) {
  return state.sun >= cost;
}

export function gainSun(state, amount) {
  const gained = Math.round(amount);
  state.sun += gained;
  return gained;
}

export function spendSun(state, amount) {
  state.sun -= amount;
}

export function getSunflowerHeadCount(state) {
  return state.twinSunflower ? 2 : 1;
}

export function getPassiveSunValue(state) {
  return state.passiveSunValue * getSunflowerHeadCount(state);
}

export function getClickSunValue(state) {
  return state.clickSunValue * getSunflowerHeadCount(state);
}

export function getPassiveIntervalMs(state) {
  return Math.max(MIN_PASSIVE_INTERVAL_MS, Math.round(state.passiveIntervalMs / getSunflowerHeadCount(state)));
}

export function getPassiveSunPerSecond(state) {
  return getPassiveSunValue(state) / (getPassiveIntervalMs(state) / 1000);
}

export function getSkySunValue() {
  return SKY_SUN_VALUE;
}

export function formatSeconds(milliseconds) {
  const seconds = milliseconds / 1000;
  return Number.isInteger(seconds) ? `${seconds}` : seconds.toFixed(1);
}
