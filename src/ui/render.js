import { BOARD_CELL_COUNT, PLANT_PACKET_DEFINITIONS, UPGRADE_DEFINITIONS } from '../config/gameData.js';
import {
  canAfford,
  formatSeconds,
  getClickSunValue,
  getPassiveIntervalMs,
  getPassiveSunPerSecond,
  getPassiveSunValue,
  getSunflowerHeadCount,
} from '../game/economy.js';

function renderSprite(sprite, className = '') {
  const classes = ['sprite', className].filter(Boolean).join(' ');
  const frames = sprite.frames ?? 1;

  if (sprite.kind === 'image') {
    return `
      <span class="${classes}" data-frames="${frames}">
        <img class="sprite__image" src="${sprite.src}" alt="" draggable="false" />
      </span>
    `;
  }

  return `
    <span class="${classes} sprite--emoji" data-frames="${frames}">
      <span class="sprite__emoji" aria-hidden="true">${sprite.value}</span>
    </span>
  `;
}

function getUpgradeById(upgradeId) {
  return UPGRADE_DEFINITIONS.find((upgrade) => upgrade.id === upgradeId);
}

function getPacketById(packetId) {
  return PLANT_PACKET_DEFINITIONS.find((packet) => packet.id === packetId);
}

function getUpgradePriceLabel(state, upgrade) {
  const owned = state.ownedUpgrades[upgrade.id] ?? 0;
  const maxPurchases = upgrade.maxPurchases ?? Infinity;

  if (owned >= maxPurchases) {
    return 'Locked';
  }

  return `${state.upgradeCosts[upgrade.id]}`;
}

function buildPacketAlmanac(state, packet) {
  if (packet.empty) {
    return {
      name: packet.name,
      stat: 'Current stat: empty, patient, and judging everyone else silently.',
      description: packet.description,
    };
  }

  const passiveValue = getPassiveSunValue(state);
  const clickValue = getClickSunValue(state);
  const passiveSpeed = formatSeconds(getPassiveIntervalMs(state));
  const heads = getSunflowerHeadCount(state);

  return {
    name: packet.name,
    stat: `Current stat: ${clickValue} click sun, ${passiveValue} passive sun every ${passiveSpeed}s, ${heads} head${heads === 1 ? '' : 's'}.`,
    description: packet.description,
  };
}

function buildUpgradeAlmanac(state, upgrade) {
  const owned = state.ownedUpgrades[upgrade.id] ?? 0;
  const maxPurchases = upgrade.maxPurchases ?? Infinity;
  const locked = owned >= maxPurchases;

  switch (upgrade.id) {
    case 'twin-sunflower':
      return {
        name: upgrade.name,
        stat: locked
          ? 'Current stat: twin mode engaged, all sunflower stats are doubled and the packet is spent.'
          : 'Current stat: base form active. Buy this once to double click value, passive value, and passive speed.',
        description: upgrade.description,
      };
    case 'fertilizer':
      return {
        name: upgrade.name,
        stat: `Current stat: passive sun payout is ${getPassiveSunValue(state)} per drop.`,
        description: upgrade.description,
      };
    case 'coffee-bean':
      return {
        name: upgrade.name,
        stat: `Current stat: passive sun drops every ${formatSeconds(getPassiveIntervalMs(state))}s.`,
        description: upgrade.description,
      };
    case 'plant-food':
      return {
        name: upgrade.name,
        stat: `Current stat: click sun payout is ${getClickSunValue(state)} per click.`,
        description: upgrade.description,
      };
    default:
      return {
        name: upgrade.name,
        stat: 'Current stat: unknown, which is rude of it.',
        description: upgrade.description,
      };
  }
}

function getHoveredCard(state) {
  const fallbackCardId = `packet:${PLANT_PACKET_DEFINITIONS[0].id}`;
  const [kind, id] = (state.hoverCardId ?? fallbackCardId).split(':');

  if (kind === 'upgrade') {
    const upgrade = getUpgradeById(id);
    if (upgrade) {
      return buildUpgradeAlmanac(state, upgrade);
    }
  }

  const packet = getPacketById(id) ?? PLANT_PACKET_DEFINITIONS[0];
  return buildPacketAlmanac(state, packet);
}

function bindCardInteractions(button, actions, cardId, onClick) {
  button.addEventListener('mouseenter', () => actions.hoverCard(cardId));
  button.addEventListener('focus', () => actions.hoverCard(cardId));
  button.addEventListener('mouseleave', actions.clearHover);
  button.addEventListener('blur', actions.clearHover);

  if (onClick) {
    button.addEventListener('click', onClick);
  }
}

