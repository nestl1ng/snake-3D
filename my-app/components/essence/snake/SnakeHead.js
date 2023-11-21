import Snake from "./Snake";
import * as THREE from "three";

export default class SnakeHead extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;

    this._snakeWidth = snakeWidth;
    this.mesh;
    this.fov = 100;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 100;
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name += "Head";
    this.mesh.position.y += this._snakePartWidth;
    this.camera.position.set(0, 10, 7);
    this.mesh?.add(...super.makeDots(), ...super.makeSquareDots(), this.camera);
    this.areaSquare = super.areaSquare(super.getWorldPosSquareDots());
    this.worldPosDots = super.getWorldPosDots();
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }
}
