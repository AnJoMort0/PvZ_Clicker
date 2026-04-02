import {
  BASE_CLICK_SUN_VALUE,
  BASE_PASSIVE_INTERVAL_MS,
  BASE_PASSIVE_SUN_VALUE,
  PLANT_PACKET_DEFINITIONS,
  STARTING_SUN,
  UPGRADE_DEFINITIONS,
} from '../config/gameData.js';

export function createInitialState() {
  const ownedUpgrades = {};
  const upgradeCosts = {};

  UPGRADE_DEFINITIONS.forEach((upgrade) => {
    ownedUpgrades[upgrade.id] = 0;
    upgradeCosts[upgrade.id] = upgrade.baseCost;
  });

  return {
    sun: STARTING_SUN,
    clickSunValue: BASE_CLICK_SUN_VALUE,
    passiveSunValue: BASE_PASSIVE_SUN_VALUE,
    passiveIntervalMs: BASE_PASSIVE_INTERVAL_MS,
    selectedPacketId: PLANT_PACKET_DEFINITIONS[0].id,
    hoverCardId: `packet:${PLANT_PACKET_DEFINITIONS[0].id}`,
    twinSunflower: false,
    ownedUpgrades,
    upgradeCosts,
    eventText: 'One lane, one Sunflower, and a frankly alarming amount of ambition.',
    particles: [],
    passiveTimerMs: 0,
    skyTimerMs: 0,
    nextSkyDropDelayMs: 0,
  };
}
