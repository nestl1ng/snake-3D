import * as THREE from "three";

export default class CollisionController {
  constructor({ eventBus, container, foodWidth }) {
    this._container = container;
    this._foodWidth = foodWidth;
    this.headVector = new THREE.Vector3(0, 0, 0);

    this.snakeSpheres = [];
    this.foodVector = new THREE.Vector3(0, 0, 0);

    this.eventBus = eventBus;
    this.eventSnake = { type: "getSnake" };
    this.eventWalls = { type: "getWalls" };
    this.eventFood = { type: "getFood" };
    this.eventPoints = { type: "getPoints" };
  }

  allCollision() {
    //this.snakeAndWalls();
    //this.snakeAndFood();
    //this.snakeSelf();
  }

  getEssence() {
    this.snake = this.getSnake();
    this.wall = this.getWalls();
    this.food = this.getFood();
    this.points = this.getPoints();
    console.log(this.snake);
  }

  // setSnake() {
  //   this.snakeSpheres.push(
  //     new THREE.Sphere(snake.snakeBody[0].position, snake._snakePartWidth / 1.5)
  //   );
  // }

  setFood() {
    const { food } = this;
    if (food === undefined) return;
    this.foodWidth = food.geometry.parameters.radius * 3;
    this.foodName = food.name;
    this.foodSphere = new THREE.Sphere(food.position, this.foodWidth * 1.5);
  }

  snakeAndWalls() {
    const { snake, wall } = this;
    if (snake.snakeBody === null || this.walls === null) return;
    this.areaWidth = wall.wallHor.wallWidth / 2;
    this.areaHeight = wall.wallVert.wallWidth / 2;
    this.snakeDots[0].getWorldPosition(this.headVector);
    if (
      this.areaWidth <= this.headVector.x ||
      this.headVector.x <= -this.areaWidth ||
      this.areaHeight <= this.headVector.z ||
      this.headVector.z <= -this.areaHeight
    ) {
      this.restart();
    }
  }

  snakeAndFood() {
    // if (snake.snakeBody === null || this.food === null || this.walls === null)
    //   return;
    // this.food[0].getWorldPosition(this.foodVector);
    // if (
    //   this.headVector.z > this.foodVector.z - this._foodWidth / 2 &&
    //   this.headVector.z < this.foodVector.z + this._foodWidth / 2 &&
    //   this.headVector.x > this.foodVector.x - this._foodWidth / 2 &&
    //   this.headVector.x < this.foodVector.x + this._foodWidth / 2
    // ) {
    //   this.randomFood();
    //   this.addSnakePart();
    //   this.makeSnakeSpheres(snake.snakeBody.length);
    // }
  }

  snakeSelf() {
    // for (let i = 1; i < this.snakeSpheres.length; i++) {
    //   if (this.snakeSpheres[0].intersectsSphere(this.snakeSpheres[i])) {
    //     this.restart();
    //   }
    // }
  }

  restart() {
    const { snake } = this;
    snake.snakeHead.mesh.position.set(0, 0.5, 0);
    snake.snakeHead.mesh.rotation.y = 0;
    if (snake.snakeBody.length > 0) {
      snake.snakeBody[0].rotation.y = 0;
      snake.snakeBody[0].position.set(
        0,
        0.5,
        snake._snakePartWidth * 3 + snake.snakeHead.mesh.position.z
      );
      if (snake.snakeBody.length > 1) {
        for (let i = 1; i < snake._snakeWidth - 1; i++) {
          snake.snakeBody[i].rotation.y = 0;
          snake.snakeBody[i].position.set(
            0,
            0.5,
            snake._snakePartWidth * 3 + snake.snakeBody[i - 1].position.z
          );
          snake.snakeBody[i].rotation.y = 0;
        }
      }
    }
    if (snake._snakeWidth < 3) return;
    for (let i = snake._snakeWidth; i < snake.snakeBody.length; i++) {
      this._container?.remove(snake.snakeBody[i]);
    }
    // this.popMass(snake._snakeWidth, snake.snakeBody);
    // this.popMass(snake._snakeWidth, this.snakeSpheres);
  }

  randomFood() {
    // this.food[0].position.set(
    //   this.getRandomNum(
    //     -this.areaWidth + this._foodWidth * 3,
    //     this.areaWidth - this._foodWidth * 3
    //   ),
    //   0.6,
    //   this.getRandomNum(
    //     -this.areaHeight + this._foodWidth * 3,
    //     this.areaHeight - this._foodWidth * 3
    //   )
    // );
    // for (let i = 0; i < this.snakeSpheres.length; i++) {
    //   if (this.foodSphere.intersectsSphere(this.snakeSpheres[i])) {
    //     this.randomFood();
    //   }
    // }
  }

  addSnakePart() {
    // this.partSnake = this.newSnake.drawHead();
    // this.partX =
    //   snake.snakeBody[snake.snakeBody.length - 1].position.x -
    //   snake.snakeBody[snake.snakeBody.length - 2].position.x +
    //   snake.snakeBody[snake.snakeBody.length - 1].position.x;
    // this.partZ =
    //   snake.snakeBody[snake.snakeBody.length - 1].position.z -
    //   snake.snakeBody[snake.snakeBody.length - 2].position.z +
    //   snake.snakeBody[snake.snakeBody.length - 1].position.z;
    // this.partSnake.position.set(this.partX, 0.5, this.partZ);
    // this._container.add(this.partSnake);
    // snake.snakeBody = this._container.children.filter(
    //   (val) => val.name === snake.name
    // );
  }

  getRandomNum(min, max) {
    let rand;
    if (max) {
      rand = Math.random() * (max - min) + min;
    } else {
      rand = Math.random() * min;
    }
    return +rand.toFixed(2);
  }

  makeSnakeSpheres(n) {
    // while (this.snakeSpheres.length < n) {
    //   this.snakeSpheres.push(
    //     new THREE.Sphere(
    //       snake.snakeBody[this.snakeSpheres.length].position,
    //      snake._snakePartWidth / 1.5
    //     )
    //   );
    // }
  }

  popMass(n, mass) {
    // while (mass.length > n) {
    //   mass.pop();
    // }
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
  getPoints() {
    this.eventBus.dispatchEvent(this.eventPoints);
    const {
      data: { points },
    } = this.eventPoints;
    return points;
  }
  //
}
