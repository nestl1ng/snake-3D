import * as THREE from "three";
// import SnakeHead from "./SnakeHead";

export default class Snake {
  constructor(snakePartWidth, snakeName, eventBus, snakeWidth) {
    this._eventBus = eventBus;

    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this.name = snakeName;
    this.vectUp = new THREE.Vector3();
    this.vectDown = new THREE.Vector3();
  }

  drawSnake() {
    this.geometry = new THREE.CapsuleGeometry(
      this._snakePartWidth,
      this._snakePartWidth,
      10,
      10
    );
    this.geometry.rotateX(Math.PI / 2);
    this.geometry.translate(0, 0, this._snakePartWidth * 1.5);
    this.material = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateX(Math.PI);
    this.mesh.name = this.name;
    return this.mesh;
  }

  makeDots() {
    this.geometryDot = new THREE.CapsuleGeometry(0.05, 0.05, 5, 5);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotUp";
    this.dotDown = this.dotUp.clone();
    this.dotDown.name = "DotDown";
    this.dotDown.position.set(0, 0, 0);
    this.dotUp.position.set(0, 0, this._snakePartWidth * 3);
    this.snakeDots = [this.dotUp, this.dotDown];
    return this.snakeDots;
  }

  getWorldPosDots() {
    this.snakeDots[0].getWorldPosition(this.vectUp);
    this.snakeDots[1].getWorldPosition(this.vectDown);
    return [this.vectUp, this.vectDown];
  }
}
