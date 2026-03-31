import { CATEGORY_DEFINITIONS, DROP_INTERVAL_SECONDS, UPGRADE_DEFINITIONS } from '../config/gameData.js';
import { canAfford, getDropAmount } from '../game/economy.js';

export function createRenderer(doc, actions) {
  const elements = {
    categoryPackets: doc.getElementById('category-packets'),
    upgradePackets: doc.getElementById('upgrade-packets'),
    sunCount: doc.getElementById('sun-count'),
    sunPerClick: doc.getElementById('sun-per-click'),
    sunPerSecond: doc.getElementById('sun-per-second'),
    dropRate: doc.getElementById('drop-rate'),
    weatherLevel: doc.getElementById('weather-level'),
    eventLog: doc.getElementById('event-log'),
    sunflowerButton: doc.getElementById('sunflower'),
  };

  elements.sunflowerButton.addEventListener('click', actions.collectSun);

  function renderCategories(state) {
    elements.categoryPackets.innerHTML = '';

    CATEGORY_DEFINITIONS.forEach((category) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `packet ${state.selectedCategory === category.id ? 'is-selected' : ''}`;
      button.innerHTML = `
        <div class="packet__topline">
          <span class="packet__type">${category.typeLabel}</span>
          <span class="packet__badge">${category.id === 'sunflower' || category.id === 'environment' ? 'Live' : 'Soon'}</span>
        </div>
        <div class="art-slot">${category.icon}</div>
        <h2 class="packet__name">${category.name}</h2>
        <p class="packet__description">${category.description}</p>
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
      const cost = state.upgradeCosts[upgrade.id] ?? 0;
      const owned = state.ownedUpgrades[upgrade.id] ?? 0;
      const disabled = isLocked || !canAfford(state, cost);

      button.type = 'button';
      button.className = `packet ${isLocked ? 'is-locked' : ''}`;
      button.disabled = disabled;
      button.innerHTML = `
        <div class="packet__topline">
          <span class="packet__type">${state.selectedCategory}</span>
          <span class="packet__badge">${isLocked ? 'Locked' : owned}</span>
        </div>
        <div class="art-slot">${upgrade.icon}</div>
        <h2 class="packet__name">${upgrade.name}</h2>
        <p class="packet__description">${upgrade.description}</p>
        ${
          isLocked
            ? ''
            : `<div class="packet__meta">
                <span class="packet__cost">${upgrade.costLabel}: ${cost}</span>
                <span class="packet__owned">Owned: ${owned}</span>
              </div>`
        }
      `;

      if (!isLocked) {
        button.addEventListener('click', () => actions.purchaseUpgrade(upgrade.id));
      }

      elements.upgradePackets.appendChild(button);
    });

    if (upgrades.every((upgrade) => upgrade.locked)) {
      const message = doc.createElement('p');
      message.className = 'lock-copy';
      message.textContent = 'This plant line is laid out on purpose so future plant families can slot into the same packet system without redesigning the UI.';
      elements.upgradePackets.appendChild(message);
    }
  }

  function renderHud(state) {
    elements.sunCount.textContent = Math.floor(state.sun);
    elements.sunPerClick.textContent = `${Math.round(state.perClick * state.globalSunMultiplier)}`;
    elements.sunPerSecond.textContent = `${state.passivePerSecond} /s`;
    elements.dropRate.textContent = state.dropOwned > 0 ? `${getDropAmount(state)} / ${DROP_INTERVAL_SECONDS}s` : '0';
    elements.weatherLevel.textContent = state.weatherOwned > 0 ? `Sunny x${state.weatherOwned}` : 'Clear';
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
