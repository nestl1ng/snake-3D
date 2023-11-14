import Wall from "../../components/essence/Wall";
import Snake from "../../components/essence/Snake";
import Food from "../../components/essence/Food";

export default class SpawnController {
  constructor({ container, eventBus }) {
    this._container = container;
    this.snake = [];
    this.onGetSnake = this.onGetSnake.bind(this);
    this.onGetWalls = this.onGetWalls.bind(this);
    this.onGetFood = this.onGetFood.bind(this);
    eventBus.addEventListener("getSnake", this.onGetSnake);
    eventBus.addEventListener("getWalls", this.onGetWalls);
    eventBus.addEventListener("getFood", this.onGetFood);
  }

  onGetSnake(e) {
    e.data = { snake: this.snake };
  }
  onGetWalls(e){
    e.data = { walls: {'wallHor': this.wallHor, 'wallVert': this.wallVert} };
  }
  onGetFood(e){
    e.data = { food: this.food };
  }

  wallsSpawn(areaWidth, areaHeight, wallHeight, wallName) {
    const { _container } = this;

    this.wallHor = new Wall(areaWidth, wallHeight, wallName);
    this.wallVert = new Wall(areaHeight, wallHeight, wallName);

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
    _container?.add(this.snakeHead, ...this.snakeBody);
  }

  foodSpawn(foodWidth, foodHeight, foodName, areaWidth, areaHeight) {
    const { _container } = this;
    this.food = new Food(foodWidth, foodHeight, foodName);
    this.food = this.food.drawFood(areaWidth, areaHeight);
    _container?.add(this.food);
  }
}
