import * as THREE from "three";
import SnakeHead from "./SnakeHead";
import SnakeBody from "./SnakeBody";

export default class Snake {
  constructor(snakePartWidth, snakeWidth, snakeName, eventBus) {
    this._eventBus = eventBus;

    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this.geometry = new THREE.CapsuleGeometry(
      this._snakePartWidth,
      this._snakePartWidth,
      10,
      10
    );
    this.geometry.rotateX(Math.PI / 2);
    this.material = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.snakeBody = [];
    this.snake = [];
    this.name = snakeName;
    //this.geometry.translate(0, this._snakePartWidth * 1.5, 0);
  }

  drawSnake() {
    this.snakeHead = new SnakeHead(
      this.geometry,
      this.material,
      this._snakePartWidth,
      this.name,
      this._eventBus
    );
    this.head = this.snakeHead.draw();
    this.snakeBody = new SnakeBody(
      this.head,
      this._snakeWidth,
      this._snakePartWidth
    );
    this.body = this.snakeBody.draw();
    this.snake = [this.head, ...this.body];
    // this.snake = [this.head, ...this.snakeBody[0].draw()];
    return this.snake;
  }
}
