import * as THREE from "three";

export default class SnakeHead {
  constructor(geometry, material, snakePartWidth, name, eventBus) {
    this._eventBus = eventBus;
    this.geometry = geometry;
    this.material = material;
    this._snakePartWidth = snakePartWidth;
    this.name = name;
    this.mesh;

    this.onGetPoints = this.onGetPoints.bind(this);
    this._eventBus.addEventListener("getPoints", this.onGetPoints);
  }

  draw() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateX(Math.PI);
    this.mesh.name = this.name + "Head";
    this.mesh.position.y += this._snakePartWidth;
    this.mesh?.add(...this.makeDots());
    return this.mesh;
  }

  makeDots() {
    this.geometryDot = new THREE.CapsuleGeometry(0.05, 0.05, 5, 5);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotUp";
    this.dotDown = this.dotUp.clone();
    this.dotDown.name = "DotDown";
    this.dotDown.position.set(0, 0, -this._snakePartWidth * 1.5);
    this.dotUp.position.set(0, 0, this._snakePartWidth * 1.5);
    this.snakeDots = [this.dotUp, this.dotDown];
    return this.snakeDots;
  }

  onGetPoints(e) {
    e.data = { points: this.dots };
  }
}
