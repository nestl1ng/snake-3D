import Snake from "./Snake";

export default class SnakeBody extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth, count, pos) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name + "Body" + count;
    this._eventBus = eventBus;

    this._snakeWidth = snakeWidth;
    this._count = count;
    this.mesh;
    this._pos = pos;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    if (this._pos !== undefined) {
      this.mesh.position.set(this._pos.x, this._pos.y, this._pos.z);
    } else {
      this.mesh.position.y += this._snakePartWidth;
      this.mesh.position.z = this._snakePartWidth * 3 * this._count;
    }
    this.mesh.name = this._name;
    this.mesh?.add(...super.makeDots(), ...super.makeSquareDots());
    return this.mesh;
  }
}
