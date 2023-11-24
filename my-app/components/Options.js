export const OptionsGame = {
  level: {
    fov: 100,
    near: 0.1,
    far: 100,
    areaWidth: 40,
    areaHeight: 30,
    boxDepth: 1,
    backgroundColor: 0xcccccc,
    groundColor: 0x42d4f5,
  },
  essences: {
    snakeWidth: 3,
    snakePartWidth: 0.5,
    wallHeight: 2,
    foodWidth: 0.5,
    foodHeight: 0.1,
    snakeCam: true,
    snakeName: "Snake",
    wallName: "Wall",
    foodName: "Food",
  },
  events: {
    eventSnake: { type: "getSnake" },
    eventWalls: { type: "getWalls" },
    eventFood: { type: "getFood" },
  },
  rotation: {
    speed: 10,
    rotateAngle: Math.PI * 1.2,
  },
  camera: {
    offset: {
      x: 0,
      y: 10,
      z: 7,
    },
    debugPosition: {
      x: 0,
      y: 5,
      z: 5,
    },
  },
  light: {
    color: 0xffffff,
    intensity: 1.5,
  },
};
