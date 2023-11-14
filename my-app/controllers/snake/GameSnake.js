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
    this._inputController = inputController;
    this.snakeMesh = [];
    this.snakeVect;

    //Options
    this.snakeWidth = 3;
    this.snakePartWidth = 0.5;

    this.wallHeight = 2;

    this.foodWidth = 0.5;
    this.foodHeight = 0.1;

    this.eventFood = { type: "getFood" };
    this.eventSnake = { type: "getSnake" };
    this.snakeName = "Snake";
    this.wallName = "Wall";
    this.foodName = "Food";

    //Rotation
    this.moveDistance = 0.15;
    this.rotateAngle = (5 * Math.PI) / 180;
    this.step;
    this.snakeVectors = [];
    this.snakeVectors2 = [];
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
    this.light = new THREE.DirectionalLight(0xffffff, 1.5);
    this.light2 = this.light.clone();
    this.light3 = this.light.clone();

    //Ground
    this.groundGeometry = new THREE.PlaneGeometry(
      this.areaWidth,
      this.areaHeight
    );
    this.groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x42d4f5,
      side: THREE.DoubleSide,
    });
    this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
  }

  initLevelAction() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.spawnController.wallsSpawn(
      this.areaWidth,
      this.areaHeight,
      this.wallHeight,
      this.wallName
    );
    this.spawnController.snakeSpawn(
      this.snakePartWidth,
      this.snakeWidth,
      this.snakeName
    );
    this.spawnController.foodSpawn(
      this.foodWidth,
      this.foodHeight,
      this.foodName,
      this.areaWidth,
      this.areaHeight
    );

    this.snakeMesh = this.getSnake().snakeBody;
    this.snakeHead = this.getSnake().snakeHead;

    this.collisionController.setSnake();
    this.collisionController.setWall(
      this.wallName,
      this.areaWidth,
      this.areaHeight
    );
    this.collisionController.setFood(this.foodWidth, this.foodName);

    this.collisionController.wall = this.wallName;

    this._inputController.pluginsAdd(this.keyBoard);
    this._inputController.attach(this.scene.children[8], false);

    this.food = this.getFood();

    this.snakeHead.add(new THREE.AxesHelper(5));
    this.camera.position.set(0, 10, 10);
    this.ground.rotateX(Math.PI / 2);

    //lights
    this.lightsSet();
    this.scene.add(this.ground, this.light, this.light2, this.light3);
    this.renderer.render(this.scene, this.camera);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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
    if (this._inputController.isActionActive("up")) {
      this.snakeHead.translateZ(this.moveDistance);
      // for (let i = 0; i < this.snakeMesh.length - 1; i++) {
      //   this.snakeMesh[i].children[1].getWorldPosition(this.snakeVectors[i]);
      //   this.snakeMesh[i + 1].lookAt(this.snakeVectors[i]);
      //   this.snakeMesh[i + 1].children[1].getWorldPosition(
      //     this.snakeVectors2[i]
      //   );
      //   if (this.snakeVectors[i].distanceTo(this.snakeVectors2[i]) > 1.5) {
      //     this.snakeMesh[i + 1].translateZ(this.moveDistance);
      //   }
      // }
    }
    if (this._inputController.isActionActive("left")) {
      gsap.set(this.snakeHead.rotation, { y: `-=${this.rotateAngle}` });
    }
    if (this._inputController.isActionActive("right")) {
      gsap.set(this.snakeHead.rotation, { y: `+=${this.rotateAngle}` });
    }
    gsap.set(this.food.rotation, { y: `-=${this.rotateAngle}` });
  }

  makeSnakeVectors(n) {
    while (this.snakeVectors.length < n) {
      this.snakeVectors.push(new THREE.Vector3(0, 0, 0));
    }
  }

  getFood() {
    this.eventBus.dispatchEvent(this.eventFood);
    const {
      data: { food },
    } = this.eventFood;
    return food;
  }

  getSnake() {
    this.eventBus.dispatchEvent(this.eventSnake);
    const {
      data: { snake },
    } = this.eventSnake;
    return snake;
  }
}
