import Snake from "./Snake";

export default class SnakeBody extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth, count) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;

    this._snakeWidth = snakeWidth;
    this._count = count;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name += "Body";
    if (this._count.isVector3) {
      this.mesh.position.set(this._count.x, this._count.y, this._count.z);
    } else {
      this.mesh.position.y += this._snakePartWidth;
      this.mesh.position.z = this._snakePartWidth * 3 * this._count;
    }
    this.mesh?.add(...super.makeDots(), ...super.makeSquareDots());
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }
}
