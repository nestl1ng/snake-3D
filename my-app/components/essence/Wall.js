import * as THREE from "three";

export default class Wall {
  constructor(wallWidth, wallHeight) {
    this.wallWidth = wallWidth;
    this.wallHeight = wallHeight;
    this.WallShape = new THREE.Shape();
    this.color = 0xff9999;
  }

  drawWall() {
    this.WallShape.moveTo(-this.wallWidth / 2, 0);
    this.WallShape.lineTo(this.wallWidth / 2, 0);
    this.WallShape.lineTo(this.wallWidth / 2, this.wallHeight);
    this.WallShape.lineTo(-this.wallWidth / 2, this.wallHeight);
    this.WallShape.lineTo(-this.wallWidth / 2, 0);
    this.WallGeometry = new THREE.ExtrudeGeometry([this.WallShape], {
      steps: 1,
      depth: 0.2,
      bevelEnabled: false,
      curveSegments: 32,
    });
    this.Wall = new THREE.Mesh(
      this.WallGeometry,
      new THREE.MeshStandardMaterial({ color: this.color })
    );
    return this.Wall;
  }
}
