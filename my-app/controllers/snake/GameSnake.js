"use client";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import SpawnController from "./SpawnController";
import { inputController } from "../InputController/InputController";
import CollisionController from "../snake/CollisionController";
import { KeyBoard } from "../InputController/plugins/KeyBoard";
import { gsap } from "gsap/dist/gsap";

export default class GameSnake {
  static get instance() {
    if (!this._instance) {
      this._instance = new GameSnake();
    }
    return this._instance;
  }

  static _instance = null;

  constructor() {
    this.fov = 100;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 100;
    this.areaWidth = 40;
    this.areaHeight = 30;
    this.boxDepth = 1;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.isIntersected;
    this.inputController = inputController;
    this.snakeBody = [];
    this.snakeVect;

    //Options
    this.snakeWidth = 4;
    this.snakePartWidth = 0.5;
    this.wallHeight = 2;
    this.foodWidth = 0.5;
    this.foodHeight = 0.1;
    this.snakeName = "Snake";
    this.wallName = "Wall";
    this.foodName = "Food";

    //Rotation
    this.moveDistance = 0.12;
    this.rotateAngle = (3 * Math.PI) / 180;
    this.rotateAngle2 = (45 * Math.PI) / 180;
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

    //Controllers
    this.spawnController = new SpawnController({
      eventBus: this.eventBus,
      container: this.scene,
    });
    this.collisionController = new CollisionController({
      eventBus: this.eventBus,
      container: this.scene,
    });
    this.keyBoard = new KeyBoard();

    this.onGetSpawn = this.onGetSpawn.bind(this);
    this.eventBus.addEventListener("getSpawn", this.onGetSpawn);
  }

  initLevelAction() {
    const { collisionController, spawnController, inputController } = this;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.lightsSet();
    this.scene.add(this.ground, this.light, this.light2, this.light3);
    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 10, 10);
    this.ground.rotateX(Math.PI / 2);

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

    collisionController.getEssence();
    this.snake = collisionController.getSnake();
    this.food = collisionController.getFood();
    this.spawn = collisionController.getSpawnController();

    this.snakeHead = this.snake.snakeHead.mesh;
    this.snakeBox = this.snake.snakeHead.box;
    this.snakeBox2 = this.snake.snakeBody[2].box;
    this.helper = new THREE.Box3Helper(this.snakeBox, 0xffff00);
    this.helper2 = new THREE.Box3Helper(this.snakeBox2, 0xffff00);
    this.scene.add(this.helper, this.helper2);
    this.snakeHead.add(new THREE.AxesHelper(5));

    inputController.pluginsAdd(this.keyBoard);
    inputController.attach(this.snakeHead, false);
  }

  playingAction() {
    window.addEventListener("resize", this.onWindowResize);
    this.renderScene();
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
    window.requestAnimationFrame(this.renderScene.bind(this));
    this.controls.update();
    this.collisionsLogic();
    this.snakeMove();
    this.renderer.render(this.scene, this.camera);
  }

  snakeMove() {
    const { snake, food, inputController } = this;
    snake.snakeHead.makeBox3();
    snake.snakeBody[2].makeBox3();
    //snake.snakeHead.mesh.translateZ(this.moveDistance);
    snake.snakeBody[0].mesh.lookAt(snake.snakeHead.getWorldPosDots()[1]);
    const pos = this.moveToMesh(snake.snakeBody[0], snake.snakeHead);
    snake.snakeBody[0].mesh.position.set(pos.x, pos.y, pos.z);
    //bodyMove
    for (let i = 0; i < snake.snakeBody.length - 1; i++) {
      snake.snakeBody[i + 1].mesh.lookAt(
        snake.snakeBody[i].getWorldPosDots()[1]
      );
      const bodyPos = this.moveToMesh(
        snake.snakeBody[i + 1],
        snake.snakeBody[i]
      );
      snake.snakeBody[i + 1].mesh.position.set(bodyPos.x, bodyPos.y, bodyPos.z);
    }

    if (inputController.isActionActive("up")) {
      snake.snakeHead.mesh.translateZ(this.moveDistance);
    }
    if (inputController.isActionActive("left")) {
      gsap.set(snake.snakeHead.mesh.rotation, { y: `-=${this.rotateAngle}` });
    }
    if (inputController.isActionActive("right")) {
      gsap.set(snake.snakeHead.mesh.rotation, { y: `+=${this.rotateAngle}` });
    }
    if (food.mesh === undefined) return;
    gsap.set(food.mesh.rotation, { y: `-=${this.rotateAngle}` });
  }

  moveToMesh(start, end) {
    let newVect = new THREE.Vector3();
    if (start.isVector3) {
      newVect = new THREE.Vector3(0, 0, this.snakePartWidth * 3);
    } else {
      newVect = new THREE.Vector3(
        start.getWorldPosDots()[1].x - start.getWorldPosDots()[0].x,
        0,
        start.getWorldPosDots()[1].z - start.getWorldPosDots()[0].z
      );
    }
    const pos = new THREE.Vector3(
      newVect.x + end.getWorldPosDots()[1].x,
      this.snakePartWidth,
      newVect.z + end.getWorldPosDots()[1].z
    );
    return pos;
  }

  collisionsLogic() {
    const { collisionController, snake, spawn } = this;
    if (collisionController.snakeAndWalls()) {
      this.restartGame();
    }
    if (collisionController.snakeAndFood()) {
      this.randomFoodPos();
      const pos = this.moveToMesh(
        new THREE.Vector3(),
        snake.snakeBody[snake.snakeBody.length - 1]
      );
      spawn.addBody(pos);
    }
    if(collisionController.snakeSelf()){
      console.log("yes");
    }
  }

  restartGame() {
    const { snake, spawn } = this;
    snake.snakeHead.mesh.position.set(0, this.snakePartWidth, 0);
    snake.snakeHead.mesh.rotation.y = 0;
    if (snake.snakeBody.length > 0) {
      for (let i = 0; i < this.snakeWidth - 1; i++) {
        snake.snakeBody[i].mesh.rotation.y = 0;
        snake.snakeBody[i].mesh.position.set(
          0,
          this.snakePartWidth,
          snake.snakeHead._snakePartWidth * 3 * (i + 1)
        );
      }
      for (let i = snake.snakeBody.length - 1; i > this.snakeWidth - 2; i--) {
        spawn.deleteBody(snake.snakeBody[i].mesh);
      }
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

  onGetSpawn(e) {
    e.data = { spawn: this.spawnController };
  }
}
