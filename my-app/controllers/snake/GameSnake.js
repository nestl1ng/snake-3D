"use client";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import SpawnController from "./SpawnController";

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
    this.areaWidth = 50;
    this.areaHeight = 40;
    this.boxDepth = 1;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.isIntersected;

    //Options
    this.wallHeight = 2;
    this.snakePartWidth = 0.5;
    this.snakeWidth = 5;
  }

  webGLRenderer() {
    return (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
  }

  initializationAction() {
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
    this.spawnController = new SpawnController(this.scene);
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

    this.camera.lookAt(this.ground.position);
    this.camera.position.set(0, 5, 5);

    this.spawnController.wallsSpawn(
      this.areaWidth,
      this.areaHeight,
      this.wallHeight
    );
    this.spawnController.snakeSpawn(this.snakePartWidth, this.snakeWidth);

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
    //console.log(this.controls.getAzimuthalAngle());
    this.renderer.render(this.scene, this.camera);
  }
}
