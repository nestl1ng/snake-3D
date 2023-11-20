import * as THREE from "three";

export default class CollisionController {
  constructor({ eventBus, container }) {
    this._container = container;
    this.headVectors = new THREE.Vector3(0, 0, 0);

    this.snakeSpheres = [];
    this.foodVector = new THREE.Vector3(0, 0, 0);

    this.eventBus = eventBus;
    this.eventSnake = { type: "getSnake" };
    this.eventWalls = { type: "getWalls" };
    this.eventFood = { type: "getFood" };
    this.eventSpawnController = { type: "getSpawn" };
  }

  getEssence() {
    this.snake = this.getSnake();
    this.snakeWidth = this.snake.snakeHead._snakeWidth;
    this.snakePartWidth = this.snake.snakeHead._snakePartWidth;
    console.log(this.snake);

    this.wall = this.getWalls();
    this.food = this.getFood();
    this.spawn = this.getSpawnController();
  }

  snakeAndWalls() {
    const { snake, wall } = this;
    this.headVectors = snake.snakeHead.getWorldPosDots();
    if (snake.snakeBody === null || wall === null) return;
    this.areaWidth = wall.wallHor.wallWidth / 2;
    this.areaHeight = wall.wallVert.wallWidth / 2;
    this.headVector = this.headVectors[0];
    if (
      this.areaWidth <= this.headVector.x ||
      this.headVector.x <= -this.areaWidth ||
      this.areaHeight <= this.headVector.z ||
      this.headVector.z <= -this.areaHeight
    ) {
      return true;
    }
    return false;
  }

  snakeAndFood() {
    const { snake, food } = this;
    this.headVectors = snake.snakeHead.getWorldPosDots();
    if (food.sphere.containsPoint(this.headVectors[0])) {
      return true;
    }
    return false;
  }

  snakeSelf() {
    const { snake } = this;
    if (snake.snakeHead.box.intersectsBox(snake.snakeBody[2].box)) {
      return true;
    }
    return false;
  }

  //getters
  getSnake() {
    this.eventBus.dispatchEvent(this.eventSnake);
    const {
      data: { snake },
    } = this.eventSnake;
    if (snake === undefined) return;
    return snake;
  }
  getWalls() {
    this.eventBus.dispatchEvent(this.eventWalls);
    const {
      data: { walls },
    } = this.eventWalls;
    if (walls === undefined) return;
    return walls;
  }
  getFood() {
    this.eventBus.dispatchEvent(this.eventFood);
    const {
      data: { food },
    } = this.eventFood;
    return food;
  }
  getSpawnController() {
    this.eventBus.dispatchEvent(this.eventSpawnController);
    const {
      data: { spawn },
    } = this.eventSpawnController;
    return spawn;
  }
}
