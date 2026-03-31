import { CATEGORY_DEFINITIONS, UPGRADE_DEFINITIONS } from '../config/gameData.js';

export function createInitialState() {
  const ownedUpgrades = {};
  const upgradeCosts = {};

  Object.values(UPGRADE_DEFINITIONS)
    .flat()
    .forEach((upgrade) => {
      ownedUpgrades[upgrade.id] = 0;
      if (!upgrade.locked) {
        upgradeCosts[upgrade.id] = upgrade.baseCost;
      }
    });

  return {
    sun: 0,
    perClick: 1,
    passivePerSecond: 0,
    dropOwned: 0,
    weatherOwned: 0,
    globalSunMultiplier: 1,
    selectedCategory: CATEGORY_DEFINITIONS[1].id,
    ownedUpgrades,
    upgradeCosts,
    eventText: 'Your sunflower is ready. Gather sun and start building a lawn economy.',
  };
}

export function getCategory(categoryId) {
  return CATEGORY_DEFINITIONS.find((category) => category.id === categoryId);
}
