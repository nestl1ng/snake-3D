import * as THREE from "three";

export default class SnakeBody {
  constructor(head, _snakeWidth, _snakePartWidth) {
    this.head = head;
    this._snakeWidth = _snakeWidth;
    this._snakePartWidth = _snakePartWidth;
    this.mesh = [];
  }

  draw() {
    this.addBody(this.head);
    if (this._snakeWidth > 2) {
      for (let i = 1; i < this._snakeWidth - 1; i++) {
        this.addBody(this.mesh[i - 1]);
      }
    }
    return this.mesh;
  }

  addBody(prop) {
    this.capsule = this.head.clone();
    this.capsule.name = "Body";
    this.capsule.position.z = this._snakePartWidth * 3 + prop.position.z;
    this.mesh.push(this.capsule);
  }
}
