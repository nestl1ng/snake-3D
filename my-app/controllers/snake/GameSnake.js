"use client";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import SpawnController from "./SpawnController";
import { inputController } from "../InputController/InputController";
import CollisionController from "../snake/CollisionController";
import { KeyBoard } from "../InputController/plugins/KeyBoard";

export default class GameSnake {
  static get instance() {
    if (!this._instance) {
      this._instance = new GameSnake();
    }
    return this._instance;
  }

  static _instance = null;

  constructor() {
    //Level Options
    this.fov = 100;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 100;
    this.areaWidth = 40;
    this.areaHeight = 30;
    this.boxDepth = 1;
    this.inputController = inputController;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.addMeshAndFood = this.addMeshAndFood.bind(this);
    this.renderScene = this.renderScene.bind(this);

    //Essences Options
    this.snakeWidth = 3;
    this.snakePartWidth = 0.5;
    this.wallHeight = 2;
    this.foodWidth = 0.5;
    this.foodHeight = 0.1;
    this.snakeCam = false;
    this.snakeName = "Snake";
    this.wallName = "Wall";
    this.foodName = "Food";

    //Events
    this.eventSnake = { type: "getSnake" };
    this.eventWalls = { type: "getWalls" };
    this.eventFood = { type: "getFood" };

    //Rotation
    this.speed = 10;
    this.rotateAngle = Math.PI *1.2;
    this.step;
  }

