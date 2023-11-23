import Wall from "../../components/essence/Wall";
import SnakeHead from "../../components/essence/snake/SnakeHead";
import Food from "../../components/essence/Food";
import SnakeBody from "../../components/essence/snake/SnakeBody";

export default class SpawnController {
  constructor({ container, eventBus, camera, snakeCam }) {
    this._container = container;
    this._eventBus = eventBus;
    this._camera = camera;
    this._snakeCam = snakeCam;
    this.count = 4;
    this.wallsMeshes = [];
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
      this.wallMesh = this.wallHor.drawWall();
      this.dispatchDots(
        wallName,
        this.wallHor._wallName,
        "target",
        this.wallHor.wallsDots
      );
      this.wallsMeshes.push(this.wallMesh);
    }
    for (let i = 0; i < 2; i++) {
      this.wallVert = new Wall(
        areaHeight,
        wallHeight,
        wallName + "Vert",
        this._eventBus,
        i + 1
      );
      this.wallMesh = this.wallVert.drawWall();
      this.dispatchDots(
        wallName,
        this.wallVert._wallName,
        "target",
        this.wallVert.wallsDots
      );
      this.wallsMeshes.push(this.wallMesh);
    }

    this.wallsMeshes[0].position.set(0, 0, -areaHeight / 2);
    this.wallsMeshes[1].position.set(0, 0, areaHeight / 2);

    this.wallsMeshes[1].rotateY(-Math.PI);

    this.wallsMeshes[2].rotateY(-Math.PI / 2);
    this.wallsMeshes[3].rotateY(Math.PI / 2);

    this.wallsMeshes[2].position.set(areaWidth / 2, 0, 0);
    this.wallsMeshes[3].position.set(-areaWidth / 2, 0, 0);
    _container?.add(...this.wallsMeshes);
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
    this.dispatchDots(
      foodName,
      this.food._foodName,
      "target",
      this.food.foodDots
    );
    _container?.add(this.foodMesh);
  }

  makeHead(snakePartWidth, snakeWidth, snakeName) {
    this.snakeHead = new SnakeHead(
      snakePartWidth,
      snakeName,
      this._eventBus,
      snakeWidth,
      this._camera,
      this._snakeCam
    );
    this.snake["snakeHead"] = this.snakeHead;
    this.snakeHeadMesh = this.snakeHead.draw();
    this.dispatchDots(
      snakeName,
      this.snakeHead._name,
      "mainTarget",
      this.snakeHead.snakeSquareDots
    );
    this.snakeMeshs.push(this.snakeHeadMesh);
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
      this.snakePartMesh = this.snakePart.draw();
      this.dispatchDots(
        snakeName,
        this.snakePart._name,
        "target",
        this.snakePart.snakeSquareDots
      );
      this.snakeMeshs.push(this.snakePartMesh);
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
      this.snakeBody.length + 1,
      pos
    );
    this.snakeBody.push(this.snakePart);
    this.snakePartMesh = this.snakePart.draw();
    this.dispatchDots(
      this._snakeName,
      this.snakePart._name,
      "target",
      this.snakePart.snakeSquareDots
    );
    this.snakeMeshs.push(this.snakePartMesh);
    this.snake["snakeBody"] = this.snakeBody;
    _container?.add(this.snakePartMesh);
  }

  deleteBody(mesh) {
    const { _container } = this;
    this.deleteDispatchDots("target", mesh.name);
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
      walls: [
        this.wallsMeshes[0],
        this.wallsMeshes[1],
        this.wallsMeshes[3],
        this.wallsMeshes[4],
      ],
    };
  }
  onGetFood(e) {
    e.data = { food: this.food };
  }

  dispatchDots(collisionType, name, group, data) {
    const dispatch = {
      type: "collision:created",
      data: {
        collisionType: collisionType,
        group: group,
        name: name,
        data: data,
      },
    };
    this._eventBus.dispatchEvent(dispatch);
  }
  deleteDispatchDots(group, name) {
    const dispatch = {
      type: "collision:delete",
      data: {
        group: group,
        name: name,
      },
    };
    this._eventBus.dispatchEvent(dispatch);
  }
}
