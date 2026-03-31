export const DROP_INTERVAL_SECONDS = 12;
export const BASE_DROP_AMOUNT = 10;

export const CATEGORY_DEFINITIONS = [
  {
    id: 'environment',
    name: 'Environment',
    icon: '🪴',
    typeLabel: 'Field',
    description: 'Lawn-wide support upgrades and setup tools.',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    icon: '🌻',
    typeLabel: 'Producer',
    description: 'Build your sun economy first.',
  },
  {
    id: 'peashooter',
    name: 'Peashooter',
    icon: '🌱',
    typeLabel: 'Attack',
    description: 'Prepared for future damage upgrades.',
  },
  {
    id: 'wallnut',
    name: 'Wall-nut',
    icon: '🥔',
    typeLabel: 'Defense',
    description: 'Prepared for future durability upgrades.',
  },
  {
    id: 'cherrybomb',
    name: 'Cherry Bomb',
    icon: '🍒',
    typeLabel: 'Burst',
    description: 'Prepared for future burst abilities.',
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
      locked: true,
    },
  ],
  wallnut: [
    {
      id: 'shell-stack',
      name: 'Shell Stack',
      icon: '🟫',
      description: 'Defense upgrades will slot into this packet family later.',
      locked: true,
    },
  ],
  cherrybomb: [
    {
      id: 'boom-kit',
      name: 'Boom Kit',
      icon: '💥',
      description: 'Burst upgrades are reserved for a future combat pass.',
      locked: true,
    },
  ],
};
