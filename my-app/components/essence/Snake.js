import * as THREE from "three";

export default class Snake {
  constructor(snakePartWidth, snakeWidth, snakeName) {
    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this.geometry = new THREE.CapsuleGeometry(
      this._snakePartWidth,
      this._snakePartWidth,
      10,
      10
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.snakeHead;
    this.snakeBody = [];
    this.name = snakeName;
    this.geometry.translate(0, this._snakePartWidth * 1.5, 0);
    this.geometry.rotateX(Math.PI / 2);
  }

  drawHead() {
    this.capsule = new THREE.Mesh(this.geometry, this.material);
    this.capsule.rotateX(Math.PI);
    this.makeDotsClutch(this.capsule, this._snakePartWidth);
    this.capsule.name = this.name + "Head";
    this.capsule.position.y += this._snakePartWidth;
    this.snakeHead = this.capsule;
    return this.snakeHead;
  }

  drawBody() {
    if (this._snakeWidth > 1) {
      for (let i = 1; i < this._snakeWidth; i++) {
        this.capsule = this.capsule.clone();
        this.capsule.name = this.name;
        this.snakeBody.push(this.capsule);
        this.capsule.position.z =
          this._snakePartWidth * 3 + this.snakeBody[i - 1].position.z;
      }
    }
    return this.snakeBody;
  }

  makeDotsClutch(obj, width) {
    this.geometryDot = new THREE.CapsuleGeometry(0.05, 0.05, 5, 5);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotClutch";
    this.dotDown = this.dotUp.clone();
    obj.add(this.dotUp, this.dotDown);
    this.dotDown.position.set(0, 0, 0);
    this.dotUp.position.set(0, 0, width * 1.5);
  }
}
