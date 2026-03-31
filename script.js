const state = {
  sun: 0,
  perClick: 1,
  passivePerSecond: 0,
  passiveOwned: 0,
  clickOwned: 0,
  dropOwned: 0,
  costs: {
    passive: 25,
    click: 20,
    drop: 40,
  },
};

const DROP_INTERVAL_SECONDS = 12;
const BASE_DROP_AMOUNT = 10;

const sunCountEl = document.getElementById('sun-count');
const sunPerClickEl = document.getElementById('sun-per-click');
const sunPerSecondEl = document.getElementById('sun-per-second');
const eventLogEl = document.getElementById('event-log');

const upgradeButtons = {
  passive: document.getElementById('upgrade-passive'),
  click: document.getElementById('upgrade-click'),
  drop: document.getElementById('upgrade-drop'),
};

const costLabels = {
  passive: document.getElementById('cost-passive'),
  click: document.getElementById('cost-click'),
  drop: document.getElementById('cost-drop'),
};

const ownedLabels = {
  passive: document.getElementById('owned-passive'),
  click: document.getElementById('owned-click'),
  drop: document.getElementById('owned-drop'),
};

function scaleCost(baseCost) {
  return Math.ceil(baseCost * 1.45);
}

function canAfford(cost) {
  return state.sun >= cost;
}

function spendSun(amount) {
  state.sun -= amount;
}

function gainSun(amount) {
  state.sun += amount;
}

function logEvent(text) {
  eventLogEl.textContent = text;
}

function updateView() {
  sunCountEl.textContent = Math.floor(state.sun);
  sunPerClickEl.textContent = state.perClick;
  sunPerSecondEl.textContent = state.passivePerSecond;

  costLabels.passive.textContent = state.costs.passive;
  costLabels.click.textContent = state.costs.click;
  costLabels.drop.textContent = state.costs.drop;

  ownedLabels.passive.textContent = state.passiveOwned;
  ownedLabels.click.textContent = state.clickOwned;
  ownedLabels.drop.textContent = state.dropOwned;

  upgradeButtons.passive.disabled = !canAfford(state.costs.passive);
  upgradeButtons.click.disabled = !canAfford(state.costs.click);
  upgradeButtons.drop.disabled = !canAfford(state.costs.drop);
}

function purchasePassive() {
  const cost = state.costs.passive;
  if (!canAfford(cost)) return;

  spendSun(cost);
  state.passiveOwned += 1;
  state.passivePerSecond += 1;
  state.costs.passive = scaleCost(cost);

  logEvent('Your sunflower now produces more sun on its own.');
  updateView();
}

function purchaseClick() {
  const cost = state.costs.click;
  if (!canAfford(cost)) return;

  spendSun(cost);
  state.clickOwned += 1;
  state.perClick += 1;
  state.costs.click = scaleCost(cost);

  logEvent('Each click now gives extra sun.');
  updateView();
}

function purchaseDrop() {
  const cost = state.costs.drop;
  if (!canAfford(cost)) return;

  spendSun(cost);
  state.dropOwned += 1;
  state.costs.drop = scaleCost(cost);

  logEvent('The sky seems sunnier... big drops will fall over time.');
  updateView();
}

document.getElementById('sunflower').addEventListener('click', () => {
  gainSun(state.perClick);
  logEvent(`Collected ${state.perClick} sun from click.`);
  updateView();
});

upgradeButtons.passive.addEventListener('click', purchasePassive);
upgradeButtons.click.addEventListener('click', purchaseClick);
upgradeButtons.drop.addEventListener('click', purchaseDrop);

setInterval(() => {
  if (state.passivePerSecond > 0) {
    gainSun(state.passivePerSecond);
  }
  updateView();
}, 1000);

setInterval(() => {
  if (state.dropOwned > 0) {
    const dropAmount = BASE_DROP_AMOUNT * state.dropOwned;
    gainSun(dropAmount);
    logEvent(`A big sun drop fell from the sky: +${dropAmount} sun.`);
    updateView();
  }
}, DROP_INTERVAL_SECONDS * 1000);

updateView();
