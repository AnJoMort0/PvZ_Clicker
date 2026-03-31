import { BASE_DROP_AMOUNT } from '../config/gameData.js';

export function scaleCost(cost, factor) {
  return Math.ceil(cost * factor);
}

export function canAfford(state, cost) {
  return state.sun >= cost;
}

export function gainSun(state, baseAmount) {
  const gained = Math.round(baseAmount * state.globalSunMultiplier);
  state.sun += gained;
  return gained;
}

export function spendSun(state, amount) {
  state.sun -= amount;
}

export function getDropAmount(state) {
  return BASE_DROP_AMOUNT * state.dropOwned;
}