  webGLRenderer() {
    return (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
  }

  initializationAction() {
    this.eventBus = new THREE.EventDispatcher();

    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
    this.cameraOffset = new THREE.Vector3(0, 10, 7);

    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.scene.background = new THREE.Color(0xcccccc);

    this.light = new THREE.DirectionalLight(0xffffff, 1.5);
    this.light2 = this.light.clone();
    this.light3 = this.light.clone();

    this.groundGeometry = new THREE.PlaneGeometry(
      this.areaWidth,
      this.areaHeight
    );
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x42d4f5,
      side: THREE.DoubleSide,
    });
    this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);

    this.clock = new THREE.Clock();

    //Controllers
    this.spawnController = new SpawnController({
      eventBus: this.eventBus,
      container: this.scene,
      camera: this.camera,
      snakeCam: this.snakeCam,
    });
    this.collisionController = new CollisionController({
      eventBus: this.eventBus,
      container: this.scene,
    });
    this.keyBoard = new KeyBoard();
  }

  initLevelAction() {
    const { spawnController, inputController } = this;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.lightsSet();
    this.scene.add(this.ground, this.light, this.light2, this.light3);
    this.renderer.render(this.scene, this.camera);
    this.ground.rotateX(Math.PI / 2);
    if (!this.snakeCam) {
      this.camera.position.set(0, 5, 5);
      this.camera.position.add(this.cameraOffset);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    //Controllers
    spawnController.wallsSpawn(
      this.areaWidth,
      this.areaHeight,
      this.wallHeight,
      this.wallName
    );
    spawnController.snakeSpawn(
      this.snakePartWidth,
      this.snakeWidth,
      this.snakeName
    );

    spawnController.foodSpawn(
      this.foodWidth,
      this.foodHeight,
      this.foodName,
      this.areaWidth,
      this.areaHeight
    );

    //Get Essence
    this.snake = this.getSnake();
    this.food = this.getFood();
    this.walls = this.getWalls();

    this.snakeHead = this.snake.snakeHead.mesh;

    inputController.pluginsAdd(this.keyBoard);
    inputController.attach(this.snakeHead, false);
  }

  playingAction() {
    window.addEventListener("resize", this.onWindowResize);
    this.collisionListeners();
    this.renderScene();
  }

  //Additional
  collisionListeners() {
    //walls
    this.eventBus.addEventListener(this.wallName, this.restartGame);
    //snake self
    this.eventBus.addEventListener(this.snakeName, this.restartGame);
    //food
    this.eventBus.addEventListener(this.foodName, this.addMeshAndFood);
  }

  lightsSet() {
    this.light.position.set(0, this.areaHeight / 2, -this.areaWidth / 2);
    this.light2.position.set(
      this.areaWidth / 4,
      this.areaHeight / 2,
      this.areaWidth / 2
    );
    this.light3.position.set(
      -this.areaWidth / 4,
      this.areaHeight / 2,
      this.areaWidth / 2
    );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  renderScene() {
    window.requestAnimationFrame(this.renderScene);
    // this._tick = (this._tick ?? 0) + 1;
    // if (this._tick % 10) return;

    this.delta = this.clock.getDelta();

    this.collisionController.update();
    this.snakeMove();
    this.renderer.render(this.scene, this.camera);
    if (!this.snakeCam) {
      this.controls.update();
    }
  }

  snakeMove() {
    const { snake, food, inputController } = this;
    if (inputController.isActionActive("up")) {
      this.bodyToHead();
    }
    if (inputController.isActionActive("left")) {
      snake.snakeHead.mesh.rotation.y -= this.rotateAngle * this.delta;
    }
    if (inputController.isActionActive("right")) {
      snake.snakeHead.mesh.rotation.y += this.rotateAngle * this.delta;
    }
    if (food.mesh === undefined) return;
    food.mesh.rotation.y -= this.rotateAngle * this.delta;
  }

  addMeshAndFood() {
    const { snake, spawnController } = this;
    this.randomFoodPos();
    const pos = this.moveToMesh(
      new THREE.Vector3(),
      snake.snakeBody[snake.snakeBody.length - 1]
    );
    spawnController.addBody(pos);
  }

  restartGame() {
    const { snake, spawnController } = this;
    snake.snakeHead.mesh.rotation.y = 0;
    snake.snakeHead.mesh.position.set(0, this.snakePartWidth, 0);
    for (let i = 0; i < this.snakeWidth - 1; i++) {
      snake.snakeBody[i].mesh.rotation.set(Math.PI, 0, Math.PI);
      snake.snakeBody[i].mesh.position.set(
        0,
        this.snakePartWidth,
        snake.snakeHead._snakePartWidth * 3 * (i + 1)
      );
    }
    for (let i = snake.snakeBody.length - 1; i > this.snakeWidth - 2; i--) {
      spawnController.deleteBody(snake.snakeBody[i].mesh);
    }
  }

  randomFoodPos() {
    const { food } = this;
    food.mesh.position.set(
      food.getRandomNum(
        -this.areaWidth / 2 + food._foodWidth * 3,
        this.areaWidth / 2 - food._foodWidth * 3
      ),
      this.snakePartWidth + food._foodHeight,
      food.getRandomNum(
        -this.areaHeight / 2 + food._foodWidth * 3,
        this.areaHeight / 2 - food._foodWidth * 3
      )
    );
  }

  bodyToHead() {
    const { snake } = this;
    snake.snakeHead.mesh.translateZ(this.speed * this.delta);
    //Head Follow
    snake.snakeBody[0].mesh.lookAt(snake.snakeHead.getWrldUpDownDots()[1]);
    const pos = this.moveToMesh(snake.snakeBody[0], snake.snakeHead);
    snake.snakeBody[0].mesh.position.set(pos.x, pos.y, pos.z);
    //Body Follow/Move
    for (let i = 0; i < snake.snakeBody.length - 1; i++) {
      snake.snakeBody[i + 1].mesh.lookAt(
        snake.snakeBody[i].getWrldUpDownDots()[1]
      );
      const bodyPos = this.moveToMesh(
        snake.snakeBody[i + 1],
        snake.snakeBody[i]
      );
      snake.snakeBody[i + 1].mesh.position.set(bodyPos.x, bodyPos.y, bodyPos.z);
    }
  }

  moveToMesh(start, end) {
    let pos;
    if (start.isVector3) {
      pos = new THREE.Vector3(
        end.getWrldUpDownDots()[1].x -
          end.getWrldUpDownDots()[0].x +
          end.getWrldUpDownDots()[1].x,
        this.snakePartWidth,
        end.getWrldUpDownDots()[1].z -
          end.getWrldUpDownDots()[0].z +
          end.getWrldUpDownDots()[1].z
      );
    } else {
      const newVect = new THREE.Vector3(
        start.getWrldUpDownDots()[1].x - start.getWrldUpDownDots()[0].x,
        0,
        start.getWrldUpDownDots()[1].z - start.getWrldUpDownDots()[0].z
      );
      pos = new THREE.Vector3(
        newVect.x + end.getWrldUpDownDots()[1].x,
        this.snakePartWidth,
        newVect.z + end.getWrldUpDownDots()[1].z
      );
    }
    return pos;
  }

  //getters
  getSnake() {
    this.eventBus.dispatchEvent(this.eventSnake);
    const {
      data: { snake },
    } = this.eventSnake;
    if (snake === undefined) return;
    return snake;
  }
  getWalls() {
    this.eventBus.dispatchEvent(this.eventWalls);
    const {
      data: { walls },
    } = this.eventWalls;
    if (walls === undefined) return;
    return walls;
  }
  getFood() {
    this.eventBus.dispatchEvent(this.eventFood);
    const {
      data: { food },
    } = this.eventFood;
    return food;
  }
}
