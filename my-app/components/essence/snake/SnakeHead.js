import Snake from "./Snake";

export default class SnakeHead extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;

    this._snakeWidth = snakeWidth;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.geometry.computeBoundingBox();
    this.mesh.name += "Head";
    this.mesh.position.y += this._snakePartWidth;
    this.mesh?.add(...super.makeDots());
    super.makeBox3();
    this.worldPosDots = super.getWorldPosDots();
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }

}
