export default class CollisionController {
  constructor({ eventBus, container }) {
    this._container = container;

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

    this.wall = this.getWalls();
    this.food = this.getFood();
    this.spawn = this.getSpawnController();
  }

  snakeAndWalls() {
    const { snake, wall } = this;
    this.snakeHeadSquareDots = snake.snakeHead.getWorldPosSquareDots();
    this.polHead = this.poligonMass(this.snakeHeadSquareDots);
    this.flag = [];
    for (let i = 0; i < wall.length; i++) {
      this.walls = wall[i].getWorldPosDots();
      this.polWall = this.poligonMass(this.walls);
      this.flag.push(this.poligonIntersection(this.polHead, this.polWall));
    }
    for (let i = 0; i < wall.length; i++) {
      if (this.flag[i]) return true;
    }
    return false;
  }

  snakeAndFood() {
    const { snake, food } = this;
    this.foodDots = food.getWorldPosDots();
    this.snakeHeadSquareDots = snake.snakeHead.getWorldPosSquareDots();
    this.polHead = this.poligonMass(this.snakeHeadSquareDots);
    this.polFood = this.poligonMass(this.foodDots);
    if (this.poligonIntersection(this.polHead, this.polFood)) {
      return true;
    }
    return false;
  }

  snakeSelf() {
    const { snake } = this;
    this.snakeHeadSquareDots = snake.snakeHead.getWorldPosSquareDots();
    this.polHead = this.poligonMass(this.snakeHeadSquareDots);
    this.flag = [];
    for (let i = 1; i < snake.snakeBody.length; i++) {
      this.bodys = snake.snakeBody[i].getWorldPosSquareDots();
      this.polBody = this.poligonMass(this.bodys);
      this.flag.push(this.poligonIntersection(this.polHead, this.polBody));
    }
    for (let i = 0; i < snake.snakeBody.length - 1; i++) {
      if (this.flag[i]) return true;
    }
    return false;
  }

  //poligons
  poligonMass(mass) {
    let polMass = [];
    for (let i = 0; i < mass.length; i++) {
      polMass.push({ x: mass[i].x, y: mass[i].z });
    }
    return polMass;
  }

  poligonIntersection(a, b) {
    let polygons = [a, b];
    let minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
      let polygon = polygons[i];
      for (i1 = 0; i1 < polygon.length; i1++) {
        let i2 = (i1 + 1) % polygon.length;
        let p1 = polygon[i1];
        let p2 = polygon[i2];
        let normal = { x: p2.y - p1.y, y: p1.x - p2.x };
        minA = maxA = undefined;
        for (j = 0; j < a.length; j++) {
          projected = normal.x * a[j].x + normal.y * a[j].y;
          if (minA === undefined || projected < minA) {
            minA = projected;
          }
          if (maxA === undefined || projected > maxA) {
            maxA = projected;
          }
        }
        minB = maxB = undefined;
        for (j = 0; j < b.length; j++) {
          projected = normal.x * b[j].x + normal.y * b[j].y;
          if (minB === undefined || projected < minB) {
            minB = projected;
          }
          if (maxB === undefined || projected > maxB) {
            maxB = projected;
          }
        }
        if (maxA < minB || maxB < minA) {
          return false;
        }
      }
    }
    return true;
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
