import Snake from "./Snake";
export default class SnakeHead extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;

    this.dots;
    this._snakeWidth = snakeWidth;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.name += "Head";
    this.mesh.position.y += this._snakePartWidth;
    this.mesh.position.set(-1.5,0.5,-1.75);
    this.mesh?.add(...super.makeDots());
    this.worldPosDots = super.getWorldPosDots();
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }
}
