import * as THREE from "three";
import Snake from "../../components/essence/Snake";

export default class CollisionController {
  constructor({ eventBus, container, foodWidth }) {
    this._container = container;
    this._foodWidth = foodWidth;
    this.headVector = new THREE.Vector3(0, 0, 0);
    this.snakeBody = null;
    this.wall = null;
    this.food = null;
    this.snake = null;

    this.snakeSpheres = [];
    this.foodVector = new THREE.Vector3(0, 0, 0);

    this.eventBus = eventBus;
    this.eventSnake = { type: "getSnake" };
    this.eventWalls = { type: "getWalls" };
    this.eventFood = { type: "getFood" };
  }

  //
  getSnake() {
    this.eventBus.dispatchEvent(this.eventSnake);
    const {
      data: { snake },
    } = this.eventSnake;
    return snake;
  }
  getWalls() {
    this.eventBus.dispatchEvent(this.eventWalls);
    const {
      data: { walls },
    } = this.eventWalls;
    return walls;
  }
  getFood() {
    this.eventBus.dispatchEvent(this.eventFood);
    const {
      data: { food },
    } = this.eventFood;
    return food;
  }
  //

  setSnake() {
    this.snake = this.getSnake();
    const { snake } = this;

    this.snakeName = snake.name;
    this.snakeBody = snake.snakeBody;
    this.headSnake = snake.snakeHead;
    this.snakeWidth = snake._snakeWidth;
    this.snakePartWidth = snake._snakePartWidth;
    this.snakeSpheres.push(
      new THREE.Sphere(this.snakeBody[0].position, this.snakePartWidth / 1.5)
    );
  }

  setWall(wallName, areaWidth, areaHeight) {
    this.wall = this.getSnake();
    const { snake } = this;
    this.walls = this._container.children.filter(
      (val) => val.name === wallName
    );
    this.areaWidth = areaWidth / 2;
    this.areaHeight = areaHeight / 2;
  }

  setFood(foodWidth, foodName) {
    this.food = this._container.children.filter((val) => val.name === foodName);
    this._foodWidth = foodWidth * 3;
    this.foodName = foodName;
    this.foodSphere = new THREE.Sphere(this.food[0].position, foodWidth * 1.5);
  }

  allCollision() {
    this.snakeAndWalls();
    this.snakeAndFood();
    //this.snakeSelf();
  }

  snakeAndWalls() {
    // if (this.snakeBody === null || this.walls === null) return;
    // this.headSnake.children[0].getWorldPosition(this.headVector);
    // if (
    //   this.areaWidth <= this.headVector.x ||
    //   this.headVector.x <= -this.areaWidth ||
    //   this.areaHeight <= this.headVector.z ||
    //   this.headVector.z <= -this.areaHeight
    // ) {
    //   this.restart();
    // }
  }

  snakeAndFood() {
    // if (this.snakeBody === null || this.food === null || this.walls === null)
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
    //   this.makeSnakeSpheres(this.snakeBody.length);
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
    // this.headSnake.position.set(0, 0.5, 0);
    // this.headSnake.rotation.y = 0;
    // for (let i = 1; i < this.snakeWidth; i++) {
    //   this.snakeBody[i].position.set(
    //     0,
    //     0.5,
    //     this.snakePartWidth * 3 + this.snakeBody[i - 1].position.z
    //   );
    //   this.snakeBody[i].rotation.y = 0;
    // }
    // if (this.snakeWidth < 3) return;
    // for (let i = this.snakeWidth; i < this.snakeBody.length; i++) {
    //   this._container?.remove(this.snakeBody[i]);
    // }
    // this.popMass(this.snakeWidth, this.snakeBody);
    // this.popMass(this.snakeWidth, this.snakeSpheres);
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
    //   this.snakeBody[this.snakeBody.length - 1].position.x -
    //   this.snakeBody[this.snakeBody.length - 2].position.x +
    //   this.snakeBody[this.snakeBody.length - 1].position.x;
    // this.partZ =
    //   this.snakeBody[this.snakeBody.length - 1].position.z -
    //   this.snakeBody[this.snakeBody.length - 2].position.z +
    //   this.snakeBody[this.snakeBody.length - 1].position.z;
    // this.partSnake.position.set(this.partX, 0.5, this.partZ);
    // this._container.add(this.partSnake);
    // this.snakeBody = this._container.children.filter(
    //   (val) => val.name === this.snakeName
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
    //       this.snakeBody[this.snakeSpheres.length].position,
    //       this.snakePartWidth / 1.5
    //     )
    //   );
    // }
  }

  popMass(n, mass) {
    // while (mass.length > n) {
    //   mass.pop();
    // }
  }
}
