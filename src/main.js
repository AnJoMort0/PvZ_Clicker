import { DROP_INTERVAL_SECONDS, UPGRADE_DEFINITIONS } from './config/gameData.js';
import { canAfford, gainSun, getDropAmount, scaleCost, spendSun } from './game/economy.js';
import { createInitialState, getCategory } from './game/state.js';
import { createRenderer } from './ui/render.js';

const state = createInitialState();

const renderer = createRenderer(document, {
  collectSun,
  selectCategory,
  purchaseUpgrade,
});

function setEvent(text) {
  state.eventText = text;
}

function render() {
  renderer.render(state);
}

function collectSun() {
  const gained = gainSun(state, state.perClick);
  setEvent(`The sunflower produced ${gained} sun.`);
  render();
}

function selectCategory(categoryId) {
  state.selectedCategory = categoryId;
  const category = getCategory(categoryId);
  setEvent(`Browsing ${category?.name ?? categoryId} upgrades.`);
  render();
}

function findUpgradeById(upgradeId) {
  return Object.values(UPGRADE_DEFINITIONS)
    .flat()
    .find((upgrade) => upgrade.id === upgradeId);
}

function purchaseUpgrade(upgradeId) {
  const upgrade = findUpgradeById(upgradeId);
  if (!upgrade || upgrade.locked) {
    return;
  }

  const cost = state.upgradeCosts[upgradeId];
  if (!canAfford(state, cost)) {
    return;
  }

  spendSun(state, cost);
  upgrade.apply(state);
  state.ownedUpgrades[upgradeId] += 1;
  state.upgradeCosts[upgradeId] = scaleCost(cost, upgrade.scaling);
  setEvent(`${upgrade.name} planted. ${upgrade.effectLabel}.`);
  render();
}

setInterval(() => {
  if (state.passivePerSecond <= 0) {
    return;
  }

  gainSun(state, state.passivePerSecond);
  render();
}, 1000);

setInterval(() => {
  if (state.dropOwned <= 0) {
    return;
  }

  const dropAmount = getDropAmount(state);
  const gained = gainSun(state, dropAmount);
  setEvent(`A sky sun dropped into the lawn for ${gained} sun.`);
  render();
}, DROP_INTERVAL_SECONDS * 1000);

render();
