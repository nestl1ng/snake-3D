import * as THREE from "three";

export default class Snake {
  constructor(snakePartWidth, snakeWidth) {
    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this.geometry = new THREE.CapsuleGeometry(
      this._snakePartWidth,
      this._snakePartWidth,
      10,
      10
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.snake = [];
  }

  drawSnake() {
    this.capsule = new THREE.Mesh(this.geometry, this.material);
    this.capsule.position.y += this._snakePartWidth;
    this.capsule.rotateX(Math.PI / 2);
    this.snake.push(this.capsule);
    if (this._snakeWidth > 1) {
      for (let i = 1; i < this._snakeWidth; i++) {
        this.capsule = this.capsule.clone();
        this.snake.push(this.capsule);
        this.capsule.position.z =
          this._snakePartWidth * 2 + this.snake[i - 1].position.z;
      }
    }
    return this.snake;
  }
}
