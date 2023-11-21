import * as THREE from "three";

export default class Wall {
  constructor(wallWidth, wallHeight, wallName) {
    this.wallWidth = wallWidth;
    this.wallHeight = wallHeight;
    this.wallShape = new THREE.Shape();
    this.color = 0x4d5bd6;
    this.wallName = wallName;
    this.deph = 0.2;
  }

  drawWall() {
    this.wallShape.moveTo(-this.wallWidth / 2, 0);
    this.wallShape.lineTo(this.wallWidth / 2, 0);
    this.wallShape.lineTo(this.wallWidth / 2, this.wallHeight);
    this.wallShape.lineTo(-this.wallWidth / 2, this.wallHeight);
    this.wallShape.lineTo(-this.wallWidth / 2, 0);
    this.wallGeometry = new THREE.ExtrudeGeometry([this.wallShape], {
      steps: 1,
      depth: this.deph,
      bevelEnabled: false,
      curveSegments: 32,
    });
    this.wall = new THREE.Mesh(
      this.wallGeometry,
      new THREE.MeshStandardMaterial({ color: this.color })
    );
    this.wall.name = this.wallName;
    this.wall.add(...this.makeDots());
    return this.wall;
  }

  makeDots() {
    this.geometryDot = new THREE.CapsuleGeometry(0.2, 0.2, 10, 10);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotUp";
    this.dotDown = this.dotUp.clone();
    this.dotDown.name = "DotDown";
    this.dotUp.position.set(
      -this.wallWidth / 2 + this.deph,
      this.wallHeight / 2,
      this.deph
    );
    this.dotDown.position.set(
      this.wallWidth / 2 - this.deph,
      this.wallHeight / 2,
      this.deph
    );
    this.wallsDots = [this.dotUp, this.dotDown];
    return this.wallsDots;
  }

  getWorldPosDots() {
    this.vect = new THREE.Vector3();
    this.dots = [];
    for (let i = 0; i < this.wallsDots.length; i++) {
      this.wallsDots[i].getWorldPosition(this.vect);
      this.dots.push(this.vect);
      this.vect = new THREE.Vector3();
    }
    return this.dots;
  }
}
