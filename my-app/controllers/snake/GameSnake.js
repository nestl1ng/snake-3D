"use client";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import SpawnController from "./SpawnController";
import { inputController } from "../InputController/InputController";
import { KeyBoard } from "../InputController/plugins/KeyBoard";
import { gsap } from "gsap/dist/gsap";
import { useState } from "react";

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
    this._inputController = inputController;
    this.snakeMesh = [];

    //Options
    this.wallHeight = 2;
    this.snakePartWidth = 0.5;
    this.snakeWidth = 2;
    this.snakeName = "Snake";
    //Rotation
    this.moveDistance = 0.15;
    this.rotateAngle = (5 * Math.PI) / 180;
    this.step;
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
      this.wallHeight
    );
    this.spawnController.snakeSpawn(
      this.snakePartWidth,
      this.snakeWidth,
      this.snakeName
    );

    this._inputController.setTarget(this.scene.children[8]);
    this._inputController.pluginsAdd(this.keyBoard);
    this._inputController.attach(this.scene.children[8], false);
    this.snakeMesh = this.scene.children.filter(
      (val) => val.name === this.snakeName
    );
    this.step = {
      x: this.snakeMesh[0].position.x,
      z: this.snakeMesh[0].position.z,
    };

    //this.snakeMesh[0].add(this.camera);
    //this.camera.position.set(0, 10, -10);
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
    this.renderer.render(this.scene, this.camera);
  }

  snakeMove() {
    for (let i = 0; i < this.snakeMesh.length; i++) {
      if (this._inputController.isActionActive("up")) {
        this.snakeMesh[i].translateY(-this.moveDistance);
      }
      if (this._inputController.isActionActive("down")) {
        this.snakeMesh[i].translateY(this.moveDistance);
      }
      if (this._inputController.isActionActive("left")) {
        this.snakeMesh[i].rotation.z -= this.rotateAngle;
      }
      if (this._inputController.isActionActive("right")) {
        this.snakeMesh[i].rotation.z += this.rotateAngle;
      }
    }
  }
}
