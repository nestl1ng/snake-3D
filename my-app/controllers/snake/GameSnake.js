"use client";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Wall from "../../components/essence/Wall";

export default class GameSnake {
  static get instance() {
    if (!this._instance) {
      this._instance = new GameSnake();
    }
    return this._instance;
  }

  static _instance = null;

  constructor() {
    this.level = new THREE.Group();
    this.fov = 100;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 100;
    this.areaWidth = 20;
    this.areaHeight = 16;
    this.boxDepth = 1;

    this.wallHeight = 2;
    this.wallHor = new Wall(this.areaWidth, this.wallHeight);
    this.wallVert = new Wall(this.areaHeight, this.wallHeight);

    this.onWindowResize = this.onWindowResize.bind(this);
    this.isIntersected;
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
    //Ground
    this.groundGeometry = new THREE.PlaneGeometry(
      this.areaWidth,
      this.areaHeight
    );
    this.groundMaterial = new THREE.MeshLambertMaterial({
      color: 0x42d4f5,
      side: THREE.DoubleSide,
    });
    this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);

    //Wall
    this.walls = new THREE.Object3D();

    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.light = new THREE.DirectionalLight(0xffffff, 3);
    this.scene.background = new THREE.Color(0xcccccc);
  }

  initLevelAction() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //this.camera.lookAt(this.ground.position);
    //this.camera.position.set(0, 10, 10);
    this.camera.position.set(12, 8, 12);
    
    this.initWalls();
    this.level.add(this.ground,this.walls);
    this.scene.add(this.level);
    this.ground.rotateX(Math.PI / 2);
    this.light.position.set(12, 8, 12);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initWalls() {
    this.wallA = this.wallHor.drawWall();
    this.wallB = this.wallA.clone();
    this.wallC = this.wallVert.drawWall();
    this.wallD = this.wallC.clone();
    this.wallA.position.set(0, 0, -this.areaHeight / 2);
    this.wallB.position.set(0, 0, this.areaHeight / 2);
    this.wallC.rotateY(-Math.PI / 2);
    this.wallD.rotateY(Math.PI / 2);
    this.wallC.position.set(this.areaWidth / 2, 0, 0);
    this.wallD.position.set(-this.areaWidth / 2, 0, 0);
    this.walls.add(this.wallA, this.wallB, this.wallC, this.wallD);
  }

  playingAction() {
    window.addEventListener("resize", this.onWindowResize);
    this.renderScene();
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
    this.renderer.render(this.scene, this.camera);
  }
}
