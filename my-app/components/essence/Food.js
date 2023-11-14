import * as THREE from "three";

export default class Food {
  constructor(foodWidth, foodHeight, foodName) {
    this.foodWidth = foodWidth;
    this.foodHeight = foodHeight;
    this.foodName = foodName;
  }

  drawFood(areaWidth, areaHeight) {
    this.areaHeight = areaHeight;
    this.areaWidth = areaWidth;
    this.geometry = new THREE.TorusGeometry(
      this.foodWidth,
      this.foodHeight,
      16,
      100
    );
    this.material = new THREE.MeshStandardMaterial({ color: 0xebde34 });
    this.torus = new THREE.Mesh(this.geometry, this.material);
    this.torus.name = this.foodName;
    this.makeDots(this.torus);
    this.torus.position.set(3, 0.6, -3);
    return this.torus;
  }

  makeDots(torus) {
    this.geometryDot = new THREE.CapsuleGeometry(0.1, 0.1, 1, 1);
    this.materialDot = new THREE.MeshStandardMaterial({ color: 0x9426de });
    this.dotUp = new THREE.Mesh(this.geometryDot, this.materialDot);
    this.dotUp.name = "DotCollision";
    this.dotDown = this.dotUp.clone();
    torus.add(this.dotUp, this.dotDown);
    this.dotDown.position.set(-(this.foodWidth + this.foodHeight) / 1.25, 0, 0);
    this.dotUp.position.set((this.foodWidth + this.foodHeight) / 1.25, 0, 0);
  }
}
