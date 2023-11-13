import * as THREE from "three";

export default class Wall {
  constructor(wallWidth, wallHeight,wallName) {
    this.wallWidth = wallWidth;
    this.wallHeight = wallHeight;
    this.wallShape = new THREE.Shape();
    this.color = 0x4d5bd6;
    this.wallName = wallName;
  }

  drawWall() {
    this.wallShape.moveTo(-this.wallWidth / 2, 0);
    this.wallShape.lineTo(this.wallWidth / 2, 0);
    this.wallShape.lineTo(this.wallWidth / 2, this.wallHeight);
    this.wallShape.lineTo(-this.wallWidth / 2, this.wallHeight);
    this.wallShape.lineTo(-this.wallWidth / 2, 0);
    this.wallGeometry = new THREE.ExtrudeGeometry([this.wallShape], {
      steps: 1,
      depth: 0.2,
      bevelEnabled: false,
      curveSegments: 32,
    });
    this.wall = new THREE.Mesh(
      this.wallGeometry,
      new THREE.MeshStandardMaterial({ color: this.color })
    );
    this.wall.name = this.wallName;
    return this.wall;
  }
}
