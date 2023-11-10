import Wall from "../../components/essence/Wall";
import Snake from "../../components/essence/Snake";

export default class SpawnController {
  constructor(container) {
    this._container = container;
    this.snake = [];
  }

  wallsSpawn(areaWidth, areaHeight, wallHeight) {
    const { _container } = this;

    this.wallHor = new Wall(areaWidth, wallHeight);
    this.wallVert = new Wall(areaHeight, wallHeight);

    this.wallA = this.wallHor.drawWall();
    this.wallB = this.wallA.clone();

    this.wallC = this.wallVert.drawWall();
    this.wallD = this.wallC.clone();

    this.wallA.position.set(0, 0, -areaHeight / 2);
    this.wallB.position.set(0, 0, areaHeight / 2);

    this.wallC.rotateY(-Math.PI / 2);
    this.wallD.rotateY(Math.PI / 2);
    this.wallC.position.set(areaWidth / 2, 0, 0);
    this.wallD.position.set(-areaWidth / 2, 0, 0);

    _container?.add(this.wallA, this.wallB, this.wallC, this.wallD);
  }

  snakeSpawn(snakePartWidth, snakeWidth, snakeName) {
    const { _container } = this;
    if (snakeWidth < 1) return;
    this.snake = new Snake(snakePartWidth, snakeWidth, snakeName);
    this.snakeHead = this.snake.drawHead();
    this.snakeBody = this.snake.drawBody();
    _container?.add(this.snakeHead,...this.snakeBody);
  }


}
