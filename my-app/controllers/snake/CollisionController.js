import * as THREE from "three";
import Snake from "../../components/essence/Snake";

export default class CollisionController {
  constructor(container, foodWidth) {
    this._container = container;
    this._foodWidth = foodWidth;
    this.headVector = new THREE.Vector3(0, 0, 0);
    this.snakeMesh = null;
    this.walls = null;
    this.food = null;
    this.snakeTail = [];

    this.foodVector = new THREE.Vector3(0, 0, 0);
  }

  setSnake(snakeName, snakeWidth, snakePartWidth, snakeMesh) {
    this.snakeName = snakeName;
    this.snakeMesh = snakeMesh;
    this.headSnake = this.snakeMesh[0];
    this.snakeWidth = snakeWidth;
    this.snakePartWidth = snakePartWidth;
    this.newSnake = new Snake(
      this.snakePartWidth,
      this.snakeWidth,
      this.snakeName
    );
  }

  setWall(wallName, areaWidth, areaHeight) {
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
  }

  snakeAndWalls() {
    if (this.snakeMesh === null || this.walls === null) return;
    this.headSnake.children[0].getWorldPosition(this.headVector);
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
    if (this.snakeMesh === null || this.food === null || this.walls === null)
      return;
    this.food[0].getWorldPosition(this.foodVector);
    if (
      this.headVector.z > this.foodVector.z - this._foodWidth / 2 &&
      this.headVector.z < this.foodVector.z + this._foodWidth / 2 &&
      this.headVector.x > this.foodVector.x - this._foodWidth / 2 &&
      this.headVector.x < this.foodVector.x + this._foodWidth / 2
    ) {
      this.randomFood();
      this.partSnake = this.newSnake.drawHead();
      this._container.add(this.partSnake);
      this.snakeMesh = this._container.children.filter(
        (val) => val.name === this.snakeName
      );
    }
  }

  restart() {
    this.headSnake.position.set(0, 0.5, 0);
    this.headSnake.rotation.y = 0;
    for (let i = 1; i < this.snakeWidth; i++) {
      this.snakeMesh[i].position.set(
        0,
        0.5,
        this.snakePartWidth * 3 + this.snakeMesh[i - 1].position.z
      );
      this.snakeMesh[i].rotation.y = 0;
    }
    if (this.snakeWidth < 3) return;
    for (let i = this.snakeWidth; i < this.snakeMesh.length; i++) {
      this._container?.remove(this.snakeMesh[i]);
    }
  }

  randomFood() {
    this.food[0].position.set(
      this.getRandomNum(
        -this.areaWidth + this._foodWidth * 3,
        this.areaWidth - this._foodWidth * 3
      ),
      0.6,
      this.getRandomNum(
        -this.areaHeight + this._foodWidth * 3,
        this.areaHeight - this._foodWidth * 3
      )
    );
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
}
