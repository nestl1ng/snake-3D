import Snake from "./Snake";
import * as THREE from "three";

export default class SnakeHead extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth, camera) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;
    this._camera = camera;
    this._cameraOffset = new THREE.Vector3(0, -10, -10);

    this._snakeWidth = snakeWidth;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name += "Head";
    this.mesh.position.y += this._snakePartWidth;
    this.mesh?.add(...super.makeDots(), ...super.makeSquareDots());
    //this.cameraPos();
    this.worldPosDots = super.getWorldPosDots();
    this.dispDots();
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }

  cameraPos() {
    this._camera.position
      .copy(this.getWorldPosDots()[1])
      .add(this._cameraOffset);
    this._camera.lookAt(this.getWorldPosDots()[1]);
    this._camera.rotateZ(Math.PI);
    this.mesh?.add(this._camera);
  }

  dispDots() {
    this.snakeHeadDisp = {
      type: "collision:created",
      data: {
        collisionType: "Dots",
        group: "target",
        name: this.mesh.name,
        data: super.getWorldPosSquareDots(),
      },
    };
    this._eventBus.dispatchEvent(this.snakeHeadDisp);
  }
}
