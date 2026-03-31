export const DROP_INTERVAL_SECONDS = 12;
export const BASE_DROP_AMOUNT = 10;

export const CATEGORY_DEFINITIONS = [
  {
    id: 'environment',
    name: 'Environment',
    icon: '🪏',
    typeLabel: 'Field',
    description: 'Lawn-wide support upgrades and setup tools.',
    seedCost: null,
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    icon: '🌻',
    typeLabel: 'Producer',
    description: 'Build your sun economy first.',
    seedCost: 25,
  },
  {
    id: 'peashooter',
    name: 'Peashooter',
    icon: '🫛',
    typeLabel: 'Attack',
    description: 'Prepared for future damage upgrades.',
    seedCost: 100,
  },
  {
    id: 'wallnut',
    name: 'Wall-nut',
    icon: '🥔',
    typeLabel: 'Defense',
    description: 'Prepared for future durability upgrades.',
    seedCost: 50,
  },
  {
    id: 'cherrybomb',
    name: 'Cherry Bomb',
    icon: '🍒',
    typeLabel: 'Burst',
    description: 'Prepared for future burst abilities.',
    seedCost: 150,
  },
];

export const UPGRADE_DEFINITIONS = {
  environment: [
    {
      id: 'weather-report',
      name: 'Sunny Day',
      icon: '☀️',
      description: 'Boost all sun income by 15%.',
      costLabel: 'Sun',
      baseCost: 60,
      scaling: 1.6,
      effectLabel: '+15% all sun',
      apply(state) {
        state.globalSunMultiplier += 0.15;
        state.weatherOwned += 1;
      },
    },
    {
      id: 'garden-rake',
      name: 'Garden Rake',
      icon: '🪴',
      description: 'Reserved for future board-control bonuses.',
      baseCost: 75,
      locked: true,
    },
  ],
  sunflower: [
    {
      id: 'sunflower-growth',
      name: 'Twin Leaves',
      icon: '🌿',
      description: 'Add +1 passive sun each second.',
      costLabel: 'Sun',
      baseCost: 25,
      scaling: 1.45,
      effectLabel: '+1 passive',
      apply(state) {
        state.passivePerSecond += 1;
      },
    },
    {
      id: 'richer-sun',
      name: 'Golden Petals',
      icon: '✨',
      description: 'Add +1 sun every click.',
      costLabel: 'Sun',
      baseCost: 20,
      scaling: 1.45,
      effectLabel: '+1 click',
      apply(state) {
        state.perClick += 1;
      },
    },
    {
      id: 'sky-drop',
      name: 'Sky Bloom',
      icon: '🌤️',
      description: 'Create one stronger sky drop every cycle.',
      costLabel: 'Sun',
      baseCost: 40,
      scaling: 1.45,
      effectLabel: '+1 sky drop',
      apply(state) {
        state.dropOwned += 1;
      },
    },
  ],
  peashooter: [
    {
      id: 'pea-line',
      name: 'Pea Line',
      icon: '🫛',
      description: 'Combat systems will branch from here later.',
      baseCost: 100,
      locked: true,
    },
    {
      id: 'repeater-line',
      name: 'Repeater Line',
      icon: '🎯',
      description: 'Higher-rate projectile upgrades will plug in here later.',
      baseCost: 200,
      locked: true,
    },
    {
      id: 'split-pea-line',
      name: 'Split Pea Line',
      icon: '🟢',
      description: 'Directional fire upgrades are reserved for a future combat pass.',
      baseCost: 325,
      locked: true,
    },
  ],
  wallnut: [
    {
      id: 'shell-stack',
      name: 'Shell Stack',
      icon: '🟫',
      description: 'Defense upgrades will slot into this packet family later.',
      baseCost: 50,
      locked: true,
    },
    {
      id: 'hard-shell',
      name: 'Hard Shell',
      icon: '🛡️',
      description: 'Tankier front-line upgrades are reserved for later.',
      baseCost: 125,
      locked: true,
    },
  ],
  cherrybomb: [
    {
      id: 'boom-kit',
      name: 'Boom Kit',
      icon: '💥',
      description: 'Burst upgrades are reserved for a future combat pass.',
      baseCost: 150,
      locked: true,
    },
    {
      id: 'chain-blast',
      name: 'Chain Blast',
      icon: '🔥',
      description: 'Larger explosive upgrade branches will arrive later.',
      baseCost: 275,
      locked: true,
    },
  ],
};