export function createRenderer(doc, actions) {
  const elements = {
    playfield: doc.querySelector('.playfield'),
    topPackets: doc.getElementById('top-packets'),
    upgradePackets: doc.getElementById('upgrade-packets'),
    laneGrid: doc.getElementById('lane-grid'),
    sunCount: doc.getElementById('sun-count'),
    sunPerSecond: doc.getElementById('sun-per-second'),
    statusLine: doc.getElementById('status-line'),
    almanacName: doc.getElementById('almanac-name'),
    almanacStat: doc.getElementById('almanac-stat'),
    almanacDescription: doc.getElementById('almanac-description'),
    particles: doc.getElementById('sun-particles'),
  };

  function renderTopPackets(state) {
    elements.topPackets.innerHTML = '';

    PLANT_PACKET_DEFINITIONS.forEach((packet) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `seed-card seed-card--top ${packet.empty ? 'is-empty' : ''} ${state.selectedPacketId === packet.id ? 'is-selected' : ''}`;
      button.setAttribute('aria-label', packet.name);
      button.setAttribute('aria-disabled', String(Boolean(packet.empty)));
      button.innerHTML = `
        <span class="seed-card__art">${renderSprite(packet.sprite, 'sprite--packet')}</span>
        <span class="seed-card__label">${packet.name}</span>
      `;

      bindCardInteractions(button, actions, `packet:${packet.id}`, packet.empty ? null : () => actions.selectPacket(packet.id));
      elements.topPackets.appendChild(button);
    });
  }

  function renderUpgrades(state) {
    elements.upgradePackets.innerHTML = '';

    UPGRADE_DEFINITIONS.forEach((upgrade) => {
      const owned = state.ownedUpgrades[upgrade.id] ?? 0;
      const maxPurchases = upgrade.maxPurchases ?? Infinity;
      const isLocked = owned >= maxPurchases;
      const cost = state.upgradeCosts[upgrade.id];
      const unavailable = !isLocked && !canAfford(state, cost);

      const button = doc.createElement('button');
      button.type = 'button';
      button.className = `upgrade-card ${isLocked ? 'is-locked' : ''} ${unavailable ? 'is-unavailable' : ''}`;
      button.setAttribute('aria-label', `${upgrade.name}. ${upgrade.effectLabel}.`);
      button.setAttribute('aria-disabled', String(isLocked));
      button.innerHTML = `
        <span class="upgrade-card__art">${renderSprite(upgrade.sprite, 'sprite--upgrade')}</span>
        <span class="upgrade-card__copy">
          <span class="upgrade-card__name">${upgrade.name}</span>
          <span class="upgrade-card__effect">${upgrade.effectLabel}</span>
        </span>
        <span class="upgrade-card__price">${getUpgradePriceLabel(state, upgrade)}</span>
      `;

      bindCardInteractions(
        button,
        actions,
        `upgrade:${upgrade.id}`,
        isLocked ? null : () => actions.purchaseUpgrade(upgrade.id)
      );

      elements.upgradePackets.appendChild(button);
    });
  }

  function renderLane(state) {
    elements.laneGrid.innerHTML = '';
    const row = doc.createElement('tr');

    for (let index = 0; index < BOARD_CELL_COUNT; index += 1) {
      const cell = doc.createElement('td');
      cell.className = 'lane-grid__cell';

      if (index === 0) {
        const sunflowerButton = doc.createElement('button');
        sunflowerButton.type = 'button';
        sunflowerButton.id = 'sunflower-plant';
        sunflowerButton.className = `plant-sprite plant-sprite--sunflower ${state.twinSunflower ? 'is-twin' : ''}`;
        sunflowerButton.setAttribute('aria-label', 'Collect sun from sunflower');
        sunflowerButton.innerHTML = `
          <span class="plant-sprite__heads plant-sprite__heads--${getSunflowerHeadCount(state)}">
            ${renderSprite(getPacketById('sunflower').sprite, 'sprite--plant')}
            ${state.twinSunflower ? renderSprite(getPacketById('sunflower').sprite, 'sprite--plant sprite--plant-secondary') : ''}
          </span>
        `;
        sunflowerButton.addEventListener('click', actions.collectSun);
        cell.appendChild(sunflowerButton);
      }

      row.appendChild(cell);
    }

    elements.laneGrid.appendChild(row);
  }

  function renderHud(state) {
    const almanac = getHoveredCard(state);
    elements.sunCount.textContent = `${Math.floor(state.sun)}`;
    elements.sunPerSecond.textContent = getPassiveSunPerSecond(state).toFixed(1);
    elements.statusLine.textContent = state.eventText;
    elements.almanacName.textContent = almanac.name;
    elements.almanacStat.textContent = almanac.stat;
    elements.almanacDescription.textContent = almanac.description;
  }

  function renderParticles(state) {
    elements.particles.innerHTML = state.particles
      .map(
        (particle) => `
          <span
            class="sun-particle sun-particle--${particle.origin}"
            style="left: ${particle.x}px; top: ${particle.y}px; --sun-scale: ${particle.scale ?? 1};"
            aria-hidden="true"
          >
            ${renderSprite({ kind: 'emoji', value: '☀️', frames: 1 }, 'sprite--sun')}
          </span>
        `
      )
      .join('');
  }

  function getCenter(selector, fallback) {
    const anchor = elements.playfield.querySelector(selector);
    if (!anchor) {
      return fallback;
    }

    const playfieldRect = elements.playfield.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();

    return {
      x: rect.left - playfieldRect.left + rect.width / 2,
      y: rect.top - playfieldRect.top + rect.height / 2,
    };
  }

  function getLaneBounds() {
    const playfieldRect = elements.playfield.getBoundingClientRect();
    const rect = elements.laneGrid.getBoundingClientRect();

    return {
      left: rect.left - playfieldRect.left,
      top: rect.top - playfieldRect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  return {
    render(state) {
      renderTopPackets(state);
      renderUpgrades(state);
      renderLane(state);
      renderHud(state);
      renderParticles(state);
    },
    renderHud,
    renderParticles,
    getSunCounterAnchor() {
      return getCenter('#sun-count', { x: 64, y: 72 });
    },
    getSunflowerAnchor() {
      return getCenter('#sunflower-plant', { x: 280, y: 360 });
    },
    getLaneBounds,
  };
}
