import Wall from "../../components/essence/Wall";
import SnakeHead from "../../components/essence/snake/SnakeHead";
import Food from "../../components/essence/Food";
import SnakeBody from "../../components/essence/snake/SnakeBody";

export default class SpawnController {
  constructor({ container, eventBus, camera }) {
    this._container = container;
    this._eventBus = eventBus;
    this._camera = camera;
    this.count = 4;
    this.wallsHor = [];
    this.wallsVert = [];
    this.onGetSnake = this.onGetSnake.bind(this);
    this.onGetWalls = this.onGetWalls.bind(this);
    this.onGetFood = this.onGetFood.bind(this);

    this._eventBus.addEventListener("getSnake", this.onGetSnake);
    this._eventBus.addEventListener("getWalls", this.onGetWalls);
    this._eventBus.addEventListener("getFood", this.onGetFood);
  }

  wallsSpawn(areaWidth, areaHeight, wallHeight, wallName) {
    const { _container } = this;
    for (let i = 0; i < 2; i++) {
      this.wallHor = new Wall(
        areaWidth,
        wallHeight,
        wallName + "Hor",
        this._eventBus,
        i + 1
      );
      this.wallsHor.push(this.wallHor);
    }
    for (let i = 0; i < 2; i++) {
      this.wallVert = new Wall(
        areaHeight,
        wallHeight,
        wallName + "Vert",
        this._eventBus,
        i + 1
      );
      this.wallsVert.push(this.wallVert);
    }

    this.wallA = this.wallsHor[0].drawWall();
    this.wallB = this.wallsHor[1].drawWall();

    this.wallC = this.wallsVert[0].drawWall();
    this.wallD = this.wallsVert[1].drawWall();

    this.wallA.position.set(0, 0, -areaHeight / 2);
    this.wallB.position.set(0, 0, areaHeight / 2);

    this.wallB.rotateY(-Math.PI);

    this.wallC.rotateY(-Math.PI / 2);
    this.wallD.rotateY(Math.PI / 2);
    this.wallC.position.set(areaWidth / 2, 0, 0);
    this.wallD.position.set(-areaWidth / 2, 0, 0);

    _container?.add(this.wallA, this.wallB, this.wallC, this.wallD);
  }

  snakeSpawn(snakePartWidth, snakeWidth, snakeName) {
    const { _container } = this;
    this._snakePartWidth = snakePartWidth;
    this._snakeWidth = snakeWidth;
    this._snakeName = snakeName;

    if (snakeWidth < 1) return;

    this.snakeMeshs = [];
    this.snake = {};
    this.snakeBody = [];
    this.makeHead(snakePartWidth, snakeWidth, snakeName);
    this.makeBody(snakePartWidth, snakeWidth, snakeName);
    _container?.add(...this.snakeMeshs);
  }

  foodSpawn(foodWidth, foodHeight, foodName, areaWidth, areaHeight) {
    const { _container } = this;
    this.food = new Food(foodWidth, foodHeight, foodName, this._eventBus);
    this.foodMesh = this.food.drawFood(areaWidth, areaHeight);
    _container?.add(this.foodMesh);
  }

  makeHead(snakePartWidth, snakeWidth, snakeName) {
    this.snakeHead = new SnakeHead(
      snakePartWidth,
      snakeName,
      this._eventBus,
      snakeWidth,
      this._camera
    );
    this.snake["snakeHead"] = this.snakeHead;
    this.snakeHead = this.snakeHead.draw();
    this.snakeMeshs.push(this.snakeHead);
  }

  makeBody(snakePartWidth, snakeWidth, snakeName) {
    for (let i = 1; i < snakeWidth; i++) {
      this.snakePart = new SnakeBody(
        snakePartWidth,
        snakeName,
        this._eventBus,
        snakeWidth,
        i
      );
      this.snakeBody.push(this.snakePart);
      this.snakePart = this.snakePart.draw();
      this.snakeMeshs.push(this.snakePart);
    }
    this.snake["snakeBody"] = this.snakeBody;
  }

  addBody(pos) {
    const { _container } = this;
    this.snakePart = new SnakeBody(
      this._snakePartWidth,
      this._snakeName,
      this._eventBus,
      this._snakeWidth,
      pos
    );
    this.snakeBody.push(this.snakePart);
    this.snakePart = this.snakePart.draw();
    this.snakeMeshs.push(this.snakePart);
    this.snake["snakeBody"] = this.snakeBody;
    _container?.add(this.snakePart);
  }

  deleteBody(mesh) {
    const { _container } = this;
    _container?.remove(mesh);
    this.snakeBody.pop();
    this.snakeMeshs.pop();
    this.snake["snakeBody"] = this.snakeBody;
  }

  onGetSnake(e) {
    e.data = { snake: this.snake };
  }
  onGetWalls(e) {
    e.data = {
      walls: [this.wallHor, this.wallHor2, this.wallVert, this.wallVert2],
    };
  }
  onGetFood(e) {
    e.data = { food: this.food };
  }
}
