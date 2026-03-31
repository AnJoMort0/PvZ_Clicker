import { CATEGORY_DEFINITIONS, DROP_INTERVAL_SECONDS, UPGRADE_DEFINITIONS } from '../config/gameData.js';
import { canAfford, getDropAmount } from '../game/economy.js';

export function createRenderer(doc, actions) {
  const elements = {
    playfield: doc.querySelector('.playfield'),
    categoryPackets: doc.getElementById('category-packets'),
    upgradePackets: doc.getElementById('upgrade-packets'),
    sunCount: doc.getElementById('sun-count'),
    sunPerSecond: doc.getElementById('sun-per-second'),
    eventLog: doc.getElementById('event-log'),
    sunflowerButton: doc.getElementById('sunflower'),
  };

  elements.sunflowerButton.addEventListener('click', actions.collectSun);

  function renderCategories(state) {
    elements.categoryPackets.innerHTML = '';

    CATEGORY_DEFINITIONS.forEach((category) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `seed-packet seed-packet--primary ${state.selectedCategory === category.id ? 'is-selected' : ''}`;
      button.setAttribute('aria-label', `${category.name} line.`);
      button.setAttribute('aria-pressed', String(state.selectedCategory === category.id));
      button.innerHTML = `
        <span class="seed-packet__glass">
          <span class="seed-packet__icon">${category.icon}</span>
        </span>
        <span class="seed-packet__price ${category.seedCost == null ? 'seed-packet__price--empty' : ''}">${category.seedCost ?? '0'}</span>
      `;
      button.addEventListener('click', () => actions.selectCategory(category.id));
      elements.categoryPackets.appendChild(button);
    });
  }

  function renderUpgrades(state) {
    elements.upgradePackets.innerHTML = '';
    const upgrades = UPGRADE_DEFINITIONS[state.selectedCategory] ?? [];

    upgrades.forEach((upgrade) => {
      const button = doc.createElement('button');
      const isLocked = Boolean(upgrade.locked);
      const cost = state.upgradeCosts[upgrade.id] ?? upgrade.baseCost ?? 0;
      const owned = state.ownedUpgrades[upgrade.id] ?? 0;
      const isUnavailable = !isLocked && !canAfford(state, cost);

      button.type = 'button';
      button.className = `seed-packet seed-packet--secondary ${isLocked ? 'is-locked' : ''} ${isUnavailable ? 'is-unavailable' : ''} ${owned > 0 ? 'is-owned' : ''}`;
      button.setAttribute(
        'aria-label',
        `${upgrade.name}. ${upgrade.description}${isLocked ? ' Coming later.' : ` Cost ${cost}.`}`
      );
      button.setAttribute('aria-disabled', String(isLocked));
      button.innerHTML = `
        <span class="seed-packet__glass">
          <span class="seed-packet__icon">${upgrade.icon}</span>
        </span>
        <span class="seed-packet__price">${cost}</span>
      `;

      if (!isLocked) {
        button.addEventListener('click', () => actions.purchaseUpgrade(upgrade.id));
      }

      elements.upgradePackets.appendChild(button);
    });
  }

  function renderHud(state) {
    const passiveRate = (state.passivePerSecond + getDropAmount(state) / DROP_INTERVAL_SECONDS) * state.globalSunMultiplier;

    elements.playfield.dataset.selectedCategory = state.selectedCategory;
    elements.sunCount.textContent = Math.floor(state.sun);
    elements.sunPerSecond.textContent = Number.isInteger(passiveRate) ? `${passiveRate}` : passiveRate.toFixed(1);
    elements.eventLog.textContent = state.eventText;
  }

  return {
    render(state) {
      renderCategories(state);
      renderUpgrades(state);
      renderHud(state);
    },
  };
}
