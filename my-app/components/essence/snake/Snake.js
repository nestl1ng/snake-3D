import * as THREE from "three";

export default class Snake {
  constructor(snakePartWidth, snakeName, eventBus, snakeWidth) {
    this._eventBus = eventBus;

    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this._name = snakeName;
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
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name = this._name;
    return this.mesh;
  }

  makeDots() {
    this.geometryDot = new THREE.CapsuleGeometry(0.04, 0.04, 10, 10);
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

  makeSquareDots() {
    this.snakeSquareDots = [];
    for (let i = 0; i < 4; i++) {
      this.squareDot = this.dotUp.clone();
      this.squareDot.name = "squareDot";
      this.snakeSquareDots.push(this.squareDot);
    }
    this.snakeSquareDots[0].position.set(
      -this._snakePartWidth,
      0,
      this._snakePartWidth * 3
    );
    this.snakeSquareDots[1].position.set(
      this._snakePartWidth,
      0,
      this._snakePartWidth * 3
    );
    this.snakeSquareDots[2].position.set(
      -this._snakePartWidth,
      0,
      this._snakePartWidth
    );
    this.snakeSquareDots[3].position.set(
      this._snakePartWidth,
      0,
      this._snakePartWidth
    );
    return this.snakeSquareDots;
  }

  getWorldPosSquareDots() {
    this.squarePoint = new THREE.Vector3();
    this.squarePoints = [];
    for (let i = 0; i < 4; i++) {
      this.snakeSquareDots[i].getWorldPosition(this.squarePoint);
      this.squarePoints.push(this.squarePoint);
      this.squarePoint = new THREE.Vector3();
    }
    return this.squarePoints;
  }

  getWorldPosDots() {
    this.vect = new THREE.Vector3();
    this.vectors = [];
    for (let i = 0; i < 2; i++) {
      this.snakeDots[i].getWorldPosition(this.vect);
      this.vectors.push(this.vect);
      this.vect = new THREE.Vector3();
    }
    return this.vectors;
  }

  areaSquare(vectors) {
    const firstDist = vectors[0].distanceTo(vectors[1]);
    const SecondDist = vectors[1].distanceTo(vectors[2]);
    return firstDist * SecondDist;
  }
}
