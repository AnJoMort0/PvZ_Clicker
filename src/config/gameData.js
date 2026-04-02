export const BOARD_CELL_COUNT = 5;
export const TOP_PACKET_COUNT = 5;

export const STARTING_SUN = 50;
export const BASE_CLICK_SUN_VALUE = 15;
export const BASE_PASSIVE_SUN_VALUE = 25;
export const BASE_PASSIVE_INTERVAL_MS = 9000;
export const MIN_PASSIVE_INTERVAL_MS = 2500;
export const SKY_SUN_VALUE = 50;
export const SKY_DROP_INTERVAL_MIN_MS = 16000;
export const SKY_DROP_INTERVAL_MAX_MS = 28000;

export const FLOWER_SUN_HOP_MS = 650;
export const FLOWER_SUN_HOME_MS = 520;
export const SKY_SUN_FALL_MS = 2200;
export const SKY_SUN_HOME_MS = 560;

export const SPRITES = {
  sunflower: {
    kind: 'image',
    src: 'assets/plants/sunflower/sunflower.png',
    frameWidth: 1344,
    frameHeight: 1308,
    frames: 1,
  },
  fertilizer: {
    kind: 'image',
    src: 'assets/upgrades/fertilizer.webp',
    frames: 1,
  },
  coffeeBean: {
    kind: 'image',
    src: 'assets/upgrades/coffee_bean.webp',
    frames: 1,
  },
  plantFood: {
    kind: 'image',
    src: 'assets/upgrades/plantfood.jpeg',
    frames: 1,
  },
  twinSunflower: {
    kind: 'emoji',
    value: '🌻',
    frames: 1,
  },
  empty: {
    kind: 'emoji',
    value: '🫥',
    frames: 1,
  },
  sun: {
    kind: 'emoji',
    value: '☀️',
    frames: 1,
  },
};

export const PLANT_PACKET_DEFINITIONS = Array.from({ length: TOP_PACKET_COUNT }, (_, index) => {
  if (index === 0) {
    return {
      id: 'sunflower',
      name: 'Sunflower',
      sprite: SPRITES.sunflower,
      description:
        'Steady, sunny, and smug about it. This is still the plant that pays everybody else around here.',
    };
  }

  return {
    id: `empty-slot-${index}`,
    name: 'Empty Slot',
    sprite: SPRITES.empty,
    description: 'A proud vacancy. Something stronger can audition for this packet later.',
    empty: true,
  };
});

export const UPGRADE_DEFINITIONS = [
  {
    id: 'twin-sunflower',
    name: 'Twin Sunflower',
    sprite: SPRITES.twinSunflower,
    baseCost: 600,
    maxPurchases: 1,
    effectLabel: 'Doubles click value, passive value, and passive speed',
    description:
      'Two heads, twice the attitude. The regular Sunflower calls this showing off. The wallet calls it a crisis.',
    apply(state) {
      state.twinSunflower = true;
    },
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer',
    sprite: SPRITES.fertilizer,
    baseCost: 100,
    scaling: 1.55,
    effectLabel: '+10 passive sun value',
    description:
      'The bag says "growth support." Your Sunflower hears "make richer suns and stop being shy about it."',
    apply(state) {
      state.passiveSunValue += 10;
    },
  },
  {
    id: 'coffee-bean',
    name: 'Coffee Bean',
    sprite: SPRITES.coffeeBean,
    baseCost: 140,
    scaling: 1.6,
    effectLabel: '+15% passive speed',
    description:
      'A jittery little bean that convinces your Sunflower naps are for weaklings and loading screens.',
    apply(state) {
      state.passiveIntervalMs *= 0.85;
    },
  },
  {
    id: 'plant-food',
    name: 'Plant Food',
    sprite: SPRITES.plantFood,
    baseCost: 90,
    scaling: 1.5,
    effectLabel: '+10 click sun value',
    description:
      'A glowing snack that turns every click into a brighter flex. The Sunflower loves being rewarded for drama.',
    apply(state) {
      state.clickSunValue += 10;
    },
  },
];
