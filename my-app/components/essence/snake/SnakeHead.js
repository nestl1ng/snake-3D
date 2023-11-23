import Snake from "./Snake";
import * as THREE from "three";

export default class SnakeHead extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth, camera, snakeCam) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name+"Head";
    this._eventBus = eventBus;
    this._camera = camera;
    this._snakeCam = snakeCam;
    this._cameraOffset = new THREE.Vector3(0, -10, -10);

    this._snakeWidth = snakeWidth;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name = this._name;
    this.mesh.position.y += this._snakePartWidth;
    this.mesh?.add(...super.makeDots(), ...super.makeSquareDots());
    if (this._snakeCam) this.cameraPos();
    this.worldPosDots = super.getWrldUpDownDots();
    return this.mesh;
  }


  cameraPos() {
    this._camera.position
      .copy(super.getWrldUpDownDots()[1])
      .add(this._cameraOffset);
    this._camera.lookAt(super.getWrldUpDownDots()[1]);
    this._camera.rotateZ(Math.PI);
    this.mesh?.add(this._camera);
  }

}
