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
    this.areaWidth = 30;
    this.areaHeight = 18;
    this.boxDepth = 1;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.isIntersected;
    this.inputController = inputController;
    this.snakeBody = [];
    this.snakeVect;

    //Options
    this.snakeWidth = 3;
    this.snakePartWidth = 0.5;
    this.wallHeight = 2;
    this.foodWidth = 0.5;
    this.foodHeight = 0.1;
    this.snakeName = "Snake";
    this.wallName = "Wall";
    this.foodName = "Food";

    //Rotation
    this.moveDistance = 0.15;
    this.rotateAngle = (5 * Math.PI) / 180;
    this.rotateAngle2 = (45 * Math.PI) / 180;
    this.step;
    this.snakeVectors = [];
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
      foodWidth: this.foodWidth,
    });
    this.keyBoard = new KeyBoard();
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

    this.makeSnakeVectors(this.snakeWidth);

    collisionController.getEssence();
    this.snake = collisionController.getSnake();
    this.food = collisionController.getFood();
    this.snakeHead = this.snake.snakeHead.mesh;
    this.snakeBody = this.snake.snakeBody.map((val) => val.mesh);

    this.snakeHead.rotation.y = this.rotateAngle2;

    inputController.pluginsAdd(this.keyBoard);
    inputController.attach(this.snakeHead, false);

    this.snakeHead.add(new THREE.AxesHelper(5));
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
    this.snakeMove();
    this.collisionController.allCollision();
    this.renderer.render(this.scene, this.camera);
  }

  snakeMove() {
    const { snake, snakeHead, snakeBody, food, inputController } = this;
    snakeBody[0].lookAt(snake.snakeHead.getWorldPosDots()[1]);
    snakeBody[1].lookAt(snake.snakeBody[0].getWorldPosDots()[1]);
    const newVect1 = new THREE.Vector3(
      snake.snakeHead.getWorldPosDots()[0].x -
        snake.snakeHead.getWorldPosDots()[1].x,
      0.5,
      snake.snakeHead.getWorldPosDots()[0].z -
        snake.snakeHead.getWorldPosDots()[1].z
    );
    const newVect2 = new THREE.Vector3(
      snake.snakeBody[0].getWorldPosDots()[0].x -
        snake.snakeBody[0].getWorldPosDots()[1].x,
      0.5,
      snake.snakeBody[0].getWorldPosDots()[0].z -
        snake.snakeBody[0].getWorldPosDots()[1].z
    );
    console.log(newVect1);

    if (inputController.isActionActive("up")) {
      snakeHead.translateZ(this.moveDistance);
    }
    if (inputController.isActionActive("left")) {
      gsap.set(snakeHead.rotation, { y: `-=${this.rotateAngle}` });
    }
    if (inputController.isActionActive("right")) {
      gsap.set(snakeHead.rotation, { y: `+=${this.rotateAngle}` });
    }
    if (food === undefined) return;
    gsap.set(food.rotation, { y: `-=${this.rotateAngle}` });
  }

  makeSnakeVectors(n) {
    while (this.snakeVectors.length < n * 3) {
      this.snakeVectors.push(new THREE.Vector3(0, 0, 0));
    }
  }
}
