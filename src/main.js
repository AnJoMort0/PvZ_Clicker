import {
  FLOWER_SUN_HOME_MS,
  FLOWER_SUN_HOP_MS,
  SKY_DROP_INTERVAL_MAX_MS,
  SKY_DROP_INTERVAL_MIN_MS,
  SKY_SUN_FALL_MS,
  SKY_SUN_HOME_MS,
  UPGRADE_DEFINITIONS,
} from './config/gameData.js';
import {
  canAfford,
  gainSun,
  getClickSunValue,
  getPassiveIntervalMs,
  getPassiveSunValue,
  getSkySunValue,
  scaleCost,
  spendSun,
} from './game/economy.js';
import { createInitialState } from './game/state.js';
import { createRenderer } from './ui/render.js';

const state = createInitialState();
state.nextSkyDropDelayMs = getRandomSkyDelayMs();

let particleId = 0;
let lastFrameTime = 0;

const renderer = createRenderer(document, {
  clearHover,
  collectSun,
  hoverCard,
  purchaseUpgrade,
  selectPacket,
});

function setEvent(text) {
  state.eventText = text;
}

function render() {
  renderer.render(state);
}

function renderHud() {
  renderer.renderHud(state);
}

function getRandomSkyDelayMs() {
  return Math.round(
    SKY_DROP_INTERVAL_MIN_MS + Math.random() * (SKY_DROP_INTERVAL_MAX_MS - SKY_DROP_INTERVAL_MIN_MS)
  );
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function getUpgradeById(upgradeId) {
  return UPGRADE_DEFINITIONS.find((upgrade) => upgrade.id === upgradeId);
}

function hoverCard(cardId) {
  state.hoverCardId = cardId;
  renderHud();
}

function clearHover() {
  state.hoverCardId = `packet:${state.selectedPacketId}`;
  renderHud();
}

function selectPacket(packetId) {
  if (state.selectedPacketId === packetId) {
    return;
  }

  state.selectedPacketId = packetId;
  state.hoverCardId = `packet:${packetId}`;
  setEvent('Sunflower packet selected. The rest of the tray can wait its turn.');
  render();
}

function collectSun() {
  const amount = getClickSunValue(state);
  spawnFlowerSun(amount, 'click');
  setEvent(`The Sunflower popped out a ${amount} sun and expects applause.`);
  renderHud();
}

function purchaseUpgrade(upgradeId) {
  const upgrade = getUpgradeById(upgradeId);
  if (!upgrade) {
    return;
  }

  const owned = state.ownedUpgrades[upgradeId] ?? 0;
  const maxPurchases = upgrade.maxPurchases ?? Infinity;
  if (owned >= maxPurchases) {
    return;
  }

  const cost = state.upgradeCosts[upgradeId];
  if (!canAfford(state, cost)) {
    setEvent(`${upgrade.name} costs ${cost} sun. The packet is unimpressed by your budget.`);
    renderHud();
    return;
  }

  spendSun(state, cost);
  upgrade.apply(state);
  state.ownedUpgrades[upgradeId] += 1;

  if ((upgrade.maxPurchases ?? Infinity) > 1) {
    state.upgradeCosts[upgradeId] = scaleCost(cost, upgrade.scaling);
  }

  setEvent(`${upgrade.name} installed. ${upgrade.effectLabel}.`);
  render();
}

function spawnFlowerSun(amount, reason) {
  const source = renderer.getSunflowerAnchor();
  const lane = renderer.getLaneBounds();
  const start = {
    x: source.x,
    y: source.y - 66,
  };
  const end = {
    x: clamp(source.x + randomBetween(-82, 82), lane.left + 30, lane.left + lane.width - 30),
    y: clamp(source.y + randomBetween(-28, 44), lane.top + 24, lane.top + lane.height - 34),
  };

  state.particles.push({
    id: particleId += 1,
    amount,
    origin: 'flower',
    reason,
    phase: 'hop',
    phaseStartedAt: performance.now(),
    phaseDurationMs: FLOWER_SUN_HOP_MS,
    start,
    end,
    x: start.x,
    y: start.y,
    arcHeight: randomBetween(54, 96),
    scale: 1,
  });
}

function spawnSkySun() {
  const lane = renderer.getLaneBounds();
  const x = lane.left + lane.width * randomBetween(0.18, 0.82);
  const start = { x, y: -70 };
  const end = { x, y: lane.top + lane.height * 0.2 };

  state.particles.push({
    id: particleId += 1,
    amount: getSkySunValue(),
    origin: 'sky',
    reason: 'sky',
    phase: 'fall',
    phaseStartedAt: performance.now(),
    phaseDurationMs: SKY_SUN_FALL_MS,
    start,
    end,
    x: start.x,
    y: start.y,
    arcHeight: 0,
    scale: 1.1,
  });
}

function transitionParticleHome(particle, now) {
  particle.phase = 'home';
  particle.phaseStartedAt = now;
  particle.phaseDurationMs = particle.origin === 'sky' ? SKY_SUN_HOME_MS : FLOWER_SUN_HOME_MS;
  particle.start = { x: particle.x, y: particle.y };
  particle.end = renderer.getSunCounterAnchor();
  particle.arcHeight = 0;
}

function collectParticle(particle) {
  const gained = gainSun(state, particle.amount);

  if (particle.reason === 'click') {
    setEvent(`Click sun collected for ${gained}. The Sunflower smirks like it planned that.`);
  } else if (particle.reason === 'passive') {
    setEvent(`Passive sun collected for ${gained}. The Sunflower calls that effortless.`);
  } else {
    setEvent(`Sky sun collected for ${gained}. Free money from the weather, as usual.`);
  }

  renderHud();
}

function updateParticle(particle, now) {
  const elapsed = now - particle.phaseStartedAt;
  const progress = Math.min(elapsed / particle.phaseDurationMs, 1);

  if (particle.phase === 'hop') {
    particle.x = lerp(particle.start.x, particle.end.x, progress);
    particle.y = lerp(particle.start.y, particle.end.y, progress) - Math.sin(progress * Math.PI) * particle.arcHeight;
  } else if (particle.phase === 'fall') {
    particle.x = particle.start.x + Math.sin(progress * Math.PI * 1.2) * 10;
    particle.y = lerp(particle.start.y, particle.end.y, progress);
  } else {
    particle.x = lerp(particle.start.x, particle.end.x, progress);
    particle.y = lerp(particle.start.y, particle.end.y, progress);
  }

  if (progress < 1) {
    return false;
  }

  if (particle.phase === 'home') {
    collectParticle(particle);
    return true;
  }

  transitionParticleHome(particle, now);
  return false;
}

function tick(now) {
  if (!lastFrameTime) {
    lastFrameTime = now;
  }

  const delta = now - lastFrameTime;
  lastFrameTime = now;

  state.passiveTimerMs += delta;
  const passiveIntervalMs = getPassiveIntervalMs(state);
  while (state.passiveTimerMs >= passiveIntervalMs) {
    state.passiveTimerMs -= passiveIntervalMs;
    spawnFlowerSun(getPassiveSunValue(state), 'passive');
  }

  state.skyTimerMs += delta;
  if (state.skyTimerMs >= state.nextSkyDropDelayMs) {
    state.skyTimerMs = 0;
    state.nextSkyDropDelayMs = getRandomSkyDelayMs();
    spawnSkySun();
  }

  state.particles = state.particles.filter((particle) => !updateParticle(particle, now));
  renderer.renderParticles(state);
  requestAnimationFrame(tick);
}

render();
requestAnimationFrame(tick);
