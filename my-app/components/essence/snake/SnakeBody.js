import Snake from "./Snake";

export default class SnakeBody extends Snake {
  constructor(snakePartWidth, name, eventBus, snakeWidth, count) {
    super(snakePartWidth, name, eventBus);
    this._snakePartWidth = snakePartWidth;
    this._name = name;
    this._eventBus = eventBus;

    this.dots;
    this._snakeWidth = snakeWidth;
    this._count = count;
    this.mesh;
  }

  draw() {
    this.mesh = super.drawSnake();
    this.mesh.name += "Body";
    this.mesh.position.y += this._snakePartWidth;
    this.mesh.position.z = this._snakePartWidth * 3 * this._count;
    //this.mesh.position.set(-2.25,0.5,-2.625);
    this.mesh?.add(...super.makeDots());
    return this.mesh;
  }

  getWorldPosDots() {
    this.worldPosDots = super.getWorldPosDots();
    return this.worldPosDots;
  }
}
